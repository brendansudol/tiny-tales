import classNames from "classnames"
import { ImagePlus } from "lucide-react"
import React, { useState, useEffect } from "react"

interface Props {
  alt: string
  className?: string
  imageUrl: string | undefined
  isLoading: boolean
  startedAt?: number // timestamp in milliseconds
}

export function AsyncImage({ alt, className, imageUrl, isLoading, startedAt }: Props) {
  return (
    <div
      className={classNames(
        "relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center",
        { "animate-pulse": isLoading },
        imageUrl ? "border" : "border-2 border-dashed border-purple-300",
        className
      )}
    >
      {imageUrl ? (
        <img alt={alt} src={formatImageSrc(imageUrl)} className="w-full h-full object-cover" />
      ) : (
        <>
          <PlaceholderContent isLoading={isLoading} />
          {isLoading && startedAt && <LoadingTimer startedAt={startedAt} />}
        </>
      )}
    </div>
  )
}

function PlaceholderContent({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="text-center p-4">
      <ImagePlus className="h-12 w-12 mx-auto text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">
        {isLoading ? "Creating your picture..." : "Your picture will goes here."}
      </p>
    </div>
  )
}

function LoadingTimer({ startedAt }: { startedAt: number }) {
  const seconds = useElapsedSeconds(startedAt, 100)

  return (
    <span className="absolute bottom-2 left-3 text-xs text-gray-500">{seconds.toFixed(1)}s</span>
  )
}

function useElapsedSeconds(startedAt: number, resolutionMs = 1_000) {
  const [seconds, setSeconds] = useState(() => (Date.now() - startedAt) / 1_000)

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((Date.now() - startedAt) / 1_000)
    }, resolutionMs)

    return () => clearInterval(id)
  }, [resolutionMs, startedAt])

  return seconds
}

// TODO: refine and/or move this
function formatImageSrc(value: string) {
  if (value.startsWith("http") || value.startsWith("/")) return value
  else return `data:image/png;base64,${value}`
}
