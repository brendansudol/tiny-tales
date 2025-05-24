import Link from "next/link"
import { LibraryBig, Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function Header() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold">
        📚 tiny tales
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/" className={buttonVariants({ size: "icon", variant: "outline" })}>
          <LibraryBig className="h-5 w-5" />
        </Link>
        <Link
          href="/books/new/edit"
          className={buttonVariants({ size: "icon", variant: "outline" })}
        >
          <Plus className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}
