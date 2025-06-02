import { NextResponse } from "next/server"
import { experimental_generateImage as generateImage } from "ai"
import { v4 as uuid } from "uuid"
import { openai } from "@ai-sdk/openai"
import { put } from "@vercel/blob"

export const runtime = "nodejs"

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
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Image generation failed." }, { status: 500 })
  }
}
