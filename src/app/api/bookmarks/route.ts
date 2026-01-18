import { connectMongoDB } from "@/lib/mongoosedb";
import bookmarkModel from "@/models/bookmarkModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth0 } from "@/lib/auth0";

export async function GET(req: NextRequest) {
    const session = await auth0.getSession();
    if(!session || !session.user.sub) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    } 
    const userSub = session.user.sub;
    await connectMongoDB();
    // console.log("DB:", mongoose.connection.db?.databaseName);

    const bookmarkItems = await bookmarkModel.find({userSub}).limit(20).lean();
    return NextResponse.json({bookmarkItems});
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

    await bookmarkModel.create(postData);
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