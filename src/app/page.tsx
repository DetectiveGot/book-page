"use client"
import { books } from "@/data/books";
import { type Book, Banner } from "@/types/types";
import { BookCard } from "@/component/BookCard";
import { useState, useMemo, useEffect } from "react";
import { Container } from "@/ui/Container";
import { cn } from "@/lib/utils";
import { ImageSlider } from "@/component/ImageSlider";
import { banners } from "@/data/banners";
// import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Home() {
  const [bookList, setBookList] = useState<Book[]>(books);
  const [onlyFav, setOnlyFav] = useState<boolean>(false);
  const [editingMode, setEditingMode] = useState<boolean>(false);
  const favList = useMemo<Book[]>(() => {
    return bookList.filter((book) => book.isFav);
  }, [bookList]);
  const [removeIdList, setRemoveIdList] = useState<Set<number>>(new Set());
  const [bannerList, setBannerList] = useState<Banner[]>(banners);

  const toggleFav = (id: number) => {
    if(editingMode) return;
    let addFavBook: Book|null = null;
    setBookList((pv) => (
      pv.map((book) =>{
        if(book.id===id) {
          if(!book.isFav) addFavBook = {...book};
          return {...book, isFav: !book.isFav};
        }
        return book;
      })
    ))
  };
  const toggleRemoveFav = (id: number) => {
    if(!editingMode) return;
    setRemoveIdList((pv) => {
      const cp = new Set(pv);
      if(cp.has(id)) cp.delete(id);
      else cp.add(id);
      return cp;
    })
  }

  return (
    <div>
      <section className="">
        <ImageSlider banners={bannerList}/>
      </section>
      <main>
        <section className="border border-stone-300">
          <Container className="pt-7 flex gap-x-5">
            <button className={cn("text-md md:text-lg active:font-bold", !onlyFav&&"font-bold")} onClick={() => {
              setOnlyFav(false);
              setEditingMode(false);
            }}>หนังสือทั้งหมด</button>
            <button className={cn("text-md md:text-lg active:font-bold", onlyFav&&"font-bold")} onClick={() => {
              setOnlyFav(true);
            }}>รายการที่คั่นไว้</button>
          </Container>
        </section>
        <section className="py-3">
          <Container className="space-y-3">
            <div className="w-full h-10 flex justify-between items-center">
              <h4 className="text-sm md:text-md">Total: {onlyFav?favList.length:bookList.length}</h4>
              <div className="flex gap-x-3">
                {editingMode &&
                  <button className="rounded-full py-1 px-4 border border-stone-200" onClick={() => {
                    setEditingMode(false);
                    setRemoveIdList(new Set());
                  }}>ยกเลิก</button>
                }
                {editingMode && 
                  <button className="rounded-full py-1 px-4 border border-stone-200" onClick={() => {
                    setEditingMode(false);
                    setBookList((pv) => pv.map((book) => removeIdList.has(book.id)?{...book, isFav: false}:book));
                    // console.log(removeIdList);
                    setRemoveIdList(new Set());
                  }}>ลบ</button>
                }
                {onlyFav && !editingMode && 
                  <button className="rounded-full py-1 px-4 border border-stone-200" onClick={() => {
                    setEditingMode((p) => !p);
                  }}>แก้ไข</button>
                }
                </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                let showList = [];
                if(onlyFav) showList = favList;
                else showList = bookList;
                return (
                  showList.map((book) => (
                    <BookCard key={book.id} 
                      book={book} 
                      toggleFav={toggleFav} 
                      editingMode={editingMode} 
                      toggleRemoveFav={() => toggleRemoveFav(book.id)}
                      toRemove={removeIdList.has(book.id)}
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
              <div><ArrowLeft/></div>
              <h1>Page</h1>
              <div><ArrowRight/></div>
            </div>
          </Container>
        </section> */}
      </main>
    </div>
  );
}
