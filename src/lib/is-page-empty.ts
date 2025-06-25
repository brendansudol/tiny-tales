import { AsyncData, getValue } from "@/lib/async-data"
import { Page } from "@/lib/types"
export type PageLike = {
  caption: string | AsyncData<string>
  image: string | AsyncData<string>
}

/** Determine if a page draft or saved page has no caption and no image. */
export function isPageEmpty(page: Page | PageLike): boolean {
  const caption =
    typeof page.caption === "string"
      ? page.caption.trim()
      : getValue(page.caption, "").trim()
  const image =
    typeof page.image === "string" ? page.image : getValue(page.image, "")
  return caption === "" && image === ""
}
