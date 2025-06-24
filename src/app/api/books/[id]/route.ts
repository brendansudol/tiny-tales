import { NextResponse } from "next/server"
import { getStoredBook, updateStoredBook } from "@/lib/server-db"
import { Book } from "@/lib/types"

export const runtime = "nodejs"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = await getStoredBook(id)

  if (book == null) return NextResponse.json({ error: "Not found" }, { status: 404 })
  else return NextResponse.json(book)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = (await req.json()) as Book
  await updateStoredBook(id, book)
  return NextResponse.json({ ok: true })
}
