"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)

  const navItems = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/customers", label: "Customers" },
    { href: "/admin/demos", label: "Demos" },
    { href: "/admin/packages", label: "Packages" },
    { href: "/admin/addons", label: "Add-ons" },
    { href: "/admin/payments", label: "Payments" },
    { href: "/admin/messages", label: "Messages" },
    { href: "/admin/testimonials", label: "Testimonials" },
    { href: "/admin/coupons", label: "Coupons" },
    { href: "/admin/settings", label: "Settings" },
  ]

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-primary flex flex-col border-r border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-primary-foreground">WebForge Admin</h2>
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(item.href)
                      ? "bg-primary-foreground/10 text-primary-foreground"
                      : "text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <nav className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">WebForge Admin</h1>
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            Back
          </Button>
        </nav>
        {children}
      </div>
    </div>
  )
}