"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Check, Eye } from "lucide-react"
import { getDemoById, getDemos } from "@/services/firestore"
import type { Demo } from "@/services/firestore"
import { demos as seedDemos } from "@/seed/demos"
import { Button } from "@/components/ui/button"

export default function WebsiteDetailPage() {
  const router = useRouter()
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

  const [demo, setDemo] = useState<Demo | null>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<Demo[]>([])

  useEffect(() => {
    async function load() {
      let all: Demo[] = []
      try {
        const data = await getDemos()
        if (data && data.length > 0) all = data
      } catch (err) {
        console.warn("Could not load demos from Firestore, using seed data", err)
      }
      if (all.length === 0) all = seedDemos

      const found = all.find((d) => d.slug === slug) || null
      setDemo(found)
      if (found) {
        setRelated(all.filter((d) => d.category === found.category && d.id !== found.id).slice(0, 4))
      }
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) {
    return <div className="pt-20 p-6">Loading website...</div>
  }

  if (!demo) {
    return (
      <main className="flex-1 pt-20 p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Website not found</h1>
        <p className="text-zinc-500 mb-6">We couldn&apos;t find the website you were looking for.</p>
        <Button onClick={() => router.push("/websites")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Browse Websites
        </Button>
      </main>
    )
  }

  return (
    <main className="flex-1 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <button
          onClick={() => router.push("/websites")}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </button>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src={demo.thumbnail} alt={demo.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-2">{demo.name}</h1>
            <p className="text-accent font-medium text-xl mb-4">₹{demo.price}</p>
            <p className="text-zinc-600 mb-6">{demo.description}</p>

            <h3 className="text-lg font-semibold mb-3">Features</h3>
            <ul className="space-y-2 mb-6">
              {demo.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 mb-8">
              {demo.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs font-medium bg-muted rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => router.push(`/checkout?demoId=${demo.id}`)}
              >
                Get this website
              </Button>
              {demo.livePreviewUrl && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open(demo.livePreviewUrl, "_blank", "noopener,noreferrer")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Live Preview
                </Button>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Websites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => router.push(`/websites/${item.slug}`)}
                >
                  <img src={item.thumbnail} alt={item.name} className="h-40 w-full object-cover" />
                  <div className="p-4">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-accent font-medium text-sm mt-1">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}