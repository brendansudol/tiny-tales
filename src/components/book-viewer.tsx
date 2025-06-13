"use client"

import { Edit, Share } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { DeleteBookButton } from "@/components/book-delete-button"
import { BookNavButtons } from "@/components/book-nav-buttons"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { shareBookAsImage } from "@/lib/share-book-image"
import { Book } from "@/lib/types"

interface Props {
  book: Book
}

export function BookViewer({ book }: Props) {
  const [pageIndex, setPageIndex] = useState(0)

  const { pages } = book
  const currentPage = pages[pageIndex]
  const { caption, image } = currentPage ?? {}

  useEffect(() => {
    // preload the current and next page images (for smoother navigation)
    const currentAndNextPages = [pageIndex, pageIndex + 1]
    currentAndNextPages
      .filter((i) => i < pages.length && pages[i].image.length > 0) // stay in-bounds
      .forEach((i) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = pages[i].image
      })
  }, [pageIndex, pages])

  if (pages.length === 0) {
    return (
      <div className="text-center">
        <div className="mb-4 text-sm text-gray-500">This book doesn’t have any pages yet.</div>
        <Link
          href={`/books/${book.id}/edit?page=${pageIndex}`}
          className={buttonVariants({ variant: "outline" })}
        >
          <Edit /> Get started
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="font-bold text-lg">{book.title || "(Untitled)"}</div>

      <Card className=" mb-4 p-0 relative">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 md:aspect-2/1">
            <div className="max-sm:relative aspect-square bg-gray-100 card-inner-radius">
              {image && (
                <img
                  src={image}
                  alt={caption}
                  className="w-full h-full object-cover card-inner-radius"
                />
              )}
              <BookNavButtons
                prevDisabled={pageIndex === 0}
                prevOnClick={() => setPageIndex((prev) => prev - 1)}
                nextDisabled={pageIndex === pages.length - 1}
                nextOnClick={() => setPageIndex((prev) => prev + 1)}
              />
            </div>
            <div className="p-6 pt-8 relative h-full overflow-auto">
              <div className="absolute top-0 right-0 px-3 py-2">
                <span className="text-sm text-gray-500">
                  {pageIndex + 1} of {pages.length}
                </span>
              </div>
              <div className="min-h-full flex flex-col justify-center">
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {caption || "(No words yet)"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 items-center">
        <Button variant="outline" aria-label="Share book" onClick={() => shareBookAsImage(book)}>
          <Share className="mr-1" />
          <span>Share</span>
        </Button>
        <Link
          href={`/books/${book.id}/edit?page=${pageIndex}`}
          className={buttonVariants({ variant: "outline" })}
        >
          <Edit className="mr-1" />
          <span className="sm:hidden">Change</span>
          <span className="hidden sm:inline">Make changes</span>
        </Link>
        <DeleteBookButton id={book.id} />
      </div>
    </div>
  )
}
