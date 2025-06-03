"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { getValue } from "@/lib/async-data"
import { useGetBooks } from "@/hooks/useBooks"

export default function Home() {
  const booksAsync = useGetBooks()
  const books = getValue(booksAsync)

  if (books == null) return null

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Header />
      {books.length === 0 && <p className="text-sm text-center text-gray-500">No books yet</p>}
      {books.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="p-4 rounded-xl bg-white border flex flex-col"
            >
              {book.title || "Untitled"}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
