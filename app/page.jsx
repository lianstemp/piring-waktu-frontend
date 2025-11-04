import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FeaturedDishes from "@/components/featured-dishes"
import AboutSection from "@/components/about-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/indonesian-nusantara-rice-terraces-lush-green-land.jpg"
              alt="Nusantara landscape"
              className="w-full h-full object-cover"
              fill
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60" />
          </div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 animate-fadeInUp text-balance drop-shadow-lg">
            Temukan Sejarah di Balik Setiap Rasa
          </h1>

          <p
            className="text-lg md:text-xl text-gray-100 mb-12 max-w-2xl mx-auto animate-fadeInUp drop-shadow-md"
            style={{ animationDelay: "0.1s" }}
          >
            Piring Waktu menggabungkan AI dan budaya untuk mengenalkan sejarah kuliner Nusantara dari Sabang sampai
            Merauke.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            <Link href="/dapur-ai">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Mulai Sekarang
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-base font-semibold bg-transparent"
              >
                Masuk
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements with green and brown accent */}
        <div className="absolute inset-0 opacity-10 z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-accent blur-3xl"></div>
        </div>
      </section>

      {/* Featured Dishes */}
      <FeaturedDishes />

      {/* About Section */}
      <AboutSection />

      {/* Footer */}
      <Footer />
    </div>
  )
}
