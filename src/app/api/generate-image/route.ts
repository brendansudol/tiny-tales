import { openai } from "@ai-sdk/openai"
import { put } from "@vercel/blob"
import { experimental_generateImage as generateImage } from "ai"
import { NextResponse } from "next/server"
import { v4 as uuid } from "uuid"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const { prompt } = await req.json()

  if (prompt == null || prompt.trim() === "") {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 })
  }

  try {
    const { image } = await generateImage({
      model: openai.image("gpt-image-1"),
      prompt,
      size: "1024x1024",
      providerOptions: {
        openai: { quality: "medium" },
      },
    })

    const { base64, mimeType } = image
    const imageBuffer = Buffer.from(base64, "base64")
    const fileName = `images/${uuid()}.png`

    const { url } = await put(fileName, imageBuffer, {
      contentType: mimeType,
      access: "public",
    })

    return NextResponse.json({ base64: base64, url }, { status: 200 })
  } catch (error) {
    console.error("/api/generate-image error", error)
    return NextResponse.json({ error: "Image generation failed." }, { status: 500 })
  }
}
