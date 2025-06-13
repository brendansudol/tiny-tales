"use client"

import Image from "next/image"
import Link from "next/link"
import { AnnouncementBanner } from "@/components/announcement-banner"
import { Header } from "@/components/header"
import { useGetBooks } from "@/hooks/useBooks"
import { getValue } from "@/lib/async-data"
import { Book } from "@/lib/types"

export default function Home() {
  const booksAsync = useGetBooks()
  const books = getValue(booksAsync)

  if (books == null) return null

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Header />
      <AnnouncementBanner />
      {books.length === 0 && <p className="text-sm text-center text-gray-500">No books yet</p>}
      {books.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

function BookCard({ book }: { book: Book }) {
  const firstImage = book.pages[0]?.image
  const pageCount = book.pages.length
  const pageText = pageCount === 1 ? "page" : "pages"

  return (
    <Link
      href={`/books/${book.id}`}
      className="p-3 rounded-xl bg-white border group block shrink-0"
    >
      <div className="flex">
        <div className="mr-4 shrink-0">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={book.title}
              width={100}
              height={100}
              className="inline-block rounded-lg size-12"
            />
          ) : (
            <div className="flex items-center justify-center size-12 bg-gray-100 rounded-lg">
              <Image
                src="/icons/book-2.png"
                alt="tiny tales"
                width={32}
                height={32}
                className="size-8"
              />
            </div>
          )}
        </div>
        <div>
          <h4>{book.title || "Untitled"}</h4>
          <p className="text-xs text-gray-500">{`${pageCount} ${pageText}`}</p>
        </div>
      </div>
    </Link>
  )
}
