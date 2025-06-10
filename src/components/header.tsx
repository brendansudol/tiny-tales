import { LibraryBig, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { AboutThis } from "@/components/about-this"
import { buttonVariants } from "@/components/ui/button"

export function Header() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <Link href="/" className="flex gap-1 text-2xl font-bold">
        <Image src="/icons/book-2.png" alt="tiny tales" width={40} height={40} />
        <span>tiny tales</span>
      </Link>
      <div className="flex items-center gap-2">
        <AboutThis />
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
