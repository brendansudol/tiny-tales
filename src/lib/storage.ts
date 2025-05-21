import { SAMPLE_BOOK } from "@/utils/data"
import { Book } from "./types"

const KEY = "tiny-tales"

export function getBooks(): Book[] {
  let books: Book[] = []

  if (typeof window !== "undefined") {
    try {
      books = JSON.parse(localStorage.getItem(KEY) ?? "[]")
    } catch (_) {}
  }

  books.unshift(SAMPLE_BOOK)
  return books
}

export function getBook(id: string): Book | undefined {
  const books = getBooks()
  return books.find((b) => b.id === id)
}

export function saveBooks(books: Book[]) {
  localStorage.setItem(KEY, JSON.stringify(books))
}

export function upsertBook(book: Book) {
  const books = getBooks()
  const idx = books.findIndex((b) => b.id === book.id)

  if (idx === -1) books.push(book)
  else books[idx] = book

  saveBooks(books)
}
