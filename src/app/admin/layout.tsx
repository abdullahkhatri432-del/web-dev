import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google"
import { ReactNode } from "react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "WebForge Admin",
  description: "Admin dashboard for WebForge marketplace",
}

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-primary flex flex-col border-r border-border">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">WebForge Admin</h2>
            </div>
            <nav className="flex-1 p-2">
              <ul className="space-y-2">
                <li>
                  <a 
                    href="/admin"
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${window.location.pathname === "/admin" || !window.location.pathname.includes("/") ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-primary transition-colors"}`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m2 0v-3a1 1 0 00-1-1H4m3 3V5a1 1 0 011-1h4a1 1 0 011 1v3m2 0H10m2 0l2 2m0 0l2-2m0 0l-2-2m0 0l-2 2m2-2l2 2m-2-2l2-2" />
                    </svg>
                    Overview
                  </a>
                </li>
                <li>
                  <a 
                    href="/admin/orders"
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${window.location.pathname.includes("/admin/orders") ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-primary transition-colors"}`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a1 1 0 00-1-1H7a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V7a1 1 0 00-1-1H9z" />
                    </svg>
                    Orders
                  </a>
                </li>
                <li>
                  <a 
                    href="/admin/customers"
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${window.location.pathname.includes("/admin/customers") ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-primary transition-colors"}`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customers
                  </a>
                </li>
                <li>
                  <a 
                    href="/admin/demos"
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${window.location.pathname.includes("/admin/demos") ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-primary transition-colors"}`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 002-2h2a2 2 0 002-2v6a2 2 0 002 2h2a2 2 0 002-2zm-3 1h3m-3 0h3m-9-3h3m-3 0h3m-3 0h3M5 9h3m3-3H5a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v.76m3.36 3.36 1.414 1.414M9 17L3.71 8.06l1.414-1.414M9 3v9m3-3v3m3-3v3m-5-5h5m-5 10h5m-5-10v10m4-6h6m-6 6H10" />
                    </svg>
                    Demos
                  </a>
                </li>
                <li>
                  <a 
                    href="/admin/packages"
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${window.location.pathname.includes("/admin/packages") ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-primary transition-colors"}`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 4m0 0v6l-4 4M12 6v6l-4-4m0 0v-6l4-4m0 0H6" />
                    </svg>
                    Packages
                  </a>
                </li>
                <li>
                  <a 
                    href="/admin/addons"
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${window.location.pathname.includes("/admin/addons") ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-primary transition-colors"}`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 4m-4-4l4 4M8 20h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2-2V4a2 2 0 00-2-2v8z" />
                    </svg>
                    Add-ons
                  </a>
                </li>
                <li>
                  <a 
                    href="/admin/payments"
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${window.location.pathname.includes("/admin/payments") ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-primary transition-colors"}`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3-3m-3.5-1.5a3 3 0 105.5 4.5H5" />
                    </svg>
                    Payments
                  </a>
                </li>
                <li>
                  <a 
                    href="/admin/messages"
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${window.location.pathname.includes("/admin/messages") ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-primary transition-colors"}`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M9 10L12 4l3 6l3-6M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v11m0-10H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-4.586m0 4.586a2 2 0 11-3.999 1.414L15 15.086" />
                    </svg>
                    Messages
                  </a>
                </li>
                <li>
                  <a 
                    href="/admin/testimonials"
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${window.location.pathname.includes("/admin/testimonials") ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-primary transition-colors"}`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 4m-4-4l4 4M12 6H4a2 2 0 01-2-2V4a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2h-2.333m1.667-1.667l1.414 1.414M12 4 close M12 4V2m0 2v2" />
                    </svg>
                    Testimonials
                  </a>
                </li>
                <li>
                  <a 
                    href="/admin/coupons"
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${window.location.pathname.includes("/admin/coupons") ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-primary transition-colors"}`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 4m-4-4l4 4M12 6H4a2 2 0 01-2-2V4a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2h-2.333m1.667-1.667l1.414 1.414M12 4 close M12 4V2m0 2v2" />
                    </svg>
                    Coupons
                  </a>
                </li>
                <li>
                  <a 
                    href="/admin/settings"
                    className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${window.location.pathname.includes("/admin/settings") ? "bg-primary/10 text-primary" : "text-zinc-400 hover:text-primary transition-colors"}`}
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16l-4-4L12 7l-4 4 1.22 1.22m4.38 2.28 1.52 5.08a2.5 2.5 0 103.52-3.52L15 13l3.16 1.88m-2.05-5.96a5.5 5.5 0 11-7.82 5.98M15 13l3.16 1.88m-2.05-5.96a5.5 5.5 0 11-7.82 5.98M12 7l-4 4m4 0l4-4" />
                    </svg>
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="flex items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold">WebForge Admin</h1>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
              >
                Back
              </Button>
            </nav>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}