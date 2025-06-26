import { Redis } from "@upstash/redis"
import { v4 as uuid } from "uuid"
import { Book } from "@/lib/types"

const redis = Redis.fromEnv()

export async function storeBook(book: Book): Promise<string> {
  const id = uuid()
  await redis.set(id, book)
  return id
}

export async function getStoredBook(id: string): Promise<Book | undefined> {
  return (await redis.get<Book>(id)) ?? undefined
}

export async function updateStoredBook(id: string, book: Book): Promise<void> {
  await redis.set(id, book)
}
