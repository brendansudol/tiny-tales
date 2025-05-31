"use client"

import classNames from "classnames"
import {
  Loader2,
  ImagePlus,
  BookText,
  SquarePlus,
  ChevronLeft,
  ChevronRight,
  Settings2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useReducer } from "react"
import { EditableText } from "@/components/editable-text"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { useMicrophone } from "@/hooks/useMicrophone"
import { asyncFailedToLoad, asyncLoaded, asyncLoading, getValue, isLoading } from "@/lib/async-data"
import { upsertBook } from "@/lib/storage"
import { Book } from "@/lib/types"
import { getInitialState, PageDraft, reducer } from "./state"
import { RecordButton } from "../record-button"

export function BookEditor({ book }: { book: Book }) {
  const [state, dispatch] = useReducer(reducer, getInitialState(book))

  const page = state.pages[state.pageIndex]
  const canPrev = state.pageIndex > 0
  const canNext = state.pageIndex < state.pages.length - 1
  const isLoadingTranscript = isLoading(page.caption)
  const isLoadingImage = isLoading(page.image)
  const captionText = getValue(page.caption, "")
  const imageSrc = getValue(page.image)

  const router = useRouter()

  const makePageUpdater = (idx: number) => (payload: Partial<PageDraft>) => {
    dispatch({ type: "UPDATE_PAGE", pageIndex: idx, payload })
  }

  const handleDeleteCurrentPage = () => {
    dispatch({ type: "DELETE_PAGE", pageIndex: state.pageIndex })
  }

  const handleChangeCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({
      type: "UPDATE_PAGE",
      pageIndex: state.pageIndex,
      payload: { caption: asyncLoaded(e.target.value) },
    })
  }

  const handleSaveBook = () => {
    upsertBook({
      ...book,
      title: state.title,
      pages: state.pages.map((page) => ({
        ...page,
        caption: getValue(page.caption, ""),
        image: getValue(page.image, ""),
      })),
    })
    router.push(`/books/${book.id}`)
  }

  const handleGenerateImage = async () => {
    if (captionText.trim().length === 0 || isLoading(page.image)) return

    const updatePage = makePageUpdater(state.pageIndex)
    updatePage({ image: asyncLoading() })

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: captionText }),
      })
      const data = await res.json()
      const imageUrl = data.url
      updatePage({ image: asyncLoaded(imageUrl) })
    } catch (error) {
      console.error("Image generation fail", error)
      updatePage({ image: asyncFailedToLoad("Image generation failed") })
    }
  }

  const { isRecording, toggleRecording } = useMicrophone({
    onAudioReady: async (blob) => {
      const formData = new FormData()
      formData.append("file", blob, "recording.webm")

      const updatePage = makePageUpdater(state.pageIndex)
      updatePage({ caption: asyncLoading() })

      try {
        const res = await fetch("/api/transcribe", { method: "POST", body: formData })
        const json = await res.json()
        const transcript = json.transcript ?? "(No transcript available)"
        updatePage({ caption: asyncLoaded(transcript) })
      } catch (error) {
        console.error("Transcription fail", error)
        updatePage({ caption: asyncFailedToLoad("Transcription failed") })
      }
    },
  })

  return (
    <div className="space-y-2">
      <EditableText
        className="font-bold text-lg"
        initialText={state.title}
        onSave={(title) => dispatch({ type: "SET_TITLE", title })}
        placeholder="Add book title"
      />

      <div className="mb-3 relative">
        <Card className="p-0 overflow-hidden">
          <CardContent className="p-5">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="text-md font-semibold">Page {state.pageIndex + 1}</div>
                  {state.pages.length > 1 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <Settings2 className="size-[14px]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleDeleteCurrentPage}>
                          Delete page
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <Textarea
                  className="resize-none h-[150px] p-4 border-2 border-dashed border-purple-300 focus-visible:ring-purple-300/50 rounded-lg disabled:opacity-80 md:text-base"
                  placeholder="Press the microphone and start talking!"
                  disabled={isRecording || isLoadingTranscript}
                  onChange={handleChangeCaption}
                  value={
                    isRecording
                      ? "I'm listening..."
                      : isLoadingTranscript
                      ? "Loading..."
                      : captionText
                  }
                />

                <div className="flex justify-between gap-4">
                  <RecordButton
                    isLoading={isLoadingTranscript}
                    isRecording={isRecording}
                    onClick={toggleRecording}
                  />

                  <Button
                    onClick={handleGenerateImage}
                    disabled={!captionText.trim() || isLoadingImage}
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
                <div
                  className={classNames(
                    "w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center",
                    { "animate-pulse": isLoadingImage },
                    imageSrc ? "border" : "border-2 border-dashed border-purple-300"
                  )}
                >
                  {imageSrc ? (
                    <img
                      src={formatImageSrc(imageSrc)}
                      alt={captionText}
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

            {state.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {state.error}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-5">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white shadow-md h-10 w-10"
            onClick={() => dispatch({ type: "SET_PAGE_INDEX", pageIndex: state.pageIndex - 1 })}
            disabled={!canPrev || isRecording}
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
            onClick={() => dispatch({ type: "SET_PAGE_INDEX", pageIndex: state.pageIndex + 1 })}
            disabled={!canNext || isRecording}
          >
            <ChevronRight />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-2 justify-between items-center">
        <div className="flex items-center gap-2">
          <Button onClick={() => dispatch({ type: "ADD_PAGE" })} variant="outline">
            <SquarePlus className="mr-1 h-4 w-4" /> Add page
          </Button>
        </div>
        <Button onClick={handleSaveBook} variant="outline">
          <BookText className="mr-1 h-4 w-4" /> Save book
        </Button>
      </div>
    </div>
  )
}

// TODO: refine this
function formatImageSrc(value: string) {
  if (value.startsWith("http") || value.startsWith("/")) return value
  else return `data:image/png;base64,${value}`
}
