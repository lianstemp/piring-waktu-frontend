"use client"

import { Star, Clock, Users, ChefHat, Heart, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/api"

export function CommunityFeed({ feedData, loading, onRecipeClick }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-muted"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (feedData.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <ChefHat size={64} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Tidak Ada Hasil</h3>
        <p className="text-muted-foreground">
          Coba kata kunci lain atau jelajahi semua resep komunitas
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {feedData.map((recipe) => (
        <FeedCard 
          key={recipe.id} 
          recipe={recipe} 
          onClick={() => onRecipeClick(recipe)} 
        />
      ))}
    </div>
  )
}

function FeedCard({ recipe, onClick }) {
  const [interactions, setInteractions] = useState({
    likeCount: 0,
    commentCount: 0
  })

  useEffect(() => {
    loadInteractions()
  }, [recipe.id])

  const loadInteractions = async () => {
    try {
      const data = await api.recipe.getRecipeInteractions(recipe.id)
      setInteractions({
        likeCount: data.likeCount,
        commentCount: data.commentCount
      })
    } catch (error) {
      console.error('Error loading interactions:', error)
    }
  }

  const renderStars = (rating) => {
    if (!rating) return null
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">{rating}</span>
      </div>
    )
  }

  return (
    <div 
      onClick={onClick}
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      {/* Recipe Image */}
      <div className="aspect-square relative overflow-hidden">
        {recipe.user_photos && recipe.user_photos.length > 0 ? (
          <div className="relative w-full h-full">
            <img 
              src={recipe.user_photos[0].url} 
              alt={recipe.recipe_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {recipe.user_photos.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                +{recipe.user_photos.length - 1}
              </div>
            )}
          </div>
        ) : recipe.user_photo_url ? (
          <img 
            src={recipe.user_photo_url} 
            alt={recipe.recipe_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <ChefHat size={32} className="text-orange-400" />
          </div>
        )}
        
        {/* Overlay with quick info */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
              <p className="text-xs text-gray-800 font-medium truncate">
                {recipe.profiles?.full_name || 'Anonymous'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-tight">
          {recipe.recipe_name}
        </h3>
        
        <div className="space-y-1">
          {recipe.user_rating && renderStars(recipe.user_rating)}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {recipe.recipe_data?.prep_time && (
              <div className="flex items-center gap-1">
                <Clock size={10} />
                <span>{recipe.recipe_data.prep_time}</span>
              </div>
            )}
            
            {recipe.recipe_data?.servings && (
              <div className="flex items-center gap-1">
                <Users size={10} />
                <span>{recipe.recipe_data.servings}</span>
              </div>
            )}
          </div>
        </div>

        {recipe.user_review && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            "{recipe.user_review}"
          </p>
        )}

        {/* Interaction Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart size={10} />
              <span>{interactions.likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={10} />
              <span>{interactions.commentCount}</span>
            </div>
          </div>
          <span className="text-xs">
            {new Date(recipe.created_at).toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'short' 
            })}
          </span>
        </div>
      </div>
    </div>
  )
}