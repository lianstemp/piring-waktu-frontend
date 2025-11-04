import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Star } from "lucide-react"

const dishes = [
  {
    name: "Rendang Daging",
    region: "Minangkabau, Sumatera Barat",
    description: "Daging sapi empuk dalam kuah santan kental bersama rempah-rempah pilihan.",
    rating: 4.9,
    image: "/rendang-daging-merah-coklat.jpg",
  },
  {
    name: "Gudeg",
    region: "Jawa Tengah",
    description: "Nangka muda yang dimasak dengan santan dan rempah tradisional hingga empuk.",
    rating: 4.8,
    image: "/gudeg-nangka-kuning-santan.jpg",
  },
  {
    name: "Sate Lilit",
    region: "Bali",
    description: "Daging giling yang dibungkus daun kelapa, disajikan dengan bumbu kacang.",
    rating: 4.7,
    image: "/sate-lilit-daging-giling.jpg",
  },
  {
    name: "Papeda",
    region: "Papua",
    description: "Bubur sagu tradisional yang disajikan dengan ikan kuah kuning hangat.",
    rating: 4.6,
    image: "/papeda-sagu-ikan.jpg",
  },
]

export default function FeaturedDishes() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Hidangan Nusantara yang Legendaris
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Jelajahi cita rasa autentik dari berbagai belahan Nusantara dengan sejarah budaya yang kaya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dishes.map((dish, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-border bg-card cursor-pointer group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden h-40 bg-muted">
                <Image
                  src={dish.image || "/placeholder.svg"}
                  alt={dish.name}
                  width={600}
                  height={240}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg text-foreground mb-2 font-serif">{dish.name}</h3>

                <p className="text-sm text-accent mb-3 font-medium">{dish.region}</p>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{dish.description}</p>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${i < Math.floor(dish.rating) ? "fill-accent text-accent" : "text-muted"}`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">{dish.rating}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
