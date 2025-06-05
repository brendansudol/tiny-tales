import { Book } from "@/lib/types"

export const SAMPLE_BOOK: Book = {
  id: "sample-book",
  title: "Sample Book",
  pages: [
    {
      id: "sample-page-1",
      caption: "Sample Page 1",
      image: "/example/a.png",
    },
    {
      id: "sample-page-2",
      caption: "Sample Page 2",
      image: "/example/b.png",
    },
    {
      id: "sample-page-3",
      caption: "Sample Page 3",
      image: "/example/c.png",
    },
  ],
  createdAt: Date.now(),
}
