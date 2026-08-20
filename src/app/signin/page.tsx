"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { auth } from "@/firebase/config"
import { useAuth } from "@/hooks/useAuth"
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth"
import { createUser, getUser } from "@/services/firestore"
import { Loader2, LogOut, ArrowRight, MessageCircle, Mail } from "lucide-react"

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier
  }
}

const inputCls =
  "mt-1 flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-200"

export default function SignInPage() {
  const router = useRouter()
  const { user, profile, isAdmin, loading, signOut, signInWithGoogle, signInWithEmailAndPassword, registerWithEmailAndPassword, sendPasswordReset, sendVerificationEmail } = useAuth()
  const [mode, setMode] = useState<"login" | "signup">("login")

  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [sent, setSent] = useState(false)
  const [resendIn, setResendIn] = useState(0)
  const [busy, setBusy] = useState<null | "send" | "verify" | "google" | "email" | "reset" | "verifymail">(null)
  const [error, setError] = useState<string | null>(null)
  const [userName, setUserName] = useState("")
  const [businessName, setBusinessName] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailMode, setEmailMode] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const confirmationRef = useRef<ConfirmationResult | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Redirect signed-in users based on their role
  useEffect(() => {
    if (user && !loading) {
      router.push(isAdmin ? "/admin" : "/account")
    }
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const validPhone = /^[6-9]\d{9}$/.test(phone.trim())

  const sendOtp = async () => {
    if (!validPhone) return
    setBusy("send")
    setError(null)
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {},
        })
      }
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone.trim()}`, window.recaptchaVerifier)
      confirmationRef.current = confirmation
      setSent(true)
      setOtp("")
      setResendIn(30)
      timerRef.current = setInterval(() => {
        setResendIn((prev) => {
          if (prev <= 1 && timerRef.current) {
            clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      setError("Couldn't send the OTP. Check the number and try again. (Make sure Phone sign-in is enabled in Firebase.)")
      console.error("sendOtp error:", err)
    } finally {
      setBusy(null)
    }
  }

  const verifyOtp = async () => {
    if (otp.trim().length !== 6 || !confirmationRef.current) return
    setBusy("verify")
    setError(null)
    try {
      const result = await confirmationRef.current.confirm(otp.trim())
      const uid = result.user.uid
      const ph = result.user.phoneNumber || `+91${phone.trim()}`

      // Save / load the user profile in Firestore (keyed by UID)
      const existing = (await getUser(uid).catch(() => null)) || (await getUser(ph).catch(() => null))
      if (!existing) {
        await createUser({
          uid,
          id: uid,
          email: result.user.email || `${ph.replace(/\D/g, "")}@webforge.in`,
          displayName: userName.trim() || null,
          phone: ph,
          businessName: businessName.trim() || null,
          role: "customer",
        }).catch(() => {
          // profile already created concurrently — fine
        })
      }
    } catch (err) {
      setError("Incorrect OTP. Please check and try again.")
      console.error("verifyOtp error:", err)
    } finally {
      setBusy(null)
    }
  }

  const handleSend = (e: FormEvent) => {
    e.preventDefault()
    if (!sent) {
      sendOtp()
    } else {
      verifyOtp()
    }
  }

  const backToNumber = () => {
    setSent(false)
    confirmationRef.current = null
    setOtp("")
    setError(null)
  }

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setBusy("email")
    setError(null)
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(email, password)
      } else {
        await registerWithEmailAndPassword(email, password)
      }
    } catch {
      setError(mode === "login" ? "Invalid email or password." : "Couldn't create the account. This email may already be registered.")
    } finally {
      setBusy(null)
    }
  }

  const handleForgot = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    setBusy("reset")
    setError(null)
    setEmailSent(false)
    try {
      await sendPasswordReset(email)
      setEmailSent(true)
    } catch {
      setError("We couldn't send a reset link. Check the email and try again.")
    } finally {
      setBusy(null)
    }
  }

  const handleVerifyEmail = async () => {
    setBusy("verifymail")
    setVerificationSent(false)
    try {
      await sendVerificationEmail()
      setVerificationSent(true)
    } catch {
      setError("Couldn't send the verification email. Try again.")
    } finally {
      setBusy(null)
    }
  }

  return (
    <main className="flex-1">
      <Navbar />

      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-amber-100 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-md px-6">
          {loading ? (
            <div className="flex justify-center py-20 text-zinc-500">Checking session...</div>
          ) : user ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-card">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-lg font-bold text-amber-600">
                {(user.displayName || user.phoneNumber || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <h1 className="mt-4 text-2xl font-bold text-zinc-900">You&apos;re signed in</h1>
              <p className="mt-2 text-sm text-zinc-500">
                {user.displayName || "Welcome"} · {user.phoneNumber || user.email}
              </p>
              {user.email && !user.emailVerified && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-xs text-amber-800">
                  <p className="font-semibold">Email not verified</p>
                  <p className="mt-0.5">Verify your email to keep your account secure.</p>
                  <button
                    onClick={handleVerifyEmail}
                    disabled={busy !== null}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
                  >
                    {busy === "verifymail" ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" /> Sending...
                      </>
                    ) : verificationSent ? (
                      "Sent! Check your inbox"
                    ) : (
                      "Send verification email"
                    )}
                  </button>
                  {error && <p className="mt-2 text-red-600">{error}</p>}
                </div>
              )}
              <Button asChild className="mt-6 w-full">
                <Link href={isAdmin ? "/admin" : "/account"}>
                  Go to {isAdmin ? "dashboard" : "my account"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="mt-3 w-full"
                onClick={async () => {
                  await signOut()
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-card">
              {/* Mode toggle */}
              <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-zinc-100 p-1">
                <button
                  onClick={() => setMode("login")}
                  className={`rounded-full py-2 text-sm font-medium transition-colors ${
                    mode === "login" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"
                  }`}
                >
                  Log in
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={`rounded-full py-2 text-sm font-medium transition-colors ${
                    mode === "signup" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"
                  }`}
                >
                  Create account
                </button>
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-zinc-900">
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </h1>
                <p className="mt-2 text-sm text-zinc-500">
                  Use your WhatsApp mobile number — we&apos;ll send you a one-time password (OTP).
                </p>
              </div>

              {!sent ? (
                <form onSubmit={handleSend} className="mt-6 space-y-4">
                  {mode === "signup" && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-zinc-700">Your name</label>
                        <input
                          type="text"
                          className={inputCls}
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Rahul Sharma"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-zinc-700">Business name</label>
                        <input
                          type="text"
                          className={inputCls}
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Sharma Restaurant"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="text-sm font-medium text-zinc-700">WhatsApp mobile number</label>
                    <div className="mt-1 flex gap-2">
                      <div className="flex h-11 w-24 shrink-0 items-center justify-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-700">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        className={`${inputCls} mt-0`}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="98765 43210"
                        autoComplete="tel"
                      />
                    </div>
                    {phone.length > 0 && !validPhone && (
                      <p className="mt-1.5 text-xs text-red-500">Enter a valid 10-digit Indian mobile number.</p>
                    )}
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" size="lg" disabled={busy !== null || !validPhone}>
                    {busy === "send" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send OTP on WhatsApp
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-zinc-500">
                    We&apos;ll send a secure 6-digit code to this number via SMS. Standard rates apply.
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSend} className="mt-6 space-y-4">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
                    OTP sent to <span className="font-semibold text-zinc-900">+91 {phone}</span>
                    <button
                      type="button"
                      onClick={backToNumber}
                      className="ml-2 font-medium text-amber-600 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Enter 6-digit OTP</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoFocus
                      className={`${inputCls} text-center text-2xl tracking-[0.5em]`}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="••••••"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" size="lg" disabled={busy !== null || otp.length !== 6}>
                    {busy === "verify" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                      </>
                    ) : (
                      <>
                        Verify &amp; continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-zinc-500">
                    {resendIn > 0 ? (
                      <>Resend code in {resendIn}s</>
                    ) : (
                      <>
                        Didn&apos;t get it?{" "}
                        <button
                          type="button"
                          onClick={sendOtp}
                          className="font-medium text-amber-600 hover:underline"
                          disabled={busy !== null}
                        >
                          Resend OTP
                        </button>
                      </>
                    )}
                  </p>
                </form>
              )}

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-xs text-zinc-500">or</span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={async () => {
                  setBusy("google")
                  setError(null)
                  try {
                    await signInWithGoogle()
                  } catch {
                    setError("Google sign-in failed. Please try again.")
                  } finally {
                    setBusy(null)
                  }
                }}
                disabled={busy !== null}
              >
                <Mail className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>

              <button
                type="button"
                onClick={() => {
                  setEmailMode((v) => !v)
                  setForgotMode(false)
                  setError(null)
                }}
                className="mt-3 w-full text-center text-sm font-medium text-amber-600 hover:underline"
              >
                {emailMode ? "← Use WhatsApp number instead" : "Use email & password instead"}
              </button>

              {emailMode && !forgotMode && (
                <form onSubmit={handleEmailSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Email</label>
                    <input
                      type="email"
                      className={inputCls}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-zinc-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setForgotMode(true)}
                        className="text-xs font-medium text-amber-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      className={inputCls}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" size="lg" disabled={busy !== null || !email || password.length < 6}>
                    {busy === "email" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {mode === "login" ? "Signing in..." : "Creating account..."}
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        {mode === "login" ? "Log in with email" : "Create account with email"}
                      </>
                    )}
                  </Button>
                  <p className="text-center text-xs text-zinc-500">
                    {mode === "signup" && "We'll send you a verification link after signup."}
                  </p>
                </form>
              )}

              {emailMode && forgotMode && (
                <form onSubmit={handleForgot} className="mt-4 space-y-4">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                    Enter your email and we&apos;ll send you a password reset link.
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Email</label>
                    <input
                      type="email"
                      className={inputCls}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  {emailSent && (
                    <p className="text-sm text-emerald-600">Reset link sent! Check your inbox (and spam).</p>
                  )}
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={busy !== null || !email}>
                    {busy === "reset" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setForgotMode(false)}
                    className="w-full text-center text-sm font-medium text-amber-600 hover:underline"
                  >
                    ← Back to sign in
                  </button>
                </form>
              )}
            </div>
          )}

          {/* reCAPTCHA target for Firebase phone auth */}
          <div id="recaptcha-container" className="sr-only" />
        </div>
      </section>

      <Footer />
    </main>
  )
}
