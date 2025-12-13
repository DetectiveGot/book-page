"use client"
import { books } from "@/data/books";
import { type Book, Banner } from "@/types/types";
import { BookCard } from "@/component/BookCard";
import { useState, useMemo, useEffect, useRef, use } from "react";
import { Container } from "@/ui/Container";
import { cn } from "@/lib/utils";
import { ImageSlider } from "@/component/ImageSlider";
import { banners } from "@/data/banners";
import { Button } from "@/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Home() {
  const [bookList, setBookList] = useState<Book[]>(books);
  const [onlyFav, setOnlyFav] = useState<boolean>(false);
  const [editingMode, setEditingMode] = useState<boolean>(false);
  const favList = useMemo<Book[]>(() => {
    return bookList.filter((book) => book.isFav);
  }, [bookList]);
  const [removeIdList, setRemoveIdList] = useState<Set<number>>(new Set());
  const [bannerList, setBannerList] = useState<Banner[]>(banners);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const perPage = 12;
  const showList = onlyFav?favList:bookList;
  const totalPage = Math.ceil(showList.length/perPage);

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

  useEffect(() => {
    setCurrentPage(0);
  }, [onlyFav]);

  return (
    <div>
      <section className="">
        <ImageSlider banners={bannerList}/>
      </section>
      <main>
        <section className="border border-stone-300">
          <Container className="pt-7 flex gap-x-5">
            <Button variant={"header"} size={"header"} className={cn("transition-opacity duration-100 hover:opacity-50",!onlyFav&&"font-bold")} onClick={() => {
              setOnlyFav(false);
              setEditingMode(false);
            }}>หนังสือทั้งหมด</Button>
            <Button variant={"header"} size={"header"} className={cn("transition-opacity duration-100 hover:opacity-50",onlyFav&&"font-bold")} onClick={() => {
              setOnlyFav(true);
            }}>รายการที่คั่นไว้</Button>
          </Container>
        </section>
        <section className="py-3">
          <Container className="space-y-3">
            <div className="w-full h-10 flex justify-between items-center">
              <h4 className="text-sm md:text-md">Total: {onlyFav?favList.length:bookList.length}</h4>
              <div className="flex gap-x-3">
                {editingMode &&
                  <Button variant={"edit"} size={"sm"} className="transition-colors duration-300 hover:bg-stone-100" onClick={() => {
                    setEditingMode(false);
                    setRemoveIdList(new Set());
                  }}>ยกเลิก</Button>
                }
                {editingMode && 
                  <Button variant={"edit"} size={"sm"} className="transition-colors duration-300 hover:bg-red-200" onClick={() => {
                    setEditingMode(false);
                    setBookList((pv) => pv.map((book) => removeIdList.has(book.id)?{...book, isFav: false}:book));
                    // console.log(removeIdList);
                    setRemoveIdList(new Set());
                  }}>ลบ</Button>
                }
                {onlyFav && !editingMode && 
                  <Button variant={"edit"} size={"sm"} className="transition-colors duration-300 hover:bg-stone-100" onClick={() => {
                    setEditingMode((p) => !p);
                  }}>แก้ไข</Button>
                }
                </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                return (
                  showList.slice(currentPage*perPage, Math.min((currentPage+1)*perPage, totalPage*perPage)).map((book) => (
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
        <section className="h-24 py-6">
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
        </section>
      </main>
    </div>
  );
}
