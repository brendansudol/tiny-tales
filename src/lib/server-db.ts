import { Book } from "@/lib/types"
import { v4 as uuid } from "uuid"

const books = new Map<string, Book>()

export function storeBook(book: Book): string {
  const id = uuid()
  books.set(id, book)
  return id
}

export function getStoredBook(id: string): Book | undefined {
  return books.get(id)
}
