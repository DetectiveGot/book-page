"use client"
import type { Book, Banner } from "@/types/types";
import { BookCard } from "@/component/BookCard";
import { useState } from "react";
import { Container } from "@/ui/Container";
import { ImageSlider } from "@/component/ImageSlider";
import { Button } from "@/ui/button";
import { Navbar } from "@/component/Navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const PER_PAGE = 12;

export default function BookmarkClient({books, initBookmarked, initBooks, initBanners}:{books: Book[], initBookmarked: string[], initBooks: number, initBanners: Banner[]}) {
  const [bookList, setBookList] = useState<Book[]>(books);
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(() => new Set(initBookmarked));
  const [editingMode, setEditingMode] = useState<boolean>(false);
  const [removeIdList, setRemoveIdList] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalBooks, setTotalBooks] = useState<number>(initBooks);
  const totalPage = Math.ceil(totalBooks/PER_PAGE);
  const router = useRouter();

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
            body: JSON.stringify({bookIds: [_id]}),
        });
        if(res.status===401) {
          router.push('/auth/login');
          return;
        }
        if(!res.ok) throw new Error("Failed");
        const {deletedCount} = await res.json();
        setBookmarkedSet(pv => {
            const newSet = new Set(pv);
            if(newFav) newSet.add(_id);
            else newSet.delete(_id);
            return newSet;
        });
        setBookList(pv => pv.filter((b) => b._id!==_id));
        setTotalBooks(pv => pv-deletedCount);
    } catch(err) {
        alert("Bookmark failed");
    }
  };
  const toggleRemoveFav = (id: string) => {
    if(!editingMode) return;
    setRemoveIdList((pv) => {
      const cp = new Set(pv);
      if(cp.has(id)) cp.delete(id);
      else cp.add(id);
      return cp;
    })
  }

  const onEdit = () => {
    setEditingMode(true);
    setRemoveIdList(new Set());
  }

  const onDelete = async () => {
    if(removeIdList.size===0) {
        setEditingMode(false);
        setRemoveIdList(new Set());
        return;
    }
    try {
        const res = await fetch('/api/bookmarks', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bookIds: Array.from(removeIdList),
            })
        })
        if(res.status===401) {
          router.push('/auth/login');
          return;
        }
        if(!res.ok) throw new Error("Delete failed");
        const {deletedCount} = await res.json();
        setBookList(pv => pv.filter((b) => !removeIdList.has(b._id)));
        setBookmarkedSet(pv => {
            const newSet = new Set(pv);
            pv.forEach((b) => {
                if(removeIdList.has(b)) newSet.delete(b);
            })
            return newSet;
        });
        setTotalBooks(pv => pv-deletedCount);
    } catch(err) {
        alert("Delete failed");
    } finally {
        setEditingMode(false);
        setRemoveIdList(new Set());
    }
  }

  const onCancel = () => {
    setRemoveIdList(new Set());
    setEditingMode(false);
  }

  const goToPage = async (page: number) => {
    const res = await fetch(`/api/bookmarks?page=${page}`);
    if(res.status===401) {
      router.push('/auth/login');
      return;
    }
    if(!res.ok) {
        alert("Failed to fetch books");
        throw new Error("Failed to fetch books");
    }
    const {bookmarkItems, bookmarkItemIds} = await res.json();
    setBookList(bookmarkItems);
    setCurrentPage(page);
    setBookmarkedSet(new Set(bookmarkItemIds));
  }

  return (
    <div>
      <Navbar/>
      <section className="">
        <ImageSlider banners={initBanners}/>
      </section>
      <main>
        <section className="border border-stone-300">
          <Container className="pt-7 flex gap-x-5">
            <Link href={'/'}><Button variant={"header"} size={"header"} className="transition-opacity duration-100 hover:opacity-50" >หนังสือทั้งหมด</Button></Link>
            <Link href={'/bookmark'}><Button variant={"header"} size={"header"} className="transition-opacity duration-100 hover:opacity-50 font-bold" >รายการที่คั่นไว้</Button></Link>
          </Container>
        </section>
        <section className="py-3">
          <Container className="space-y-3">
            <div className="w-full h-10 flex justify-between items-center">
              <h4 className="text-sm md:text-md">Total: {totalBooks}</h4>
              <div className="flex gap-x-3">
                {!editingMode && <Button variant={"edit"} size={"sm"} className="transition-colors duration-300 hover:bg-stone-100" onClick={onEdit}>แก้ไข</Button>}
                {editingMode && (
                    <>
                        <Button variant={"edit"} size={"sm"} className="transition-colors duration-300 hover:bg-red-200" onClick={onDelete}>ลบ</Button>
                        <Button variant={"edit"} size={"sm"} className="transition-colors duration-300 hover:bg-stone-100" onClick={onCancel}>ยกเลิก</Button>
                    </>
                )}
              </div>

            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                return (
                  bookList.map((book) => (
                    <BookCard key={book._id} 
                      book={book} 
                      toggleFav={toggleFav} 
                      bookmarkedSet={bookmarkedSet}
                      editingMode={editingMode}
                      toggleRemoveFav={toggleRemoveFav}
                      toRemove={removeIdList.has(book._id)}
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
                    return <Button key={i} variant={'square'} size={'square'} className={cn("transition-opacity duration-100 hover:opacity-50", p===currentPage&&"bg-stone-200")} onClick={async () => goToPage(p)}>{p}</Button>
                })
              })()}
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
