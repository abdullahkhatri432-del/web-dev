"use client"

import { useEffect, useState } from "react"
import { getDemos } from "../services/firestore"
import type { Demo } from "../services/firestore"
import { demos as seedDemos } from "@/seed/demos"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "featured">("featured")
  const [showLogin, setShowLogin] = useState(false)
  const router = useRouter()

  // Fetch data
  const [demos, setDemos] = useState<Demo[]>([])

  // Initialize data on mount, falling back to bundled seed data
  useEffect(() => {
    async function load() {
      try {
        const data = await getDemos()
        if (data && data.length > 0) {
          setDemos(data)
          return
        }
      } catch (err) {
        console.warn("Could not load demos from Firestore, using seed data", err)
      }
      setDemos(seedDemos)
    }
    load()
  }, [])
  
  const categories = [
    "restaurant", "cafe", "gym", "salon", "clinic",
    "real-estate", "hotel", "portfolio", "agency",
    "saas", "ecommerce", "education", "photography", "local-business"
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/websites?search=${encodeURIComponent(searchQuery)}&category=${selectedCategory || ""}`)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    router.push(`/websites?category=${category}&search=${encodeURIComponent(searchQuery)}&sort=${sortBy}`)
  }

  return (
    <main className="flex-1">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm fixed w-full top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <svg className="h-6 w-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7l7 9z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold tracking-tight">WebForge</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push("/signup")}
              className="px-4 py-2"
            >
              Get Started
            </Button>
            <Button 
              variant="default"
              onClick={() => setShowLogin(true)}
              className="px-4 py-2"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0">
          {/* Abstract background shapes */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/10 transform -rotate-6 opacity-50 dark:opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/5 transform opacity-30 dark:opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center px-6 relative">
          <div className="animate-fade-in-up from-opacity-0 transition-all duration-1000">
            <p className="text-accent text-sm font-medium tracking-widest uppercase mb-6">
              Your Website. Picked, Paid, Built.
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
              Choose a design, customize your package, 
              <span className="italic">submit your requirements</span>,
              and get your business online
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto mb-10">
              &quot;Choose a design, customize your package, submit your requirements, and get your business online without endless meetings.&quot;
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Button 
                onClick={() => router.push("/websites")}
                className="flex-1 sm:max-w-200 py-3 px-6 text-lg font-medium"
              >
                Browse Websites
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/packages")}
                className="flex-1 sm:max-w-200 py-3 px-6 text-lg font-medium"
              >
                View Packages
              </Button>
            </div>
          </div>
          
          {/* Demo Preview in Hero */}
          <div className="hidden sm:block animate-fade-in delay-400">
            <div className="mt-16 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-64">
                <img 
                  src="/demos/gym-premium.jpg" 
                  alt="Gym premium website demo" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center px-4">
                  <span className="text-white font-medium">₹7,999 - ₹29,999</span>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    aria-label="Preview website"
                  >
                    <Eye className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Websites Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Websites</h2>
            <p className="text-zinc-600">Browse our curated collection of professionally designed website demos</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {demos.map((demo) => {
              // Filter by category and featured
              if (selectedCategory && demo.category !== selectedCategory) return null
              if (sortBy === "price-low" && demo.price > (demos[0]?.price || 0)) return null
              if (sortBy === "price-high") return null // simplified
              
              const isFeatured = demo.featured && (!selectedCategory || demo.category === selectedCategory)
              
              return (
                <div 
                  key={demo.id} 
                  className={`group rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 ${isFeatured ? "border-2 border-primary/20" : ""}`} 
                  onMouseEnter={() => router.push(`/websites/${demo.slug}`)}
                >
                  <div className="relative h-64">
                    <img 
                      src={demo.thumbnail} 
                      alt={demo.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-4 bg-black/60 backdrop-blur-sm p-3">
                      <span className="text-white font-medium">₹{demo.price}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="hidden sm:block"
                        aria-label="Preview website"
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium line-clamp-2">{demo.name}</h3>
                    <p className="text-sm text-zinc-500 line-clamp-2 mt-2">{demo.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-accent font-medium">₹{demo.price}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                        aria-label="Get this website"
                      >
                        Get
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">01</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Choose a design</h3>
                    <p className="text-zinc-500">Browse our curated collection of website demos and pick the one that fits your business</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mt-6">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">02</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Customize your package</h3>
                    <p className="text-zinc-500">Select add-ons, domain setup, and hosting to match your needs</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mt-6">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">03</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Submit requirements</h3>
                    <p className="text-zinc-500">Enter your business information, upload assets, and specify your needs</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mt-6">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">04</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Pay securely</h3>
                    <p className="text-zinc-500">Use Razorpay for secure online payment</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mt-6">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">05</span>
                  </div>
                  <div>
                    <h3 className="font-medium">We build it</h3>
                    <p className="text-zinc-500">Our developers get to work on your website with clear requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 mt-6">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">06</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Launch</h3>
                    <p className="text-zinc-500">Receive your completed website and go live</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/demos/hotel-ocean.jpg" 
                  alt="How it works illustration" 
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Industries */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Popular Industries</h2>
            <p className="text-zinc-600">We&apos;ve designed websites for these businesses</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[

              { name: "Restaurant", count: "47", icon: "utensils", color: "red" },
              { name: "Gym", count: "34", icon: "dumbbell", color: "green" },
              { name: "Salon", count: "28", icon: "scissors", color: "purple" },
              { name: "Clinic", count: "23", icon: "stethoscope", color: "blue" },
              { name: "Real Estate", count: "38", icon: "building", color: "orange" },
              { name: "Hotel", count: "19", icon: " hotel", color: "teal" },
              { name: "Agency", count: "31", icon: "palette", color: "fuchsia" },
              { name: "SaaS", count: "42", icon: "server", color: "emerald" },

            ].map((industry) => (
              <div 
                key={industry.name} 
                className="p-4 rounded-xl text-center hover:bg-primary/5 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className={`h-6 w-6 text-${industry.color}60`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 4" />
                  </svg>
                </div>
                <h4 className="font-medium mb-1">{industry.name}</h4>
                <p className="text-xs text-zinc-500">{industry.count}+ websites</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Ready to get online?</h2>
            <p className="text-zinc-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses that have gotten their website through WebForge. No sales calls, no endless meetings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Button 
                onClick={() => router.push("/websites")}
                className="flex-1 sm:max-w-200 py-3 px-6 text-lg font-medium"
              >
                Browse Websites
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push("/packages")}
                className="flex-1 sm:max-w-200 py-3 px-6 text-lg font-medium"
              >
                View Packages
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}