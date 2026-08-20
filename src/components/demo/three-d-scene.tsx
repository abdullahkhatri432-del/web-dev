"use client"

import type { CSSProperties } from "react"
import {
  Activity,
  Aperture,
  Banknote,
  BedDouble,
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck,
  Camera,
  Car,
  ChefHat,
  Coffee,
  Coins,
  ConciergeBell,
  Cpu,
  CupSoda,
  Dumbbell,
  Film,
  Gem,
  Globe,
  GraduationCap,
  Heart,
  HeartPulse,
  Home,
  Image,
  KeyRound,
  Layers,
  Leaf,
  Lightbulb,
  MapPin,
  MonitorSmartphone,
  Music,
  Package,
  PencilLine,
  Plus,
  Rocket,
  Scissors,
  ShoppingBag,
  Sparkles,
  SprayCan,
  Star,
  Stethoscope,
  Store,
  Tag,
  Target,
  Trophy,
  Truck,
  User,
  UtensilsCrossed,
  Wine,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react"

type Anim = "float" | "orbit" | "spin3d" | "ring" | "pulse" | "rise"

type SceneIcon = LucideIcon | React.FC<{ className?: string; style?: CSSProperties }>

type ElementSpec = {
  icon: SceneIcon
  anim: Anim
  wrap: string
  size: number
  color: string
  bg?: string
  duration?: number
  delay?: number
  z?: number
  r?: number
}

const ANIM_CLASS: Record<Anim, string> = {
  float: "animate-demo-float",
  orbit: "animate-demo-orbit",
  spin3d: "animate-demo-spin3d",
  ring: "animate-demo-ring",
  pulse: "animate-demo-pulse",
  rise: "animate-demo-rise",
}

const el = (
  icon: SceneIcon,
  anim: Anim,
  wrap: string,
  size: number,
  color: string,
  extra: Partial<ElementSpec> = {},
): ElementSpec => ({ icon, anim, wrap, size, color, ...extra })

const AMBER = "#d97706"
const ORANGE = "#f97316"
const GREEN = "#059669"
const EMERALD = "#10b981"
const SKY = "#0284c7"
const BLUE = "#2563eb"
const INDIGO = "#4f46e5"
const VIOLET = "#7c3aed"
const FUCHSIA = "#c026d3"
const PINK = "#ec4899"
const PURPLE = "#9333ea"
const RED = "#dc2626"
const ZINC = "#3f3f46"
const TEAL = "#0d9488"
const CYAN = "#0891b2"

const ORBIT = (r: number) => `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`
const rVar = (r: number) => `clamp(170px, ${Math.round((r / 880) * 100)}vw, ${r}px)`

export const SCENES: Record<string, ElementSpec[]> = {
  restaurant: [
    el(ChefHat, "float", "left-[7%] top-[14%]", 64, AMBER, { bg: "#fffbeb", duration: 5.5 }),
    el(Wine, "float", "right-[9%] top-[24%]", 56, RED, { bg: "#fef2f2", duration: 6.5, delay: 0.8 }),
    el(UtensilsCrossed, "float", "left-[12%] bottom-[12%]", 52, ZINC, { bg: "#fafafa", duration: 7, delay: 0.4 }),
    el(Coffee, "spin3d", "right-[14%] bottom-[10%]", 56, ORANGE, { bg: "#fff7ed", duration: 9 }),
    el(Heart, "rise", "left-1/2 top-[8%]", 28, RED, { duration: 4, delay: 0 }),
    el(Star, "rise", "right-[26%] top-[10%]", 24, AMBER, { duration: 5, delay: 1.4 }),
    el(Sparkles, "rise", "left-[30%] top-[6%]", 22, ORANGE, { duration: 4.5, delay: 2.2 }),
  ],
  cafe: [
    el(Coffee, "float", "left-[8%] top-[16%]", 66, AMBER, { bg: "#fffbeb", duration: 5 }),
    el(CupSoda, "float", "right-[8%] top-[26%]", 58, ORANGE, { bg: "#fff7ed", duration: 6.5, delay: 0.7 }),
    el(Leaf, "float", "left-[14%] bottom-[14%]", 52, GREEN, { bg: "#ecfdf5", duration: 7, delay: 0.3 }),
    el(SteamIcon, "rise", "left-1/2 top-[20%]", 30, ZINC, { duration: 3.5, delay: 0 }),
  ],
  gym: [
    el(Dumbbell, "spin3d", "left-[9%] top-[18%]", 72, ZINC, { bg: "#fafafa", duration: 8 }),
    el(Trophy, "float", "right-[10%] top-[24%]", 62, AMBER, { bg: "#fffbeb", duration: 6, delay: 0.5 }),
    el(HeartPulse, "pulse", "right-[16%] bottom-[12%]", 58, EMERALD, { bg: "#ecfdf5", duration: 2.4 }),
    el(Activity, "float", "left-[16%] bottom-[10%]", 50, RED, { bg: "#fef2f2", duration: 6.8, delay: 1 }),
    el(Sparkles, "rise", "left-[38%] top-[8%]", 24, EMERALD, { duration: 4.4, delay: 0.8 }),
  ],
  salon: [
    el(Scissors, "float", "left-[8%] top-[18%]", 66, PINK, { bg: "#fdf2f8", duration: 5.5 }),
    el(Sparkles, "float", "right-[9%] top-[22%]", 58, PURPLE, { bg: "#faf5ff", duration: 6, delay: 0.6 }),
    el(SprayCan, "float", "left-[14%] bottom-[14%]", 54, FUCHSIA, { bg: "#fdf4ff", duration: 7, delay: 0.2 }),
    el(Star, "spin3d", "right-[14%] bottom-[10%]", 52, PINK, { bg: "#fff1f2", duration: 8 }),
    el(Sparkles, "rise", "left-1/2 top-[12%]", 26, PURPLE, { duration: 4, delay: 0 }),
    el(Sparkles, "rise", "right-[30%] top-[8%]", 22, PINK, { duration: 5, delay: 1.2 }),
  ],
  clinic: [
    el(Stethoscope, "float", "left-[9%] top-[16%]", 64, SKY, { bg: "#f0f9ff", duration: 5.5 }),
    el(Plus, "pulse", "right-[10%] top-[20%]", 60, TEAL, { bg: "#f0fdfa", duration: 2.6 }),
    el(HeartPulse, "float", "left-[14%] bottom-[12%]", 56, RED, { bg: "#fef2f2", duration: 6.5, delay: 0.5 }),
    el(Activity, "float", "right-[14%] bottom-[14%]", 52, SKY, { bg: "#f0f9ff", duration: 7, delay: 0.9 }),
    el(Heart, "rise", "left-1/2 top-[14%]", 26, RED, { duration: 4.2, delay: 0 }),
  ],
  "real-estate": [
    el(Building2, "float", "left-[7%] top-[14%]", 72, BLUE, { bg: "#eff6ff", duration: 5.5 }),
    el(Home, "float", "right-[9%] top-[24%]", 60, INDIGO, { bg: "#eef2ff", duration: 6.5, delay: 0.6 }),
    el(KeyRound, "spin3d", "left-[15%] bottom-[12%]", 56, AMBER, { bg: "#fffbeb", duration: 8 }),
    el(MapPin, "float", "right-[15%] bottom-[10%]", 52, RED, { bg: "#fef2f2", duration: 7, delay: 1 }),
    el(Sparkles, "rise", "right-[30%] top-[10%]", 24, BLUE, { duration: 4.6, delay: 0.4 }),
  ],
  hotel: [
    el(BedDouble, "float", "left-[8%] top-[16%]", 66, SKY, { bg: "#f0f9ff", duration: 5.5 }),
    el(ConciergeBell, "float", "right-[9%] top-[22%]", 58, AMBER, { bg: "#fffbeb", duration: 6.5, delay: 0.5 }),
    el(Building2, "float", "left-[14%] bottom-[14%]", 60, CYAN, { bg: "#ecfeff", duration: 7, delay: 0.8 }),
    el(Star, "spin3d", "right-[14%] bottom-[12%]", 54, AMBER, { bg: "#fffbeb", duration: 7.5 }),
    el(Wine, "float", "left-[30%] bottom-[6%]", 48, RED, { bg: "#fef2f2", duration: 6.8, delay: 1.3 }),
  ],
  portfolio: [
    el(User, "float", "left-[9%] top-[16%]", 62, ZINC, { bg: "#fafafa", duration: 5.5 }),
    el(Briefcase, "float", "right-[10%] top-[22%]", 58, AMBER, { bg: "#fffbeb", duration: 6.5, delay: 0.5 }),
    el(Layers, "float", "left-[15%] bottom-[14%]", 54, INDIGO, { bg: "#eef2ff", duration: 7, delay: 0.3 }),
    el(Sparkles, "float", "right-[15%] bottom-[10%]", 50, FUCHSIA, { bg: "#fdf4ff", duration: 6, delay: 1 }),
    el(Star, "rise", "left-1/2 top-[10%]", 26, AMBER, { duration: 4.2, delay: 0 }),
  ],
  agency: [
    el(Rocket, "float", "left-[8%] top-[16%]", 68, VIOLET, { bg: "#faf5ff", duration: 5 }),
    el(Lightbulb, "float", "right-[9%] top-[24%]", 58, AMBER, { bg: "#fffbeb", duration: 6.5, delay: 0.5 }),
    el(Target, "float", "left-[14%] bottom-[14%]", 56, INDIGO, { bg: "#eef2ff", duration: 7, delay: 0.3 }),
    el(Sparkles, "spin3d", "right-[14%] bottom-[12%]", 52, FUCHSIA, { bg: "#fdf4ff", duration: 8 }),
    el(Zap, "rise", "left-1/2 top-[12%]", 28, AMBER, { duration: 4.4, delay: 0 }),
  ],
  saas: [
    el(MonitorSmartphone, "float", "left-[8%] top-[16%]", 70, INDIGO, { bg: "#eef2ff", duration: 5 }),
    el(Cpu, "float", "right-[9%] top-[24%]", 60, CYAN, { bg: "#ecfeff", duration: 6.5, delay: 0.5 }),
    el(Globe, "spin3d", "left-[14%] bottom-[14%]", 58, SKY, { bg: "#f0f9ff", duration: 10 }),
    el(Zap, "float", "right-[15%] bottom-[10%]", 54, AMBER, { bg: "#fffbeb", duration: 6, delay: 1 }),
    el(Sparkles, "rise", "left-1/2 top-[10%]", 26, INDIGO, { duration: 4.2, delay: 0 }),
  ],
  ecommerce: [
    el(ShoppingBag, "float", "left-[8%] top-[16%]", 68, EMERALD, { bg: "#ecfdf5", duration: 5.5 }),
    el(Tag, "float", "right-[9%] top-[24%]", 58, AMBER, { bg: "#fffbeb", duration: 6.5, delay: 0.5 }),
    el(Truck, "float", "left-[14%] bottom-[14%]", 56, BLUE, { bg: "#eff6ff", duration: 7, delay: 0.3 }),
    el(Package, "spin3d", "right-[14%] bottom-[12%]", 56, ORANGE, { bg: "#fff7ed", duration: 9 }),
    el(Star, "rise", "left-1/2 top-[12%]", 26, AMBER, { duration: 4.4, delay: 0 }),
  ],
  education: [
    el(GraduationCap, "float", "left-[8%] top-[16%]", 68, BLUE, { bg: "#eff6ff", duration: 5.5 }),
    el(BookOpen, "float", "right-[9%] top-[24%]", 58, GREEN, { bg: "#ecfdf5", duration: 6.5, delay: 0.5 }),
    el(PencilLine, "float", "left-[15%] bottom-[14%]", 54, AMBER, { bg: "#fffbeb", duration: 7, delay: 0.3 }),
    el(Star, "spin3d", "right-[15%] bottom-[12%]", 50, SKY, { bg: "#f0f9ff", duration: 8 }),
    el(Sparkles, "rise", "left-1/2 top-[10%]", 24, BLUE, { duration: 4.2, delay: 0 }),
  ],
  photography: [
    el(Camera, "float", "left-[8%] top-[16%]", 68, ZINC, { bg: "#fafafa", duration: 5.5 }),
    el(Aperture, "spin3d", "right-[9%] top-[24%]", 62, AMBER, { bg: "#fffbeb", duration: 9 }),
    el(Image, "float", "left-[14%] bottom-[14%]", 56, SKY, { bg: "#f0f9ff", duration: 7, delay: 0.4 }),
    el(Film, "float", "right-[15%] bottom-[12%]", 54, RED, { bg: "#fef2f2", duration: 6.5, delay: 1 }),
    el(Sparkles, "rise", "left-1/2 top-[12%]", 24, AMBER, { duration: 4.3, delay: 0 }),
  ],
  "local-business": [
    el(MapPin, "float", "left-[8%] top-[16%]", 68, RED, { bg: "#fef2f2", duration: 5.5 }),
    el(Store, "float", "right-[9%] top-[24%]", 60, AMBER, { bg: "#fffbeb", duration: 6.5, delay: 0.5 }),
    el(CalendarCheck, "float", "left-[14%] bottom-[14%]", 56, GREEN, { bg: "#ecfdf5", duration: 7, delay: 0.3 }),
    el(Star, "spin3d", "right-[14%] bottom-[12%]", 52, ORANGE, { bg: "#fff7ed", duration: 8 }),
    el(Sparkles, "rise", "left-1/2 top-[12%]", 24, RED, { duration: 4.4, delay: 0 }),
  ],
}

const ORBIT_DEFAULT_R = 460

function SceneElement({ spec }: { spec: ElementSpec }) {
  const { icon: Icon, anim, wrap, size, color, bg, duration, delay, z = 10, r = ORBIT_DEFAULT_R } = spec
  const styleBase: CSSProperties = {
    width: size,
    height: size,
    backgroundColor: bg ?? "#ffffff",
    color,
    zIndex: z,
  }
  const animStyle: CSSProperties = {
    animationDuration: duration ? `${duration}s` : undefined,
    animationDelay: delay ? `${delay}s` : undefined,
  }

  if (anim === "orbit") {
    const orbitStyle = {
      "--orbit-r": rVar(r),
      ...animStyle,
    } as CSSProperties
    return (
      <div className={`absolute ${wrap}`} style={{ zIndex: z }}>
        <div className="animate-demo-orbit" style={orbitStyle}>
          <div
            className="flex items-center justify-center rounded-2xl border border-zinc-200/70 shadow-lg"
            style={styleBase}
          >
            <Icon className="h-[54%] w-[54%]" style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.12))" }} />
          </div>
        </div>
      </div>
    )
  }

  if (anim === "spin3d") {
    return (
      <div className={`absolute ${wrap}`} style={{ zIndex: z, perspective: "700px" }}>
        <div className="animate-demo-spin3d" style={animStyle}>
          <div
            className="flex items-center justify-center rounded-2xl border border-zinc-200/70 shadow-lg"
            style={styleBase}
          >
            <Icon className="h-[54%] w-[54%]" style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.12))" }} />
          </div>
        </div>
      </div>
    )
  }

  if (anim === "ring") {
    return (
      <div className={`absolute ${wrap}`} style={{ zIndex: z, width: size, height: size }}>
        <div className="h-full w-full rounded-full border-2 animate-demo-ring" style={{ borderColor: color, ...animStyle }} />
      </div>
    )
  }

  if (anim === "rise") {
    return (
      <div className={`absolute ${wrap}`} style={{ zIndex: z }}>
        <div className="animate-demo-rise" style={animStyle}>
          <Icon className="h-full w-full" style={{ color, opacity: 0.8 }} />
        </div>
      </div>
    )
  }

  return (
    <div className={`absolute ${wrap}`} style={{ zIndex: z }}>
      <div className={`${ANIM_CLASS[anim]} flex items-center justify-center rounded-2xl border border-zinc-200/70 shadow-lg`} style={{ ...styleBase, ...animStyle }}>
        <Icon className="h-[54%] w-[54%]" style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.12))" }} />
      </div>
    </div>
  )
}

export function ThreeDScene({ category }: { category: string }) {
  const items = SCENES[category] ?? SCENES["local-business"]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      <div
        className="animate-demo-pulse absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
        style={{ backgroundColor: "rgba(245,158,11,0.16)", zIndex: 0 }}
      />
      {items.map((spec, i) => (
        <SceneElement key={i} spec={spec} />
      ))}
    </div>
  )
}

function SteamIcon(props: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${props.className ?? ""}`} style={props.style}>
      <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" style={{ animation: "demo-rise 3s ease-in infinite" }} />
      <span className="h-3.5 w-3.5 rounded-full bg-zinc-200" style={{ animation: "demo-rise 3.4s ease-in 0.6s infinite" }} />
      <span className="h-2 w-2 rounded-full bg-zinc-300" style={{ animation: "demo-rise 3.2s ease-in 1.2s infinite" }} />
    </div>
  )
}