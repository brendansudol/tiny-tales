import { CircleHelp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function AboutThis() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <CircleHelp />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>About</DialogTitle>
        <DialogDescription>
          <p className="mb-3">
            Tiny Tales is a playful canvas for young storytellers. Kids speak their idea for each
            page, and our friendly AI turns those words into pictures.
          </p>
          <p className="mb-3">
            Every book lives only in this browser. Nothing is uploaded or shared unless you choose
            to, so children can create freely and safely.
          </p>
          <div className="flex gap-2 text-xs text-black">
            <a
              href="https://github.com/brendansudol/tiny-tales"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Code on GitHub
            </a>

            <span>//</span>

            <a
              href="https://www.brendansudol.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Made by @brensudol
            </a>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
