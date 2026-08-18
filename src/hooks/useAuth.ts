"use client"

import { useEffect, useState, useCallback } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "../firebase/config"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(user, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await import("firebase/auth").then(mod => {
        const googleProvider = new mod.GoogleAuthProvider()
        googleProvider.setCustomParameters({
          prompt: "select_account",
          login_hint: "maximize_continue",
        })
        return signInWithPopup(auth, googleProvider)
      })
      return result
    } catch (error) {
      console.error("Google sign in error:", error)
      throw error
    }
  }

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await import("firebase/auth").then(mod => {
        return signInWithEmailAndPassword(auth, email, password)
      })
    } catch (error) {
      console.error("Email sign in error:", error)
      throw error
    }
  }

  const registerWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await import("firebase/auth").then(mod => {
        return createUserWithEmailAndPassword(auth, email, password)
      })
    } catch (error) {
      console.error("Email registration error:", error)
      throw error
    }
  }

  const sendPasswordReset = async (email: string) => {
    try {
      await import("firebase/auth").then(mod => {
        return sendPasswordEmail(auth, email)
      })
    } catch (error) {
      console.error("Password reset error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await import("firebase/auth").then(mod => {
        return signOut(auth)
      })
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  return { user, loading, signInWithGoogle, signInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, signOut }
}