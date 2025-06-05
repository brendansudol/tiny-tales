import { SAMPLE_BOOK } from "@/lib/sample-data"
import { Book } from "@/lib/types"

const KEY = "tiny-tales"

export function getBooks(): Book[] {
  let books: Book[] = []

  if (typeof window !== "undefined") {
    try {
      books = JSON.parse(localStorage.getItem(KEY) ?? "[]")
    } catch (_) {}
  }

  if (books[0]?.id !== SAMPLE_BOOK.id) {
    // If the sample book is not present, add it to the beginning of the list
    // This ensures that the sample book is always available for new users
    books = [SAMPLE_BOOK, ...books]
  }

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
