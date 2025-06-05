"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface Args {
  maxDurationMs?: number
  onAudioReady?: (blob: Blob) => void
}

interface Return {
  isRecording: boolean
  audioLevel: number // Normalised RMS audio level (0‑1) for visual meters.
  elapsedSeconds: number
  startRecording: () => Promise<void>
  stopRecording: () => void
  toggleRecording: () => void
}

export function useMicrophone({ maxDurationMs = 60_000, onAudioReady }: Args = {}): Return {
  const [isRecording, setIsRecording] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const rafRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const startTimestampRef = useRef<number>(0)

  const cleanupAnalyser = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect()
      analyserRef.current = null
    }
    setAudioLevel(0)
    setElapsedSeconds(0)
  }

  const stop = useCallback(() => {
    if (!isRecording) return
    setIsRecording(false)
    cleanupAnalyser()

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
  }, [isRecording])

  const start = useCallback(async () => {
    if (isRecording) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        onAudioReady?.(blob)
        stream.getTracks().forEach((t) => t.stop())
        mediaRecorderRef.current = null
        chunksRef.current = []
      }

      mediaRecorder.start(100) // collect in 100 ms slices
      setIsRecording(true)
      startTimestampRef.current = Date.now()

      /* ── audio-level analyser (visual feedback) ── */
      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 512
      source.connect(analyser)
      analyserRef.current = analyser

      const buffer = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteTimeDomainData(buffer)
        // Simple RMS calculation
        let sum = 0
        for (let i = 0; i < buffer.length; i++) {
          const v = (buffer[i] - 128) / 128
          sum += v * v
        }
        setAudioLevel(Math.sqrt(sum / buffer.length))

        // Update elapsed time
        setElapsedSeconds((Date.now() - startTimestampRef.current) / 1000)

        rafRef.current = requestAnimationFrame(tick)
      }
      tick()

      /* ── enforce max duration ── */
      timeoutRef.current = window.setTimeout(stop, maxDurationMs)
    } catch (err) {
      console.error("Microphone access failed:", err)
    }
  }, [isRecording, maxDurationMs, onAudioReady, stop])

  const toggle = useCallback(() => {
    if (isRecording) stop()
    else start()
  }, [isRecording, start, stop])

  // Clean‑up if the component using the hook unmounts
  useEffect(() => {
    return () => stop()
  }, [])

  return {
    isRecording,
    audioLevel,
    elapsedSeconds,
    startRecording: start,
    stopRecording: stop,
    toggleRecording: toggle,
  }
}
