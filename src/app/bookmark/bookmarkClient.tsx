"use client"
import type { Book, Banner, Bookmark } from "@/types/types";
import { BookCard } from "@/component/BookCard";
import { useState, useMemo, useEffect } from "react";
import { Container } from "@/ui/Container";
import { ImageSlider } from "@/component/ImageSlider";
import { banners } from "@/data/banners";
import { Button } from "@/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/component/Navbar";
import Link from "next/link";

export default function BookmarkClient({books, initBookmarked}:{books: Book[], initBookmarked: string[]}) {
  const [bookList, setBookList] = useState<Book[]>(books);
  const [bookmarkedSet, setBookmarkedSet] = useState<Set<string>>(() => new Set(initBookmarked));
  const [editingMode, setEditingMode] = useState<boolean>(false);
  const [removeIdList, setRemoveIdList] = useState<Set<string>>(new Set());
  const [bannerList, setBannerList] = useState<Banner[]>(banners);
  // const [currentPage, setCurrentPage] = useState<number>(0);

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
        if(!res.ok) throw new Error("Failed");
        setBookmarkedSet(pv => {
            const newSet = new Set(pv);
            if(newFav) newSet.add(_id);
            else newSet.delete(_id);
            return newSet;
        });
        setBookList(pv => pv.filter((b) => b._id!==_id));
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

//   useEffect(() => {
//     setCurrentPage(0);
//   }, [onlyFav]);

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
        if(!res.ok) throw new Error("Delete failed");
        setBookList(pv => pv.filter((b) => !removeIdList.has(b._id)));
        setBookmarkedSet(pv => {
            const newSet = new Set(pv);
            pv.forEach((b) => {
                if(removeIdList.has(b)) newSet.delete(b);
            })
            return newSet;
        })
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

  return (
    <div>
      <Navbar/>
      <section className="">
        <ImageSlider banners={bannerList}/>
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
              <h4 className="text-sm md:text-md">Total: {bookList.length}</h4>
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
        {/* <section className="h-24 py-6">
          <Container className="relative">
            <div className="flex gap-x-3 justify-end">
              <Button disabled={editingMode || currentPage===0} className="disabled:opacity-40 disabled:cursor-default" onClick={() => {
                if(editingMode) return;
                setCurrentPage((pv) => Math.max(pv-1, 0));
              }}><ArrowLeft/></Button>
              <h1>Page {currentPage+1}</h1>
              <Button disabled={editingMode || (currentPage+1>=totalPage)} className="disabled:opacity-40 disabled:cursor-default" onClick={() => {
                if(editingMode) return;
                setCurrentPage((pv) => {
                  if(pv+1<Math.ceil(showList.length/perPage)) return pv+1;
                  return pv;
                })
              }}><ArrowRight/></Button>
            </div>
          </Container>
        </section> */}
      </main>
    </div>
  );
}
