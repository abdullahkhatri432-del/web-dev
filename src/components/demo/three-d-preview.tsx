"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import type { Demo, Package } from "@/services/firestore"
import { ThreeDScene } from "./three-d-scene"

type Props = {
  demo: Demo
  allDemos: Demo[]
  packages: Package[]
}

const PKG_FALLBACK: Record<string, { name: string; price: number }> = {
  starter: { name: "Starter", price: 7999 },
  business: { name: "Business", price: 14999 },
  pro: { name: "Pro", price: 29999 },
}

const SCENE_LABELS: Record<string, string> = {
  restaurant: "Fine dining",
  cafe: "Café",
  gym: "Fitness",
  salon: "Beauty & salon",
  clinic: "Healthcare",
  "real-estate": "Real estate",
  hotel: "Hotels",
  portfolio: "Portfolio",
  agency: "Creative agency",
  saas: "SaaS & tech",
  ecommerce: "Ecommerce",
  education: "Education",
  photography: "Photography",
  "local-business": "Local business",
}

export function ThreeDPreview({ demo, allDemos, packages }: Props) {
  const router = useRouter()
  const [businessName, setBusinessName] = useState("")
  const [pkgId, setPkgId] = useState<string>("business")

  const domain = (businessName.trim() || "your-business").toLowerCase().replace(/\s+/g, "-") + ".com"

  const idx = allDemos.findIndex((d) => d.id === demo.id)
  const go = (step: number) => {
    const next = allDemos[(idx + step + allDemos.length) % allDemos.length]
    router.push(`/demo?demoId=${next.id}`)
  }

  return (
    <div className="relative">
      {/* Stage */}
      <div className="relative flex items-center justify-center overflow-visible py-16" style={{ perspective: "1600px" }}>
        <ThreeDScene category={demo.category} />

        {/* 3D card */}
        <div
          className="relative select-none animate-demo-tilt"
          style={{ zIndex: 10, transformStyle: "preserve-3d" }}
        >
          {/* Browser window */}
          <div className="w-[min(720px,86vw)] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_50px_100px_-20px_rgba(24,24,27,0.35)]">
            <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <div className="mx-auto flex h-8 w-full max-w-sm items-center justify-center rounded-lg bg-white text-xs text-zinc-500 ring-1 ring-zinc-200">
                <span className="truncate">{domain}</span>
              </div>
            </div>
            <div className="relative aspect-[16/10] bg-zinc-100">
              <img src={demo.thumbnail} alt={demo.name} className="h-full w-full object-cover" draggable={false} />
              {businessName.trim() && (
                <div className="absolute left-4 top-4 rounded-lg bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                  {businessName.trim()}
                </div>
              )}
            </div>
          </div>

          {/* Floor reflection */}
          <div
            className="pointer-events-none absolute left-0 right-0 top-full mt-4 overflow-hidden"
            style={{ transform: "rotateX(180deg)", opacity: 0.16 }}
          >
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="aspect-[16/10] bg-zinc-100">
                <img src={demo.thumbnail} alt="" className="h-full w-full object-cover opacity-70" draggable={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scene label */}
      <div className="pointer-events-none absolute top-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber-200 bg-white/90 px-4 py-1.5 text-xs text-amber-700 shadow-sm backdrop-blur">
        <Sparkles className="h-3.5 w-3.5" />
        {SCENE_LABELS[demo.category] ?? demo.category} · 3D animated preview
      </div>

      {/* Name overlay card */}
      <div className="mx-auto -mt-2 max-w-xl rounded-2xl border border-zinc-200 bg-white p-5 text-center shadow-card">
        <p className="text-sm text-zinc-500">
          This is your template. Add your business name to imagine it&apos;s yours —
          we&apos;ll place it right in your website.
        </p>
        <input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Your business name"
          className="mt-3 h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-center text-sm text-zinc-900 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
        />
        <div className="mt-2 text-xs text-zinc-500">
          Your preview URL: <span className="font-mono text-amber-600">{domain}</span>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => go(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-amber-500 hover:text-amber-600"
          aria-label="Previous template"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm text-zinc-500">
          {idx + 1} / {allDemos.length}
        </span>
        <button
          onClick={() => go(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-amber-500 hover:text-amber-600"
          aria-label="Next template"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Package selector */}
      <div className="mx-auto mt-8 max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-widest text-amber-600">Choose your package</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {(["starter", "business", "pro"] as const).map((id) => {
            const p = packages.find((x) => x.id === id) || PKG_FALLBACK[id]
            const active = pkgId === id
            return (
              <button
                key={id}
                onClick={() => setPkgId(id)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-amber-500 bg-amber-50 ring-1 ring-amber-200"
                    : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
              >
                <div className="font-semibold text-zinc-900">{p.name}</div>
                <div className="mt-1 text-sm font-bold text-amber-600">₹{p.price.toLocaleString("en-IN")}</div>
                <div className="mt-1 text-xs text-zinc-500">{(p as { includedPages?: number }).includedPages ?? "—"} pages included</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}