"use client"

import { Loader2, ImagePlus, BookText, SquarePlus, Settings2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useReducer } from "react"
import { AsyncImage } from "@/components/async-image"
import { getInitialState, isPageEmpty, PageDraft, reducer } from "@/components/book-editor-state"
import { BookNavButtons } from "@/components/book-nav-buttons"
import { EditableText } from "@/components/editable-text"
import { RecordButton } from "@/components/record-button"
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
import {
  asyncFailedToLoad,
  asyncLoaded,
  asyncLoading,
  getLoadingInfo,
  getValue,
  isLoading,
} from "@/lib/async-data"
import { upsertBook } from "@/lib/storage"
import { updateBookOnline } from "@/lib/share-book-online"
import { Book } from "@/lib/types"

export function BookEditor({ book, pageIndex = 0 }: { book: Book; pageIndex?: number }) {
  const router = useRouter()

  const [state, dispatch] = useReducer(reducer, getInitialState(book, pageIndex))
  const isLastPage = state.pageIndex === state.pages.length - 1
  const page = state.pages[state.pageIndex]
  const isLoadingTranscript = isLoading(page.caption)
  const { isLoading: isLoadingImage, startedAt } = getLoadingInfo(page.image)
  const captionText = getValue(page.caption, "")
  const imageUrl = getValue(page.image)

  const makePageUpdater = (idx: number) => (payload: Partial<PageDraft>, error?: string) => {
    dispatch({ type: "UPDATE_PAGE", pageIndex: idx, payload, error })
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

  const handleSaveBook = async () => {
    const updatedBook = {
      ...book,
      title: state.title,
      pages: state.pages
        .map((page) => ({
          ...page,
          caption: getValue(page.caption, "").trim(),
          image: getValue(page.image, ""),
        }))
        .filter((page) => page.caption || page.image),
    }

    upsertBook(updatedBook)
    if (book.remoteId != null) {
      await updateBookOnline(updatedBook)
    }

    router.push(`/books/${book.id}?celebrate=1`)
  }

  const handleGenerateImage = async () => {
    if (captionText.trim().length === 0 || isLoading(page.image)) return

    const { pageIndex } = state
    const updatePage = makePageUpdater(pageIndex)
    updatePage({ image: asyncLoading() })

    try {
      const previousCaptions = state.pages
        .slice(0, pageIndex)
        .map((p) => getValue(p.caption, "").trim())
        .filter((text) => text.length > 0)
        .slice(-3)

      let prompt: string = captionText
      // Add previous captions to the prompt if available
      if (previousCaptions.length > 0) {
        const promptParts: string[] = []
        promptParts.push("Previous pages:")
        previousCaptions.forEach((text, idx) => {
          const num = pageIndex - previousCaptions.length + idx + 1
          promptParts.push(`${num}. ${text}`)
        })
        promptParts.push("Current page:")
        promptParts.push(captionText)
        promptParts.push("Illustrate the current page scene in a consistent style.")
        prompt = promptParts.join("\n")
      }

      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      const imageUrl = data.url
      updatePage({ image: asyncLoaded(imageUrl) })
    } catch (error) {
      console.error("Image generation fail", error)
      updatePage({ image: asyncFailedToLoad("Image generation failed") }, "Image generation failed")
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
        updatePage({ caption: asyncFailedToLoad("Transcription failed") }, "Transcription failed")
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
                  placeholder="Press the microphone and start talking."
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
                    isDisabled={isLoadingImage}
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
                <AsyncImage
                  alt={captionText}
                  imageUrl={imageUrl}
                  isLoading={isLoadingImage}
                  startedAt={startedAt}
                />
              </div>
            </div>

            {state.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {state.error}
              </div>
            )}
          </CardContent>
        </Card>

        <BookNavButtons
          prevDisabled={state.pages.length <= 1 || isRecording}
          prevOnClick={() =>
            dispatch({
              type: "SET_PAGE_INDEX",
              pageIndex: state.pageIndex === 0 ? state.pages.length - 1 : state.pageIndex - 1,
            })
          }
          nextDisabled={(isLastPage && isPageEmpty(page)) || isRecording}
          nextOnClick={() => {
            if (isLastPage) {
              dispatch({ type: "ADD_PAGE" })
            } else {
              dispatch({
                type: "SET_PAGE_INDEX",
                pageIndex: state.pageIndex + 1,
              })
            }
          }}
        />
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
