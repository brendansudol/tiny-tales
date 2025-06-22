import { upsertBook } from "@/lib/storage"
import { Book } from "@/lib/types"

export async function shareBookOnline(book: Book): Promise<string | undefined> {
  try {
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    })
    const data = await res.json()
    if (data.id) {
      const updated = { ...book, remoteId: data.id }
      upsertBook(updated)
      return `${location.origin}/share/${data.id}`
    }
  } catch (err) {
    console.error("shareBookOnline", err)
  }
}
