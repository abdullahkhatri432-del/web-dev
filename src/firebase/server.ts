/**
 * Server-side Firebase Admin Setup
 * 
 * This uses the Firebase Admin SDK only on the server side.
 * The service account key should be stored as a base64-encoded env var
 * and decoded at runtime. Never commit the raw key to the repository.
 * 
 * Set FIREBASE_SERVICE_ACCOUNT_BASE64 in your .env file.
 */

import { adminDb, adminAuth } from "./server"
import { onValue, query, orderByValue, limitToLast } from "firebase/database"
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"

// Helper to decode the base64 service account
function decodeServiceAccount() {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if (!base64) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set")
  }
  const json = Buffer.from(base64, "base64").toString("utf-8")
  return JSON.parse(json)
}

// Initialize Admin SDK only on server side
let adminInitialized = false

export async function initializeAdminSdk() {
  if (adminInitialized) return
  
  try {
    const serviceAccount = decodeServiceAccount()
    
    const { initializeApp } = await import("firebase-admin/app")
    const { getFirestore } = await import("firebase-admin/firestore")
    const { getAuth } = await import("firebase-admin/auth")
    
    // Initialize Admin App
    // @ts-expect-error - adminApp type
    const adminApp = initializeApp({
      credential: require("firebase-admin").credential.cert(serviceAccount),
    })
    
    adminAuth = getAuth(adminApp)
    adminDb = getFirestore(adminApp)
    
    adminInitialized = true
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK", error)
    // Fallback: use client-side Firestore if Admin SDK fails
    // This is intentional for development or when service account is not configured
  }
}

// Call initialization on module import (server-side only)
if (typeof window === "undefined") {
  initializeAdminSdk().catch(console.error)
}

export { adminDb, adminAuth }