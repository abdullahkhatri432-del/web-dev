"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Mail, Phone, MessageSquare, RefreshCw, Inbox, Loader2 } from "lucide-react"
import { getAllContactMessages } from "@/services/firestore"
import type { ContactMessage } from "@/services/firestore"

function toMillis(d: Date | unknown): number {
  if (d instanceof Date) return d.getTime()
  if (d && typeof d === "object" && "seconds" in (d as object)) return (d as { seconds: number }).seconds * 1000
  return 0
}

function fmtDate(d: Date | unknown) {
  const t = toMillis(d)
  if (!t) return "—"
  return new Date(t).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    const data = await getAllContactMessages().catch(() => {
      setError(true)
      return [] as ContactMessage[]
    })
    setMessages(data)
  }, [])

  useEffect(() => {
    let cancelled = false
    getAllContactMessages()
      .then((data) => {
        if (!cancelled) setMessages(data)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const sorted = useMemo(() => (messages ?? []).slice().sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt)), [messages])

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Messages</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Contact-form submissions from visitors — check here regularly.
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-amber-400 hover:text-amber-600"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="mt-6">
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            Couldn&apos;t load messages. Check your connection and try again.
          </div>
        )}

        {messages === null ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading messages...
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-200 bg-white py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-50 text-zinc-400">
              <Inbox className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-zinc-900">No messages yet</h2>
            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              When visitors send a message from the contact page, it&apos;ll show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((m) => (
              <div key={m.id} className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-900">{m.name}</span>
                      {m.subject && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          {m.subject}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                      <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-amber-600">
                        <Mail className="h-3 w-3" /> {m.email}
                      </a>
                      {m.phone && (
                        <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-amber-600">
                          <Phone className="h-3 w-3" /> {m.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400">{fmtDate(m.createdAt)}</span>
                </div>
                <p className="mt-3 flex items-start gap-2 rounded-xl bg-zinc-50 p-3 text-sm text-zinc-700">
                  <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  {m.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}