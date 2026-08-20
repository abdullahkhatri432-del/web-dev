"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { getUserOrders, getOrderUpdates } from "@/services/firestore"
import type { Order, OrderUpdate } from "@/services/firestore"
import { Loader2, Package, ShoppingBag, MessageSquare, AlertCircle } from "lucide-react"

const STATUS_STYLES: Record<string, string> = {
  "pending payment": "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-green-100 text-green-800 border-green-200",
  "requirements pending": "bg-blue-100 text-blue-800 border-blue-200",
  "requirements received": "bg-sky-100 text-sky-800 border-sky-200",
  "in progress": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "design review": "bg-violet-100 text-violet-800 border-violet-200",
  development: "bg-purple-100 text-purple-800 border-purple-200",
  "quality check": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "ready for delivery": "bg-teal-100 text-teal-800 border-teal-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "revision requested": "bg-orange-100 text-orange-800 border-orange-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

function toMillis(v: Date | unknown): number {
  if (typeof v === "object" && v !== null && "toMillis" in (v as object)) {
    return (v as { toMillis: () => number }).toMillis()
  }
  if (v instanceof Date) return v.getTime()
  return 0
}

function toDate(v: Date | unknown): Date | null {
  if (typeof v === "object" && v !== null && "toDate" in (v as object)) {
    return (v as { toDate: () => Date }).toDate()
  }
  if (v instanceof Date) return v
  return null
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] || "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
      {status}
    </span>
  )
}

function OrderCard({ order }: { order: Order }) {
  const [updates, setUpdates] = useState<OrderUpdate[] | null>(null)
  const [show, setShow] = useState(false)
  const d = toDate(order.createdAt)

  const toggle = async () => {
    const next = !show
    setShow(next)
    if (next && updates === null) {
      setUpdates(await getOrderUpdates(order.id).catch(() => []))
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-mono text-xs font-bold text-zinc-400">{order.reference || `#${order.id.slice(-6).toUpperCase()}`}</div>
          <div className="mt-1 text-lg font-bold text-zinc-900">{order.businessName || order.ownerName || "Your website"}</div>
          <div className="text-xs text-zinc-500">{d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-amber-600">₹{(order.total || 0).toLocaleString("en-IN")}</div>
          <StatusBadge status={order.orderStatus} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
        <span>Package: <span className="font-medium text-zinc-700 capitalize">{order.package}</span></span>
        {order.addons?.length > 0 && (
          <span>Addons: <span className="font-medium text-zinc-700">{order.addons.join(", ")}</span></span>
        )}
        <span>Payment: <span className="font-medium text-zinc-700">{order.paymentStatus}</span></span>
      </div>

      <button onClick={toggle} className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:underline">
        <MessageSquare className="h-3.5 w-3.5" />
        {show ? "Hide" : "Show"} order updates
      </button>

      {show && (
        <div className="mt-3 space-y-1.5 rounded-xl bg-zinc-50 p-3">
          {updates === null ? (
            <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
          ) : updates.length === 0 ? (
            <p className="text-xs text-zinc-500">No updates yet — we&apos;ll post progress here.</p>
          ) : (
            updates.map((u) => (
              <div key={u.id} className="flex items-start gap-2 text-xs">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                <div>
                  <span className="font-semibold capitalize text-zinc-700">{u.status}</span>
                  {u.message && <p className="text-zinc-500">{u.message}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function AccountPage() {
  const router = useRouter()
  const { user, profile, isAdmin, loading } = useAuth()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/signin")
      return
    }
    if (isAdmin) {
      router.replace("/admin")
      return
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    if (!user || !profile || isAdmin) return
    const ids = [profile.id, profile.phone ?? "", profile.email ?? ""].filter(Boolean)
    Promise.all(ids.map((id) => getUserOrders(id).catch(() => [] as Order[])))
      .then((groups) => {
        const seen = new Map<string, Order>()
        for (const group of groups) for (const o of group) seen.set(o.id, o)
        return [...seen.values()]
      })
      .then((all) => setOrders(all.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))))
      .catch(() => setError(true))
  }, [user, profile, isAdmin])

  if (loading || !user) {
    return (
      <main className="flex-1">
        <Navbar />
        <div className="flex justify-center py-40 text-zinc-500">
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-amber-600" /> Loading...
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="flex-1">
      <Navbar />

      <section className="relative overflow-hidden pb-24 pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-amber-100 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-xl font-bold text-amber-600">
                {(user.displayName || profile?.displayName || user.phoneNumber || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-zinc-900">{profile?.displayName || user.displayName || "My account"}</h1>
                <p className="text-sm text-zinc-500">{profile?.businessName ? `${profile.businessName} · ` : ""}{user.phoneNumber || user.email}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/websites">
                    <ShoppingBag className="mr-1.5 h-4 w-4" />
                    Order a website
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-zinc-900">
              <Package className="h-5 w-5 text-amber-600" />
              My orders
            </h2>

            {error ? (
              <div className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-6 text-sm text-zinc-500">
                <AlertCircle className="h-5 w-5 text-red-400" /> Couldn&apos;t load your orders. Try again later.
              </div>
            ) : orders === null ? (
              <div className="flex justify-center rounded-2xl border border-zinc-100 bg-white py-16">
                <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
              </div>
            ) : orders.length === 0 ? (
              <div className="rounded-2xl border border-zinc-100 bg-white py-16 text-center">
                <Package className="mx-auto h-10 w-10 text-zinc-300" />
                <p className="mt-3 text-sm text-zinc-500">You haven&apos;t placed any orders yet.</p>
                <Button asChild className="mt-5">
                  <Link href="/websites">Browse websites</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <OrderCard key={o.id} order={o} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}