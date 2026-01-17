import { connectMongoDB } from "@/lib/mongoosedb";
import bookmarkModel from "@/models/bookmarkModel";
import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";
import { auth0 } from "@/lib/auth0";

export async function GET(req: NextRequest) {
    await connectMongoDB();
    // console.log("DB:", mongoose.connection.db?.databaseName);
    const session = await auth0.getSession();
    if(!session || !session.user.sub) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    } 
    const userSub = session.user.sub;

    const bookmarkItems = await bookmarkModel.find({userSub}).limit(20).lean();
    return NextResponse.json({bookmarkItems});
}