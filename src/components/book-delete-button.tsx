"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { getBooks, saveBooks } from "@/lib/storage"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

interface Props {
  id: string
}

export function DeleteBookButton({ id }: Props) {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    const rest = getBooks().filter((b) => b.id !== id)
    saveBooks(rest)
    router.push("/") // home after delete
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        aria-label="Delete book"
        onClick={() => setOpen(true)}
      >
        <Trash2 />
      </Button>

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
