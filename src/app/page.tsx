"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  Palette,
  ClipboardList,
  Rocket,
  Star,
  Quote,
  Utensils,
  Coffee,
  Dumbbell,
  Scissors,
  Stethoscope,
  Building2,
  Hotel,
  Briefcase,
  Cloud,
  ShoppingBag,
  GraduationCap,
  Camera,
  Store,
  Check,
} from "lucide-react"
import { getDemos } from "@/services/firestore"
import type { Demo } from "@/services/firestore"
import { demos as seedDemos, demoCategories as seedCategories } from "@/seed/demos"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"

const categoryIcons: Record<string, typeof Utensils> = {
  restaurant: Utensils,
  cafe: Coffee,
  gym: Dumbbell,
  salon: Scissors,
  clinic: Stethoscope,
  "real-estate": Building2,
  hotel: Hotel,
  portfolio: Palette,
  agency: Briefcase,
  saas: Cloud,
  ecommerce: ShoppingBag,
  education: GraduationCap,
  photography: Camera,
  "local-business": Store,
}

const packages = [
  {
    id: "starter",
    name: "Starter",
    price: "₹7,999",
    tagline: "For getting online fast",
    features: ["Up to 3 pages", "Responsive design", "Mobile-friendly", "Contact form", "5-day delivery"],
    popular: false,
  },
  {
    id: "business",
    name: "Business",
    price: "₹14,999",
    tagline: "For growing businesses",
    features: ["Up to 7 pages", "Everything in Starter", "Blog / services section", "Google Maps + WhatsApp", "3-day delivery"],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹29,999",
    tagline: "For serious brands",
    features: ["Up to 12 pages", "Everything in Business", "Advanced animations", "Online booking / payments", "Priority 2-day delivery"],
    popular: false,
  },
]

const testimonials = [
  {
    quote: "Got my restaurant website live in 4 days. No calls, no back-and-forth — just picked a design, paid, and it was done.",
    name: "Arjun Mehta",
    role: "Restaurant owner, Mumbai",
  },
  {
    quote: "The best part is knowing the exact price upfront. My gym website looks better than what agencies quoted 5x more for.",
    name: "Priya Sharma",
    role: "Gym founder, Delhi",
  },
  {
    quote: "They handled the logo, the pages, everything. I just answered one simple form. Highly recommended.",
    name: "Rahul Verma",
    role: "Clinic director, Bangalore",
  },
]

function formatPrice(price: number) {
  return price.toLocaleString("en-IN")
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [demos, setDemos] = useState<Demo[]>(seedDemos)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getDemos()
        if (!cancelled && data && data.length > 0) {
          setDemos(data)
        }
      } catch {
        // seed data already loaded
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    router.push(`/websites?search=${encodeURIComponent(searchQuery)}`)
  }

  const featured = demos.filter((d) => d.featured).slice(0, 8)
  const filteredDemos = selectedCategory
    ? demos.filter((d) => d.category === selectedCategory)
    : demos.slice(0, 8)

  const heroDemo = demos.find((d) => d.featured) ?? demos[0]

  return (
    <main className="flex-1">
      <Navbar />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden pb-20 pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-orange-600/10 blur-[100px]" />
          <div className="absolute -left-40 top-80 h-96 w-96 rounded-full bg-amber-400/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in-up mx-auto inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-xs font-medium text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              Productized websites · Fixed pricing · Fast delivery
            </div>

            <h1 className="animate-fade-in-up mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
              Your business online,
              <br />
              <span className="text-gradient-amber">without endless meetings.</span>
            </h1>

            <p className="animate-fade-in-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Choose a professionally designed template, customize your package, submit your
              requirements — and we build it. No calls. No quotes. No surprises.
            </p>

            <form
              onSubmit={handleSearch}
              className="animate-fade-in-up mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-2xl glass p-2 shadow-card"
            >
              <Search className="ml-3 h-5 w-5 shrink-0 text-zinc-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates — gym, salon, restaurant..."
                className="h-11 w-full bg-transparent px-2 text-sm text-white outline-none placeholder:text-zinc-500"
              />
              <Button type="submit" size="lg" className="shrink-0">
                Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="animate-fade-in-up mx-auto mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {[
                { value: "250+", label: "websites shipped" },
                { value: "4.9/5", label: "average rating" },
                { value: "3 days", label: "avg. turnaround" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="mt-1 text-xs text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Browser mockup */}
          <div className="animate-fade-in-up relative mx-auto mt-16 max-w-4xl" style={{ animationDelay: "0.15s" }}>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101014] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-2 border-b border-white/5 bg-[#141419] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-green-500/70" />
                <div className="mx-auto flex h-7 w-full max-w-sm items-center justify-center rounded-lg bg-white/5 text-[11px] text-zinc-500">
                  webforge.app/preview/{heroDemo?.slug ?? "premium-gym"}
                </div>
              </div>
              <img
                src={heroDemo?.thumbnail ?? "/demos/gym-premium.svg"}
                alt={heroDemo?.name ?? "Website preview"}
                className="h-[420px] w-full object-cover md:h-[520px]"
              />
            </div>

            <div className="animate-float absolute -left-4 top-24 hidden rounded-2xl border border-white/10 bg-[#131318]/90 px-5 py-4 shadow-card backdrop-blur lg:block">
              <div className="text-xs text-zinc-500">Starting at</div>
              <div className="mt-1 text-2xl font-bold text-white">
                ₹{formatPrice(heroDemo?.price ?? 7999)}
              </div>
              <div className="mt-1 text-xs text-emerald-400">Included + tax</div>
            </div>

            <div className="animate-float absolute -right-6 bottom-16 hidden rounded-2xl border border-white/10 bg-[#131318]/90 px-5 py-4 shadow-card backdrop-blur lg:block" style={{ animationDelay: "1.5s" }}>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/15 text-amber-400">
                  <Zap className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">Delivery in 5 days</div>
                  <div className="text-xs text-zinc-500">Design + content included</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="border-y border-white/5 bg-[#0b0b0e] py-6">
        <div className="mask-fade-x overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-10">
            {[...seedCategories, ...seedCategories].map((c, i) => (
              <span key={`${c.id}-${i}`} className="flex items-center gap-10 text-sm font-medium text-zinc-500">
                {c.name}
                <span className="h-1 w-1 rounded-full bg-amber-500/50" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED WEBSITES ============ */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-amber-400">Templates</div>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Designs that close your customers
              </h2>
              <p className="mt-4 max-w-xl text-zinc-400">
                Every template is built to convert — clear calls-to-action, fast loading, and
                mobile-first layouts. Pick one and we customise it for your business.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/websites">
                View all templates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                selectedCategory === null
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                  : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
              }`}
            >
              All
            </button>
            {seedCategories.slice(0, 6).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(selectedCategory === c.id ? null : c.id)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  selectedCategory === c.id
                    ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                    : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(selectedCategory ? filteredDemos : featured).map((demo) => (
              <Link
                key={demo.id}
                href={`/websites/${demo.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/5 bg-[#101014] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30 hover:shadow-[0_20px_60px_-20px_rgba(245,158,11,0.25)]"
              >
                <div className="relative aspect-[8/5] overflow-hidden">
                  <img
                    src={demo.thumbnail}
                    alt={demo.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    {demo.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white">{demo.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{demo.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-400">₹{formatPrice(demo.price)}</span>
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-300 opacity-0 transition-opacity group-hover:opacity-100">
                      Customise
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="relative border-y border-white/5 bg-[#0b0b0e] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-400">Process</div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
              From template to live website in 5 days
            </h2>
            <p className="mt-4 text-zinc-400">
              A dead-simple process. You do the easy parts, we do the heavy lifting.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-4">
            {[
              {
                icon: Palette,
                step: "01",
                title: "Pick a design",
                desc: "Browse templates and choose the one that fits your business.",
              },
              {
                icon: Zap,
                step: "02",
                title: "Customise your package",
                desc: "Pick a plan and add-ons — pages, booking, payments, blog.",
              },
              {
                icon: ClipboardList,
                step: "03",
                title: "Fill one simple form",
                desc: "Tell us about your business, upload your logo and photos.",
              },
              {
                icon: Rocket,
                step: "04",
                title: "We build & launch",
                desc: "Pay securely online and get your finished website in days.",
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className="group relative rounded-2xl border border-white/5 bg-[#101014] p-7 transition-all duration-300 hover:border-amber-400/25"
              >
                <div className="text-xs font-semibold text-zinc-600">Step {s.step}</div>
                <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 transition-colors group-hover:bg-amber-400 group-hover:text-[#0b0b0b]">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{s.desc}</p>
                {i < 3 && (
                  <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-gradient-to-r from-amber-400/40 to-transparent md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INDUSTRIES ============ */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-400">Industries</div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Built for your kind of business
            </h2>
            <p className="mt-4 text-zinc-400">
              From restaurants to SaaS — templates designed for your industry&apos;s customers.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {seedCategories.map((c) => {
              const Icon = categoryIcons[c.id] ?? Store
              const count = demos.filter((d) => d.category === c.id).length
              return (
                <Link
                  key={c.id}
                  href={`/websites?category=${c.id}`}
                  className="group rounded-2xl border border-white/5 bg-[#101014] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/30"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition-colors group-hover:bg-amber-400/15 group-hover:text-amber-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{c.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{count} template{count === 1 ? "" : "s"}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="packages" className="relative border-y border-white/5 bg-[#0b0b0e] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-400">Pricing</div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
              One price. Nothing hidden.
            </h2>
            <p className="mt-4 text-zinc-400">
              Every package includes the template, customisation, and your content. Pay online via
              UPI QR — securely, once, and done.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {packages.map((p) => (
              <div
                key={p.id}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${
                  p.popular
                    ? "border-amber-400/40 bg-[#131318] shadow-[0_0_60px_-20px_rgba(245,158,11,0.4)]"
                    : "border-white/5 bg-[#101014] hover:border-white/15"
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-gradient px-4 py-1 text-xs font-bold text-[#0b0b0b]">
                    Most popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white">{p.name}</h3>
                <p className="mt-1 text-sm text-zinc-500">{p.tagline}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{p.price}</span>
                  <span className="text-sm text-zinc-500">one-time</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-8 w-full" variant={p.popular ? "default" : "outline"}>
                  <Link href={`/checkout?package=${p.id}`}>
                    {p.popular ? "Get started" : "Choose plan"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" /> Scan &amp; pay via UPI
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-400" /> Domain & hosting setup included
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-400" /> Free revisions for 30 days
            </span>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-400">Reviews</div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Businesses love their new websites
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-white/5 bg-[#101014] p-7"
              >
                <Quote className="h-6 w-6 text-amber-400/60" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-300">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/15 text-sm font-bold text-amber-300">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-zinc-500">{t.role}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/15 via-[#131318] to-[#101014] px-8 py-16 text-center md:px-16">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-500/15 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-orange-600/15 blur-[90px]" />
            <h2 className="relative text-4xl font-bold tracking-tight text-white md:text-5xl">
              Ready to get online?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-zinc-400">
              Browse templates, customise your package, and go live within days. No meetings, no
              quotes, no nonsense.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/websites">
                  Browse templates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/#how-it-works">How it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
