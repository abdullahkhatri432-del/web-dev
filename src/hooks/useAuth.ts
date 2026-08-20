"use client"

import { useEffect, useState, useCallback } from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { auth, googleProvider } from "../firebase/config"
import { createUser, getUserProfile, type User as Profile } from "@/services/firestore"

export type { User }

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (cancelled) return
      setUser(currentUser)
      if (currentUser) {
        const p = await getUserProfile(currentUser).catch(() => null)
        if (!cancelled) setProfile(p)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
      unsub()
    }
  }, [])

  const refreshProfile = useCallback(async (u?: User | null) => {
    const current = u ?? user
    if (!current) {
      setProfile(null)
      return null
    }
    const p = await getUserProfile(current).catch(() => null)
    setProfile(p)
    return p
  }, [user])

  const upsertProfile = useCallback(async (u: User, extra?: Partial<Profile>) => {
    const id = u.uid
    const profileData: Partial<Profile> = {
      id,
      email: u.email ?? null,
      displayName: u.displayName ?? null,
      phone: u.phoneNumber ?? null,
      ...extra,
    }
    await createUser({
      uid: id,
      email: u.email ?? null,
      displayName: u.displayName ?? null,
      phone: u.phoneNumber ?? null,
      businessName: extra?.businessName ?? null,
      role: extra?.role ?? "customer",
    })
    return profileData
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider)
    await upsertProfile(result.user).catch(() => {})
    setProfile(await getUserProfile(result.user).catch(() => null) ?? null)
    return result
  }, [upsertProfile])

  const signInWithEmailAndPasswordFn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password)
  }

  const registerWithEmailAndPassword = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await upsertProfile(result.user).catch(() => {})
    setProfile(await getUserProfile(result.user).catch(() => null) ?? null)
    return result
  }

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const sendVerificationEmail = async (u?: User | null) => {
    const current = u ?? user
    if (!current) return
    await sendEmailVerification(current)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setProfile(null)
  }

  return {
    user,
    profile,
    isAdmin: profile?.role === "admin",
    loading,
    refreshProfile,
    upsertProfile,
    signInWithGoogle,
    signInWithEmailAndPassword: signInWithEmailAndPasswordFn,
    registerWithEmailAndPassword,
    sendPasswordReset,
    sendVerificationEmail,
    signOut,
  }
}