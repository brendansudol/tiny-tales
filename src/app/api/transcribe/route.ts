import { experimental_transcribe as transcribe } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Missing 'file' in form data" }, { status: 400 })
    }

    const audioArray = new Uint8Array(await file.arrayBuffer())
    const result = await transcribe({
      model: openai.transcription("whisper-1"),
      audio: audioArray,
      // providerOptions: { openai: { timestampGranularities: ["word"] } }, // optional
    })

    return NextResponse.json({ transcript: result.text })
  } catch (error) {
    console.error("/api/transcribe error", error)
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 })
  }
}
