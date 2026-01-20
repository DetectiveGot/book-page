"use server"
import { auth0 } from "@/lib/auth0";
import BooksClient from "./bookClient";
import { connectMongoDB } from "@/lib/mongoosedb";
import bookModel from "@/models/bookModel";
import bookmarkModel from "@/models/bookmarkModel";
import bannerModel from "@/models/bannerModel";

const PER_PAGE = 12;
const BANNER_LIM = 5;

export default async function Home() {
  await connectMongoDB();
  const session = await auth0.getSession();
  const userSub = session?.user.sub;

  const [books, totalBooks] = await Promise.all([
    bookModel.find().limit(PER_PAGE).lean(),
    bookModel.countDocuments().lean(),
  ]);
  const bookIds = books.map(b => b._id);
  let bookmarkedList: string[] = [];
  let isLogged = false;
  if(userSub) {
    const bookmarks = await bookmarkModel.find({userSub, bookId: {$in: bookIds}}).limit(PER_PAGE).select({bookId: 1}).lean();
    bookmarkedList = bookmarks.map(b => b.bookId.toString());
    isLogged = true;
  }
  const banners = await bannerModel.find({}).limit(BANNER_LIM).lean();
  const bannerRes = banners.map((b) => ({
      ...b, 
      _id: b._id.toString(),
      bookId: b.bookId.toString(),
  }));
  const bookRes = books.map(b => ({
    ...b,
    _id: b._id.toString(),
  }));
  return (
    <BooksClient books={bookRes} initBookmarked={bookmarkedList} totalBooks={totalBooks} isLogged={isLogged} initBanners={bannerRes}/>
  )
}
