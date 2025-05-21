import { NextResponse } from "next/server"
import { experimental_generateImage as generateImage } from "ai"
import { openai } from "@ai-sdk/openai"

// Run on the Edge – lower latency & no cold starts
export const runtime = "edge"

export async function POST(req: Request) {
  const { prompt } = await req.json()

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
  }

  try {
    const { image } = await generateImage({
      model: openai.image("gpt-image-1"),
      prompt,
      size: "1024x1024",
    })

    return NextResponse.json({ base64: image.base64 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Image generation failed." }, { status: 500 })
  }
}
