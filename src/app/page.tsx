"use client"
import { books } from "@/data/books";
import { type Book } from "@/types/types";
import { BookCard } from "@/component/BookCard";
import { useState } from "react";
import { Container } from "@/ui/Container";

export default function Home() {
  const [bookList, setBookList] = useState<Book[]>(books);
  const [onlyFav, setOnlyFav] = useState<boolean>(false);
  return (
    <div>
      <section className="bg-black min-h-40">
        <h1 className="text-white text-2xl">Banner Part</h1>
      </section>
      <main>
        <section className="border border-stone-300">
          <Container className="pt-7 flex gap-x-5">
            <button className="text-lg">หนังสือทั้งหมด</button>
            <button className="text-lg">รายการที่คั่นไว้</button>
          </Container>
        </section>
        <section className="py-3">
          <Container className="space-y-3">
            <div className="w-full h-10 flex justify-between items-center">
              <h4>Total: {bookList.length}</h4>
              <button className="rounded-full py-1 px-4 border border-stone-200">Edit</button>
            </div>
            <div className="w-full grid grid-cols-3 gap-4">
              {bookList.map((book) => (
                <BookCard key={book.title} book={book}/>
              ))}
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
