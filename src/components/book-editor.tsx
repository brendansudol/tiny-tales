"use client"

import {
  Mic,
  Loader2,
  ImagePlus,
  BookText,
  SquarePlus,
  ChevronLeft,
  ChevronRight,
  CircleStop,
} from "lucide-react"
import { useState } from "react"
import { v4 as uuid } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Book, Page } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useMicrophone } from "@/hooks/useMicrophone"

interface Props {
  book: Book
}

export function BookEditor({ book }: Props) {
  const [pagesDraft, setPagesDraft] = useState(() => [...book.pages])
  const [pageIndex, setPageIndex] = useState(0)
  const [caption, setCaption] = useState("")
  const [imageResult, setImageResult] = useState<string>()
  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false)
  const [error, _setError] = useState<string>()

  const handleAddPage = () => {
    const newPage: Page = { id: uuid(), caption: "", image: "" }
    setPagesDraft((prev) => [...prev, newPage])
    setCaption("")
    setImageResult("")
  }

  const handleSaveBook = () => {
    console.log("TODO: save book")
    // upsertBook({ ...book, title, pages })
    // router.push(`/`)
  }

  const handleGenerateImage = async () => {
    if (caption.trim().length === 0) return

    try {
      setIsLoadingImage(true)
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: caption }),
      })
      const data = await res.json()
      setImageResult(data.url ?? data.base64)
    } catch (error) {
      console.error("Image generation fail", error)
    } finally {
      setIsLoadingImage(false)
    }
  }

  const { isRecording, toggleRecording } = useMicrophone({
    onAudioReady: async (blob) => {
      const formData = new FormData()
      formData.append("file", blob, "recording.webm")

      try {
        setIsLoadingTranscript(true)
        const res = await fetch("/api/transcribe", { method: "POST", body: formData })
        const json = await res.json()
        setCaption(json.transcript ?? "(No transcript available)")
      } catch (error) {
        console.error("Transcription fail", error)
      } finally {
        setIsLoadingTranscript(false)
      }
    },
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Card className="p-0 overflow-hidden">
          <CardContent className="p-5">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center md:text-left">
                  <h2 className="text-lg font-bold text-purple-700">
                    Let’s start your book! (page {pageIndex + 1})
                  </h2>
                </div>

                <div className="relative min-h-[150px] p-4 bg-white border-2 border-dashed border-purple-300 rounded-lg">
                  {caption ? (
                    <p>{caption}</p>
                  ) : (
                    <p className="text-gray-400">
                      {isRecording ? "I'm listening..." : "Press the microphone and start talking!"}
                    </p>
                  )}

                  <div
                    className={cn(
                      "absolute bottom-2 right-2 h-4 w-4 rounded-full",
                      isRecording ? "bg-red-500 animate-pulse" : "bg-gray-300"
                    )}
                  />
                </div>

                <div className="flex justify-between gap-4">
                  <Button
                    disabled={isLoadingTranscript}
                    onClick={toggleRecording}
                    variant="outline"
                    size="icon"
                  >
                    {isRecording ? (
                      <CircleStop className="h-4 w-4" />
                    ) : isLoadingTranscript ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    onClick={handleGenerateImage}
                    disabled={!caption.trim() || isLoadingImage}
                    variant="outline"
                  >
                    {isLoadingImage ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <ImagePlus className="mr-1 h-4 w-4" />
                        Create
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-purple-300 flex items-center justify-center">
                  {imageResult != null && imageResult !== "" ? (
                    <img
                      src={formatImageSrc(imageResult)}
                      alt={caption}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <ImagePlus className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        {isLoadingImage
                          ? "Creating your picture..."
                          : "Your picture will appear here"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-5">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white shadow-md h-10 w-10"
            onClick={() => setPageIndex((prev) => prev - 1)}
            disabled={pageIndex === 0}
          >
            <ChevronLeft />
            <span className="sr-only">Previous page</span>
          </Button>
        </div>

        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-5">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white shadow-md h-10 w-10"
            onClick={() => setPageIndex((prev) => prev + 1)}
            disabled={pageIndex >= pagesDraft.length - 1}
          >
            <ChevronRight />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-2 justify-between items-center">
        <Button onClick={handleAddPage} variant="outline">
          <SquarePlus className="mr-1 h-4 w-4" /> Add page
        </Button>
        <Button onClick={handleSaveBook} variant="outline">
          <BookText className="mr-1 h-4 w-4" /> Save book
        </Button>
      </div>

      <pre>{JSON.stringify(pagesDraft, null, 2)}</pre>
    </div>
  )
}

// TODO: refine this
function formatImageSrc(value: string) {
  if (value.startsWith("http") || value.startsWith("/")) return value
  else return `data:image/png;base64,${value}`
}
