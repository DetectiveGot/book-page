"use client"
import type { Book, Banner } from "@/types/types";
import { BookCard } from "@/component/BookCard";
import { useState } from "react";
import { Container } from "@/ui/Container";
import { cn } from "@/lib/utils";
import { ImageSlider } from "@/component/ImageSlider";
import { banners } from "@/data/banners";
import { Button } from "@/ui/button";
import { Navbar } from "@/component/Navbar";
import Link from "next/link";

const PER_PAGE = 12;

export default function BookClient({books, initBookmarked, totalBooks}:{books: Book[], initBookmarked: string[], totalBooks: number}) {
  const [bookList, setBookList] = useState<Book[]>(books);
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(() => new Set(initBookmarked));
  const [editingMode, setEditingMode] = useState<boolean>(false);
  const [bannerList, setBannerList] = useState<Banner[]>(banners);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPage = Math.ceil(totalBooks/PER_PAGE);

  const toggleFav = async (_id: string) => {
    if(editingMode) return;
    const cur = bookList.find(b => b._id===_id);
    if(!cur) return;
    const newFav = !bookmarkedSet.has(_id);
    try {
        const res = await fetch("/api/bookmarks", {
            method: newFav?"POST":"DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                bookIds: [_id]
            }),
        });
        if(!res.ok) throw new Error("Failed");
        setBookmarkedSet(pv => {
            const newSet = new Set(pv);
            if(newFav) newSet.add(_id);
            else newSet.delete(_id);
            return newSet;
        })
    } catch(err) {
        alert("Bookmark failed");
    }
  };

  const goToPage = async (page: number) => {
    const res = await fetch(`/api/books?page=${page}`);
    if(!res.ok) {
        alert("Failed to fetch books");
        throw new Error("Failed to fetch books");
    }
    const {bookItems, bookmarkIds} = await res.json();
    setBookList(bookItems);
    setCurrentPage(page);
    setBookmarkedSet(new Set(bookmarkIds));
  }

  return (
    <div>
      <Navbar/>
      <section className="">
        <ImageSlider banners={bannerList}/>
      </section>
      <main>
        <section className="border border-stone-300">
          <Container className="pt-7 flex gap-x-5">
            <Link href={'/'}><Button variant={"header"} size={"header"} className={cn("transition-opacity duration-100 hover:opacity-50 font-bold")} >หนังสือทั้งหมด</Button></Link>
            <Link href={'/bookmark'}><Button variant={"header"} size={"header"} className={cn("transition-opacity duration-100 hover:opacity-50")} >รายการที่คั่นไว้</Button></Link>
          </Container>
        </section>
        <section className="py-3">
          <Container className="space-y-3">
            <div className="w-full h-10 flex justify-between items-center">
              <h4 className="text-sm md:text-md">Total: {totalBooks}</h4>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                return (
                  bookList.map((book) => (
                    <BookCard key={book._id} 
                      book={book} 
                      toggleFav={toggleFav} 
                      bookmarkedSet={bookmarkedSet}
                    />
                  ))
                )
              })()}
            </div>
          </Container>
        </section>
        <section className="h-24 py-6">
          <Container className="relative">
            <div className="flex gap-x-3 justify-end font-semibold">
                <span>Page:</span>
              {(() => {
                const pages: (number|"...")[] = [];
                if(currentPage>3) {
                    pages.push(1);
                    pages.push("...");
                    pages.push(currentPage-1);
                } else for(let i=1;i<currentPage;i++) pages.push(i);
                pages.push(currentPage)
                if(currentPage+2<totalPage) {
                    pages.push(currentPage+1);
                    pages.push("...");
                    pages.push(totalPage);
                } else for(let i=currentPage+1;i<=totalPage;i++) pages.push(i);
                return pages.map((p, i) => {
                    if(p==='...') return <span key={i}>...</span>
                    return <Button key={i} className="transition-opacity duration-100 hover:opacity-50" onClick={async () => goToPage(p)}>{p}</Button>
                })
              })()}
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
