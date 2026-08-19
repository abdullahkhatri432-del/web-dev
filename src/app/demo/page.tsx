"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { ThreeDPreview } from "@/components/demo/three-d-preview"
import { getDemos, getPackage } from "@/services/firestore"
import type { Demo, Package } from "@/services/firestore"
import { demos as seedDemos, demoCategories as seedCategories } from "@/seed/demos"
import { ArrowRight, Box } from "lucide-react"

const catNames: Record<string, string> = Object.fromEntries(seedCategories.map((c) => [c.id, c.name]))

function DemoContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams.get("demoId") || ""

  const [demos, setDemos] = useState<Demo[]>(seedDemos)
  const [packages, setPackages] = useState<Package[]>([])
  const [selectedId, setSelectedId] = useState(initialId)
  const [category, setCategory] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      let allDemos: Demo[] = seedDemos
      try {
        const d = await getDemos()
        if (d && d.length > 0) allDemos = d
      } catch {
        // use seed
      }
      const pkgs: Package[] = []
      for (const id of ["starter", "business", "pro"] as const) {
        try {
          pkgs.push(await getPackage(id))
        } catch {
          // skip
        }
      }
      if (!cancelled) {
        setDemos(allDemos)
        setPackages(pkgs)
        setSelectedId((prev) => {
          if (prev && allDemos.some((x) => x.id === prev)) return prev
          const featured = allDemos.find((x) => x.featured) ?? allDemos[0]
          return featured?.id ?? allDemos[0]?.id ?? ""
        })
        setLoaded(true)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = category ? demos.filter((d) => d.category === category) : demos
  const demo = demos.find((d) => d.id === selectedId) ?? null
  const currentIdxInFiltered = filtered.findIndex((d) => d.id === selectedId)

  if (!loaded) {
    return (
      <main className="flex-1">
        <Navbar />
        <div className="pt-40 text-center text-zinc-500">Loading 3D preview...</div>
      </main>
    )
  }

  if (!demo) {
    return (
      <main className="flex-1">
        <Navbar />
        <div className="pt-40 text-center">
          <p className="text-zinc-500">No template selected.</p>
          <Button asChild className="mt-6">
            <a href="/websites">Browse templates</a>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1">
      <Navbar />

      <section className="relative overflow-hidden pb-24 pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-amber-100 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-700">
              <Box className="h-3.5 w-3.5" />
              3D Live Preview
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
              See your website <span className="text-gradient-amber">in 3D</span>
            </h1>
            <p className="mt-4 text-lg text-zinc-600">
              Rotate the template, add your business name, and imagine it live on your own domain.
              This is exactly what you&apos;ll get.
            </p>
          </div>

          {/* Category tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setCategory(null)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                !category
                  ? "border-amber-500 bg-amber-50 text-amber-700"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
              }`}
            >
              All
            </button>
            {seedCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  category === c.id
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_340px]">
            <ThreeDPreview demo={demo} allDemos={filtered} packages={packages} />

            {/* Template picker */}
            <aside>
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-card">
                <div className="text-sm font-semibold text-zinc-900">Choose a template</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {filtered.map((d) => {
                    const active = d.id === selectedId
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedId(d.id)}
                        className={`overflow-hidden rounded-xl border text-left transition-all ${
                          active
                            ? "border-amber-500 ring-1 ring-amber-200"
                            : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <img src={d.thumbnail} alt={d.name} className="aspect-[8/5] w-full object-cover" />
                        <div className="px-3 py-2">
                          <div className="truncate text-xs font-semibold text-zinc-900">{d.name}</div>
                          <div className="text-[11px] text-amber-600">₹{d.price.toLocaleString("en-IN")}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
                <div className="text-sm font-semibold text-zinc-900">Love this design?</div>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                  {currentIdxInFiltered >= 0
                    ? `${demo.name} · from ₹${demo.price.toLocaleString("en-IN")}`
                    : "Customise it to your business."}
                </p>
                <Button asChild className="mt-4 w-full" size="lg">
                  <a href={`/checkout?demoId=${demo.id}`}>
                    Customise this design
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <p className="mt-3 text-center text-[11px] text-zinc-500">
                  No advance to start · Pay when the design is approved
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="pt-28 text-center text-zinc-500">Loading 3D preview...</div>}>
      <DemoContent />
    </Suspense>
  )
}