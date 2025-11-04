"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"

export default function AuthCodeError() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
            Login Gagal
          </h1>
          <p className="text-muted-foreground mb-6">
            Terjadi kesalahan saat proses login. Silakan coba lagi.
          </p>
          <Button 
            onClick={() => router.push('/login')}
            className="w-full"
          >
            Coba Lagi
          </Button>
        </div>
      </main>
    </div>
  )
}