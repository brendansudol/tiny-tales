import { NextResponse } from "next/server"
import { getStoredBook } from "@/lib/server-db"

export const runtime = "nodejs"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const book = getStoredBook(id)

  if (book == null) return NextResponse.json({ error: "Not found" }, { status: 404 })
  else return NextResponse.json(book)
}
