import { Lightbulb, BookOpen, Users } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="tentang" className="py-20 px-6 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 text-balance">
              Tentang Piring Waktu
            </h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Piring Waktu adalah platform inovatif yang menggabungkan teknologi AI dengan kearifan budaya lokal. Kami
              percaya bahwa setiap hidangan memiliki cerita yang perlu dilestarikan dan dibagikan kepada generasi
              mendatang.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
                    <Lightbulb className="text-primary-foreground" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Inovasi Teknologi</h3>
                  <p className="text-muted-foreground">
                    AI kami menganalisis bahan makanan dan mengidentifikasi resep tradisional dengan akurat.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent">
                    <BookOpen className="text-accent-foreground" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Warisan Budaya</h3>
                  <p className="text-muted-foreground">
                    Setiap resep dilengkapi dengan sejarah, asal-usul, dan cerita budaya yang mendalam.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-secondary">
                    <Users className="text-secondary-foreground" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Komunitas Aktif</h3>
                  <p className="text-muted-foreground">
                    Bagikan pengalaman memasak Anda dan pelajari dari ribuan pengguna lainnya.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 blur-3xl"></div>
            <div className="relative rounded-2xl overflow-hidden bg-muted p-8 border border-border">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                  <Lightbulb className="text-primary" size={40} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Teknologi AI Bertemu Budaya</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Platform kami menggunakan kecerdasan buatan untuk menganalisis foto makanan, mengidentifikasi bahan,
                  dan memberikan informasi lengkap tentang sejarah serta cara membuat hidangan tradisional Indonesia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
