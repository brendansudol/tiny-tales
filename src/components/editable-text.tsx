import React, { useState, useRef, useEffect } from "react"
import { Check, PencilLine } from "lucide-react"
import { Button } from "./ui/button"

interface Props {
  initialText: string
  className?: string
  inputClassName?: string
  onSave?: (text: string) => void
  placeholder?: string
  minWidth?: number
  showEditIcon?: boolean
}

export function EditableText({
  initialText,
  className,
  inputClassName,
  onSave,
  placeholder = "Enter text…",
  minWidth = 50,
  showEditIcon = true,
}: Props) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [text, setText] = useState<string>(initialText)
  const [inputWidth, setInputWidth] = useState<number>(minWidth)
  const inputRef = useRef<HTMLInputElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)

  // Calculate width based on text content
  const calculateWidth = (value: string) => {
    if (measureRef.current) {
      measureRef.current.textContent = value || placeholder
      const width = measureRef.current.offsetWidth
      return Math.max(width + 20, minWidth) // Add padding
    }
    return minWidth
  }

  // Set initial width when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setInputWidth(calculateWidth(text))
    }
  }, [isEditing, placeholder, minWidth])

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
    onSave?.(text)
  }

  const handleCancel = () => {
    setText(initialText)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const newWidth = calculateWidth(newValue)
    setInputWidth(newWidth)
    setText(newValue)
  }

  return (
    <div className={`inline-block ${className}`}>
      {/* Hidden element for measuring text width */}
      <span
        ref={measureRef}
        className="absolute invisible whitespace-pre"
        style={{
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
          letterSpacing: "inherit",
        }}
      />

      {isEditing ? (
        <div className="inline-flex items-center gap-1">
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`border border-purple-300 rounded-md px-2 py-1 outline-none focus:border-purple-500 ${inputClassName}`}
            style={{ width: `${inputWidth}px` }}
          />
          <Button variant="ghost" size="icon" onClick={handleSave} className="h-8 w-8">
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1">
          <span
            onClick={handleStartEdit}
            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md border border-transparent hover:border-gray-200 transition-colors"
          >
            {text || placeholder}
          </span>
          {showEditIcon && (
            <Button variant="ghost" size="icon" onClick={handleStartEdit} className="h-8 w-8">
              <PencilLine className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
