/**
 * Server-side Firebase Admin Setup
 *
 * This uses the Firebase Admin SDK only on the server side.
 * The service account key should be stored as a base64-encoded env var
 * and decoded at runtime. Never commit the raw key to the repository.
 *
 * Set FIREBASE_SERVICE_ACCOUNT_BASE64 in your .env file.
 */

import { cert, getApps, initializeApp as initializeAdminApp, type App } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { getAuth } from "firebase-admin/auth"

// Helper to decode the base64 service account
function decodeServiceAccount() {
  const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
  if (!base64) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set")
  }
  const json = Buffer.from(base64, "base64").toString("utf-8")
  return JSON.parse(json)
}

let adminApp: App | null = null

export function getAdminApp(): App {
  if (adminApp) return adminApp

  const existing = getApps()[0]
  if (existing) {
    adminApp = existing
    return existing
  }

  adminApp = initializeAdminApp({
    credential: cert(decodeServiceAccount()),
  })
  return adminApp
}

export function getAdminDb() {
  return getFirestore(getAdminApp())
}

export function getAdminAuth() {
  return getAuth(getAdminApp())
}
