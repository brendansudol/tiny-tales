"use client"

import Image from "next/image"
import { useState } from "react"
import { VoiceRecorder } from "@/components/voice-recorder"

export default function SandboxPage() {
  const [prompt, setPrompt] = useState("")
  const [imageResult, setImageResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    setLoading(true)
    setImageResult(null)

    const res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.base64) {
      setImageResult(data.base64)
    } else {
      alert(data.error ?? "Something went wrong 🤖")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-6 p-6">
      <VoiceRecorder transcriptEndpoint="/api/transcribe" />

      <hr />

      <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3">
        <input
          className="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the image you want…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </form>
      {imageResult && (
        <Image src={`data:image/png;base64,${imageResult}`} alt={prompt} height={400} width={400} />
      )}
    </main>
  )
}
