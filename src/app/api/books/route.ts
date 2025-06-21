import { NextResponse } from "next/server"
import { Book } from "@/lib/types"
import { storeBook } from "@/lib/server-db"

export const runtime = "nodejs"

export const POST = async (req: Request) => {
  const book = (await req.json()) as Book
  const id = storeBook(book)
  return NextResponse.json({ id })
}
