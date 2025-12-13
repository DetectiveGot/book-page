export type Book = {
    id: number
    title: string,
    author: string,
    chapter: number,
    currentChapter: number,
    isFav: boolean,
    imageUrl: string,
    genre: string[]|null,
    description: string
};

export type Banner = {
    id: number,
    title: string,
    imageUrl: string,
}