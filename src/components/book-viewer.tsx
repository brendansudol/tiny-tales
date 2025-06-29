"use client"

import { Edit, Share, Loader2 } from "lucide-react"
import ImageComponent from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useSwipeable } from "react-swipeable"
import { DeleteBookButton } from "@/components/book-delete-button"
import { BookNavButtons } from "@/components/book-nav-buttons"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePageImageLoader } from "@/hooks/usePageImageLoader"
import { shareBookOnline } from "@/lib/share-book-online"
import { Book } from "@/lib/types"
import { cn } from "@/lib/utils"

interface Props {
  book: Book
  showActions?: boolean
}

export function BookViewer({ book, showActions = true }: Props) {
  const [pageIndex, setPageIndex] = useState(0)

  const { pages } = book
  const currentPage = pages[pageIndex]
  const { caption, image } = currentPage ?? {}

  const { isImageLoaded, markImageLoaded } = usePageImageLoader(pages, pageIndex)

  const swipeHandlers = useSwipeable({
    trackTouch: true,
    trackMouse: false,
    onSwipedLeft: () => setPageIndex((prev) => Math.min(prev + 1, pages.length - 1)),
    onSwipedRight: () => setPageIndex((prev) => Math.max(prev - 1, 0)),
  })

  const handleShare = async () => {
    const url = await shareBookOnline(book)
    if (!url) return
    if (navigator.share) {
      await navigator.share({ url, title: book.title })
    } else {
      await navigator.clipboard.writeText(url)
      alert("Link copied to clipboard")
    }
  }

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

      <Card className="mb-4 p-0 relative">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 md:aspect-2/1">
            <div
              className="max-sm:relative aspect-square bg-gray-100 card-inner-radius"
              {...swipeHandlers}
            >
              {image && (
                <div className="relative w-full h-full">
                  <ImageComponent
                    key={image}
                    alt={caption}
                    className={cn(
                      "object-cover card-inner-radius transition-opacity",
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    )}
                    fill={true}
                    onLoad={() => markImageLoaded(image)}
                    src={image}
                  />
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center card-inner-radius">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    </div>
                  )}
                </div>
              )}
              <BookNavButtons
                prevDisabled={pages.length <= 1}
                prevOnClick={() =>
                  setPageIndex((prev) => (prev === 0 ? pages.length - 1 : prev - 1))
                }
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

      {showActions && (
        <div className="flex gap-3 items-center">
          <Button variant="outline" aria-label="Share book" onClick={handleShare}>
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
      )}
    </div>
  )
}
