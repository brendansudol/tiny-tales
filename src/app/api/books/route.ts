import { NextResponse } from "next/server"
import { storeBook } from "@/lib/server-db"
import { Book } from "@/lib/types"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const book = (await req.json()) as Book
  const id = await storeBook(book)

  return NextResponse.json({ id })
}
