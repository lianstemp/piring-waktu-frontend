"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import api from "@/lib/api"
import { CommunityFeed } from "@/components/komunitas/community-feed"
import { RecipeDetailModal } from "@/components/komunitas/recipe-detail-modal"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, SlidersHorizontal } from "lucide-react"

export default function KomunitasPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [user, setUser] = useState(null)
  const [feedData, setFeedData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadCommunityFeed()
    }
  }, [user])

  useEffect(() => {
    let filtered = [...feedData]

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(recipe => 
        recipe.recipe_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.recipe_data?.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.user_review?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by rating
    if (filterBy === "high-rated") {
      filtered = filtered.filter(recipe => recipe.user_rating >= 4)
    } else if (filterBy === "with-photos") {
      filtered = filtered.filter(recipe => recipe.user_photo_url)
    }

    // Sort data
    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.user_rating || 0) - (a.user_rating || 0))
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.recipe_name.localeCompare(b.recipe_name))
    }

    setFilteredData(filtered)
  }, [searchQuery, feedData, sortBy, filterBy])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    }
  }

  const loadCommunityFeed = async () => {
    try {
      setLoading(true)
      const response = await api.recipe.getCommunityFeed(48, 0) // Load more items
      setFeedData(response.recipes || [])
      setFilteredData(response.recipes || [])
    } catch (error) {
      console.error("Error loading community feed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe)
    setDetailModalOpen(true)
  }

  const handleModalClose = () => {
    setDetailModalOpen(false)
    setSelectedRecipe(null)
    // Refresh feed data to update interaction counts
    loadCommunityFeed()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <Header />

      {/* Hero Section */}
      <div className="pt-20 bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Komunitas Rasa
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Lihat hasil masakan dari komunitas penggemar kuliner Nusantara yang telah mencoba resep-resep tradisional
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Cari hidangan, chef, atau daerah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-center bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary/50 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2 flex-1">
            <Filter size={20} className="text-muted-foreground" />
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter resep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Resep</SelectItem>
                <SelectItem value="high-rated">Rating Tinggi (4+)</SelectItem>
                <SelectItem value="with-photos">Dengan Foto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} className="text-muted-foreground" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
                <SelectItem value="name">Nama A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Info */}
        {(searchQuery || filterBy !== "all") && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredData.length > 0 
                ? `Menampilkan ${filteredData.length} hasil${searchQuery ? ` untuk "${searchQuery}"` : ""}`
                : `Tidak ada hasil${searchQuery ? ` untuk "${searchQuery}"` : ""}`
              }
            </p>
          </div>
        )}
        
        <CommunityFeed 
          feedData={filteredData}
          loading={loading}
          onRecipeClick={handleRecipeClick}
        />
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          isOpen={detailModalOpen}
          onClose={handleModalClose}
          recipe={selectedRecipe}
        />
      )}
    </div>
  )
}