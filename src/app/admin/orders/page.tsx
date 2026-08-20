"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle, ChevronDown, ChevronUp, CheckCircle2, MessageSquare } from "lucide-react"
import {
  getAllOrders,
  getOrderUpdates,
  updateOrderStatus,
  ORDER_STATUS_LIST,
  type Order,
  type OrderStatus,
  type OrderUpdate,
} from "@/services/firestore"

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

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] || "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
      {status}
    </span>
  )
}

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState<OrderStatus>(order.orderStatus as OrderStatus)
  const [note, setNote] = useState("")
  const [updates, setUpdates] = useState<OrderUpdate[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const d = toDate(order.createdAt)

  const toggle = useCallback(async () => {
    const next = !expanded
    setExpanded(next)
    if (next && updates.length === 0) {
      const u = await getOrderUpdates(order.id).catch(() => [])
      setUpdates(u)
    }
  }, [expanded, order.id, updates.length])

  const save = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await updateOrderStatus(order.id, status, { note })
      setNote("")
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-zinc-100 bg-white shadow-sm">
      <button
        onClick={toggle}
        className="flex w-full flex-wrap items-center gap-3 p-4 text-left transition-colors hover:bg-zinc-50"
      >
        <div className="min-w-[90px]">
          <div className="font-mono text-xs font-bold text-zinc-700">{order.reference || `#${order.id.slice(-6).toUpperCase()}`}</div>
          <div className="text-[11px] text-zinc-400">{d ? d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</div>
        </div>
        <div className="min-w-[140px] flex-1">
          <div className="text-sm font-semibold text-zinc-900">{order.businessName || order.ownerName || "—"}</div>
          <div className="truncate text-xs text-zinc-500">{order.phone || order.email || order.whatsapp || "—"}</div>
        </div>
        <div className="min-w-[80px] text-right">
          <div className="text-sm font-bold text-amber-600">₹{(order.total || 0).toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-zinc-400">{order.package}</div>
        </div>
        <StatusBadge status={order.orderStatus} />
        {expanded ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
      </button>

      {expanded && (
        <div className="border-t border-zinc-100 p-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Details</div>
              <dl className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">Customer</dt><dd className="font-medium text-zinc-900">{order.ownerName || "—"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">Email</dt><dd className="font-medium text-zinc-900">{order.email || "—"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">WhatsApp</dt><dd className="font-medium text-zinc-900">{order.whatsapp || order.phone || "—"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">Addons</dt><dd className="font-medium text-zinc-900">{order.addons?.length ? order.addons.join(", ") : "None"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-zinc-500">Description</dt><dd className="font-medium text-zinc-900">{order.businessDescription || "—"}</dd></div>
                {order.requirements?.neededPages?.length > 0 && (
                  <div className="flex justify-between gap-4"><dt className="text-zinc-500">Pages</dt><dd className="font-medium text-zinc-900">{order.requirements.neededPages.join(", ")}</dd></div>
                )}
              </dl>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Update status</div>
              <div className="mt-2 flex flex-col gap-2">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                >
                  {ORDER_STATUS_LIST.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional note for the customer (sent to order updates)"
                  className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
                <button
                  onClick={save}
                  disabled={saving || (status === order.orderStatus && !note.trim())}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : null}
                  {saving ? "Saving..." : saved ? "Saved" : "Save status"}
                </button>
              </div>

              <div className="mt-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Timeline</div>
                <div className="mt-2 max-h-32 space-y-1.5 overflow-y-auto">
                  {updates.length === 0 ? (
                    <p className="text-xs text-zinc-400">No updates yet.</p>
                  ) : (
                    updates.map((u) => (
                      <div key={u.id} className="flex items-start gap-2 text-xs">
                        <MessageSquare className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                        <div>
                          <span className="font-medium text-zinc-700">{u.status}</span>
                          {u.message && <p className="text-zinc-500">{u.message}</p>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState("all")

  const load = useCallback(async () => {
    const data = await getAllOrders().catch(() => {
      setError(true)
      return [] as Order[]
    })
    setOrders(data)
  }, [])

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

  const filtered = useMemo(() => {
    const list = (orders ?? []).slice().sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
    if (filter === "all") return list
    return list.filter((o) => o.orderStatus === filter)
  }, [orders, filter])

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Orders</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage every order and keep customers updated</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          >
            <option value="all">All statuses</option>
            {ORDER_STATUS_LIST.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={load}
            className="h-10 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300"
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <p className="mt-3 text-sm text-zinc-500">Couldn&apos;t load orders. Check the backend env vars.</p>
          </CardContent>
        </Card>
      ) : orders === null ? (
        <div className="flex items-center justify-center py-20 text-zinc-500">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-zinc-500">
            No orders yet. Share your website link to start receiving orders.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  )
}