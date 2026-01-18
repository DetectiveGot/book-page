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
    const { bookId } = await req.json();
    await connectMongoDB();
    // console.log("DB:", mongoose.connection.db?.databaseName);
    await bookmarkModel.create({
        userSub,
        bookId: new mongoose.Types.ObjectId(bookId),
    })
    return NextResponse.json({ok: true});
}

export async function DELETE(req: NextRequest) {
    const session = await auth0.getSession();
    if(!session || !session.user.sub) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const userSub = session.user.sub;
    const { bookId } = await req.json();
    const delId = new mongoose.Types.ObjectId(bookId);
    await connectMongoDB();
    await bookmarkModel.deleteOne({bookId: delId});
    return NextResponse.json({ok: true});
}