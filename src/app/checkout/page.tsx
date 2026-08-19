"use client"

import { Suspense, useEffect, useState, type ChangeEvent } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, ShieldCheck, QrCode } from "lucide-react"
import { getDemoById, getPackage, getAddons } from "../../services/firestore"
import type { Demo, Package, Addon } from "../../services/firestore"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { UpiQrModal, UPI_ID } from "@/components/site/upi-qr-modal"

type FormData = {
  packageId: "starter" | "business" | "pro"
  selectedAddons: string[]
  businessName: string
  ownerName: string
  email: string
  phone: string
  whatsapp: string
  businessAddress: string
  businessDescription: string
  likedWebsites: string
  uploadedFiles: Array<{ id: string; name: string; url: string }>
}

const PKG_OPTIONS: Record<FormData["packageId"], { name: string; price: number; features: string[]; includedPages: number }> = {
  starter: { name: "STARTER", price: 7999, features: ["Up to 3 pages", "Responsive design"], includedPages: 3 },
  business: { name: "BUSINESS", price: 14999, features: ["Up to 7 pages", "Contact form"], includedPages: 7 },
  pro: { name: "PRO", price: 29999, features: ["Up to 12 pages", "Advanced animations"], includedPages: 12 },
}

const STEPS = ["Demo", "Package", "Add-ons", "Details", "Review"]

function formatPrice(price: number) {
  return price.toLocaleString("en-IN")
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const demoId = searchParams.get("demoId")
  const prePkg = searchParams.get("package")

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    packageId: (prePkg as FormData["packageId"]) ?? "starter",
    selectedAddons: [],
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    whatsapp: "",
    businessAddress: "",
    businessDescription: "",
    likedWebsites: "",
    uploadedFiles: [],
  })

  const [demo, setDemo] = useState<Demo | null>(null)
  const [addonsList, setAddonsList] = useState<Addon[]>([])
  const [, setPackages] = useState<Package[]>([])
  const [showUpi, setShowUpi] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        if (demoId) {
          const d = await getDemoById(demoId)
          if (!cancelled) setDemo(d)
        }
        const p = await Promise.all<Package>(["starter", "business", "pro"].map((id) => getPackage(id as FormData["packageId"])))
        if (!cancelled) setPackages(p)
        const a = await getAddons()
        if (!cancelled) setAddonsList(a)
      } catch (err) {
        console.warn("Checkout data load failed", err)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [demoId])

  const addonOpts = addonsList.map((a) => ({ id: a.id, name: a.name, price: a.price, desc: a.description }))

  const pPrice = PKG_OPTIONS[formData.packageId]?.price || 0
  const aPrice = addonOpts
    .filter((a) => formData.selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0)
  const sub = pPrice + aPrice
  const tax = Math.round(sub * 0.18)
  const total = sub + tax

  const nextStep = () => setStep((s) => Math.min(s + 1, 5))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const onBizSubmit = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    nextStep()
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, { id: Date.now().toString(), name: files[0].name, url: URL.createObjectURL(files[0]) }],
      }))
    }
  }

  const inputCls =
    "mt-1 flex h-11 w-full rounded-xl border border-zinc-200 bg-card/60 px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition-all focus:border-amber-300 focus:ring-2 focus:ring-ring/30"

  return (
    <main className="flex-1">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 pb-24 pt-28">
        {/* Stepper */}
        <div className="mx-auto mb-10 flex max-w-xl items-center">
          {STEPS.map((label, i) => {
            const num = i + 1
            const active = step === num
            const done = step > num
            return (
              <div key={label} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-all ${
                      done
                        ? "border-amber-400 bg-amber-400 text-zinc-900"
                        : active
                          ? "border-amber-300 bg-amber-50 text-amber-600 ring-glow"
                          : "border-zinc-200 bg-white text-zinc-500"
                    }`}
                  >
                    {done ? <Check className="h-4 w-4" /> : num}
                  </div>
                  <span className={`mt-2 hidden text-xs sm:block ${active ? "text-amber-600" : "text-zinc-500"}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-2 mb-5 h-px flex-1 sm:mb-0 ${done ? "bg-amber-500" : "bg-zinc-100"}`} />
                )}
              </div>
            )
          })}
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-white shadow-card">
          <div className="border-b border-zinc-100 bg-zinc-50 px-8 py-5">
            <h2 className="text-xl font-bold text-zinc-900">Step {step} · {STEPS[step - 1]}</h2>
          </div>

          <div className="p-8">
            {step === 1 && (
              <div>
                {demo ? (
                  <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                    <div className="overflow-hidden rounded-2xl border border-zinc-200">
                      <img src={demo.thumbnail} alt={demo.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-amber-600 inline-block">
                        {demo.category}
                      </div>
                      <h3 className="mt-3 text-2xl font-bold text-zinc-900">{demo.name}</h3>
                      <p className="mt-2 text-zinc-500">{demo.description}</p>
                      <p className="mt-4 text-2xl font-bold text-amber-600">₹{formatPrice(demo.price)}</p>
                      <Button className="mt-6" onClick={nextStep}>
                        Select this design
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-zinc-500">No demo selected.</p>
                    <Button asChild variant="outline" className="mt-6">
                      <Link href="/websites">Browse templates</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 md:grid-cols-3">
                {(Object.entries(PKG_OPTIONS) as Array<[FormData["packageId"], (typeof PKG_OPTIONS)[FormData["packageId"]]]>).map(([key, pkg]) => (
                  <div
                    key={key}
                    onClick={() => setFormData((prev) => ({ ...prev, packageId: key }))}
                    className={`cursor-pointer rounded-2xl border p-6 transition-all ${
                      formData.packageId === key
                        ? "border-amber-300 bg-amber-50 ring-glow"
                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                    }`}
                  >
                    <h4 className="text-lg font-bold text-zinc-900">{pkg.name}</h4>
                    <p className="mt-1 text-2xl font-bold text-amber-600">₹{formatPrice(pkg.price)}</p>
                    <p className="mt-1 text-xs text-zinc-500">Starting price</p>
                    <ul className="mt-4 space-y-2">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-zinc-500">
                          <Check className="h-3.5 w-3.5 text-amber-600" />
                          {f}
                        </li>
                      ))}
                      <li className="flex items-center gap-2 text-sm text-zinc-500">
                        <Check className="h-3.5 w-3.5 text-amber-600" />
                        {pkg.includedPages} pages included
                      </li>
                    </ul>
                  </div>
                ))}
                <div className="md:col-span-3 flex justify-end">
                  <Button onClick={nextStep}>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="space-y-3">
                  {addonOpts.map((a) => {
                    const selected = formData.selectedAddons.includes(a.id)
                    return (
                      <div
                        key={a.id}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            selectedAddons: selected
                              ? prev.selectedAddons.filter((x) => x !== a.id)
                              : [...prev.selectedAddons, a.id],
                          }))
                        }}
                        className={`flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition-all ${
                          selected ? "border-amber-300 bg-amber-50" : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                              selected ? "border-amber-400 bg-amber-400 text-zinc-900" : "border-zinc-300"
                            }`}
                          >
                            {selected && <Check className="h-4 w-4" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-zinc-900">{a.name}</h4>
                            <p className="text-xs text-zinc-500">{a.desc}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-amber-600">+₹{formatPrice(a.price)}</span>
                      </div>
                    )
                  })}
                </div>
                {addonOpts.length === 0 && (
                  <p className="text-center text-zinc-500 py-8">No add-ons available yet — skip ahead.</p>
                )}
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={nextStep}>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["businessName", "Business name"],
                      ["ownerName", "Owner name"],
                      ["email", "Email"],
                      ["phone", "Phone"],
                      ["whatsapp", "WhatsApp"],
                      ["businessAddress", "Business address"],
                    ] as Array<[keyof FormData, string]>
                  ).map(([key, label]) => (
                    <div key={key}>
                      <label className="text-sm font-medium text-zinc-700">{label}</label>
                      <input
                        type="text"
                        className={inputCls}
                        value={String(formData[key] ?? "")}
                        onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={() => onBizSubmit({})}>
                    Continue to Review
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-zinc-900">What does your business do?</h3>
                    <textarea
                      className={`${inputCls} min-h-[100px]`}
                      placeholder="e.g. We run a family restaurant in Jaipur and want to accept table reservations..."
                      value={formData.businessDescription}
                      onChange={(e) => setFormData((prev) => ({ ...prev, businessDescription: e.target.value }))}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">Websites you like (URLs)</h3>
                    <input
                      type="text"
                      className={inputCls}
                      placeholder="https://..."
                      value={formData.likedWebsites}
                      onChange={(e) => setFormData((prev) => ({ ...prev, likedWebsites: e.target.value }))}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">Upload assets (logo, photos)</h3>
                    <input type="file" onChange={onFileChange} className="mt-2 text-sm text-zinc-500 file:mr-3 file:rounded-full file:border-0 file:bg-amber-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-amber-600" />
                    {formData.uploadedFiles.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {formData.uploadedFiles.map((f) => (
                          <li key={f.id} className="text-sm text-zinc-500">· {f.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                  </div>
                </div>

                <div className="h-fit rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50 to-transparent p-6">
                  <h3 className="text-lg font-bold text-zinc-900">Order summary</h3>
                  <dl className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between text-zinc-500">
                      <dt>Design</dt>
                      <dd className="text-zinc-900">₹{formatPrice(demo?.price ?? 0)}</dd>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <dt>Package ({PKG_OPTIONS[formData.packageId].name})</dt>
                      <dd className="text-zinc-900">₹{formatPrice(pPrice)}</dd>
                    </div>
                    {formData.selectedAddons.length > 0 && (
                      <div className="flex justify-between text-zinc-500">
                        <dt>Add-ons</dt>
                        <dd className="text-zinc-900">₹{formatPrice(aPrice)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-500">
                      <dt>Tax (18%)</dt>
                      <dd className="text-zinc-900">₹{formatPrice(tax)}</dd>
                    </div>
                    <div className="border-t border-zinc-200 pt-3">
                      <div className="flex justify-between text-base font-bold">
                        <dt className="text-zinc-900">Total</dt>
                        <dd className="text-amber-600">₹{formatPrice(total)}</dd>
                      </div>
                    </div>
                  </dl>
                  <Button className="mt-6 w-full" size="lg" onClick={() => setShowUpi(true)}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Pay ₹{formatPrice(total)} via UPI
                  </Button>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                    Scan QR · Pay with any UPI app · {UPI_ID}
                  </p>
                  <p className="mt-1 text-center text-[11px] text-zinc-500">
                    No advance to start — pay only when the design is approved.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <UpiQrModal
        key={showUpi ? "open" : "closed"}
        open={showUpi}
        onClose={() => setShowUpi(false)}
        amount={total}
        demo={demo}
        addonPrices={addonOpts.filter((a) => formData.selectedAddons.includes(a.id)).map((a) => a.price)}
        subtotal={sub}
        tax={tax}
        formData={formData}
      />

      <Footer />
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="pt-28 text-center text-zinc-500">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
