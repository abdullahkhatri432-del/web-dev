"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowRight, MessageCircle } from "lucide-react"

const faqs = [
  {
    q: "How does WebForge work?",
    a: "You pick a ready-made template, choose a package (Starter, Business or Pro), add any add-ons you need, and tell us about your business in one simple form. We build and launch your website — usually within 3–5 days.",
  },
  {
    q: "How much does a website cost?",
    a: "Prices start at ₹5,999 for a simple local-business site. Starter is ₹7,999, Business is ₹14,999 and Pro is ₹29,999. Add-ons (booking, WhatsApp, SEO, blog, etc.) are priced individually. You always see the final total before paying — no hidden costs.",
  },
  {
    q: "How do I pay?",
    a: "We accept payment via UPI QR (any UPI app — GPay, PhonePe, Paytm, etc.). After checking out you'll get a QR code to scan and pay the exact amount. No advance to start — pay when the design is approved.",
  },
  {
    q: "What's included in the price?",
    a: "The template design, customisation for your business, your content and photos, a mobile-friendly responsive build, and free revisions for 30 days after launch. Domain and hosting setup are also included.",
  },
  {
    q: "How long does it take to get my website?",
    a: "Most websites go live in 3–5 days. Pro packages get priority 2-day delivery. We'll confirm a delivery date after you place your order.",
  },
  {
    q: "Do I need to provide content and photos?",
    a: "We'll ask for your business details, logo and photos in a simple form. If you don't have photos or a logo, we can design a logo (add-on) and use professional placeholder content until you supply your own.",
  },
  {
    q: "Can I add booking, payments or WhatsApp to my site?",
    a: "Yes. We have add-ons for online booking, UPI payments, WhatsApp integration, SEO, Google Maps, a blog, photo galleries, multilingual support and more.",
  },
  {
    q: "What if I need changes after launch?",
    a: "Every package includes free revisions for 30 days after launch. After that, small changes are available at a low cost — just reach out and we'll quote you.",
  },
  {
    q: "Do you help with domain and hosting?",
    a: "Yes, domain and hosting setup is included in every package. We'll help you connect your domain (or get one) and put your site live with a reliable host.",
  },
  {
    q: "What's your refund policy?",
    a: "Since we start work after you pay, we offer a 48-hour full refund window from the time of payment if you change your mind and we haven't started work yet. See our refund policy page for details.",
  },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <main className="flex-1">
      <Navbar />

      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-amber-100 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-600">FAQ</div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 md:text-6xl">
              Frequently asked questions
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-zinc-500">
              Everything you need to know about getting a website with WebForge. Can&apos;t find your
              answer? Message us and we&apos;ll help.
            </p>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((f, i) => {
              const isOpen = open === i
              return (
                <div
                  key={i}
                  className={`overflow-hidden rounded-2xl border transition-colors ${
                    isOpen ? "border-amber-200 bg-white" : "border-zinc-100 bg-white"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-zinc-900">{f.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-amber-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-6 pb-6 text-sm leading-relaxed text-zinc-500">{f.a}</p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-transparent px-8 py-10 text-center">
            <MessageCircle className="h-8 w-8 text-amber-600" />
            <h2 className="text-2xl font-bold text-zinc-900">Still have questions?</h2>
            <p className="max-w-md text-sm text-zinc-500">
              We reply within a few hours, Monday to Saturday.
            </p>
            <Button asChild>
              <Link href="/contact">
                Contact us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
