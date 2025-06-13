import { Book } from "@/lib/types"

export const EXAMPLE_BOOK: Book = {
  id: "example",
  title: "Alphabet Fun",
  pages: [
    {
      id: "page-1",
      caption: "A cartoon of the letter A drinking coffee.",
      image: "/example/a.png",
    },
    {
      id: "page-2",
      caption: "A cartoon of the letter B drinking milk.",
      image: "/example/b.png",
    },
    {
      id: "page-3",
      caption: "A cartoon of the letter C watching TV.",
      image: "/example/c.png",
    },
  ],
  createdAt: Date.now(),
}
