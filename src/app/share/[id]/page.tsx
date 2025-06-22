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
  const book = getStoredBook(id)

  if (book == null) return notFound()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Header />
      <BookViewer book={book} />
    </div>
  )
}
