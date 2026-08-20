"use client"

import { useEffect, useState, type ReactNode } from "react"
import QRCode from "qrcode"
import { X, Copy, Check, QrCode, BadgeCheck, ShieldCheck, Lock, ArrowRight, ReceiptText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createOrder } from "@/services/firestore"
import type { Demo, Order } from "@/services/firestore"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

export const UPI_ID = "8160587811@kotak811"
const UPI_NAME = "Khatri Builds"

const PKG_LABELS: Record<string, string> = {
  starter: "Starter Package",
  business: "Business Package",
  pro: "Pro Package",
}

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
    tn: "Khatri Builds order",
  })
  return `upi://pay?${params.toString()}`
}

function genReference() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
  let s = ""
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `KB-${s}`
}

export function UpiQrModal({ open, onClose, amount, demo, addonPrices, subtotal, tax, formData }: UpiQrModalProps) {
  const { user } = useAuth()
  const userId = user?.uid ?? null
  const [qrSvg, setQrSvg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [txnId, setTxnId] = useState("")
  const [reference] = useState(() => genReference())
  const [saveFailed, setSaveFailed] = useState(false)

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
    setSaveFailed(false)
    try {
      const orderData: Order = {
        id: "",
        reference,
        userId: userId || "guest",
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
        upiTransactionId: txnId.trim() || null,
      }
      await createOrder(orderData)
      setSubmitted(true)
    } catch {
      setSaveFailed(true)
      setSubmitted(true)
    } finally {
      setSaving(false)
    }
  }

  const confirmStep: ReactNode = submitted ? (
    <div className="flex flex-col items-center py-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
        <BadgeCheck className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-zinc-900">Payment details received</h3>
      <p className="mt-2 text-sm text-zinc-500">
        Your order has been recorded. We&apos;ll verify the transfer and confirm on WhatsApp / email within{" "}
        <span className="font-semibold text-zinc-900">15 minutes</span>.
      </p>

      <div className="mt-5 w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-left">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Order reference</span>
          <span className="font-mono font-bold text-zinc-900">{reference}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-zinc-500">Amount</span>
          <span className="font-semibold text-zinc-900">₹{amount.toLocaleString("en-IN")}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-zinc-500">Status</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
            Awaiting verification
          </span>
        </div>
      </div>

      {saveFailed && (
        <p className="mt-3 text-xs text-red-500">
          We couldn&apos;t save your order yet. Email us your details (see footer) and we&apos;ll set it up manually.
        </p>
      )}

      <div className="mt-5 w-full space-y-2">
        <Button asChild className="w-full">
          <Link href={user ? "/account" : "/signin"}>
            Track your order
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" className="w-full text-zinc-500" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-sm font-extrabold text-white">
KB
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900">Khatri Builds</p>
            <p className="flex items-center gap-1 text-xs text-zinc-500">
              <Lock className="h-3 w-3 text-emerald-500" />
              Secure UPI payment
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          Protected
        </span>
      </div>

      {/* Steps */}
      <div className="mt-5 flex items-center gap-2 text-xs">
        <span className="flex items-center gap-1 font-semibold text-amber-600">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white">1</span>
          Pay
        </span>
        <span className="h-px flex-1 bg-zinc-200" />
        <span className="flex items-center gap-1 text-zinc-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200">2</span>
          Confirm
        </span>
        <span className="h-px flex-1 bg-zinc-200" />
        <span className="flex items-center gap-1 text-zinc-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200">3</span>
          We verify
        </span>
      </div>

      {/* Order summary */}
      <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-600">
            <ReceiptText className="h-4 w-4 text-zinc-400" />
            {demo?.name || "Website build"}
            <span className="text-zinc-400">·</span>
            {PKG_LABELS[formData.packageId] || "Package"}
          </span>
        </div>
        {addonPrices.length > 0 && (
          <p className="mt-1 text-xs text-zinc-500">
            + {addonPrices.length} add-on{addonPrices.length > 1 ? "s" : ""} (₹
            {addonPrices.reduce((a, b) => a + b, 0).toLocaleString("en-IN")})
          </p>
        )}
        <div className="mt-3 flex items-end justify-between border-t border-zinc-200 pt-3">
          <div>
            <p className="text-xs text-zinc-500">Amount payable</p>
            <p className="text-xl font-bold text-zinc-900">
              ₹{amount.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-zinc-400"> incl. 18% GST</span>
            </p>
          </div>
          <span className="font-mono text-xs text-zinc-400">{reference}</span>
        </div>
      </div>

      {/* Payee */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <ShieldCheck className="h-4.5 w-4.5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-zinc-900">
            Payee: Khatri Builds <span className="text-xs font-normal text-emerald-600">· Verified UPI merchant</span>
          </p>
          <p className="text-xs text-zinc-500">
            Please pay exactly <span className="font-semibold text-zinc-900">₹{amount.toLocaleString("en-IN")}</span> to:
          </p>
        </div>
      </div>

      {/* QR */}
      <div className="mt-4 flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-5">
        {qrSvg ? (
          <div className="h-52 w-52 rounded-xl border border-zinc-100 bg-white p-1" dangerouslySetInnerHTML={{ __html: qrSvg }} />
        ) : (
          <div className="flex h-52 w-52 items-center justify-center text-sm text-zinc-500">
            Generating QR…
          </div>
        )}
        <div className="mt-3 flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2">
          <span className="text-sm font-semibold text-zinc-900">{UPI_ID}</span>
          <button
            onClick={handleCopy}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-colors hover:text-amber-600"
            aria-label="Copy UPI ID"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-zinc-500">
          Scan with any UPI app — GPay, PhonePe, Paytm, BHIM
        </p>
      </div>

      {/* Transaction ID */}
      <div className="mt-4">
        <label className="text-xs font-medium text-zinc-600">
          UPI Transaction ID <span className="text-zinc-400">(optional — helps us verify faster)</span>
        </label>
        <input
          value={txnId}
          onChange={(e) => setTxnId(e.target.value)}
          placeholder="e.g. 4125123456789"
          className="mt-1.5 flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
        />
      </div>

      <div className="mt-5 grid w-full grid-cols-2 gap-3">
        <Button asChild variant="outline">
          <a href={upiUri(amount)}>
            <QrCode className="mr-1.5 h-4 w-4" />
            Open UPI app
          </a>
        </Button>
        <Button onClick={handlePaid} disabled={saving}>
          {saving ? "Saving…" : "I've completed payment"}
        </Button>
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-zinc-500">
        <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
        Pay only after you approve the design · 100% refund if we miss the deadline
      </p>
    </div>
  )

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-6 shadow-card">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        {confirmStep}
      </div>
    </div>
  )
}