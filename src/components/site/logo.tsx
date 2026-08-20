import Link from "next/link"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-amber-gradient shadow-sm">
        <svg
          className="h-5 w-5 text-zinc-900"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight text-zinc-900">Khatri Builds</span>
    </Link>
  )
}
