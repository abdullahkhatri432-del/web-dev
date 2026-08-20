"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Loader2, LogOut, ArrowRight, Mail, User, Lock } from "lucide-react"

const inputCls =
  "mt-1 flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-200"

export default function SignInPage() {
  const router = useRouter()
  const {
    user,
    isAdmin,
    loading,
    signOut,
    signInWithGoogle,
    signInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    sendVerificationEmail,
  } = useAuth()
  const [mode, setMode] = useState<"login" | "signup">("login")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [forgotMode, setForgotMode] = useState(false)
  const [busy, setBusy] = useState<null | "google" | "email" | "reset" | "verifymail">(null)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setBusy("email")
    setError(null)
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(email, password)
      } else {
        await registerWithEmailAndPassword(email, password, name)
      }
    } catch {
      setError(
        mode === "login"
          ? "Invalid email or password."
          : "Couldn't create the account. This email may already be registered.",
      )
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
                {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <h1 className="mt-4 text-2xl font-bold text-zinc-900">You&apos;re signed in</h1>
              <p className="mt-2 text-sm text-zinc-500">{user.displayName || "Welcome"} · {user.email}</p>
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
                  onClick={() => {
                    setMode("login")
                    setForgotMode(false)
                    setError(null)
                  }}
                  className={`rounded-full py-2 text-sm font-medium transition-colors ${
                    mode === "login" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"
                  }`}
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setMode("signup")
                    setForgotMode(false)
                    setError(null)
                  }}
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
                  {mode === "login"
                    ? "Log in with your email address."
                    : "Sign up in seconds — no payment needed."}
                </p>
              </div>

              {!forgotMode ? (
                <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
                  {mode === "signup" && (
                    <div>
                      <label className="text-sm font-medium text-zinc-700">Your name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <input
                          type="text"
                          className={`${inputCls} pl-10`}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Rahul Sharma"
                          autoComplete="name"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="email"
                        className={`${inputCls} pl-10`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-zinc-700">Password</label>
                      {mode === "login" && (
                        <button
                          type="button"
                          onClick={() => setForgotMode(true)}
                          className="text-xs font-medium text-amber-600 hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="password"
                        className={`${inputCls} pl-10`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                      />
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={busy !== null || !email || password.length < 6}
                  >
                    {busy === "email" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        {mode === "login" ? "Signing in..." : "Creating account..."}
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        {mode === "login" ? "Log in with email" : "Create account"}
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleForgot} className="mt-6 space-y-4">
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
                {busy === "google" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.55-5.17 3.55-8.87z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  )
}