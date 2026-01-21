"use server"
import { auth0 } from "@/lib/auth0";
import { connectMongoDB } from "@/lib/mongoosedb";
import bookModel from "@/models/bookModel";
import bookmarkModel from "@/models/bookmarkModel";
import type { Book, Bookmark } from "@/types/types";
import BookmarkClient from "./bookmarkClient";
import { redirect } from "next/navigation";
import bannerModel from "@/models/bannerModel";

const PER_PAGE = 12;
const BANNER_LIM = 5;

export default async function Page() {
    const session = await auth0.getSession();
    const userSub = session?.user.sub;
    if(!userSub) {
        redirect('/auth/login');
    }
    await connectMongoDB();

    let books: Book[] = [];
    let bookmarksId: string[] = [];
    let totalBooks = 0;
    if(userSub) {
        const [bookmarks, _totalBooks] = await Promise.all([
            await bookmarkModel.find({userSub}).select({bookId: 1}).limit(PER_PAGE).lean(),
            await bookmarkModel.countDocuments({userSub}).lean(),
        ]);
        totalBooks = _totalBooks;
        bookmarksId = bookmarks.map((b) => b.bookId.toString());
        books = await bookModel.find({_id: {$in: bookmarksId}}).limit(PER_PAGE).lean();
    }
    const banners = await bannerModel.find({}).limit(BANNER_LIM).lean();
    const bannerRes = banners.map((b) => ({
        ...b, 
        _id: b._id.toString(),
        bookId: b.bookId.toString(),
    }));
    const bookRes = books.map((b) => ({
        ...b,
        _id: b._id.toString(),
    }));
    return (
        <BookmarkClient books={bookRes} initBookmarked={bookmarksId} initBooks={totalBooks} initBanners={bannerRes}/>
    )
}
