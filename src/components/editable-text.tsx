"use client"

import { Pencil, Check } from "lucide-react"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  initialText?: string
  onSave?: (text: string) => void
  children?: React.ReactNode
  placeholder?: string
}

export default function EditableText({
  initialText = "",
  onSave,
  children,
  placeholder = "Click to add text",
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(initialText || (typeof children === "string" ? children : ""))

  const handleSave = () => {
    setIsEditing(false)
    if (onSave) onSave(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setText(initialText || (typeof children === "string" ? children : ""))
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-auto min-w-[150px] max-w-[500px]"
          style={{ width: `${Math.max(text.length * 10 + 10, 150)}px` }}
          autoFocus
        />
        <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8">
          <Check className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 group">
      {children || text ? (
        <div className="py-1 font-semibold cursor-pointer" onClick={() => setIsEditing(true)}>
          {children || text}
        </div>
      ) : (
        <div
          className="py-1 italic text-muted-foreground cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {placeholder}
        </div>
      )}
      <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8">
        <Pencil className="size-4" />
      </Button>
    </div>
  )
}
