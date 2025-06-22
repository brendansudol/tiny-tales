import Link from "next/link"
import { notFound } from "next/navigation"
import { use } from "react"
import { BookViewer } from "@/components/book-viewer"
import { Header } from "@/components/header"
import { getStoredBook } from "@/lib/server-db"

interface Props {
  params: Promise<{ id: string }>
}

export default function SharedBookPage({ params }: Props) {
  const { id } = use(params)
  const book = use(getStoredBook(id))

  if (book == null) return notFound()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Header />
      <div className="mb-6 rounded-lg bg-yellow-100 p-4 text-sm text-yellow-900">
        🎉 You’re viewing a book that was shared with you.{" "}
        <Link href="/books/new/edit" className="underline">
          Create your own
        </Link>
      </div>
      <BookViewer book={book} showActions={false} />
    </div>
  )
}
