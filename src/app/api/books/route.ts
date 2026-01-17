import { connectMongoDB } from "@/lib/mongoosedb";
import bookModel from "@/models/bookModel";
import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    await connectMongoDB();
    // console.log("DB:", mongoose.connection.db?.databaseName);
    const bookItems = await bookModel.find({}).limit(20).lean();
    return NextResponse.json({bookItems});
}