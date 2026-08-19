import Link from "next/link"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck } from "lucide-react"

const cases = [
  {
    title: "48-hour full refund",
    body: "If you change your mind within 48 hours of payment and we have not yet started building your website, you can request a full refund of the amount paid. The refund is processed within 5–7 business days to your UPI / bank account.",
  },
  {
    title: "No refund once work starts",
    body: "Because our work is custom and time-intensive, once we begin building your website, the order is non-refundable. However, we guarantee to complete your website as described, including free revisions for 30 days after launch. If we ever fail to deliver, you'll get a full refund.",
  },
  {
    title: "Duplicate or erroneous payment",
    body: "If you accidentally pay twice or enter the wrong amount, contact us within 48 hours with the transaction details and we'll refund the excess amount.",
  },
  {
    title: "How to request a refund",
    body: "Email hello@webforge.in or message us on WhatsApp at +91 81605 87811 with your order details (name, email, order reference and the UPI transaction ID). We'll verify and process eligible refunds within 5–7 business days.",
  },
]

export default function RefundsPage() {
  return (
    <main className="flex-1">
      <Navbar />

      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-amber-100 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-600">Legal</div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">Refund policy</h1>
          <p className="mt-3 text-sm text-zinc-500">Last updated: August 2026</p>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <p className="text-sm leading-relaxed text-zinc-700">
              We want you to feel completely safe paying for your website. That&apos;s why we offer a
              48-hour full-refund window, and a 100% money-back guarantee if we ever fail to
              deliver your website as promised.
            </p>
          </div>

          <div className="mt-10 space-y-8">
            {cases.map((c) => (
              <div key={c.title}>
                <h2 className="text-xl font-semibold text-zinc-900">{c.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">{c.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-transparent p-6">
            <p className="text-sm text-zinc-700">Need to request a refund or have questions?</p>
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
