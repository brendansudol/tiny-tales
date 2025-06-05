"use client"

import { useEffect, useState } from "react"
import { AsyncData, asyncLoaded, asyncLoading } from "@/lib/async-data"
import { getBook, getBooks } from "@/lib/storage"
import { Book } from "@/lib/types"

export function useGetBooks() {
  const [books, setBooks] = useState<AsyncData<Book[]>>(asyncLoading())

  useEffect(() => {
    setBooks(asyncLoaded(getBooks()))
  }, [])

  return books
}

export function useGetBook(id: string) {
  const [book, setBook] = useState<AsyncData<Book | undefined>>(asyncLoading())

  useEffect(() => {
    setBook(asyncLoaded(getBook(id)))
  }, [id])

  return book
}
