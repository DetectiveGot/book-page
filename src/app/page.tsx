"use server"
import { auth0 } from "@/lib/auth0";
import BooksClient from "./bookClient";
import { connectMongoDB } from "@/lib/mongoosedb";
import bookModel from "@/models/bookModel";
import bookmarkModel from "@/models/bookmarkModel";

export default async function Home() {
  await connectMongoDB();
  const session = await auth0.getSession();
  const userSub = session?.user.sub;

  const books = await bookModel.find().limit(20).lean();
  const bookIds = books.map(b => b._id);
  let bookmarkedList: string[] = [];
  if(userSub) {
    const bookmarks = await bookmarkModel.find({userSub, bookId: {$in: bookIds}}).select({bookId: 1}).lean();
    bookmarkedList = bookmarks.map(b => b.bookId.toString());
  }
  const bookRes = books.map(b => ({
    ...b,
    _id: b._id.toString(),
  }));
  return (
    <BooksClient books={bookRes} initBookmarked={bookmarkedList}/>
  )
}
