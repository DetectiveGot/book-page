export type Book = {
    _id: string
    title: string,
    author: string,
    chapter: number,
    // currentChapter: number,
    // isFav: boolean,
    imageUrl: string,
    genre: string[]|null,
    description: string,
};

export type Banner = {
    _id: string,
    title: string,
    imageUrl: string,
    linkUrl: string,
}

export type Bookmark = {
    _id: string,
    bookId: string,
}