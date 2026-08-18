"use client"

import { getDemos, getPackages, getAddons } from "../../services/firestore"
import { useRouter, useSearchParams } from "next/navigation"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const demoId = searchParams.get("demoId")
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    packageId: "starter",
    selectedAddons: [],
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    whatsapp: "",
    businessAddress: "",
    instagram: "",
    facebook: "",
    googleBusinessProfile: "",
    businessDescription: "",
    businessModel: "",
    neededPages: [],
    colorPreference: "",
    hasLogo: false,
    hasExistingWebsite: false,
    likedWebsites: "",
    specialFunctionality: "",
    preferredDeliveryDate: "",
    uploadedFiles: [],
  })
  
  const [demo, setDemo] = useState({})
  const [packages, setPackages] = useState([])
  const [addonsList, setAddonsList] = useState([])
  
  useEffect(() => {
    async function load() {
      if (demoId) {
        const d = await getDemoById(demoId)
        setDemo(d)
      }
      const p = await Promise.all(["starter", "business", "pro"].map(getPackage))
      setPackages(p)
      const a = await getAddons()
      setAddonsList(a)
    }
    load()
  }, [demoId])
  
  const pkgOptions = {
    starter: { name: "STARTER", price: 7999, features: ["Up to 3 pages", "Responsive design"], includedPages: 3 },
    business: { name: "BUSINESS", price: 14999, features: ["Up to 7 pages", "Contact form"], includedPages: 7 },
    pro: { name: "PRO", price: 29999, features: ["Up to 12 pages", "Advanced animations"], includedPages: 12 },
  }
  
  const addonOpts = addonsList.map(a => ({ id: a.id, name: a.name, price: a.price, desc: a.description }))
  
  const pPrice = pkgOptions[formData.packageId]?.price || 0
  const aPrice = formData.selectedAddons.reduce((s, id) => s + (function(arr, id) { for (const a of arr) { if (a.id === id) return a.price; } return 0; })(addonOpts, formData.selectedAddons[0] || ""), 0)
  const sub = pPrice + aPrice
  const tax = Math.round(sub * 0.18)
  const total = sub + tax
  
  const nextStep = () => setStep(s => Math.min(s + 1, 5))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))
  
  const onBizSubmit = (data) => {
    setFormData({ ...formData, ...data })
    nextStep()
  }
  const onReqSubmit = (data) => {
    setFormData({ ...formData, ...data })
    nextStep()
  }
  
  const onFileChange = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      setFormData({ ...formData, uploadedFiles: [...formData.uploadedFiles, { id: Date.now().toString(), name: files[0].name, url: URL.createObjectURL(files[0]) }] })
    }
  }
  
  return (
    <main className="flex-1">
      <header className="border-b bg-background/80 backdrop-blur-sm fixed w-full top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 19l-7-7-7 7"></path></svg>
            <h2 className="font-semibold">Checkout</h2>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded-full bg-zinc-300 flex items-center justify-center text-sm font-medium">{step}</div>
            <span className="mx-1">/</span>
            <div className="w-6 h-6 rounded-full bg-zinc-300 flex items-center justify-center text-sm font-medium">5</div>
          </div>
        </div>
      </header>
      
      <div className="p-6 pt-20">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select a Demo</h2>
            {demo.id && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <img src={demo.thumbnail} alt={demo.name} className="w-full h-48 object-cover rounded-xxl mb-4"/>
                <h3 className="text-xl font-bold">{demo.name}</h3>
                <p className="text-zinc-600">{demo.description}</p>
                <p className="text-accent font-medium">₹{demo.price}</p>
                <button className="w-full py-3 mt-4">Select Package</button>
              </div>
            )}
          </div>
        )}
        
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select Package</h2>
            {demo.id && (
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(pkgOptions).map(([key, pkg]) => (
                  <div
                    key={key}
                    className={`rounded-2xl p-6 border ${formData.packageId === key ? "border-primary bg-primary/5" : "border-border hover:border-primary"}`}
                  >
                    <h4 className="text-xl font-bold">{pkg.name}</h4>
                    <p className="text-zinc-600">₹{pkg.price}</p>
                    <p className="text-sm text-zinc-500">Starting price</p>
                    {pkg.features.map(f => (
                      <div key={f} className="flex items-start">
                        <svg className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span className="ml-2 text-sm">{f}</span>
                      </div>
                    ))}
                    <button className="w-full py-3 mt-4 font-medium">
                      {formData.packageId === key ? "Selected" : "Select Package"}
                    </button>
                    <div className="mt-3 pt-2 text-sm text-zinc-500">
                      <span>Included pages:</span> {pkgOptions[key].includedPages}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!demo.id && <p className="text-zinc-500">Select a demo first</p>}
          </div>
        )}
        
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Select Add-ons</h2>
            {demo.id && formData.packageId && (
              <div className="space-y-4">
                {addonOpts.map(a => (
                  <div
                    key={a.id}
                    className={`p-4 rounded-xl border ${formData.selectedAddons.includes(a.id) ? "border-primary" : "border-border"} cursor-pointer`}
                    onClick={() => {
                      const isSel = formData.selectedAddons.includes(a.id)
setFormData({
  ...formData,
  selectedAddons: isSel ? formData.selectedAddons.filter(x => x !== a.id) : [...formData.selectedAddons, a.id],
})
}}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{a.name}</h4>
                        <p className="text-xs text-zinc-500">{a.desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-accent font-medium">₹{a.price}</span>
                        <svg className="h-4 w-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    </div>
                    <p className="text-xs mt-2 text-zinc-500">Add ₹{a.price} to total</p>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-zinc-500">Package:</span> ₹{pPrice}</div>
                    <div><span className="text-zinc-500">Add-ons:</span> ₹{aPrice}</div>
                  </div>
                  <div className="mt-2 font-medium">
                    <span>Subtotal:</span> ₹{sub}
                  </div>
                </div>
              </div>
            )}
            {!demo.id || !formData.packageId && <p className="text-zinc-500">Select package first</p>}
          </div>
        )}
        
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Business Information</h2>
            <p className="text-zinc-500 mb-4">Required for order processing</p>
            <div className="mb-4">
              <p>Business name:</p>
              <p>Owner name:</p>
              <p>Email:</p>
              <p>Phone:</p>
              <p>WhatsApp:</p>
            </div>
            <p>Business address:</p>
            <button>Continue to Requirements</button>
          </div>
        )}
        
        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-zinc-500">Demo</p>
                  <p className="font-medium">{demo.name || "Not selected"}</p>
                  <p className="text-accent">₹{demo.price || 0}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Package</p>
                  <p className="font-medium">{pkgOptions[formData.packageId]?.name || "Not selected"}</p>
                  <p className="text-accent">₹{pPrice}</p>
                </div>
              </div>
              {formData.selectedAddons.length > 0 && (
                <div>
                  <p className="text-zinc-500">Add-ons</p>
                  <p className="text-accent">₹{aPrice}</p>
                </div>
              )}
              <div>
                <p className="text-zinc-500">Subtotal</p>
                <p className="font-medium text-accent">₹{sub}</p>
              </div>
              <div>
                <p className="text-zinc-500">Tax (18%)</p>
                <p className="font-medium">₹{tax}</p>
              </div>
              <div>
                <p className="text-accent font-medium text-lg">Total: ₹{total}</p>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-3">Requirements</h3>
            <p className="text-zinc-500 mb-2">What does your business do?</p>
            <p>What pages do you need?</p>
            <p>Preferred colors:</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <p>Have a logo?</p>
              <p>Have existing website?</p>
            </div>
            <p>Websites you like (URLs):</p>
            <p>Special functionality:</p>
            <p>Preferred delivery date:</p>
            
            <div className="mt-8">
              <button>Pay Now</button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}