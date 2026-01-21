import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectMongoDB() {
    if(mongoose.connection.readyState>=1) return;
    if(MONGODB_URI) await mongoose.connect(MONGODB_URI);
    else throw new Error("NO MONGODB URI");
}