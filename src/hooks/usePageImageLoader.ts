"use client"

import { useEffect, useRef, useState } from "react"
import { Page } from "@/lib/types"

export function usePageImageLoader(pages: Page[], pageIndex: number) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const loadedImages = useRef(new Set<string>())

  const image = pages[pageIndex]?.image

  useEffect(() => {
    if (image) {
      setImageLoaded(loadedImages.current.has(image))
    } else {
      setImageLoaded(false)
    }
  }, [image])

  useEffect(() => {
    const indices = [pageIndex, pageIndex + 1]
    indices
      .filter((i) => i < pages.length && pages[i].image.length > 0)
      .forEach((i) => {
        const src = pages[i].image
        if (loadedImages.current.has(src)) return
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => loadedImages.current.add(src)
        img.src = src
      })
  }, [pageIndex, pages])

  const markImageLoaded = (src: string) => {
    loadedImages.current.add(src)
    setImageLoaded(true)
  }

  return { imageLoaded, markImageLoaded }
}
