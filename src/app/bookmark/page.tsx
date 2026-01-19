"use server"
import { auth0 } from "@/lib/auth0";
import { connectMongoDB } from "@/lib/mongoosedb";
import bookModel from "@/models/bookModel";
import bookmarkModel from "@/models/bookmarkModel";
import type { Book, Bookmark } from "@/types/types";
import BookmarkClient from "./bookmarkClient";
import { redirect } from "next/navigation";

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
            await bookmarkModel.find({userSub}).select({bookId: 1}).limit(20).lean(),
            await bookmarkModel.countDocuments({userSub}).lean(),
        ]);
        totalBooks = _totalBooks;
        bookmarksId = bookmarks.map((b) => b.bookId.toString());
        books = await bookModel.find({_id: {$in: bookmarksId}}).limit(20).lean();
    }
    const bookRes = books.map((b) => ({
        ...b,
        _id: b._id.toString(),
    }));
    return (
        <BookmarkClient books={bookRes} initBookmarked={bookmarksId} initBooks={totalBooks}/>
    )
}
