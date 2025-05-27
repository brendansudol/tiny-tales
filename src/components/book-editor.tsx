"use client"

import classNames from "classnames"
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
import { useReducer } from "react"
import { v4 as uuid } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AsyncData,
  asyncFailedToLoad,
  asyncLoaded,
  asyncLoading,
  asyncNotStarted,
  getValue,
  isLoading,
} from "@/lib/async-data"
import { Book, Page } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useMicrophone } from "@/hooks/useMicrophone"
import { EditableText } from "./editable-text"

interface PageDraft extends Omit<Page, "caption" | "image"> {
  caption: AsyncData<string>
  image: AsyncData<string>
}

interface State {
  pages: PageDraft[]
  pageIndex: number
  title: string
  error?: string
}

type Action =
  | { type: "SET_TITLE"; title: string }
  | { type: "SET_PAGE_INDEX"; pageIndex: number }
  | { type: "ADD_PAGE" }
  | { type: "UPDATE_PAGE"; pageIndex: number; payload: Partial<PageDraft> }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TITLE":
      return {
        ...state,
        title: action.title,
      }

    case "SET_PAGE_INDEX":
      return {
        ...state,
        pageIndex: action.pageIndex,
      }

    case "ADD_PAGE":
      return {
        ...state,
        pages: [...state.pages, createEmptyPage()],
        pageIndex: state.pages.length,
      }

    case "UPDATE_PAGE":
      return {
        ...state,
        pages: state.pages.map((page, idx) =>
          idx === action.pageIndex ? { ...page, ...action.payload } : page
        ),
      }

    default:
      return state
  }
}

export function BookEditor({ book }: { book: Book }) {
  const [state, dispatch] = useReducer(reducer, {
    pages:
      book.pages.length === 0
        ? [createEmptyPage()]
        : book.pages.map((p) => ({
            ...p,
            caption: asyncLoaded(p.caption),
            image: asyncLoaded(p.image),
          })),
    pageIndex: 0,
    title: book.title,
  })

  const page = state.pages[state.pageIndex]
  const canPrev = state.pageIndex > 0
  const canNext = state.pageIndex < state.pages.length - 1
  const isLoadingTranscript = isLoading(page.caption)
  const isLoadingImage = isLoading(page.image)
  const captionText = getValue(page.caption) ?? ""
  const imageSrc = getValue(page.image)

  const makePageUpdater = (idx: number) => (payload: Partial<PageDraft>) => {
    dispatch({ type: "UPDATE_PAGE", pageIndex: idx, payload })
  }

  const handleSaveBook = () => {
    console.log("TODO: save book")
    // upsertBook({ ...book, title, pages })
    // router.push(`/`)
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

      // await sleep(8_000)
      // const imageUrl = "/example/a.png"

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
    <div className="space-y-4">
      <EditableText
        className="font-semibold text-lg"
        initialText={state.title}
        onSave={(title) => dispatch({ type: "SET_TITLE", title })}
        placeholder="Add book title…"
      />

      <div className="relative">
        <Card className="p-0 overflow-hidden">
          <CardContent className="p-5">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-center md:text-left">
                  <h2 className="text-lg font-bold text-purple-700">Page {state.pageIndex + 1}</h2>
                </div>

                <div className="relative min-h-[150px] p-4 bg-white border-2 border-dashed border-purple-300 rounded-lg">
                  {captionText.length > 0 ? (
                    <p>{captionText}</p>
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
                    "w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-purple-300 flex items-center justify-center",
                    { "animate-pulse": isLoadingImage }
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
        <Button onClick={() => dispatch({ type: "ADD_PAGE" })} variant="outline">
          <SquarePlus className="mr-1 h-4 w-4" /> Add page
        </Button>
        <Button onClick={handleSaveBook} variant="outline">
          <BookText className="mr-1 h-4 w-4" /> Save book
        </Button>
      </div>

      <pre>{JSON.stringify(state.pages, null, 2)}</pre>
    </div>
  )
}

// TODO: refine this
function formatImageSrc(value: string) {
  if (value.startsWith("http") || value.startsWith("/")) return value
  else return `data:image/png;base64,${value}`
}

function createEmptyPage(): PageDraft {
  return {
    id: uuid(),
    caption: asyncNotStarted(),
    image: asyncNotStarted(),
  }
}
