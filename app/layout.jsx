import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata = {
  title: "Piring Waktu - Jelajahi Sejarah Kuliner Nusantara",
  description:
    "Platform AI-powered untuk mengeksplorasi sejarah kuliner Nusantara dengan komunitas yang aktif dan asisten AI yang ahli.",
  generator: "v0.app",
  keywords: "kuliner, Nusantara, resep tradisional, AI, komunitas",
  authors: [{ name: "Piring Waktu" }],
  openGraph: {
    title: "Piring Waktu - Jelajahi Sejarah Kuliner Nusantara",
    description: "Platform AI-powered untuk mengeksplorasi sejarah kuliner Nusantara",
    type: "website",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${_geist.className} ${_geistMono.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
