"use client"

import { use, useMemo } from "react"
import { v4 as uuid } from "uuid"
import { BookEditor } from "@/components/book-editor"
import { Header } from "@/components/header"
import { getBook } from "@/lib/storage"
import { Book } from "@/lib/types"

interface Props {
  params: Promise<{ id: string }>
}

export default function BookEditPage({ params }: Props) {
  const { id } = use(params)
  const book = useMemo(() => getBook(id) ?? createEmptyBook(), [id])

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Header />
      <BookEditor book={book} />
    </div>
  )
}

function createEmptyBook(): Book {
  return {
    id: uuid(),
    title: "",
    pages: [],
    createdAt: Date.now(),
  }
}
