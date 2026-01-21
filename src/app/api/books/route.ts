import { auth0 } from "@/lib/auth0";
import { connectMongoDB } from "@/lib/mongoosedb";
import bookmarkModel from "@/models/bookmarkModel";
import bookModel from "@/models/bookModel";
import type { Bookmark } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";

const PER_PAGE = 12;

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const page = Number(searchParams.get("page")??1);
    await connectMongoDB();
    // console.log("DB:", mongoose.connection.db?.databaseName);
    const session = await auth0.getSession();
    const userSub = session?.user.sub;
    const books = await bookModel.find({}).skip((page-1)*PER_PAGE).limit(PER_PAGE).lean();
    const bookIds = books.map((b) => b._id);
    let bookmarks: Bookmark[] = [];
    const bookItems = books.map((b) => ({
        ...b,
        _id: b._id.toString(),
    }));
    if(userSub) {
        bookmarks = await bookmarkModel.find({userSub, bookId: {$in: bookIds}}).select({bookId: 1}).limit(PER_PAGE).lean();
    }
    const bookmarkIds = bookmarks.map((b) => b.bookId.toString());
    return NextResponse.json({bookItems, bookmarkIds});
}