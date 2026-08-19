import Link from "next/link"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const sections = [
  {
    title: "1. Information we collect",
    body: [
      "We collect the information you provide when placing an order or contacting us: your name, email address, phone number, business name and address, business description, and any files you upload (such as logos and photos).",
      "When you sign in with Google, we receive your Google account name and email address.",
    ],
  },
  {
    title: "2. How we use your information",
    body: [
      "Your information is used to build your website, communicate with you about your order, send you updates and invoices, and provide customer support.",
      "We do not sell or rent your personal information to any third party.",
    ],
  },
  {
    title: "3. Payment data",
    body: [
      "Payments are made via UPI QR. We record the order amount and status but we do not store your bank account details, UPI PIN, or any payment credentials. Payment processing happens entirely within your UPI app.",
    ],
  },
  {
    title: "4. Content you upload",
    body: [
      "Files you upload (logos, photos, business text) are used solely to build your website. You retain ownership of your content. After project completion we keep a copy for support purposes unless you request deletion.",
    ],
  },
  {
    title: "5. Cookies & analytics",
    body: [
      "Our website may use basic cookies and analytics to understand how visitors use the site. This data is aggregated and does not identify you personally.",
    ],
  },
  {
    title: "6. Data storage & security",
    body: [
      "Your data is stored securely in Google Firebase (Firestore and Cloud Storage). We follow industry-standard practices to protect your data, but no method of transmission over the internet is 100% secure.",
    ],
  },
  {
    title: "7. Your rights",
    body: [
      "You can request a copy of your data, ask us to correct inaccurate data, or request deletion of your data by contacting us. We will respond within a reasonable time.",
    ],
  },
  {
    title: "8. Contact us",
    body: [
      "For any privacy questions, contact us at hello@webforge.in or via WhatsApp at +91 81605 87811.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <Navbar />

      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-400">Legal</div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">Privacy policy</h1>
          <p className="mt-3 text-sm text-zinc-500">Last updated: August 2026</p>

          <div className="mt-10 space-y-8">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-xl font-semibold text-white">{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-transparent p-6">
            <p className="text-sm text-zinc-300">Have questions about how we handle your data?</p>
            <Button asChild variant="outline" size="sm">
              <Link href="/contact">
                Contact us
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
