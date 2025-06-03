import { v4 as uuid } from "uuid"
import { Book } from "@/lib/types"

export function createEmptyBook(): Book {
  return {
    id: uuid(),
    title: "",
    pages: [],
    createdAt: Date.now(),
  }
}
