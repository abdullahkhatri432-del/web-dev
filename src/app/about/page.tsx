import Link from "next/link"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Palette, ClipboardList, Rocket, ShieldCheck, Zap, Heart } from "lucide-react"

const stats = [
  { value: "250+", label: "websites shipped" },
  { value: "4.9/5", label: "average rating" },
  { value: "3 days", label: "avg. turnaround" },
  { value: "14", label: "industries served" },
]

const values = [
  {
    icon: Zap,
    title: "Speed over meetings",
    desc: "We productized web development so you skip the calls, quotes and endless revisions.",
  },
  {
    icon: ShieldCheck,
    title: "One fixed price",
    desc: "Every package has a clear, upfront price. No hidden charges, no surprise invoices.",
  },
  {
    icon: Heart,
    title: "Built for small businesses",
    desc: "Restaurants, salons, clinics and local brands deserve great websites too — at prices they can afford.",
  },
  {
    icon: Rocket,
    title: "Live in days, not months",
    desc: "Pick a design, tell us about your business, and we handle everything else.",
  },
]

const process = [
  { icon: Palette, step: "01", title: "Pick a design", desc: "Browse ready-made templates built to convert." },
  { icon: ClipboardList, step: "02", title: "Customise", desc: "Choose a package and add-ons for your needs." },
  { icon: Rocket, step: "03", title: "We build", desc: "Share your details once — we do the heavy lifting." },
  { icon: ShieldCheck, step: "04", title: "You go live", desc: "Pay securely via UPI and launch in days." },
]

export default function AboutPage() {
  return (
    <main className="flex-1">
      <Navbar />

      <section className="relative overflow-hidden pb-16 pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-amber-100 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-600">About WebForge</div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 md:text-6xl">
            Your business online, <span className="text-gradient-amber">without endless meetings.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">
            WebForge is a productized web-development service. Instead of quoting, waiting, and
            going back-and-forth, you choose a professionally designed template, pick a package,
            and we build your website — fast, at a fixed price.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/websites">
              Browse templates
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-zinc-100 bg-zinc-50 py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-zinc-900">{s.value}</div>
              <div className="mt-1 text-sm text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-600">Why WebForge</div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">What we believe</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-zinc-100 bg-white p-8 transition-colors hover:border-amber-200"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-100 bg-zinc-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-600">Process</div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">How it works</h2>
            <p className="mt-4 text-zinc-500">From template to live website in as little as 3 days.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {process.map((s) => (
              <div key={s.step} className="rounded-2xl border border-zinc-100 bg-white p-7">
                <div className="text-xs font-semibold text-zinc-500">Step {s.step}</div>
                <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-600">The team</div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">Built by people who ship</h2>
            <p className="mt-4 text-zinc-500">
              We&apos;re a small team of designers and developers who got tired of the slow, expensive
              way agencies work. So we made our own.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500">
            <span className="rounded-full border border-zinc-200 bg-white px-4 py-2">Design</span>
            <span className="rounded-full border border-zinc-200 bg-white px-4 py-2">Development</span>
            <span className="rounded-full border border-zinc-200 bg-white px-4 py-2">SEO</span>
            <span className="rounded-full border border-zinc-200 bg-white px-4 py-2">Content</span>
            <span className="rounded-full border border-zinc-200 bg-white px-4 py-2">Support</span>
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/contact">
                Talk to us
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
