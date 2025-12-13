import { Book } from "@/types/types";
import Image from "next/image";
import { Bookmark, Circle, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import React from "react";

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
        <div ref={ref} className={cn(className, "flex justify-between rounded-md shadow h-24 lg:h-32")} {...props}>
            <a href="/" className="min-w-0 flex-1">
                <div className="flex h-full">
                    <div className="shrink-0 h-full w-20 lg:w-24 relative">
                        <Image 
                        src={imageUrl}
                        fill
                        alt={book.title}
                        className="rounded-md"
                    />
                    </div>
                    <div className="min-w-0 p-3 flex flex-col justify-between">
                        <div>
                            <h3 className="truncate font-bold text-sm md:text-md">{title}</h3>
                            <p className="truncate text-gray-600 text-xs md:text-sm">{author}</p>
                        </div>
                        <footer className="text-gray-500 text-xs md:text-sm">
                            <p className="truncate">Chapter: {chapter}</p>
                            <p className="truncate">Current: {currentChapter}</p>
                        </footer>
                    </div>
                </div>
            </a>
            <button className="border-l border-r-stone-300 p-2"
                onClick={() => {
                    if(!editingMode) toggleFav(id);
                    else toggleRemoveFav(id);
                }}
            >
                {(() => {
                    if(editingMode) return toRemove?<CircleCheck className="w-4 h-4 sm:w-6 sm:h-6"/>:<Circle className="w-4 h-4 sm:w-6 sm:h-6"/>;
                    return <Bookmark className={cn("w-4 h-4 sm:w-6 sm:h-6",book.isFav&&"fill-yellow-300")}/>;
                })()}
            </button>
        </div>
    )
});

export { BookCard };