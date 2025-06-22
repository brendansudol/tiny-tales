import Link from "next/link"

export function SharedBookBanner() {
  return (
    <div className="mb-6 rounded-lg bg-yellow-100 p-4 text-yellow-900">
      <p className="text-sm">
        📖 You’re viewing a book that was shared with you.{' '}
        <Link href="/" className="underline">Create your own</Link>.
      </p>
    </div>
  )
}
