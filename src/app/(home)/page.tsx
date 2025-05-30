"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { getBooks } from "@/lib/storage"

export default function Home() {
  const books = getBooks()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Header />
      {books.length === 0 && <p className="text-sm text-center text-gray-500">No books yet</p>}
      {books.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
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
