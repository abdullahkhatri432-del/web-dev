"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, MousePointer2 } from "lucide-react"
import type { Demo, Package } from "@/services/firestore"

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

export function ThreeDPreview({ demo, allDemos, packages }: Props) {
  const [businessName, setBusinessName] = useState("")
  const [pkgId, setPkgId] = useState<string>("business")
  const [rotateX, setRotateX] = useState(10)
  const [rotateY, setRotateY] = useState(-8)
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null)
  const rafRef = useRef<number | null>(null)

  const pkg = packages.find((p) => p.id === pkgId) || PKG_FALLBACK[pkgId]
  const domain = (businessName.trim() || "your-business").toLowerCase().replace(/\s+/g, "-") + ".com"

  const startIdle = useCallback(() => {
    if (rafRef.current) return
    let t = 0
    const tick = () => {
      t += 0.008
      if (!dragRef.current) {
        setRotateX(10 + Math.sin(t * 1.4) * 4)
        setRotateY(-8 + Math.sin(t) * 10)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    startIdle()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [startIdle])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current
      if (!d) return
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      setRotateY(Math.max(-38, Math.min(38, d.ry + dx * 0.25)))
      setRotateX(Math.max(-6, Math.min(24, d.rx - dy * 0.15)))
    }
    const onUp = () => {
      dragRef.current = null
      setDragging(false)
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [dragging])

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, rx: rotateX, ry: rotateY }
    setDragging(true)
  }

  const idx = allDemos.findIndex((d) => d.id === demo.id)
  const go = (step: number) => {
    const next = allDemos[(idx + step + allDemos.length) % allDemos.length]
    window.location.href = `/demo?demoId=${next.id}`
  }

  return (
    <div className="relative">
      {/* Stage */}
      <div className="relative flex items-center justify-center py-10" style={{ perspective: "1600px" }}>
        <div
          className="relative select-none"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transition: dragging ? "none" : "transform 0.15s ease-out",
            cursor: dragging ? "grabbing" : "grab",
          }}
          onPointerDown={onPointerDown}
        >
          {/* Browser window */}
          <div className="w-[min(880px,88vw)] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_50px_100px_-20px_rgba(24,24,27,0.35)]">
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
            className="pointer-events-none absolute left-0 right-0 top-full mt-3 overflow-hidden"
            style={{ transform: "rotateX(180deg)", opacity: 0.18 }}
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

      {/* Drag hint */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-4 py-1.5 text-xs text-zinc-500 shadow-sm">
        <MousePointer2 className="h-3.5 w-3.5" />
        Drag to rotate in 3D
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
        <div className="mt-2 text-xs text-zinc-400">
          Your preview URL: <span className="font-mono text-amber-600">{domain}</span>
        </div>
      </div>

      {/* Prev / Next */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => go(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-amber-500 hover:text-amber-600"
          aria-label="Previous template"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm text-zinc-500">
          {idx + 1} / {allDemos.length}
        </span>
        <button
          onClick={() => go(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-amber-500 hover:text-amber-600"
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