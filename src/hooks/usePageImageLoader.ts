"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Page } from "@/lib/types"

export function usePageImageLoader(pages: Page[], pageIndex: number) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const loadedImages = useRef(new Set<string>())

  const image = pages[pageIndex]?.image

  useEffect(() => {
    if (image) setIsImageLoaded(loadedImages.current.has(image))
    else setIsImageLoaded(false)
  }, [image])

  useEffect(() => {
    // preload the current and next page images (for smoother navigation)
    const currentAndNextPages = [pageIndex, pageIndex + 1]
    currentAndNextPages
      .filter((i) => i < pages.length && pages[i].image.length > 0) // stay in-bounds
      .forEach((i) => {
        const src = pages[i].image
        if (loadedImages.current.has(src)) return
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => loadedImages.current.add(src)
        img.src = src
      })
  }, [pageIndex, pages])

  const markImageLoaded = useCallback((src: string) => {
    loadedImages.current.add(src)
    setIsImageLoaded(true)
  }, [])

  return {
    isImageLoaded,
    markImageLoaded,
  }
}
