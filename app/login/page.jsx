"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
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
            <Button onClick={handleGoogle} className="w-full" disabled={loading}>
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
