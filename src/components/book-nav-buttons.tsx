import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"

interface Props {
  prevDisabled?: boolean
  prevOnClick: () => void
  nextDisabled?: boolean
  nextOnClick: () => void
}

export function BookNavButtons({
  prevDisabled = false,
  prevOnClick,
  nextDisabled = false,
  nextOnClick,
}: Props) {
  return (
    <>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-5 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md h-10 w-10"
          disabled={prevDisabled}
          onClick={prevOnClick}
        >
          <ChevronLeft />
          <span className="sr-only">Previous page</span>
        </Button>
      </div>

      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-5 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md h-10 w-10"
          disabled={nextDisabled}
          onClick={nextOnClick}
        >
          <ChevronRight />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </>
  )
}
