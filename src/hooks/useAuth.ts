"use client"

import { useEffect, useState } from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User,
} from "firebase/auth"
import { auth, googleProvider } from "../firebase/config"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      return result
    } catch (error) {
      console.error("Google sign in error:", error)
      throw error
    }
  }

  const signInWithEmailAndPasswordFn = async (email: string, password: string) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Email sign in error:", error)
      throw error
    }
  }

  const registerWithEmailAndPassword = async (email: string, password: string) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Email registration error:", error)
      throw error
    }
  }

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error("Password reset error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  return { user, loading, signInWithGoogle, signInWithEmailAndPassword: signInWithEmailAndPasswordFn, registerWithEmailAndPassword, sendPasswordReset, signOut }
}