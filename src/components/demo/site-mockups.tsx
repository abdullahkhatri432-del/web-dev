"use client"

import type { CSSProperties } from "react"
import {
  Activity,
  Aperture,
  BarChart3,
  BedDouble,
  Bike,
  BookOpen,
  Briefcase,
  Brush,
  Building2,
  CalendarCheck,
  Camera,
  Clock,
  Coffee,
  ConciergeBell,
  Cookie,
  Cpu,
  Dumbbell,
  GraduationCap,
  Heart,
  HeartPulse,
  KeyRound,
  Lightbulb,
  MapPin,
  MessageCircle,
  Package,
  Palette,
  Plus,
  Rocket,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Stethoscope,
  Store,
  Target,
  TrendingUp,
  Truck,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react"

type Visual = "plate" | "cup" | "dumbbell" | "scissors" | "heartbeat" | "cards" | "device" | "box" | "cap" | "pin"

type MockContent = {
  badge: string
  headline: string
  highlight: string
  sub: string
  cta: string
  secondary: string
  visual: Visual
  stats: { value: string; label: string }[]
  features: { icon: LucideIcon; title: string; desc: string }[]
}

const MOCK: Record<string, MockContent> = {
  restaurant: {
    badge: "Restaurant",
    headline: "Delicious food,",
    highlight: "served with love",
    sub: "Modern bistro for dine-in, takeaway & parties.",
    cta: "Book a table",
    secondary: "View menu",
    visual: "plate",
    stats: [
      { value: "4.9", label: "Rating" },
      { value: "500+", label: "Dishes" },
      { value: "12 yrs", label: "Serving" },
    ],
    features: [
      { icon: UtensilsCrossed, title: "Dine-in", desc: "Cozy tables & candle light" },
      { icon: Bike, title: "Takeaway", desc: "Hot & ready in 20 min" },
      { icon: CalendarCheck, title: "Reservations", desc: "Book parties online" },
    ],
  },
  cafe: {
    badge: "Café & Coffee",
    headline: "Brewed fresh,",
    highlight: "every morning",
    sub: "Specialty coffee, baked treats & cozy corners.",
    cta: "Order coffee",
    secondary: "Our menu",
    visual: "cup",
    stats: [
      { value: "4.8", label: "Rating" },
      { value: "40+", label: "Blends" },
      { value: "5", label: "Locations" },
    ],
    features: [
      { icon: Coffee, title: "Specialty coffee", desc: "Single-origin beans" },
      { icon: Cookie, title: "Baked daily", desc: "Fresh in-house treats" },
      { icon: Wifi, title: "Free Wi-Fi", desc: "Work-friendly corners" },
    ],
  },
  gym: {
    badge: "Gym & Fitness",
    headline: "Get stronger,",
    highlight: "every day",
    sub: "Personal training, group classes & premium equipment.",
    cta: "Start free trial",
    secondary: "Join now",
    visual: "dumbbell",
    stats: [
      { value: "1200+", label: "Members" },
      { value: "40+", label: "Trainers" },
      { value: "24/7", label: "Open" },
    ],
    features: [
      { icon: Dumbbell, title: "Modern equipment", desc: "Premium machines" },
      { icon: HeartPulse, title: "Personal training", desc: "1-on-1 coaching" },
      { icon: Users, title: "Group classes", desc: "Yoga, HIIT & more" },
    ],
  },
  salon: {
    badge: "Beauty Salon",
    headline: "Look & feel,",
    highlight: "amazing",
    sub: "Hair, skin & makeup by expert stylists.",
    cta: "Book appointment",
    secondary: "Our services",
    visual: "scissors",
    stats: [
      { value: "4.9", label: "Rating" },
      { value: "25+", label: "Stylists" },
      { value: "30+", label: "Services" },
    ],
    features: [
      { icon: Scissors, title: "Hair styling", desc: "Cuts, colour & styling" },
      { icon: Sparkles, title: "Spa & skin", desc: "Facials & treatments" },
      { icon: Brush, title: "Bridal & makeup", desc: "Party & wedding looks" },
    ],
  },
  clinic: {
    badge: "Medical Clinic",
    headline: "Your health,",
    highlight: "our priority",
    sub: "Trusted doctors, modern care & same-day appointments.",
    cta: "Book a checkup",
    secondary: "Our doctors",
    visual: "heartbeat",
    stats: [
      { value: "15+", label: "Doctors" },
      { value: "98%", label: "Satisfaction" },
      { value: "24/7", label: "Care" },
    ],
    features: [
      { icon: Stethoscope, title: "Expert doctors", desc: "Specialists you trust" },
      { icon: Plus, title: "Diagnostics", desc: "In-house lab & scans" },
      { icon: Clock, title: "Quick appointments", desc: "Same-day slots" },
    ],
  },
  "real-estate": {
    badge: "Real Estate",
    headline: "Find your",
    highlight: "dream home",
    sub: "Luxury homes, verified listings & easy site visits.",
    cta: "Browse homes",
    secondary: "Sell property",
    visual: "cards",
    stats: [
      { value: "500+", label: "Listings" },
      { value: "200+", label: "Sold" },
      { value: "4.8", label: "Rating" },
    ],
    features: [
      { icon: Building2, title: "Verified listings", desc: "Every home checked" },
      { icon: KeyRound, title: "Easy process", desc: "Paperwork done for you" },
      { icon: TrendingUp, title: "Smart prices", desc: "Fair market value" },
    ],
  },
  hotel: {
    badge: "Hotel & Resorts",
    headline: "Stay where",
    highlight: "memories begin",
    sub: "Ocean-view rooms, pools & world-class service.",
    cta: "Reserve a room",
    secondary: "View rooms",
    visual: "cards",
    stats: [
      { value: "120", label: "Rooms" },
      { value: "4.9", label: "Rating" },
      { value: "24/7", label: "Concierge" },
    ],
    features: [
      { icon: BedDouble, title: "Luxury rooms", desc: "Ocean & garden views" },
      { icon: Waves, title: "Pool & spa", desc: "Relax and unwind" },
      { icon: ConciergeBell, title: "24/7 service", desc: "Always at your service" },
    ],
  },
  portfolio: {
    badge: "Portfolio",
    headline: "Work that",
    highlight: "speaks for itself",
    sub: "Designs & projects by a creative professional.",
    cta: "View my work",
    secondary: "Contact me",
    visual: "cards",
    stats: [
      { value: "80+", label: "Projects" },
      { value: "6 yrs", label: "Experience" },
      { value: "30+", label: "Clients" },
    ],
    features: [
      { icon: Palette, title: "Creative design", desc: "Bold, modern visuals" },
      { icon: Briefcase, title: "Case studies", desc: "Real results, documented" },
      { icon: Star, title: "Client love", desc: "5-star reviews" },
    ],
  },
  agency: {
    badge: "Creative Agency",
    headline: "We grow",
    highlight: "your brand",
    sub: "Design, marketing & campaigns that convert.",
    cta: "Start a project",
    secondary: "Our work",
    visual: "cards",
    stats: [
      { value: "120+", label: "Brands" },
      { value: "40+", label: "Experts" },
      { value: "4.9", label: "Rating" },
    ],
    features: [
      { icon: Rocket, title: "Brand strategy", desc: "Positioning that sells" },
      { icon: Target, title: "Performance ads", desc: "ROI-focused campaigns" },
      { icon: Lightbulb, title: "Creative ideas", desc: "Ideas that stand out" },
    ],
  },
  saas: {
    badge: "SaaS Platform",
    headline: "Automate",
    highlight: "your business",
    sub: "One dashboard for sales, teams & analytics.",
    cta: "Start free trial",
    secondary: "See demo",
    visual: "device",
    stats: [
      { value: "10k+", label: "Users" },
      { value: "99.9%", label: "Uptime" },
      { value: "4.8", label: "Rating" },
    ],
    features: [
      { icon: Cpu, title: "Fast & secure", desc: "Enterprise-grade speed" },
      { icon: Zap, title: "Automations", desc: "Save hours weekly" },
      { icon: BarChart3, title: "Analytics", desc: "Real-time insights" },
    ],
  },
  ecommerce: {
    badge: "Online Store",
    headline: "Shop the",
    highlight: "latest trends",
    sub: "Fast delivery, easy returns & secure checkout.",
    cta: "Shop now",
    secondary: "New arrivals",
    visual: "box",
    stats: [
      { value: "50k+", label: "Orders" },
      { value: "2k+", label: "Products" },
      { value: "4.8", label: "Rating" },
    ],
    features: [
      { icon: ShoppingBag, title: "Big collection", desc: "Fresh styles weekly" },
      { icon: Truck, title: "Fast delivery", desc: "Ships within 24 hrs" },
      { icon: ShieldCheck, title: "Secure payments", desc: "100% protected" },
    ],
  },
  education: {
    badge: "Online Academy",
    headline: "Learn",
    highlight: "anything online",
    sub: "Expert-led courses with certificates & live support.",
    cta: "Enroll now",
    secondary: "Browse courses",
    visual: "cap",
    stats: [
      { value: "20k+", label: "Students" },
      { value: "150+", label: "Courses" },
      { value: "4.9", label: "Rating" },
    ],
    features: [
      { icon: GraduationCap, title: "Certificates", desc: "Earn verified badges" },
      { icon: BookOpen, title: "Expert courses", desc: "Learn from pros" },
      { icon: MessageCircle, title: "Live support", desc: "Help when you need it" },
    ],
  },
  photography: {
    badge: "Photography",
    headline: "Moments",
    highlight: "worth keeping",
    sub: "Weddings, portraits & product shoots.",
    cta: "Book a shoot",
    secondary: "My gallery",
    visual: "cards",
    stats: [
      { value: "500+", label: "Shoots" },
      { value: "8 yrs", label: "Experience" },
      { value: "5.0", label: "Rating" },
    ],
    features: [
      { icon: Camera, title: "Pro shoots", desc: "Latest gear & lenses" },
      { icon: Aperture, title: "Creative edits", desc: "Signature colour grade" },
      { icon: Heart, title: "Client stories", desc: "Captured beautifully" },
    ],
  },
  "local-business": {
    badge: "Local Business",
    headline: "Your neighbourhood",
    highlight: "favourite",
    sub: "Walk-ins welcome — find us right on the map.",
    cta: "Get directions",
    secondary: "Call now",
    visual: "pin",
    stats: [
      { value: "4.9", label: "Rating" },
      { value: "10k+", label: "Customers" },
      { value: "15 yrs", label: "Serving" },
    ],
    features: [
      { icon: MapPin, title: "Easy to find", desc: "Right on the map" },
      { icon: Store, title: "Visit us", desc: "Walk-ins welcome" },
      { icon: Star, title: "Loved locally", desc: "5-star reputation" },
    ],
  },
}

function PlateVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ perspective: "700px" }}>
      <div style={{ transform: "rotateX(52deg)", transformStyle: "preserve-3d" }}>
        <div className="animate-demo-spin relative rounded-full border-4 border-zinc-300 bg-white shadow-xl" style={{ width: 96, height: 96 }}>
          <div className="absolute inset-3 rounded-full border border-amber-200" />
          <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500" />
          <div className="absolute left-[18%] top-[22%] h-3 w-3 rounded-full bg-emerald-500" />
          <div className="absolute right-[20%] top-[30%] h-3 w-3 rounded-full bg-red-400" />
        </div>
      </div>
      <span className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-zinc-200" style={{ animation: "demo-rise 2.6s ease-in infinite" }} />
      <span className="absolute -top-2 left-1/2 ml-5 h-2 w-2 rounded-full bg-zinc-200" style={{ animation: "demo-rise 3s ease-in 0.7s infinite" }} />
    </div>
  )
}

function CupVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ perspective: "700px" }}>
      <div className="relative" style={{ animation: "demo-float 4s ease-in-out infinite" }}>
        <div className="relative h-16 w-14 rounded-b-2xl border-2 border-zinc-300 bg-white shadow-lg">
          <div className="absolute -right-4 top-2 h-8 w-4 rounded-r-full border-2 border-zinc-300 bg-white" />
          <div className="absolute left-1/2 top-1/2 h-3 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600" />
        </div>
        <span className="absolute -top-3 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-zinc-200" style={{ animation: "demo-rise 2.4s ease-in infinite" }} />
        <span className="absolute -top-4 left-1/2 ml-4 h-2 w-2 rounded-full bg-zinc-200" style={{ animation: "demo-rise 2.9s ease-in 0.6s infinite" }} />
      </div>
    </div>
  )
}

function DumbbellVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ perspective: "650px" }}>
      <div className="animate-demo-spin3d relative flex h-10 w-32 items-center" style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute left-0 top-1/2 h-9 w-9 -translate-y-1/2 rounded-lg bg-zinc-800 shadow-lg" style={{ boxShadow: "0 0 0 4px rgba(63,63,70,0.25)" }} />
        <div className="absolute right-0 top-1/2 h-9 w-9 -translate-y-1/2 rounded-lg bg-zinc-800 shadow-lg" style={{ boxShadow: "0 0 0 4px rgba(63,63,70,0.25)" }} />
        <div className="h-2 w-full rounded-full bg-zinc-400" />
      </div>
      <div className="animate-demo-ring absolute h-20 w-20 rounded-full border-2 border-amber-400/70" />
    </div>
  )
}

function ScissorsVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ perspective: "650px" }}>
      <div className="animate-demo-rock flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl" style={{ transformStyle: "preserve-3d" }}>
        <Scissors className="h-11 w-11 text-pink-500" />
      </div>
      <Sparkles className="absolute left-[30%] top-2 h-4 w-4 animate-demo-pulse text-purple-400" />
      <Sparkles className="absolute right-[30%] top-6 h-3 w-3 animate-demo-pulse text-pink-400" style={{ animationDelay: "0.8s" }} />
    </div>
  )
}

function HeartbeatVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="animate-demo-pulse relative">
        <HeartPulse className="h-16 w-16 text-red-500" fill="rgba(239,68,68,0.18)" />
      </div>
      <svg className="absolute inset-x-4 bottom-1 h-8 w-full" viewBox="0 0 200 40" preserveAspectRatio="none">
        <path
          d="M0 20 L60 20 L70 8 L80 32 L90 12 L95 20 L140 20 L150 10 L155 20 L200 20"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="520"
          className="animate-demo-ecg"
        />
      </svg>
    </div>
  )
}

function CardsVisual() {
  return (
    <div className="flex h-full w-full items-center justify-center" style={{ perspective: "750px" }}>
      <div className="animate-demo-rock relative h-28 w-40" style={{ transformStyle: "preserve-3d" }}>
        <div
          className="absolute left-0 top-2 flex h-24 w-16 items-center justify-center rounded-lg bg-amber-400 shadow-lg"
          style={{ transform: "translateZ(26px) rotateY(-16deg)" }}
        >
          <Star className="h-5 w-5 text-white" fill="white" />
        </div>
        <div
          className="absolute left-1/2 top-0 flex h-28 w-16 -translate-x-1/2 flex-col items-center justify-center gap-1 rounded-lg bg-zinc-800 shadow-lg"
          style={{ transform: "translateZ(6px)" }}
        >
          <span className="h-1.5 w-8 rounded bg-zinc-500" />
          <span className="h-1.5 w-8 rounded bg-zinc-500" />
          <span className="h-1.5 w-6 rounded bg-amber-400" />
        </div>
        <div
          className="absolute right-0 top-2 flex h-24 w-16 items-center justify-center rounded-lg bg-sky-400 shadow-lg"
          style={{ transform: "translateZ(26px) rotateY(16deg)" }}
        >
          <Sparkles className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  )
}

function DeviceVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ perspective: "750px" }}>
      <div className="animate-demo-rock relative h-28 w-16 rounded-xl border-4 border-zinc-800 bg-white shadow-2xl" style={{ transformStyle: "preserve-3d" }}>
        <div className="mx-auto mt-2 h-1.5 w-8 rounded-full bg-zinc-200" />
        <div className="mx-auto mt-3 h-10 w-12 rounded-md bg-indigo-50 p-1">
          <div className="h-1.5 w-10 rounded bg-indigo-400" />
          <div className="mt-1.5 h-1.5 w-7 rounded bg-indigo-200" />
          <div className="mt-1 h-1.5 w-9 rounded bg-indigo-200" />
        </div>
      </div>
      <div className="animate-demo-ring absolute h-24 w-24 rounded-full border-2 border-indigo-400/70" />
      <Zap className="absolute -right-1 top-4 h-4 w-4 animate-demo-pulse text-amber-500" fill="currentColor" />
    </div>
  )
}

function BoxVisual() {
  const faces: CSSProperties[] = [
    { transform: "translateZ(30px)", backgroundColor: "#ffffff", color: "#d97706" },
    { transform: "rotateY(180deg) translateZ(30px)", backgroundColor: "#f59e0b", color: "#ffffff" },
    { transform: "rotateY(90deg) translateZ(30px)", backgroundColor: "#fde68a", color: "#92400e" },
    { transform: "rotateY(-90deg) translateZ(30px)", backgroundColor: "#fff7ed", color: "#b45309" },
    { transform: "rotateX(90deg) translateZ(30px)", backgroundColor: "#f59e0b", color: "#ffffff" },
    { transform: "rotateX(-90deg) translateZ(30px)", backgroundColor: "#fef3c7", color: "#b45309" },
  ]
  return (
    <div className="flex h-full w-full items-center justify-center" style={{ perspective: "600px" }}>
      <div className="animate-demo-spin3d relative" style={{ width: 60, height: 60, transformStyle: "preserve-3d" }}>
        {faces.map((s, i) => (
          <div key={i} className="absolute inset-0 flex items-center justify-center rounded-md border border-amber-200 shadow-lg" style={s}>
            {i < 3 && <Package className="h-6 w-6" />}
          </div>
        ))}
      </div>
    </div>
  )
}

function CapVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ perspective: "700px" }}>
      <div className="relative" style={{ animation: "demo-float 4.5s ease-in-out infinite" }}>
        <div className="h-14 w-16 rounded-t-lg bg-indigo-600 shadow-xl" style={{ transform: "skewX(-12deg)" }} />
        <div className="-mt-1 h-3 w-20 rounded bg-indigo-500" style={{ transform: "skewX(-12deg)" }} />
        <div className="absolute -right-1 bottom-0 h-8 w-1 rounded bg-amber-400" style={{ transform: "rotate(20deg)" }} />
        <div className="absolute right-2 bottom-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
        <div className="absolute left-0 top-0 h-14 w-16 rounded-t-lg bg-indigo-600/60" style={{ transform: "translateZ(-8px)" }} />
      </div>
      <div className="animate-demo-ring absolute h-24 w-24 rounded-full border-2 border-indigo-400/70" />
    </div>
  )
}

function PinVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ perspective: "650px" }}>
      <div className="relative" style={{ animation: "demo-float 4.2s ease-in-out infinite" }}>
        <MapPin className="h-20 w-20 text-red-500" fill="rgba(239,68,68,0.2)" strokeWidth={1.6} />
      </div>
      <div className="animate-demo-ring absolute h-24 w-24 rounded-full border-2 border-red-400/70" />
      <div className="animate-demo-ring absolute h-20 w-20 rounded-full border-2 border-amber-400/70" style={{ animationDelay: "1.2s" }} />
    </div>
  )
}

function HeroVisual({ type }: { type: Visual }) {
  switch (type) {
    case "plate":
      return <PlateVisual />
    case "cup":
      return <CupVisual />
    case "dumbbell":
      return <DumbbellVisual />
    case "scissors":
      return <ScissorsVisual />
    case "heartbeat":
      return <HeartbeatVisual />
    case "cards":
      return <CardsVisual />
    case "device":
      return <DeviceVisual />
    case "box":
      return <BoxVisual />
    case "cap":
      return <CapVisual />
    case "pin":
      return <PinVisual />
  }
}

function MockNavbar({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-5 py-2.5 backdrop-blur">
      <div className="flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500 text-[9px] font-black text-white">
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="truncate text-xs font-bold text-zinc-900">{name}</span>
      </div>
      <nav className="hidden gap-3 text-[10px] font-medium text-zinc-500 sm:flex">
        <span>Home</span>
        <span>About</span>
        <span>Services</span>
        <span>Contact</span>
      </nav>
      <span className="rounded-md bg-amber-500 px-2.5 py-1 text-[10px] font-semibold text-white">Get Started</span>
    </header>
  )
}

function Hero({ c, name }: { c: MockContent; name: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 to-white px-5 pb-6 pt-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-100 blur-2xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-amber-50 blur-2xl" />

      <div className="relative">
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white px-2 py-0.5 text-[9px] font-semibold text-amber-700">
          {c.badge}
        </span>
        <h2 className="mt-2 text-xl font-black leading-tight text-zinc-900">
          {c.headline} <span className="text-amber-600">{c.highlight}</span>
        </h2>
        <p className="mt-1 text-[11px] text-zinc-500">{c.sub}</p>
        <div className="mt-2.5 flex gap-2">
          <span className="rounded-md bg-zinc-900 px-3 py-1.5 text-[10px] font-semibold text-white">{c.cta}</span>
          <span className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-[10px] font-semibold text-zinc-700">
            {c.secondary}
          </span>
        </div>
      </div>

      <div className="relative mt-3 h-36">{<HeroVisual type={c.visual} />}</div>

      <div className="relative mt-3 grid grid-cols-3 gap-2">
        {c.stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-center shadow-sm">
            <div className="text-xs font-extrabold text-amber-600">{s.value}</div>
            <div className="text-[9px] text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Features({ c }: { c: MockContent }) {
  return (
    <section className="px-5 pb-6 pt-4">
      <div className="grid grid-cols-3 gap-2">
        {c.features.map((f, i) => (
          <div
            key={f.title}
            className="rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm animate-demo-float"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <f.icon className="h-4 w-4 text-amber-600" />
            <div className="mt-1.5 text-[10px] font-bold text-zinc-900">{f.title}</div>
            <div className="text-[9px] text-zinc-500">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function MockFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 text-center text-[9px] text-zinc-400">
      © 2026 · Made with Khatri Builds
    </footer>
  )
}

function Gallery({ c }: { c: MockContent }) {
  const tiles = [
    { bg: "from-amber-200 to-amber-400", icon: c.features[0].icon },
    { bg: "from-zinc-200 to-zinc-400", icon: c.features[1].icon },
    { bg: "from-amber-100 to-amber-300", icon: c.features[2].icon },
  ]
  return (
    <section className="px-5 pb-2 pt-2">
      <div className="text-[11px] font-bold text-zinc-900">Highlights</div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {tiles.map((t, i) => (
          <div
            key={i}
            className={`flex h-20 items-center justify-center rounded-xl bg-gradient-to-br ${t.bg} shadow-sm animate-demo-float`}
            style={{ animationDelay: `${i * 0.7}s` }}
          >
            <t.icon className="h-6 w-6 text-white" />
          </div>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="px-5 pb-2 pt-2">
      <div className="text-[11px] font-bold text-zinc-900">What customers say</div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {[
          { text: "Absolutely love it — booking is so easy now!", name: "Riya S." },
          { text: "The website looks premium. Highly recommended.", name: "Aman K." },
        ].map((t, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-2.5 shadow-sm animate-demo-float" style={{ animationDelay: `${i * 0.8}s` }}>
            <div className="flex gap-0.5 text-amber-500">
              {[0, 1, 2, 3, 4].map((s) => (
                <Star key={s} className="h-2.5 w-2.5" fill="currentColor" />
              ))}
            </div>
            <p className="mt-1 text-[9px] leading-relaxed text-zinc-600">“{t.text}”</p>
            <div className="mt-1 text-[9px] font-semibold text-zinc-400">{t.name}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CtaBand({ c }: { c: MockContent }) {
  return (
    <section className="px-5 pb-4 pt-2">
      <div className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-center shadow-md">
        <div className="text-[11px] font-extrabold text-white">{c.cta} today</div>
        <div className="mt-0.5 text-[9px] text-amber-50">No advance to start · Pay when approved</div>
      </div>
    </section>
  )
}

export function SiteMockup({ category, name }: { category: string; name: string }) {
  const c = MOCK[category] ?? MOCK["local-business"]
  return (
    <div className="site-mock-scroll flex h-full flex-col overflow-y-auto bg-white text-left">
      <MockNavbar name={name} />
      <Hero c={c} name={name} />
      <Gallery c={c} />
      <Testimonials />
      <Features c={c} />
      <CtaBand c={c} />
      <MockFooter />
    </div>
  )
}