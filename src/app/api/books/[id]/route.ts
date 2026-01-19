import { connectMongoDB } from "@/lib/mongoosedb";
import bookModel from "@/models/bookModel";
import mongoose, { mongo } from "mongoose";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}:{params: {id: string}}) {
    const {id} = params;
    await connectMongoDB();
    if(!mongoose.Types.ObjectId.isValid(id)){
        return NextResponse.json({error: "Invalid Book"}, {status: 400});
    }
    const bookId = new mongoose.Types.ObjectId(id);
    const book = await bookModel.findOne({_id: bookId}).lean();
    if(!book) {
        return NextResponse.json({error: "Book not found"}, {status: 404});
    }
    const bookData = {...book, _id: book._id.toString()};
    return NextResponse.json({bookData});
}