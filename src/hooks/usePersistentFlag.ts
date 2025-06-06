"use client"

import { useState, useEffect, useCallback } from "react"

export function usePersistentFlag(
  key: string,
  defaultValue: boolean
): [boolean, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>()
  const handleChange = useCallback((value: boolean) => setValue(value), [])

  // read-side
  useEffect(() => {
    const stored = typeof window !== "undefined" && window.localStorage.getItem(key)
    if (stored === "true" || stored === "false") setValue(stored === "true")
    else setValue(defaultValue)
  }, [key, defaultValue])

  // write-side
  useEffect(() => {
    if (typeof window !== "undefined" && value != null) {
      window.localStorage.setItem(key, String(value))
    }
  }, [key, value])

  return [value ?? defaultValue, handleChange]
}
