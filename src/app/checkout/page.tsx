"use client"

import { Suspense, useEffect, useState } from "react"
import { getDemoById, getPackage, getAddons } from "../../services/firestore"
import { useRouter, useSearchParams } from "next/navigation"
import type { Demo, Package, Addon } from "../../services/firestore"
import { Button } from "@/components/ui/button"

type FormData = {
  packageId: "starter" | "business" | "pro"
  selectedAddons: string[]
  businessName: string
  ownerName: string
  email: string
  phone: string
  whatsapp: string
  businessAddress: string
  instagram: string
  facebook: string
  googleBusinessProfile: string
  businessDescription: string
  businessModel: string
  neededPages: string[]
  colorPreference: string
  hasLogo: boolean
  hasExistingWebsite: boolean
  likedWebsites: string
  specialFunctionality: string
  preferredDeliveryDate: string
  uploadedFiles: Array<{ id: string; name: string; url: string }>
}

const PKG_OPTIONS: Record<FormData["packageId"], { name: string; price: number; features: string[]; includedPages: number }> = {
  starter: { name: "STARTER", price: 7999, features: ["Up to 3 pages", "Responsive design"], includedPages: 3 },
  business: { name: "BUSINESS", price: 14999, features: ["Up to 7 pages", "Contact form"], includedPages: 7 },
  pro: { name: "PRO", price: 29999, features: ["Up to 12 pages", "Advanced animations"], includedPages: 12 },
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const demoId = searchParams.get("demoId")

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    packageId: "starter",
    selectedAddons: [],
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    whatsapp: "",
    businessAddress: "",
    instagram: "",
    facebook: "",
    googleBusinessProfile: "",
    businessDescription: "",
    businessModel: "",
    neededPages: [],
    colorPreference: "",
    hasLogo: false,
    hasExistingWebsite: false,
    likedWebsites: "",
    specialFunctionality: "",
    preferredDeliveryDate: "",
    uploadedFiles: [],
  })

  const [demo, setDemo] = useState<Demo | null>(null)
  const [addonsList, setAddonsList] = useState<Addon[]>([])
  const [, setPackages] = useState<Package[]>([])

  useEffect(() => {
    async function load() {
      if (demoId) {
        const d = await getDemoById(demoId)
        setDemo(d)
      }
      const p = await Promise.all<Package>(["starter", "business", "pro"].map((id) => getPackage(id as "starter" | "business" | "pro")))
      setPackages(p)
      const a = await getAddons()
      setAddonsList(a)
    }
    load().catch((err) => console.warn("Checkout data load failed", err))
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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, { id: Date.now().toString(), name: files[0].name, url: URL.createObjectURL(files[0]) }],
      }))
    }
  }

  return (
    <main className="flex-1">
      <header className="border-b bg-background/80 backdrop-blur-sm fixed w-full top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 19l-7-7-7 7"></path></svg>
            <h2 className="font-semibold">Checkout</h2>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded-full bg-zinc-300 flex items-center justify-center text-sm font-medium">{step}</div>
            <span className="mx-1">/</span>
            <div className="w-6 h-6 rounded-full bg-zinc-300 flex items-center justify-center text-sm font-medium">5</div>
          </div>
        </div>
      </header>

      <div className="p-6 pt-20">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select a Demo</h2>
            {demo ? (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <img src={demo.thumbnail} alt={demo.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                <h3 className="text-xl font-bold">{demo.name}</h3>
                <p className="text-zinc-600">{demo.description}</p>
                <p className="text-accent font-medium">₹{demo.price}</p>
                <Button className="w-full py-3 mt-4" onClick={nextStep}>
                  Select Package
                </Button>
              </div>
            ) : (
              <p className="text-zinc-500">No demo selected. Go back and pick a website first.</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select Package</h2>
            <div className="grid grid-cols-1 gap-6">
              {(Object.entries(PKG_OPTIONS) as Array<[FormData["packageId"], typeof PKG_OPTIONS[FormData["packageId"]]]>).map(([key, pkg]) => (
                <div
                  key={key}
                  className={`rounded-2xl p-6 border cursor-pointer ${formData.packageId === key ? "border-primary bg-primary/5" : "border-border hover:border-primary"}`}
                  onClick={() => setFormData((prev) => ({ ...prev, packageId: key }))}
                >
                  <h4 className="text-xl font-bold">{pkg.name}</h4>
                  <p className="text-zinc-600">₹{pkg.price}</p>
                  <p className="text-sm text-zinc-500">Starting price</p>
                  {pkg.features.map((f) => (
                    <div key={f} className="flex items-start">
                      <svg className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span className="ml-2 text-sm">{f}</span>
                    </div>
                  ))}
                  <div className="mt-3 pt-2 text-sm text-zinc-500">
                    <span>Included pages:</span> {pkg.includedPages}
                  </div>
                  <Button
                    className="w-full py-3 mt-4 font-medium"
                    onClick={(e) => {
                      e.stopPropagation()
                      nextStep()
                    }}
                  >
                    {formData.packageId === key ? "Selected - Continue" : "Select Package"}
                  </Button>
                </div>
              ))}
            </div>
            {!demo && <p className="text-zinc-500 mt-4">Select a demo first</p>}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select Add-ons</h2>
            <div className="space-y-4">
              {addonOpts.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 rounded-xl border cursor-pointer ${formData.selectedAddons.includes(a.id) ? "border-primary" : "border-border"}`}
                  onClick={() => {
                    const isSel = formData.selectedAddons.includes(a.id)
                    setFormData((prev) => ({
                      ...prev,
                      selectedAddons: isSel ? prev.selectedAddons.filter((x) => x !== a.id) : [...prev.selectedAddons, a.id],
                    }))
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{a.name}</h4>
                      <p className="text-xs text-zinc-500">{a.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-accent font-medium">₹{a.price}</span>
                      <svg className="h-4 w-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  </div>
                  <p className="text-xs mt-2 text-zinc-500">Add ₹{a.price} to total</p>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-zinc-500">Package:</span> ₹{pPrice}</div>
                  <div><span className="text-zinc-500">Add-ons:</span> ₹{aPrice}</div>
                </div>
                <div className="mt-2 font-medium">
                  <span>Subtotal:</span> ₹{sub}
                </div>
                <Button className="w-full mt-4" onClick={nextStep}>
                  Continue to Business Info
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Business Information</h2>
            <p className="text-zinc-500 mb-4">Required for order processing</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type="text"
                    className="mt-1 flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm"
                    value={String(formData[key] ?? "")}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={() => onBizSubmit({})}>Continue to Requirements</Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-zinc-500">Demo</p>
                  <p className="font-medium">{demo?.name || "Not selected"}</p>
                  <p className="text-accent">₹{demo?.price || 0}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Package</p>
                  <p className="font-medium">{PKG_OPTIONS[formData.packageId]?.name || "Not selected"}</p>
                  <p className="text-accent">₹{pPrice}</p>
                </div>
              </div>
              {formData.selectedAddons.length > 0 && (
                <div>
                  <p className="text-zinc-500">Add-ons</p>
                  <p className="text-accent">₹{aPrice}</p>
                </div>
              )}
              <div>
                <p className="text-zinc-500">Subtotal</p>
                <p className="font-medium text-accent">₹{sub}</p>
              </div>
              <div>
                <p className="text-zinc-500">Tax (18%)</p>
                <p className="font-medium">₹{tax}</p>
              </div>
              <div>
                <p className="text-accent font-medium text-lg">Total: ₹{total}</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3">Requirements</h3>
            <p className="text-zinc-500 mb-2">What does your business do?</p>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-border px-3 py-2 text-sm mb-4"
              value={formData.businessDescription}
              onChange={(e) => setFormData((prev) => ({ ...prev, businessDescription: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-2 mb-4">
              <p className="text-sm">Have a logo?</p>
              <p className="text-sm">Have existing website?</p>
            </div>
            <p className="text-zinc-500 mb-2">Websites you like (URLs):</p>
            <input
              type="text"
              className="flex h-10 w-full rounded-md border border-border px-3 py-2 text-sm mb-4"
              value={formData.likedWebsites}
              onChange={(e) => setFormData((prev) => ({ ...prev, likedWebsites: e.target.value }))}
            />
            <div className="mb-4">
              <label className="text-sm font-medium">Upload assets (logo, photos)</label>
              <input type="file" onChange={onFileChange} className="mt-1" />
              {formData.uploadedFiles.length > 0 && (
                <ul className="mt-2 text-sm text-zinc-600">
                  {formData.uploadedFiles.map((f) => (
                    <li key={f.id}>{f.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={prevStep}>Back</Button>
              <Button onClick={() => router.push("/")}>Pay Now</Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-6 pt-20">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}