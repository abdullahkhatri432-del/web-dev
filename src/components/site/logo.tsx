import Link from "next/link"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-amber-gradient shadow-[0_8px_24px_-8px_rgba(245,158,11,0.7)]">
        <svg
          className="h-5 w-5 text-[#0b0b0b]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight text-white">WebForge</span>
    </Link>
  )
}
