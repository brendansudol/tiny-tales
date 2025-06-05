"use client"

import { Loader2, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  isLoading?: boolean
  isRecording: boolean
  onClick: () => void
}

export function RecordButton({ isLoading, isRecording, onClick }: Props) {
  return (
    <div className="relative">
      {isRecording && (
        <>
          <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-20" />
          <div className="absolute inset-0 rounded-full bg-red-400 animate-pulse opacity-30" />
          <div className="absolute -inset-2 rounded-full bg-red-300 animate-ping opacity-10 animation-delay-150" />
          <div className="absolute -inset-4 rounded-full bg-red-200 animate-ping opacity-5 animation-delay-300" />
        </>
      )}
      <Button
        disabled={isLoading}
        onClick={onClick}
        variant={isRecording ? "destructive" : "outline"}
        size="icon"
        className={`
          relative z-10 transition-all duration-300 ease-in-out
          ${isRecording ? "shadow-lg shadow-red-500/25 scale-105" : ""}
        `}
      >
        {isRecording ? (
          <MicOff className="h-4 w-4 animate-pulse" />
        ) : isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
