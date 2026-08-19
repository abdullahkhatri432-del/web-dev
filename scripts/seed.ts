import fs from "node:fs"
import path from "node:path"
import { initializeApp, getApps } from "firebase/app"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { demos as seedDemos, demoCategories as seedCategories } from "../src/seed/demos"

const envPath = path.resolve(process.cwd(), ".env.local")
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq)
    const value = trimmed.slice(eq + 1)
    if (!(key in process.env)) process.env[key] = value
  }
}

const required = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
]

const missing = required.filter((k) => !process.env[k])
if (missing.length > 0) {
  console.error("Missing Firebase env vars in .env.local:", missing.join(", "))
  process.exit(1)
}

const packages = [
  {
    id: "starter",
    name: "Starter",
    price: 7999,
    features: ["Up to 3 pages", "Responsive design", "Mobile-friendly", "Contact form"],
    includedPages: 3,
  },
  {
    id: "business",
    name: "Business",
    price: 14999,
    features: ["Up to 7 pages", "Blog / services section", "Google Maps + WhatsApp", "Everything in Starter"],
    includedPages: 7,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29999,
    features: ["Up to 12 pages", "Advanced animations", "Online booking / payments", "Everything in Business"],
    includedPages: 12,
  },
]

const addons = [
  { id: "blog", name: "Blog setup", description: "Add a blog section so you can publish updates and rank on Google.", price: 4999, category: "content" },
  { id: "booking", name: "Online booking", description: "Let customers book appointments / tables directly on your site.", price: 6999, category: "feature" },
  { id: "whatsapp", name: "WhatsApp integration", description: "One-tap WhatsApp chat button plus click-to-chat links.", price: 999, category: "feature" },
  { id: "upi", name: "UPI payments", description: "Accept payments via UPI QR on your website.", price: 3999, category: "feature" },
  { id: "seo", name: "SEO setup", description: "On-page SEO: titles, meta tags, schema and Google indexing.", price: 2999, category: "marketing" },
  { id: "gallery", name: "Photo gallery", description: "Organized image gallery with lightbox for your work.", price: 1999, category: "content" },
  { id: "logo", name: "Logo design", description: "A simple professional logo designed for your business.", price: 2499, category: "design" },
  { id: "map", name: "Google Maps", description: "Embed a map with directions to your location.", price: 999, category: "feature" },
  { id: "domain", name: "Domain + email", description: "Custom domain setup with a business email address.", price: 1499, category: "setup" },
  { id: "multilingual", name: "Multilingual", description: "Translate your site into Hindi or other languages.", price: 4499, category: "content" },
]

const app = getApps()[0] ?? initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
})

const db = getFirestore(app)

async function main() {
  let demos = 0
  let categories = 0
  let pkg = 0
  let addon = 0

  for (const d of seedDemos) {
    await setDoc(doc(db, "demos", d.id), { ...d }, { merge: true })
    demos++
  }

  for (const c of seedCategories) {
    await setDoc(doc(db, "demoCategories", c.id), { ...c }, { merge: true })
    categories++
  }

  for (const p of packages) {
    await setDoc(doc(db, "packages", p.id), { ...p }, { merge: true })
    pkg++
  }

  for (const a of addons) {
    await setDoc(doc(db, "addons", a.id), { ...a }, { merge: true })
    addon++
  }

  console.log("Seed complete:")
  console.log("  demos:", demos)
  console.log("  demoCategories:", categories)
  console.log("  packages:", pkg)
  console.log("  addons:", addon)
  process.exit(0)
}

main().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
