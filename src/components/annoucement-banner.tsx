"use client"

import { usePersistentFlag } from "@/hooks/usePersistentFlag"

const STORAGE_KEY = "announcement-v1"

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = usePersistentFlag(STORAGE_KEY, false)

  if (dismissed) return null

  return (
    <div className="w-full bg-yellow-100 text-yellow-900 px-4 py-3 mb-4 flex items-start gap-4 rounded-lg">
      <p className="flex-1">🎉 TODO: Add little announcement banner here!</p>
      <button className="shrink-0 font-medium hover:underline" onClick={() => setDismissed(true)}>
        Dismiss
      </button>
    </div>
  )
}
