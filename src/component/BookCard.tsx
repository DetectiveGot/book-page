import { Book } from "@/types/types";
import Image from "next/image";
import { Bookmark, Circle, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import React from "react";

const imageHeight = 250;
const imageWidth = 100;

type BookCardProps = React.HTMLAttributes<HTMLDivElement> & {
    book: Book;
    toggleFav: (id: number) => void;
    editingMode: boolean;
    toggleRemoveFav: (id: number) => void;
    toRemove: boolean;
}

const BookCard = forwardRef<HTMLDivElement, BookCardProps>(({className, book, toggleFav, editingMode, toggleRemoveFav, toRemove, ...props}, ref) => {
    const {
        id,
        title,
        author,
        chapter,
        currentChapter,
        isFav,
        imageUrl,
        genre,
        description
    } = book;
    return (
        <div ref={ref} className={cn(className, "flex rounded-md shadow gap-x-3 relative")} 
            onClick={() => {
                if(!editingMode) return;
                toggleRemoveFav(id);
            }}
            {...props}
        >
            <Image 
                src={imageUrl}
                width={imageWidth}
                height={imageHeight}
                alt={book.title}
                className="rounded-md"
            />
            <div className="p-3">
                <h3 className="font-bold">{title}</h3>
                <p>Author: {author}</p>
                <p>Chapter: {chapter}</p>
                <p>Current: {currentChapter}</p>
            </div>
            <button className="absolute right-1 top-1" onClick={() => toggleFav(id)}>
                {(() => {
                    if(editingMode) return toRemove?<CircleCheck/>:<Circle/>;
                    return <Bookmark className={cn(book.isFav&&"fill-yellow-300")}/>;
                })()}
            </button>
        </div>
    )
});

export { BookCard };