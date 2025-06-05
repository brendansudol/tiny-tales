"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { getBooks, saveBooks } from "@/lib/storage"

interface Props {
  id: string
  isIconOnly?: boolean
}

export function DeleteBookButton({ id, isIconOnly = false }: Props) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const handleOpenConfirm = () => setOpen(true)

  const handleDelete = () => {
    const rest = getBooks().filter((b) => b.id !== id)
    saveBooks(rest)
    router.push("/") // home after delete
  }

  return (
    <>
      {isIconOnly ? (
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          aria-label="Delete book"
          onClick={handleOpenConfirm}
        >
          <Trash2 />
        </Button>
      ) : (
        <Button onClick={handleOpenConfirm} variant="outline">
          <Trash2 className="mr-1 h-4 w-4" />
          <span className="sm:hidden">Delete</span>
          <span className="hidden sm:inline">Delete book</span>
        </Button>
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this book?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="mb-4 text-sm text-gray-500">Are you sure you want to delete this book?</p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
