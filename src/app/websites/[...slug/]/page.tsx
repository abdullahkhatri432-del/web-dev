"use client"

import { useState, useEffect } from "react"
import { Search, Grid, Layout, Eye, ExternalLink, ArrowLeft } from "lucide-react"
import { getDemos, getCategories } from "../../../../services/firestore"
import { useRouter, useSearchParams } from "next/navigation"

type FilterOptions = {
  category: string | null
  search: string
  sort: "price-low" | "price-high" | "featured"
}

export default function WebsitesBrowsePage() {
  const router = useRouter()
  const [searchParams] = useSearchParams()
  
  const category = searchParams.get("category") || null
  const search = searchParams.get("search") || ""
  const sort = (searchParams.get("sort") as "price-low" | "price-high" | "featured") || "featured"

  const [demos, setDemos] = useState<Array<{
    id: string
    name: string
    slug: string
    category: string
    description: string
    price: number
    thumbnail: string
    screenshots: string[]
    features: string[]
    tags: string[]
    livePreviewUrl: string
    featured: boolean
  }>>([])
  
  const [categories, setCategories] = useState<string[]>([])
  const [filteredDemos, setFilteredDemos] = useState<Array<{
    id: string
    name: string
    slug: string
    category: string
    description: string
    price: number
    thumbnail: string
    screenshots: string[]
    features: string[]
    tags: string[]
    livePreviewUrl: string
    featured: boolean
  }>>([])

  useEffect(() => {
    async function loadData() {
      const allDemos = await getDemos()
      setDemos(allDemos)
      
      const allCategories = await getCategories()
      setCategories(allCategories.map(c => c.id))
      
      // Apply filters
      let result = allDemos.filter((demo) => {
        // Category filter
        if (category && demo.category !== category) return false
        // Search filter
        if (search && !demo.name.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      
      // Sort
      result.sort((a, b) => {
        if (sort === "price-low") return a.price - b.price
        if (sort === "price-high") return b.price - a.price
        // featured first
        if (b.featured && !a.featured) return -1
        if (!b.featured && a.featured) return 1
        return 0
      })
      
      setFilteredDemos(result)
    }
    loadData()
  }, [category, search, sort])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/websites?search=${encodeURIComponent(searchValue)}&category=${category || ""}&sort=${sort}`)
  }

  const handleCategoryChange = (cat: string) => {
    router.push(`/websites?category=${cat}&search=${encodeURIComponent(search)}&sort=${sort}`)
  }

  const handleSortChange = (sortValue: "price-low" | "price-high" | "featured") => {
    router.push(`/websites?category=${category}&search=${encodeURIComponent(search)}&sort=${sortValue}`)
  }

  return (
    <main className="flex-1 pt-20 pb-12">
      {/* Sidebar Filters */}
      <aside className="fixed left-0 inset-y-0 w-64 bg-background shadow-xl z-40 transform translate-x-full sm:translate-x-0 transition-transform">
        <div className="h-full p-6 border-y border-border">
          <h3 className="text-xl font-bold mb-6">Filter</h3>
          
          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Category</h4>
            <div className="space-y-2">
              <button 
                onClick={() => handleCategoryChange(null)}
                className={`px-4 py-2 rounded border ${!category ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-transparent"}`}
              >
                All Categories
              </button>
              {categories.map((cat) => {
                const catNames: Record<string, string> = {
                  "restaurant": "Restaurant",
                  "cafe": "Cafe",
                  "gym": "Gym",
                  "salon": "Salon",
                  "clinic": "Clinic",
                  "real-estate": "Real Estate",
                  "hotel": "Hotel",
                  "portfolio": "Portfolio",
                  "agency": "Agency",
                  "saas": "SaaS",
                  "ecommerce": "Ecommerce",
                  "education": "Education",
                  "photography": "Photography",
                  "local-business": "Local Business",
                }
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded border ${category === cat ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-transparent"}`}
                  >
                    {catNames[cat]}
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Search */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Search</h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
              <input
                type="text"
                placeholder="Search websites..."
                value={search}
                onChange={(e) => {
                  // handled by handleSearch
                }}
                className="pl-8 pr-4 h-10 rounded border placeholder:text-zinc-400"
              />
            </div>
          </div>
          
          {/* Sort */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Sort by</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleSortChange("featured")}
                className={`px-4 py-2 rounded border ${sort === "featured" ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-transparent"}`}
              >
                Featured first
              </button>
              <button
                onClick={() => handleSortChange("price-low")}
                className={`px-4 py-2 rounded border ${sort === "price-low" ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-transparent"}`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => handleSortChange("price-high")}
                className={`px-4 py-2 rounded border ${sort === "price-high" ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-transparent"}`}
              >
                Price: High to Low
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <h1 className="text-3xl font-bold">Browse Websites</h1>
          
          {/* Count */}
          <div className="ml-auto text-sm text-zinc-500">
            {filteredDemos.length} {filteredDemos.length === 1 ? "website" : "websites"} found
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDemos.map((demo) => (
            <div 
              key={demo.id} 
              className="group rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-64">
                <img 
                  src={demo.thumbnail} 
                  alt={demo.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-4 bg-black/60 backdrop-blur-sm p-3">
                  <span className="text-white font-medium">₹{demo.price}</span>
                  <div className="hidden sm:block">
                    <Eye className="h-4 w-4 text-white" />
                    <span className="ml-2 text-xs font-medium" onClick={() => router.push(`/checkout?demoId=${demo.id}`)}>Get</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium line-clamp-2">{demo.name}</h3>
                <p className="text-sm text-zinc-500 line-clamp-2 mt-2">{demo.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-accent font-medium">₹{demo.price}</span>
                  {/* CTA moved to image overlay */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}