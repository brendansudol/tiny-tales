"use client"

import { notFound, usePathname, useRouter, useSearchParams } from "next/navigation"
import { use, useEffect } from "react"
import { BookViewer } from "@/components/book-viewer"
import { Header } from "@/components/header"
import { celebrate } from "@/lib/confetti"
import { useGetBook } from "@/hooks/useBooks"
import { getValue, isReady } from "@/lib/async-data"

interface Props {
  params: Promise<{ id: string }>
}

export default function BookViewPage({ params }: Props) {
  const { id } = use(params)

  const bookAsync = useGetBook(id)
  const book = getValue(bookAsync)

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const shouldCelebrate = searchParams.get("celebrate") === "1"

  useEffect(() => {
    if (shouldCelebrate) {
      celebrate()
      router.replace(pathname, { scroll: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldCelebrate])

  if (!isReady(bookAsync)) return null
  if (book == null) return notFound()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Header />
      <BookViewer book={book} />
    </div>
  )
}
