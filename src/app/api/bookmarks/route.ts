import { connectMongoDB } from "@/lib/mongoosedb";
import bookmarkModel from "@/models/bookmarkModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth0 } from "@/lib/auth0";
import bookModel from "@/models/bookModel";

const PER_PAGE = 12;

export async function GET(req: NextRequest) {
    const session = await auth0.getSession();
    if(!session || !session.user.sub) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    } 
    const userSub = session.user.sub;
    const {searchParams} = new URL(req.url);
    const page = Number(searchParams.get("page")??1);
    await connectMongoDB();
    // console.log("DB:", mongoose.connection.db?.databaseName);
    let bookmarks = [];
    let bookmarkItems = [];
    let bookmarkItemIds = [];
    if(userSub) {
        bookmarks = await bookmarkModel.find({userSub}).skip((page-1)*PER_PAGE).limit(PER_PAGE).lean();
        const bookmarkIds = bookmarks.map((b) => b.bookId);
        const books = await bookModel.find({_id: {$in: bookmarkIds}}).limit(PER_PAGE).lean();
        bookmarkItems = books.map((b) => ({
            ...b,
            _id: b._id.toString(),
        }));
        bookmarkItemIds = bookmarkIds.map((id) => id.toString());
    }
    return NextResponse.json({bookmarkItems, bookmarkItemIds});
}

export async function POST(req: NextRequest) {
    const session = await auth0.getSession();
    if(!session || !session.user.sub) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const userSub = session.user.sub;
    const { bookIds }: {bookIds: string[]} = await req.json();
    const postIds = bookIds.filter((id) => mongoose.Types.ObjectId.isValid(id)).map((id) => new mongoose.Types.ObjectId(id));
    const postData = postIds.map((bookId) => ({
        userSub,
        bookId,
    }))
    await connectMongoDB();
    // console.log("DB:", mongoose.connection.db?.databaseName);

    await bookmarkModel.insertMany(postData, {ordered: false});
    return NextResponse.json({ok: true});
}

export async function DELETE(req: NextRequest) {
    const session = await auth0.getSession();
    if(!session || !session.user.sub) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const userSub = session.user.sub;
    const { bookIds }: { bookIds: string[] } = await req.json();
    const delIds = bookIds.filter((id) => mongoose.Types.ObjectId.isValid(id)).map((id) => new mongoose.Types.ObjectId(id));
    await connectMongoDB();

    const result = await bookmarkModel.deleteMany({userSub, bookId: {$in: delIds}});
    return NextResponse.json({deletedCount: result.deletedCount});
}