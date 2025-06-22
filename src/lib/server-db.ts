import { Book } from "@/lib/types"
import { v4 as uuid } from "uuid"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export async function storeBook(book: Book): Promise<string> {
  const id = uuid()
  await redis.set(id, book)
  return id
}

export async function getStoredBook(id: string): Promise<Book | undefined> {
  return (await redis.get<Book>(id)) ?? undefined
}
