"use client"

import { useState, type FormEvent } from "react"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { Mail, MessageCircle, MapPin, Clock, Check, Loader2 } from "lucide-react"
import { createContactMessage } from "@/services/firestore"

const inputCls =
  "mt-1 flex h-11 w-full rounded-xl border border-zinc-200 bg-card/60 px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition-all focus:border-amber-300 focus:ring-2 focus:ring-ring/30"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus("saving")
    try {
      await createContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        subject: form.subject || null,
        message: form.message,
      })
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <main className="flex-1">
      <Navbar />

      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-amber-100 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-600">Contact</div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 md:text-6xl">Let&apos;s talk</h1>
            <p className="mt-4 text-lg text-zinc-500">
              Questions about a template, a package, or an existing order? Send us a message and
              we&apos;ll get back to you within a few hours.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-card">
              {status === "done" ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <Check className="h-7 w-7" />
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-zinc-900">Message sent!</h2>
                  <p className="mt-2 max-w-sm text-sm text-zinc-500">
                    Thanks for reaching out. We&apos;ll reply to {form.email} shortly.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setForm({ name: "", email: "", phone: "", subject: "", message: "" })
                      setStatus("idle")
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-zinc-700">Your name</label>
                      <input type="text" className={inputCls} placeholder="Rahul Sharma" value={form.name} onChange={set("name")} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-zinc-700">Email</label>
                      <input type="email" className={inputCls} placeholder="you@example.com" value={form.email} onChange={set("email")} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-zinc-700">Phone (optional)</label>
                      <input type="tel" className={inputCls} placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-zinc-700">Subject</label>
                      <input type="text" className={inputCls} placeholder="Help with my order" value={form.subject} onChange={set("subject")} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-sm font-medium text-zinc-700">Message</label>
                    <textarea
                      className={`${inputCls} min-h-[140px]`}
                      placeholder="Tell us how we can help..."
                      value={form.message}
                      onChange={set("message")}
                      required
                    />
                  </div>
                  {status === "error" && (
                    <p className="mt-3 text-sm text-red-400">
                      Something went wrong sending your message. Please try again or email us directly.
                    </p>
                  )}
                  <Button type="submit" size="lg" className="mt-6" disabled={status === "saving"}>
                    {status === "saving" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      "Send message"
                    )}
                  </Button>
                </form>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-100 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">WhatsApp</div>
                    <div className="text-xs text-zinc-500">Fastest reply</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-zinc-500">+91 81605 87811</p>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">Email</div>
                    <div className="text-xs text-zinc-500">For documents &amp; details</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-zinc-500">hello@khatribuilds.in</p>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">Response time</div>
                    <div className="text-xs text-zinc-500">Within a few hours</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-zinc-500">Mon–Sat, 10am – 7pm IST</p>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">Based in</div>
                    <div className="text-xs text-zinc-500">Serving clients pan-India</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-zinc-500">India 🇮🇳 · Working with clients everywhere</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
