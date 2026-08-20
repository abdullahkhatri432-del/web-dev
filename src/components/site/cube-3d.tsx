"use client"

import { Check, Zap, Rocket, ShieldCheck, Gauge, Palette } from "lucide-react"

const faces = [
  { label: "Pick a design", icon: Palette },
  { label: "We build it", icon: Zap },
  { label: "Launch fast", icon: Rocket },
  { label: "100% refundable", icon: ShieldCheck },
  { label: "3-day delivery", icon: Gauge },
  { label: "You're live", icon: Check },
]

const FACE_TRANSFORMS = [
  (h: number) => `translateZ(${h}px)`,
  (h: number) => `rotateY(90deg) translateZ(${h}px)`,
  (h: number) => `rotateY(180deg) translateZ(${h}px)`,
  (h: number) => `rotateY(-90deg) translateZ(${h}px)`,
  (h: number) => `rotateX(90deg) translateZ(${h}px)`,
  (h: number) => `rotateX(-90deg) translateZ(${h}px)`,
]

export function Cube3D({ size = 150, className }: { size?: number; className?: string }) {
  const half = size / 2
  return (
    <div className={className} style={{ perspective: "1200px", width: size, height: size }}>
      <div
        className="relative h-full w-full"
        style={{ transform: "rotateX(-18deg) rotateY(12deg)", transformStyle: "preserve-3d" }}
      >
        <div className="animate-demo-spin3d relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {faces.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={f.label}
                className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl border border-amber-200/70 bg-white/90 text-amber-600 shadow-card backdrop-blur"
                style={{ backfaceVisibility: "hidden", transform: FACE_TRANSFORMS[i](half) }}
              >
                <Icon className="h-6 w-6" />
                <span className="px-1 text-center text-[9px] font-semibold leading-tight text-zinc-600">
                  {f.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}