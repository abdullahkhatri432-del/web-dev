import { db } from "../firebase/config"
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  limit, 
  updateDoc 
} from "firebase/firestore"

// Types
export interface User {
  id: string
  email: string | null
  displayName: string | null
  phone: string | null
  businessName: string | null
  createdAt: Date
  role: "customer" | "admin"
}

export interface Demo {
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
}

export interface Package {
  id: "starter" | "business" | "pro"
  name: string
  price: number
  features: string[]
  includedPages: number
}

export interface Addon {
  id: string
  name: string
  description: string
  price: number
  category: string
}

export interface Order {
  id: string
  userId: string
  demoId: string
  packageId: "starter" | "business" | "pro"
  addons: string[]
  businessName: string
  ownerName: string
  email: string
  phone: string
  whatsapp: string
  businessAddress: string
  instagram: string
  facebook: string
  googleBusinessProfile: string
  businessDescription: string
  requirements: {
    businessModel: string
    neededPages: string[]
    colorPreference: string
    hasLogo: boolean
    hasExistingWebsite: boolean
    likedWebsites: string[]
    specialFunctionality: string
    preferredDeliveryDate: string | null
  }
  assets: string[] // Firebase Storage paths
  package: "starter" | "business" | "pro"
  addonPrices: number[]
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentStatus: "pending" | "paid" | "failed"
  orderStatus: "pending payment" | "paid" | "requirements pending" | "requirements received" | "in progress" | "design review" | "development" | "quality check" | "ready for delivery" | "delivered" | "revision requested" | "completed" | "cancelled"
  createdAt: Date
  updatedAt: Date
  razorpayOrderId: string | null
  razorpayPaymentId: string | null
  razorpaySignature: string | null
}

export interface Payment {
  id: string
  orderId: string
  amount: number
  currency: string
  razorpayOrderId: string
  razorpayPaymentId: string | null
  razorpaySignature: string | null
  status: "pending" | "verified" | "failed"
  createdAt: Date
}

export interface OrderUpdate {
  id: string
  orderId: string
  status: string
  message: string
  createdAt: Date
  userId: string
}

export interface Testimonial {
  id: string
  userId: string | null
  name: string
  company: string | null
  rating: number
  comment: string
  createdAt: Date
}

export interface Coupon {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  maxUsage: number
  usedCount: number
  minOrderValue: number
  expiresAt: Date
  active: boolean
}

// Users collection
export async function createUser(userData: {
  email: string | null
  displayName: string | null
  phone: string | null
  businessName: string | null
  role: "customer" | "admin"
}) {
  const usersRef = collection(db, "users")
  const userRef = doc(usersRef, userData.email || userData.id || Date.now().toString())
  
  await setDoc(userRef, {
    ...userData,
    createdAt: new Date(),
  })
  
  return userRef
}

export async function getUser(userId: string) {
  const userRef = doc(db, "users", userId)
  const snap = await getDoc(userRef)
  
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as User
  }
  return null
}

export async function getUserByEmail(email: string) {
  const usersRef = collection(db, "users")
  const q = query(usersRef, where("email", "==", email))
  const snap = await getDocs(q)
  
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { id: doc.id, ...doc.data() } as User
}

// Demos collection
export async function getDemos(filters?: {
  category?: string
  search?: string
  featuredOnly?: boolean
  minPrice?: number
  maxPrice?: number
}) {
  let demosRef = collection(db, "demos")
  const constraints: any[] = []
  
  if (filters?.category) {
    constraints.push(where("category", "==", filters.category))
  }
  if (filters?.featuredOnly) {
    constraints.push(where("featured", "==", true))
  }
  if (filters?.search) {
    constraints.push(where("name", ">==", filters.search))
    constraints.push(where("name", "<", filters.search + "\u0000"))
  }
  if (filters?.minPrice !== undefined) {
    constraints.push(where("price", ">=", filters.minPrice))
  }
  if (filters?.maxPrice !== undefined) {
    constraints.push(where("price", "<=", filters.maxPrice))
  }
  
  if (constraints.length > 0) {
    demosRef = query(demosRef, ...constraints)
  }
  
  demosRef = query(demosRef, orderBy("featured", "desc"), orderBy("name", "asc"))
  const snap = await getDocs(demosRef)
  
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Demo))
}

export async function getDemoById(id: string) {
  const docRef = doc(db, "demos", id)
  const snap = await getDoc(docRef)
  
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as Demo
  }
  return null
}

export async function getCategories() {
  const categoriesRef = collection(db, "demoCategories")
  const snap = await getDocs(categoriesRef)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// Packages - stored as doc for easy editing
export async function getPackage(packageId: "starter" | "business" | "pro") {
  const pkgRef = doc(db, "packages", packageId)
  const snap = await getDoc(pkgRef)
  
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as Package
  }
  
  // Return defaults if not found
  const defaults: Package = {
    id: packageId,
    name: packageId,
    price: packageId === "starter" ? 7999 : packageId === "business" ? 14999 : 29999,
    features: [],
    includedPages: packageId === "starter" ? 3 : packageId === "business" ? 7 : 12,
  }
  return defaults
}

export async function getAllPackages() {
  const packages: Package[] = []
  for (const id of ["starter", "business", "pro"] as const) {
    packages.push(await getPackage(id))
  }
  return packages
}

// Addons
export async function getAddons() {
  const addonsRef = collection(db, "addons")
  const snap = await getDocs(addonsRef)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Addon))
}

export async function getAddon(id: string) {
  const docRef = doc(db, "addons", id)
  const snap = await getDoc(docRef)
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as Addon
  }
  return null
}

// Orders
export async function createOrder(orderData: Order) {
  const ordersRef = collection(db, "orders")
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  
  return docRef.id
}

export async function getOrder(id: string) {
  const orderRef = doc(db, "orders", id)
  const snap = await getDoc(orderRef)
  
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() } as Order
  }
  return null
}

export async function updateOrder(id: string, data: Partial<Order>) {
  const orderRef = doc(db, "orders", id)
  await updateDoc(orderRef, {
    ...data,
    updatedAt: new Date(),
  })
  return getOrder(id)
}

export async function getUserOrders(userId: string, statusFilter?: string) {
  const ordersRef = collection(db, "orders")
  const q = query(ordersRef, where("userId", "==", userId))
  const snap = await getDocs(q)
  
  const orders = snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Order))
  
  if (statusFilter) {
    return orders.filter(o => o.orderStatus === statusFilter)
  }
  return orders
}

// Payments
export async function createPayment(paymentData: Payment) {
  const paymentsRef = collection(db, "payments")
  const docRef = await addDoc(paymentsRef, {
    ...paymentData,
    createdAt: new Date(),
  })
  return docRef.id
}

export async function getPayment(orderId: string) {
  const paymentsRef = collection(db, "payments")
  const q = query(paymentsRef, where("orderId", "==", orderId))
  const snap = await getDocs(q)
  
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { id: doc.id, ...doc.data() } as Payment
}

export async function updatePaymentStatus(orderId: string, status: "pending" | "verified" | "failed", razorpayPaymentId: string | null, razorpaySignature: string | null) {
  const paymentRef = doc(db, "payments", orderId)
  await updateDoc(paymentRef, {
    status,
    razorpayPaymentId,
    razorpaySignature,
  })
}

// Order Updates
export async function createOrderUpdate(updateData: OrderUpdate) {
  const updatesRef = collection(db, "orderUpdates")
  const docRef = await addDoc(updatesRef, {
    ...updateData,
    createdAt: new Date(),
  })
  return docRef.id
}

export async function getOrderUpdates(orderId: string) {
  const updatesRef = collection(db, "orderUpdates")
  const q = query(updatesRef, where("orderId", "==", orderId), orderBy("createdAt", "desc"))
  const snap = await getDocs(q)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// Testimonials
export async function createTestimonial(testimonialData: Testimonial) {
  const testimonialsRef = collection(db, "testimonials")
  const docRef = await addDoc(testimonialsRef, {
    ...testimonialData,
    createdAt: new Date(),
  })
  return docRef.id
}

export async function getTestimonials(activeOnly = true) {
  const testimonialsRef = collection(db, "testimonials")
  const q = query(testimonialsRef, where("active", "==", true))
  const snap = await getDocs(q)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial))
}

// Coupons
export async function createCoupon(couponData: Coupon) {
  const couponsRef = collection(db, "coupons")
  const docRef = await addDoc(couponsRef, {
    ...couponData,
    createdAt: new Date(),
    usedCount: 0,
  })
  return docRef.id
}

export async function getCoupon(code: string) {
  const couponsRef = collection(db, "coupons")
  const q = query(couponsRef, where("code", "==", code))
  const snap = await getDocs(q)
  
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { id: doc.id, ...doc.data() } as Coupon
}

export async function getActiveCoupons() {
  const couponsRef = collection(db, "coupons")
  const q = query(couponsRef, where("active", "==", true))
  const snap = await getDocs(q)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon))
}

export async function incrementCouponUsage(couponId: string) {
  const couponRef = doc(db, "coupons", couponId)
  await updateDoc(couponRef, {
    usedCount: 1, // Increment in a transaction for production
  })
}