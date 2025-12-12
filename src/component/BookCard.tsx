import { Book } from "@/types/types"
import Image from "next/image";

const imageHeight = 250;
const imageWidth = 100;

export const BookCard = ({book}:{book: Book}) => {
    const {
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
        <div className="flex rounded-md shadow gap-x-3">
            <Image 
                src={imageUrl}
                width={imageWidth}
                height={imageHeight}
                alt={book.title}
                className="rounded-md"
            />
            <div>
                <h3>{title}</h3>
                <p>Author: {author}</p>
                <p>Chapter: {chapter}</p>
                <p>Current: {currentChapter}</p>
            </div>
        </div>
    )
}