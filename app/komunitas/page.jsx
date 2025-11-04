"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Image from "next/image"
import { Search, Plus, Heart, MessageCircle, Share2, Star } from "lucide-react"
import Link from "next/link"

const completedDishes = [
  {
    id: "1",
    author: "Siti Nurhaliza",
    avatar: "/wanita.jpg",
    dish: "Rendang Daging",
    region: "Minangkabau, Sumatera Barat",
    image: "/rendang-daging-merah-coklat.jpg",
    userPhoto: "/rendang-daging-merah-coklat.jpg",
    review: "Rendang buatan saya kali ini lebih empuk dari biasanya. Rahasia: masak dengan panas sedang lebih lama dan air santan yang cukup!",
    rating: 5,
    likes: 245,
    comments: 32,
    shares: 18,
    isPublic: true,
    cookedAt: "2 jam yang lalu",
    originalRecipe: {
      history: "Rendang adalah masakan tradisional dari Minangkabau yang telah masuk ke daftar 50 makanan terbaik dunia.",
      ingredients: ["Daging sapi 1 kg", "Santan 1 liter", "Cabai merah 10 buah"],
      steps: ["Potong daging menjadi ukuran sedang", "Haluskan bumbu dan tumis hingga harum"]
    }
  },
  {
    id: "2",
    author: "Budi Santoso",
    avatar: "/pria.jpg",
    dish: "Gudeg",
    region: "Yogyakarta, Jawa Tengah",
    image: "/gudeg-nangka-kuning.jpg",
    userPhoto: "/gudeg-nangka-kuning.jpg",
    review: "Pertama kali coba buat gudeg dari resep asli. Hasilnya sangat memuaskan, rasa nangka muda yang lembut berpadu dengan santan kental.",
    rating: 4,
    likes: 156,
    comments: 21,
    shares: 12,
    isPublic: true,
    cookedAt: "5 jam yang lalu",
    originalRecipe: {
      history: "Gudeg adalah hidangan khas Yogyakarta yang terbuat dari nangka muda.",
      ingredients: ["Nangka muda 2 kg", "Santan 1 liter", "Bawang merah 8 siung"],
      steps: ["Rebus nangka muda hingga empuk", "Tumis bumbu halus hingga harum"]
    }
  },
  {
    id: "3",
    author: "Putri Dewi",
    avatar: "/gadis.jpg",
    dish: "Sate Lilit",
    region: "Bali",
    image: "/sate-lilit-daging.jpg",
    userPhoto: "/sate-lilit-daging.jpg",
    review: "Sate lilit buatan saya hari ini sempurna! Daging giling yang pas, dibungkus daun kelapa muda, dan saus kacang yang gurih.",
    rating: 5,
    likes: 312,
    comments: 45,
    shares: 28,
    isPublic: true,
    cookedAt: "1 hari yang lalu",
    originalRecipe: {
      history: "Sate Lilit adalah makanan tradisional Bali yang terbuat dari daging cincang yang ditarik pada sebuah lidi.",
      ingredients: ["Daging babi giling 500g", "Kelapa parut 200g", "Bawang merah 5 siung"],
      steps: ["Campur daging cincang, kelapa parut, dan bumbu halus", "Lilitkan pada lidi hingga rata"]
    }
  },
]

export default function KomunitasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [likedPosts, setLikedPosts] = useState([])

  const toggleLike = (postId) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    )
  }

  const filteredDishes = completedDishes.filter(dish => 
    dish.isPublic && (
      dish.dish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.region.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif font-bold text-foreground mb-4 text-balance">
              Komunitas Rasa
            </h1>
            <p className="text-lg text-muted-foreground">
              Lihat hasil masakan dari komunitas penggemar kuliner Nusantara yang telah mencoba resep-resep tradisional
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari hidangan, chef, atau daerah asal..."
                className="pl-12 bg-card border-border text-foreground placeholder:text-muted-foreground rounded-full"
              />
            </div>
          </div>

          {/* Completed Dishes Feed */}
          <div className="space-y-6">
            {filteredDishes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Tidak ada hidangan yang ditemukan.</p>
              </div>
            ) : (
              filteredDishes.map((dish) => (
                <Card
                  key={dish.id}
                  className="border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Post Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-4">
                      <Image
                        src={dish.avatar || "/placeholder.svg"}
                        alt={dish.author}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{dish.author}</h3>
                        <p className="text-sm text-muted-foreground">telah memasak • {dish.cookedAt}</p>
                      </div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ✓ Sudah Dimasak
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-serif font-bold text-foreground mb-1">{dish.dish}</h2>
                      <p className="text-sm text-accent mb-4">{dish.region}</p>
                      <div className="flex items-center gap-2 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${i < dish.rating ? "fill-accent text-accent" : "text-muted"}`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">({dish.rating}/5)</span>
                      </div>
                    </div>

                    {/* Recipe History */}
                    <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2 text-sm">Sejarah & Asal:</h4>
                      <p className="text-sm text-muted-foreground">{dish.originalRecipe.history}</p>
                    </div>

                    {/* User Review */}
                    {dish.review && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-2 text-sm">Review dari {dish.author}:</h4>
                        <p className="text-muted-foreground leading-relaxed">{dish.review}</p>
                      </div>
                    )}

                    {/* User Photo */}
                    <div className="w-full rounded-lg mb-6 h-96 overflow-hidden">
                      <Image
                        src={dish.userPhoto || "/placeholder.svg"}
                        alt={`${dish.dish} oleh ${dish.author}`}
                        width={1200}
                        height={720}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between text-muted-foreground">
                      <button
                        onClick={() => toggleLike(dish.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          likedPosts.includes(dish.id) ? "text-accent bg-accent/10" : "hover:bg-muted"
                        }`}
                      >
                        <Heart size={20} className={likedPosts.includes(dish.id) ? "fill-current" : ""} />
                        <span className="text-sm">
                          {dish.likes + (likedPosts.includes(dish.id) ? 1 : 0)}
                        </span>
                      </button>

                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-all">
                        <MessageCircle size={20} />
                        <span className="text-sm">{dish.comments}</span>
                      </button>

                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-all">
                        <Share2 size={20} />
                        <span className="text-sm">{dish.shares}</span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
