"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { IndianRupee, ShoppingCart, Loader2, AlertCircle } from "lucide-react"
import { getAllOrders } from "@/services/firestore"
import type { Order } from "@/services/firestore"

function formatPrice(price: number) {
  return price.toLocaleString("en-IN")
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    "pending payment": "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    "requirements pending": "bg-blue-100 text-blue-800",
    "in progress": "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
  }
  const cls = map[status] || "bg-zinc-100 text-zinc-800"
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${cls}`}>
      {status}
    </span>
  )
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

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    getAllOrders()
      .then((data) => {
        if (!cancelled) setOrders(data)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const paidOrders = (orders || []).filter(
    (o) => !["pending payment", "cancelled"].includes(o.orderStatus) && o.paymentStatus !== "pending"
  )
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const activeOrders = (orders || []).filter(
    (o) => !["completed", "cancelled", "pending payment"].includes(o.orderStatus)
  )
  const recent = (orders || [])
    .slice()
    .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
    .slice(0, 8)

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">Live data from your Firestore orders</p>
        </div>
        <Link
          href="/websites"
          className="text-sm font-medium text-amber-600 hover:underline"
        >
          View website →
        </Link>
      </div>

      {error ? (
        <div className="flex flex-col items-center rounded-2xl border border-zinc-100 bg-white py-16 text-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="mt-3 text-sm text-zinc-500">
            Couldn&apos;t load orders from Firestore. Check that the backend env vars are set.
          </p>
        </div>
      ) : orders === null ? (
        <div className="flex flex-col items-center rounded-2xl border border-zinc-100 bg-white py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          <p className="mt-3 text-sm text-zinc-500">Loading orders...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div>
                    <p className="text-3xl font-bold text-amber-600">₹{formatPrice(totalRevenue)}</p>
                    <p className="text-zinc-500">From {paidOrders.length} paid orders</p>
                  </div>
                  <IndianRupee className="h-6 w-6 text-amber-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div>
                    <p className="text-3xl font-bold text-zinc-900">{orders.length}</p>
                    <p className="text-zinc-500">All-time orders</p>
                  </div>
                  <ShoppingCart className="h-6 w-6 text-zinc-900/60" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div>
                    <p className="text-3xl font-bold text-emerald-400">{activeOrders.length}</p>
                    <p className="text-zinc-500">Currently being built</p>
                  </div>
                  <ShoppingCart className="h-6 w-6 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-zinc-900">
              Recent Orders {orders.length === 0 && <span className="text-sm font-normal text-zinc-500">— none yet, orders will appear here</span>}
            </h2>

            {orders.length === 0 ? (
              <div className="rounded-2xl border border-zinc-100 bg-white py-16 text-center">
                <p className="text-zinc-500">No orders yet. Share your website link to start receiving orders.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-zinc-100 bg-white">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-zinc-100 text-left">
                      <th className="p-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Order</th>
                      <th className="p-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Customer</th>
                      <th className="p-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Amount</th>
                      <th className="p-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Status</th>
                      <th className="p-4 text-xs font-medium uppercase tracking-wider text-zinc-500">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((o) => {
                      const d = toDate(o.createdAt)
                      return (
                        <tr key={o.id} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50">
                          <td className="p-4 text-sm text-zinc-700">{o.id.slice(-6).toUpperCase()}</td>
                          <td className="p-4 text-sm text-zinc-900">{o.businessName || o.ownerName || "—"}</td>
                          <td className="p-4 text-sm font-semibold text-amber-600">₹{formatPrice(o.total || 0)}</td>
                          <td className="p-4">{statusBadge(o.orderStatus)}</td>
                          <td className="p-4 text-sm text-zinc-500">
                            {d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
