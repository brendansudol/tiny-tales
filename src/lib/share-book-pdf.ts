import { jsPDF } from "jspdf"
import { Book } from "./types"

export async function shareBookAsPdf(book: Book) {
  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  for (let i = 0; i < book.pages.length; i++) {
    const { image, caption } = book.pages[i]
    if (i !== 0) pdf.addPage()
    // Fit image to width, 60% height
    pdf.addImage(image, "JPEG", 0, 0, pageWidth, pageHeight * 0.6)
    pdf.text(caption, 40, pageHeight * 0.7, { maxWidth: pageWidth - 80 })
  }

  const blob = pdf.output("blob")
  const file = new File([blob], `${book.title}.pdf`, { type: "application/pdf" })

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: book.title,
      text: `Enjoy my tiny tales story: “${book.title}”`,
      files: [file],
    })
  } else {
    // Fallback: trigger a download
    const url = URL.createObjectURL(file)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
}
