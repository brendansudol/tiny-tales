"use client"

import React, { useState } from "react"
import { useMicrophone } from "@/hooks/useMicrophone"

interface Props {
  transcriptEndpoint: string
  className?: string
}

export function VoiceRecorder({ transcriptEndpoint, className = "" }: Props) {
  const [transcript, setTranscript] = useState<string | null>(null)
  const { isRecording, audioLevel, elapsedSeconds, toggleRecording } = useMicrophone({
    onAudioReady: async (blob) => {
      const formData = new FormData()
      formData.append("file", blob, "recording.webm")

      try {
        const res = await fetch(transcriptEndpoint, {
          method: "POST",
          body: formData,
        })
        const json = await res.json()
        setTranscript(json.transcript ?? "(No transcript available)")
      } catch (err) {
        console.error("Transcription request failed:", err)
        setTranscript("(Error fetching transcript)")
      }
    },
  })

  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-2xl p-6 shadow-md bg-white w-full max-w-md ${className}`}
    >
      {/* Record / Stop button */}
      <button
        onClick={toggleRecording}
        className={`px-6 py-3 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isRecording ? "bg-red-600 text-white" : "bg-indigo-600 text-white"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      {/* Audio‑level bar + timer */}
      <div className="flex items-center gap-3 w-60">
        <div className="flex-grow h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
            style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
          />
        </div>
        <span className="font-mono text-sm w-14 text-right">{elapsedSeconds.toFixed(1)}s</span>
      </div>

      {/* Transcript result */}
      {transcript && (
        <div className="w-full border rounded-lg p-3 text-sm text-gray-800">
          <h4 className="font-medium mb-1">Transcript</h4>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  )
}
