"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/piring-waktu-logo.svg" alt="Piring Waktu" width={40} height={40} className="rounded-full" />
          <span className="hidden md:inline font-serif font-bold text-lg text-foreground">Piring Waktu</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Beranda
          </Link>
          <Link href="#tentang" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Tentang
          </Link>
          <Link href="/dapur-ai" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Dapur AI
          </Link>
          <Link href="/komunitas" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Komunitas
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-foreground hover:bg-muted">
              Masuk / Daftar
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground" aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border md:hidden">
            <div className="flex flex-col gap-4 p-6">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="#tentang"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Tentang
              </Link>
              <Link
                href="/dapur-ai"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Dapur AI
              </Link>
              <Link
                href="/komunitas"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Komunitas
              </Link>
              <hr className="border-border" />
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full text-foreground hover:bg-muted">
                  Masuk / Daftar
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
