import { Book, Page } from "@/lib/types"

/**
 * Combine all pages of a book into one tall PNG and invoke the Web Share API
 * (or fallback to a download). Throws on failure.
 */
export async function shareBookAsImage(book: Book): Promise<void> {
  const PAGE_WIDTH = 800 // px
  const PADDING = 40
  const CAPTION_FONT = "20px sans-serif"
  const LINE_HEIGHT = 28

  // 1. Preload images & compute individual heights
  const loadedPages: Array<
    Page & { img: HTMLImageElement | null; scale: number; imgHeight: number }
  > = await Promise.all(
    book.pages.map(async (p) => {
      if (!p.image) return { ...p, img: null, scale: 1, imgHeight: 0 }
      const img = await loadImage(p.image)
      const scale = PAGE_WIDTH / img.width
      return { ...p, img, scale, imgHeight: img.height * scale }
    })
  )

  // Temporary canvas for caption measurement
  const measureCanvas = document.createElement("canvas")
  const measureCtx = measureCanvas.getContext("2d") as CanvasRenderingContext2D
  measureCtx.font = CAPTION_FONT

  let totalHeight = 0
  loadedPages.forEach(({ caption, imgHeight }) => {
    let lines = 1
    let line = ""
    caption.split(" ").forEach((w) => {
      const test = line + w + " "
      if (measureCtx.measureText(test).width > PAGE_WIDTH - PADDING * 2) {
        lines++
        line = w + " "
      } else {
        line = test
      }
    })
    totalHeight += imgHeight + lines * LINE_HEIGHT + 40 // 40px gap
  })

  const canvas = document.createElement("canvas")
  canvas.width = PAGE_WIDTH
  canvas.height = totalHeight
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, PAGE_WIDTH, totalHeight)
  ctx.font = CAPTION_FONT
  ctx.fillStyle = "#000"

  // 2. Render pages sequentially
  let yOffset = 0
  for (const { caption, img, imgHeight } of loadedPages) {
    if (img) ctx.drawImage(img, 0, yOffset, PAGE_WIDTH, imgHeight)
    yOffset += imgHeight + 20 // gap before caption
    yOffset = drawWrappedText(ctx, caption, PADDING, yOffset, PAGE_WIDTH - PADDING * 2, LINE_HEIGHT)
    yOffset += 20 // gap after caption
  }

  // 3. Convert to blob & share
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("blob conversion failed"))),
      "image/png"
    )
  })

  const file = new File([blob], `${book.title}.png`, { type: "image/png" })

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: book.title,
      text: `Enjoy my Tiny Tales story \"${book.title}\"`,
      files: [file],
    })
  } else {
    const url = URL.createObjectURL(file)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    alert("Image downloaded – share it from your files app!")
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
    img.src = src
  })
}

/**
 * Draw text onto a canvas context, automatically wrapping when the next
 * word would exceed `maxWidth`.
 * Returns the next y-coordinate (top of the following line).
 */
function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ")
  let line = ""
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " "
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, y)
      line = words[n] + " "
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), x, y)
  return y + lineHeight
}
