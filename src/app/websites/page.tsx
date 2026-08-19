"use client"

import { Suspense, useEffect, useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { Search, ArrowRight, SlidersHorizontal } from "lucide-react"
import { getDemos, getCategories } from "@/services/firestore"
import type { Demo } from "@/services/firestore"
import { demos as seedDemos, demoCategories as seedCategories } from "@/seed/demos"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"

const catNames: Record<string, string> = Object.fromEntries(seedCategories.map((c) => [c.id, c.name]))

function formatPrice(price: number) {
  return price.toLocaleString("en-IN")
}

function WebsitesBrowseContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const category = searchParams.get("category") || null
  const search = searchParams.get("search") || ""
  const sort = (searchParams.get("sort") as "price-low" | "price-high" | "featured") || "featured"

  const [categories, setCategories] = useState<string[]>(seedCategories.map((c) => c.id))
  const [demos, setDemos] = useState<Demo[]>(seedDemos)
  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    let cancelled = false
    async function loadData() {
      let allDemos: Demo[] = seedDemos
      let allCategories: string[] = seedCategories.map((c) => c.id)
      try {
        const loadedDemos = await getDemos()
        const loadedCategories = await getCategories()
        if (loadedDemos && loadedDemos.length > 0) allDemos = loadedDemos
        if (loadedCategories && loadedCategories.length > 0) {
          allCategories = (loadedCategories as Array<{ id: string; name: string }>).map((c) => c.id)
        }
      } catch {
        // use seed data
      }
      if (!cancelled) {
        setDemos(allDemos)
        setCategories(allCategories)
      }
    }
    loadData()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredDemos = useMemo(() => {
    const result = demos.filter((demo) => {
      if (category && demo.category !== category) return false
      if (search && !demo.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })

    result.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price
      if (sort === "price-high") return b.price - a.price
      if (b.featured && !a.featured) return -1
      if (!b.featured && a.featured) return 1
      return 0
    })

    return result
  }, [category, search, sort, demos])

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    router.push(`/websites?search=${encodeURIComponent(searchInput)}`)
  }

  const handleCategoryChange = (cat: string | null) => {
    router.push(cat ? `/websites?category=${cat}` : "/websites")
  }

  return (
    <main className="flex-1">
      <Navbar />

      <section className="border-b border-zinc-100 bg-zinc-50 pb-10 pt-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-600">Templates</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">Browse websites</h1>
            <p className="mt-3 text-zinc-500">
              {filteredDemos.length} {filteredDemos.length === 1 ? "template" : "templates"} ready to customise for your business.
            </p>
          </div>

          <form onSubmit={handleSearch} className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl glass p-2">
            <Search className="ml-3 h-5 w-5 shrink-0 text-zinc-500" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search templates..."
              className="h-11 w-full bg-transparent px-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
            />
            <Button type="submit" className="shrink-0">
              Search
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                !category
                  ? "border-amber-300 bg-amber-50 text-amber-600"
                  : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat === category ? null : cat)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  category === cat
                    ? "border-amber-300 bg-amber-50 text-amber-600"
                    : "border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-900"
                }`}
              >
                {catNames[cat] || cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
            <select
              value={sort}
              onChange={(e) => router.push(`/websites?category=${category || ""}&search=${encodeURIComponent(search)}&sort=${e.target.value}`)}
              className="h-10 rounded-full border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none focus:border-amber-300"
            >
              <option value="featured">Featured first</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDemos.map((demo) => (
            <div
              key={demo.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 "
            >
              <div className="relative aspect-[8/5] overflow-hidden">
                <img
                  src={demo.thumbnail}
                  alt={demo.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  {demo.category}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold text-zinc-900">{demo.name}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-zinc-500">{demo.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-amber-600">₹{formatPrice(demo.price)}</span>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/checkout?demoId=${demo.id}`)}
                  >
                    Customise
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDemos.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="text-zinc-500">No templates match your filters.</p>
            <Button asChild variant="outline" className="mt-6">
              <Link href="/websites">View all templates</Link>
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}

export default function WebsitesBrowsePage() {
  return (
    <Suspense fallback={<div className="pt-28 text-center text-zinc-500">Loading websites...</div>}>
      <WebsitesBrowseContent />
    </Suspense>
  )
}
