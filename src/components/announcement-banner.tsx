"use client"

import { X as Close } from "lucide-react"
import { usePersistentFlag } from "@/hooks/usePersistentFlag"

const STORAGE_KEY = "announcement-v1"

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = usePersistentFlag(STORAGE_KEY, false)

  if (dismissed) return null

  return (
    <div className="flex items-start justify-between gap-4 bg-yellow-100 text-yellow-900 p-4 mb-6 rounded-lg">
      <p className="text-sm">👋 Turn your kid‘s stories into fun picture books in seconds.</p>
      <button
        type="button"
        className="flex-none p-[2px] hover:cursor-pointer"
        onClick={() => setDismissed(true)}
      >
        <Close className="size-4" />
      </button>
    </div>
  )
}
