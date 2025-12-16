import { notFound } from "next/navigation";
import { books } from "@/data/books";
import { Container } from "@/ui/Container";
import { Book } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/ui/button";

export default async function Page({
    params
}: {
    params: Promise<{id: string}>
}) {
    const { id } = await params;
    const bookList = books;
    const book = bookList.find((bk) => String(bk.id)===id)
    if(!book){
        notFound();
    }
    const {
        title,
        author,
        chapter,
        currentChapter,
        isFav,
        imageUrl,
        genre,
        description
    }:Book|undefined = book;
    
    return (
        <div>
            <Container className="py-6 shadow space-y-3">
                <nav>
                    <Link href="/"><Button>Home</Button></Link>
                </nav>
                <section className="flex gap-x-6 md:gap-x-12">
                    <div className="relative md:h-60 md:w-44 h-36 w-24 shrink-0">
                        <Image
                            src={imageUrl}
                            fill
                            alt={title}
                            sizes="(max-width: 768px) 240px, 176px"
                        />
                    </div>
                    <div className="flex-1 text-sm sm:text-md md:text-lg min-w-0">
                        <h1 className="md:text-xl text-md font-bold truncate">{title}</h1>
                        <p className="truncate">Author: {author}</p>
                        <p className="truncate">Total Chapters: {chapter}</p>
                        <p className="truncate">Genre: {genre?.join(", ")}</p>
                    </div>
                </section>
                <section className="text-sm sm:text-md md:text-lg min-w-0">
                    <h1 className="md:text-xl text-md font-bold">Description</h1>
                    <p>{description}</p>
                </section>
                <section>

                </section>
            </Container>
        </div>
    )
}