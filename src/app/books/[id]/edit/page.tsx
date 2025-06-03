"use client"

import { use, useMemo } from "react"
import { BookEditor } from "@/components/book-editor"
import { Header } from "@/components/header"
import { createEmptyBook } from "@/lib/create-empty-book"
import { useGetBook } from "@/hooks/useBooks"
import { getValue, isReady } from "@/lib/async-data"
import { useSearchParams } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default function BookEditPage({ params }: Props) {
  const { id } = use(params)

  const bookAsync = useGetBook(id)
  const existingBook = getValue(bookAsync)
  const book = useMemo(() => existingBook ?? createEmptyBook(), [existingBook])

  const searchParams = useSearchParams()
  const pageIndex = Number(searchParams.get("page")) || 0

  if (!isReady(bookAsync)) return null

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Header />
      <BookEditor key={book.id} book={book} pageIndex={pageIndex} />
    </div>
  )
}
