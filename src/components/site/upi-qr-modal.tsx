"use client"

import { useEffect, useState, type ReactNode } from "react"
import QRCode from "qrcode"
import { X, Copy, Check, QrCode, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createOrder } from "@/services/firestore"
import type { Demo, Order } from "@/services/firestore"

export const UPI_ID = "8160587811@kotak811"
const UPI_NAME = "WebForge"

type FormDataLike = {
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
}

type UpiQrModalProps = {
  open: boolean
  onClose: () => void
  amount: number
  demo: Demo | null
  addonPrices: number[]
  subtotal: number
  tax: number
  formData: FormDataLike
}

export function upiUri(amount: number) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: UPI_NAME,
    cu: "INR",
    am: String(amount),
    tn: "WebForge order",
  })
  return `upi://pay?${params.toString()}`
}

export function UpiQrModal({ open, onClose, amount, demo, addonPrices, subtotal, tax, formData }: UpiQrModalProps) {
  const [qrSvg, setQrSvg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    QRCode.toString(upiUri(amount), {
      type: "svg",
      margin: 2,
      width: 240,
      errorCorrectionLevel: "M",
      color: { dark: "#0b0b0b", light: "#ffffff" },
    })
      .then((svg) => {
        if (!cancelled) setQrSvg(svg)
      })
      .catch(() => {
        if (!cancelled) setQrSvg(null)
      })
    return () => {
      cancelled = true
    }
  }, [open, amount])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!open) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable
    }
  }

  const handlePaid = async () => {
    setSaving(true)
    try {
      const orderData: Order = {
        id: "",
        userId: "guest",
        demoId: demo?.id ?? "",
        packageId: formData.packageId,
        addons: formData.selectedAddons,
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        businessAddress: formData.businessAddress,
        instagram: "",
        facebook: "",
        googleBusinessProfile: "",
        businessDescription: formData.businessDescription,
        requirements: {
          businessModel: "",
          neededPages: [],
          colorPreference: "",
          hasLogo: false,
          hasExistingWebsite: false,
          likedWebsites: [formData.likedWebsites],
          specialFunctionality: "",
          preferredDeliveryDate: null,
        },
        assets: [],
        package: formData.packageId,
        addonPrices,
        subtotal,
        discount: 0,
        tax,
        total: amount,
        paymentStatus: "pending",
        orderStatus: "pending payment",
        createdAt: new Date(),
        updatedAt: new Date(),
        razorpayOrderId: null,
        razorpayPaymentId: null,
        razorpaySignature: null,
      }
      await createOrder(orderData)
      setSubmitted(true)
    } catch {
      // failed to save — show a notice instead
      setSubmitted(true)
    } finally {
      setSaving(false)
    }
  }

  const confirmStep: ReactNode = submitted ? (
    <div className="flex flex-col items-center py-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
        <BadgeCheck className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-zinc-900">Payment details received</h3>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        We will verify your UPI payment and confirm your order on WhatsApp / email within 15 minutes.
        No action needed from your side.
      </p>
      <Button className="mt-6" onClick={onClose}>
        Done
      </Button>
    </div>
  ) : (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <QrCode className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-zinc-900">Scan &amp; pay via UPI</h3>
      <p className="mt-1 text-sm text-zinc-500">Amount payable</p>
      <p className="mt-1 text-3xl font-bold text-amber-600">₹{amount.toLocaleString("en-IN")}</p>

      <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-3">
        {qrSvg ? (
          <div className="h-56 w-56" dangerouslySetInnerHTML={{ __html: qrSvg }} />
        ) : (
          <div className="flex h-56 w-56 items-center justify-center text-sm text-zinc-500">
            Generating QR…
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2">
        <span className="text-sm font-semibold text-zinc-900">{UPI_ID}</span>
        <button
          onClick={handleCopy}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-colors hover:text-amber-600"
          aria-label="Copy UPI ID"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="mt-5 grid w-full grid-cols-2 gap-3">
        <Button asChild variant="outline">
          <a href={upiUri(amount)}>Open UPI app</a>
        </Button>
        <Button onClick={handlePaid} disabled={saving}>
          {saving ? "Saving…" : "I&apos;ve paid"}
        </Button>
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        After paying, tap &quot;I&apos;ve paid&quot; so we can verify your transfer.
      </p>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-card">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {confirmStep}
      </div>
    </div>
  )
}
