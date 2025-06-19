import { notFound } from "next/navigation"
import { BookViewer } from "@/components/book-viewer"
import { Header } from "@/components/header"
import { getStoredBook } from "@/lib/server-db"

interface Props {
  params: { id: string }
}

export default async function SharedBookPage({ params }: Props) {
  const book = getStoredBook(params.id)
  if (!book) return notFound()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Header />
      <BookViewer book={book} />
    </div>
  )
}
