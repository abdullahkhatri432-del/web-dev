import Link from "next/link"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const sections = [
  {
    title: "1. Services",
    body: [
      "WebForge provides productized website design and development services. When you place an order, you are purchasing a website package (Starter, Business or Pro), optional add-ons, and the customisation of a selected template for your business.",
    ],
  },
  {
    title: "2. Ordering & payment",
    body: [
      "Orders are placed through the checkout flow and paid via UPI QR. A confirmed order is one where payment has been received and verified. You'll receive confirmation on WhatsApp or email.",
      "Prices shown are inclusive of the stated package features. Tax (18% GST) is shown at checkout before payment.",
    ],
  },
  {
    title: "3. Our responsibilities",
    body: [
      "We will build your website based on the details you provide in the order form. We commit to delivering within the timeframe stated on your order, and to provide free revisions for 30 days after launch.",
    ],
  },
  {
    title: "4. Your responsibilities",
    body: [
      "You agree to provide accurate business information, logos and photos within a reasonable time after ordering. Delays in providing these may extend the delivery timeline.",
      "You are responsible for the accuracy of content you provide. We are not liable for errors in content supplied by you.",
    ],
  },
  {
    title: "5. Revisions",
    body: [
      "Each package includes free revisions for 30 days from the date your website goes live. Revision requests should be specific and reasonable. Larger structural changes may be quoted separately.",
    ],
  },
  {
    title: "6. Intellectual property",
    body: [
      "Upon full payment, you own the final delivered website and its content. We retain ownership of the template framework, and we may display your website in our portfolio (unless you request otherwise).",
    ],
  },
  {
    title: "7. Refunds",
    body: [
      "Refunds are handled as described in our refund policy. In short: a full refund is available within 48 hours of payment if we have not started work. Once work begins, refunds are not available but work will continue to completion.",
    ],
  },
  {
    title: "8. Third-party services",
    body: [
      "Your website may rely on third-party services such as domain registrars, hosting providers, Google services and payment apps. We are not responsible for outages or changes to these services.",
    ],
  },
  {
    title: "9. Liability",
    body: [
      "Our total liability for any claim related to your order is limited to the amount you paid for the order. We are not liable for indirect or consequential damages.",
    ],
  },
  {
    title: "10. Contact",
    body: [
      "For any questions about these terms, contact us at hello@webforge.in or via WhatsApp at +91 81605 87811.",
    ],
  },
]

export default function TermsPage() {
  return (
    <main className="flex-1">
      <Navbar />

      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-amber-400">Legal</div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">Terms of service</h1>
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
            <p className="text-sm text-zinc-300">Questions about these terms?</p>
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
