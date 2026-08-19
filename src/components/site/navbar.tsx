"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "./logo"

const links = [
  { href: "/websites", label: "Websites" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#packages", label: "Packages" },
]

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#09090b]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/signup">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/websites">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
