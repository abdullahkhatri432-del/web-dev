import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google"
import { ReactNode } from "react"
import { ScrollProgress } from "@/components/site/scroll-progress"
import { BackToTop } from "@/components/site/back-to-top"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Khatri Builds - Your Website. Picked, Paid, Built.",
  description: "Productized web-development marketplace. Choose a design, customize your package, and get your business online without endless meetings.",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ScrollProgress />
        {children}
        <BackToTop />
      </body>
    </html>
  )
}