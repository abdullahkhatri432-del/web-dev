"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, Eye, ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import { getDemos } from "@/services/firestore"
import type { Demo } from "@/services/firestore"
import { demos as seedDemos } from "@/seed/demos"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"

function formatPrice(price: number) {
  return price.toLocaleString("en-IN")
}

export default function WebsiteDetailPage() {
  const router = useRouter()
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

  const [demo, setDemo] = useState<Demo | null>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<Demo[]>([])

  useEffect(() => {
    async function load() {
      let all: Demo[] = []
      try {
        const data = await getDemos()
        if (data && data.length > 0) all = data
      } catch (err) {
        console.warn("Could not load demos from Firestore, using seed data", err)
      }
      if (all.length === 0) all = seedDemos

      const found = all.find((d) => d.slug === slug) || null
      setDemo(found)
      if (found) {
        setRelated(all.filter((d) => d.category === found.category && d.id !== found.id).slice(0, 4))
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return (
      <main className="flex-1">
        <Navbar />
        <div className="pt-40 text-center text-zinc-500">Loading website...</div>
      </main>
    )
  }

  if (!demo) {
    return (
      <main className="flex-1">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 pt-40 text-center">
          <h1 className="text-4xl font-bold text-zinc-900">Website not found</h1>
          <p className="mx-auto mt-4 max-w-md text-zinc-500">
            We couldn&apos;t find the website you were looking for. It may have been moved or renamed.
          </p>
          <Button asChild className="mt-8">
            <Link href="/websites">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse all templates
            </Link>
          </Button>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="flex-1">
      <Navbar />

      <section className="relative overflow-hidden pb-20 pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-amber-100 blur-[120px]" />
          <div className="absolute -right-32 top-40 h-72 w-72 rounded-full bg-amber-100 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <button
            onClick={() => router.push("/websites")}
            className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all websites
          </button>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-card">
              <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-100 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-green-500/70" />
                <div className="mx-auto flex h-7 w-full max-w-xs items-center justify-center rounded-lg bg-zinc-50 text-[11px] text-zinc-500">
                  webforge.app/preview/{demo.slug}
                </div>
              </div>
              <img src={demo.thumbnail} alt={demo.name} className="h-full w-full object-cover" />
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
                  {demo.category}
                </span>
                {demo.featured && (
                  <span className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
                    <Sparkles className="h-3 w-3 text-amber-600" />
                    Featured
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">{demo.name}</h1>
              <p className="mt-3 text-lg font-bold text-amber-600">₹{formatPrice(demo.price)}</p>
              <p className="mt-4 leading-relaxed text-zinc-500">{demo.description}</p>

              <h3 className="mt-8 text-lg font-semibold text-zinc-900">What&apos;s included</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {demo.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-2">
                {demo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" onClick={() => router.push(`/checkout?demoId=${demo.id}`)}>
                  Get this website
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push(`/demo?demoId=${demo.id}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  3D preview
                </Button>
                {demo.livePreviewUrl && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => window.open(demo.livePreviewUrl, "_blank", "noopener,noreferrer")}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Live preview
                  </Button>
                )}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-zinc-100 pt-6 text-xs text-zinc-500">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-amber-600" /> Scan &amp; pay via UPI
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-600" /> Delivery in 3–5 days
                </span>
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-600" /> Domain &amp; hosting included
                </span>
              </div>
            </div>
          </div>

          {demo.screenshots && demo.screenshots.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Preview</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {demo.screenshots.map((src, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
                  >
                    <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-100 px-4 py-2.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <img src={src} alt={`${demo.name} preview ${i + 1}`} className="w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Similar websites</h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/websites/${item.slug}`}
                    className="group overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-amber-200"
                  >
                    <img src={item.thumbnail} alt={item.name} className="h-40 w-full object-cover" />
                    <div className="p-4">
                      <h4 className="font-semibold text-zinc-900">{item.name}</h4>
                      <p className="mt-1 text-sm font-bold text-amber-600">₹{formatPrice(item.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
