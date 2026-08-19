"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/site/navbar"
import { Footer } from "@/components/site/footer"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Mail, Loader2, LogOut, ArrowRight } from "lucide-react"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

const inputCls =
  "mt-1 flex h-11 w-full rounded-xl border border-white/10 bg-card/60 px-4 py-2 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-amber-400/50 focus:ring-2 focus:ring-ring/30"

export default function SignInPage() {
  const router = useRouter()
  const { user, loading, signInWithGoogle, signInWithEmailAndPassword, signOut } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [busy, setBusy] = useState<null | "google" | "email">(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && !loading) router.push("/admin")
  }, [user, loading, router])

  const handleGoogle = async () => {
    setBusy("google")
    setError(null)
    try {
      await signInWithGoogle()
    } catch {
      setError("Google sign-in failed. Please try again.")
    } finally {
      setBusy(null)
    }
  }

  const handleEmail = async (e: FormEvent) => {
    e.preventDefault()
    setBusy("email")
    setError(null)
    try {
      await signInWithEmailAndPassword(email, password)
    } catch {
      setError("Invalid email or password. Please check and try again.")
    } finally {
      setBusy(null)
    }
  }

  return (
    <main className="flex-1">
      <Navbar />

      <section className="relative overflow-hidden pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-md px-6">
          {loading ? (
            <div className="flex justify-center py-20 text-zinc-500">Checking session...</div>
          ) : user ? (
            <div className="rounded-3xl border border-white/5 bg-[#101014] p-8 text-center shadow-card">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/15 text-lg font-bold text-amber-300">
                {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
              </div>
              <h1 className="mt-4 text-2xl font-bold text-white">You&apos;re signed in</h1>
              <p className="mt-2 text-sm text-zinc-400">
                {user.displayName || "Welcome"} · {user.email}
              </p>
              <Button asChild className="mt-6 w-full">
                <Link href="/admin">
                  Go to dashboard
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
            <div className="rounded-3xl border border-white/5 bg-[#101014] p-8 shadow-card">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white">Sign in</h1>
                <p className="mt-2 text-sm text-zinc-400">
                  Access your WebForge dashboard to manage orders.
                </p>
              </div>

              <Button className="mt-6 w-full" onClick={handleGoogle} disabled={busy !== null}>
                {busy === "google" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <GoogleIcon className="mr-2 h-4 w-4" />
                )}
                Continue with Google
              </Button>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-zinc-500">or</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <form onSubmit={handleEmail} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300">Email</label>
                  <input
                    type="email"
                    className={inputCls}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300">Password</label>
                  <input
                    type="password"
                    className={inputCls}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" className="w-full" disabled={busy !== null}>
                  {busy === "email" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Sign in with email
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-zinc-500">
                Need an account? <Link href="/contact" className="text-amber-400 hover:underline">Contact us</Link>
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
