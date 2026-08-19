"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { LayoutDashboard, LogOut, Globe, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
]

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user, signOut } = useAuth()

  return (
    <div className="flex h-screen">
      <aside className="flex w-64 flex-col border-r border-white/5 bg-[#0b0b0e]">
        <div className="border-b border-white/5 p-6">
          <Link href="/" className="text-lg font-bold text-white">
            WebForge <span className="text-amber-400">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <item.icon className="h-4 w-4 text-amber-400" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-white/5 p-3">
          {user && (
            <p className="mb-2 truncate px-3 text-xs text-zinc-500">{user.email}</p>
          )}
          <Button asChild variant="ghost" size="sm" className="w-full justify-start">
            <Link href="/">
              <Globe className="mr-2 h-4 w-4" />
              View website
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 w-full justify-start text-zinc-400 hover:text-white"
            onClick={async () => {
              await signOut()
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <nav className="flex items-center justify-between border-b border-white/5 bg-[#0b0b0e]/70 px-8 py-4 backdrop-blur">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-sm text-zinc-500">Signed in as {user?.email || "guest"}</div>
        </nav>
        {children}
      </div>
    </div>
  )
}
