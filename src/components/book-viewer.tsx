"use client"

import { ChevronLeft, ChevronRight, Edit, Share } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Book } from "@/lib/types"
import { DeleteBookButton } from "./book-delete-button"
import { shareBookPdf } from "@/lib/share-book-pdf"

const SHOULD_SHOW_SHARE_BUTTON = false

interface Props {
  book: Book
}

export function BookViewer({ book }: Props) {
  const [pageIndex, setPageIndex] = useState(0)

  const { pages } = book
  const currentPage = pages[pageIndex]
  const { caption, image } = currentPage

  if (pages.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No pages in your book yet. Start creating!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="font-bold text-lg">{book.title}</div>

      <div className="mb-4 relative">
        <Card className="overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 md:aspect-2/1">
              <div className="aspect-square bg-gray-100">
                {image && <img src={image} alt={caption} className="w-full h-full object-cover" />}
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

        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-5">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white shadow-md h-10 w-10"
            onClick={() => setPageIndex((prev) => prev - 1)}
            disabled={pageIndex === 0}
          >
            <ChevronLeft />
            <span className="sr-only">Previous page</span>
          </Button>
        </div>

        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-5">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white shadow-md h-10 w-10"
            onClick={() => setPageIndex((prev) => prev + 1)}
            disabled={pageIndex === pages.length - 1}
          >
            <ChevronRight />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        {SHOULD_SHOW_SHARE_BUTTON && (
          <Button variant="outline" aria-label="Share book" onClick={() => shareBookPdf(book)}>
            <Share /> Share
          </Button>
        )}
        <Link href={`/books/${book.id}/edit`} className={buttonVariants({ variant: "outline" })}>
          <Edit /> Make changes
        </Link>
        <DeleteBookButton id={book.id} />
      </div>
    </div>
  )
}
