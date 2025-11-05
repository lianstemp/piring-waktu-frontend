"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

function LoginContent() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dapur-ai'

  const handleGoogle = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`
        }
      })

      if (error) {
        console.error("Supabase OAuth error:", error)
        setLoading(false)
      }
      // On success, Supabase will redirect the user to the provider
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">Masuk atau Daftar</h1>
            <p className="text-muted-foreground">Lanjutkan dengan akun Google Anda</p>
          </div>

          <div className="space-y-4">
            <Button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3" disabled={loading}>
              {!loading && (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {loading ? "Mengalihkan..." : "Continue with Google"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Dengan melanjutkan, Anda menyetujui syarat dan kebijakan privasi kami.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
