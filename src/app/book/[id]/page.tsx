"use server"
import BookClient from "./bookClient";
import { connectMongoDB } from "@/lib/mongoosedb";
import bookModel from "@/models/bookModel";
import mongoose from "mongoose";

export default async function Page({
    params
}: {
    params: Promise<{id: string}>
}) {
    const {id} = await params;
    await connectMongoDB();
    const bookId = new mongoose.Types.ObjectId(id);
    const book = await bookModel.findOne({_id: bookId}).lean();
    const bookData = {
        ...book,
        _id: book._id.toString(),
    }
    return (
        <BookClient bookData={bookData}/>
    )
}