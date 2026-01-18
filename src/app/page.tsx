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
  if(userSub) {
    const [books, bookmarks] = await Promise.all([
      bookModel.find().limit(20).lean(),
      bookmarkModel.find({userSub}).limit(20)
    ])
    const bookmarkedList = bookmarks.map((b) => b.bookId.toString());
    const bookRes = books.map((b) => ({
      ...b,
      _id: b._id.toString(),
    }))
    return (
      <BooksClient books={bookRes} initBookmarked={bookmarkedList}/>
    );
  } else {
    const books = await bookModel.find().limit(20).lean();
    const bookRes = books.map((b) => ({
      ...b,
      _id: b._id.toString(),
    }))
    return (
      <BooksClient books={bookRes} initBookmarked={[]}/>
    );
  }
}
