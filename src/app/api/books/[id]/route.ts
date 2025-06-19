import { NextResponse } from "next/server"
import { getStoredBook } from "@/lib/server-db"

export const runtime = "nodejs"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const book = getStoredBook(params.id)
  if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(book)
}
