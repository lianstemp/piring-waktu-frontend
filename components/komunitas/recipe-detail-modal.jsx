"use client"

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, Clock, Users, ChefHat, BookOpen, MessageCircle, Heart } from "lucide-react"
import { useState } from "react"

export function RecipeDetailModal({ isOpen, onClose, recipe }) {
  const [activeTab, setActiveTab] = useState("recipe")

  if (!recipe) return null

  const renderStars = (rating) => {
    if (!rating) return null
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {recipe.recipe_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Image and Author Info */}
          <div className="space-y-4">
            {/* Recipe Image */}
            <div className="aspect-square rounded-xl overflow-hidden">
              {recipe.user_photo_url ? (
                <img 
                  src={recipe.user_photo_url} 
                  alt={recipe.recipe_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <ChefHat size={64} className="text-orange-400" />
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">
                    {recipe.profiles?.full_name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {recipe.profiles?.full_name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(recipe.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {recipe.user_rating && (
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Rating:</p>
                  {renderStars(recipe.user_rating)}
                </div>
              )}

              {recipe.user_review && (
                <div>
                  <p className="text-sm font-medium mb-2">Review:</p>
                  <p className="text-sm text-muted-foreground italic">
                    "{recipe.user_review}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Recipe Details */}
          <div className="space-y-4">
            {/* Recipe Meta */}
            <div className="grid grid-cols-3 gap-4">
              {recipe.recipe_data?.prep_time && (
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Clock size={20} className="mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Persiapan</p>
                  <p className="text-sm font-semibold">{recipe.recipe_data.prep_time}</p>
                </div>
              )}
              
              {recipe.recipe_data?.cook_time && (
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <ChefHat size={20} className="mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Memasak</p>
                  <p className="text-sm font-semibold">{recipe.recipe_data.cook_time}</p>
                </div>
              )}
              
              {recipe.recipe_data?.servings && (
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Users size={20} className="mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Porsi</p>
                  <p className="text-sm font-semibold">{recipe.recipe_data.servings}</p>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("recipe")}
                  className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "recipe"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Resep
                </button>
                {recipe.recipe_data?.history && (
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "history"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sejarah
                  </button>
                )}
                {recipe.cooking_notes && (
                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "notes"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Catatan
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activeTab === "recipe" && (
                <div className="space-y-4">
                  {/* Ingredients */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Bahan-bahan:</h4>
                    <ul className="space-y-1">
                      {recipe.recipe_data?.ingredients?.map((ingredient, index) => (
                        <li key={index} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Cara Memasak:</h4>
                    <ol className="space-y-2">
                      {recipe.recipe_data?.instructions?.map((step, index) => (
                        <li key={index} className="text-sm text-foreground flex gap-3">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {activeTab === "history" && recipe.recipe_data?.history && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={20} className="text-primary" />
                    <h4 className="font-semibold text-foreground">Sejarah Resep</h4>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {recipe.recipe_data.history}
                  </p>
                </div>
              )}

              {activeTab === "notes" && recipe.cooking_notes && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle size={20} className="text-primary" />
                    <h4 className="font-semibold text-foreground">Catatan Memasak</h4>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {recipe.cooking_notes}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="flex-1">
                <Heart size={16} className="mr-2" />
                Suka
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageCircle size={16} className="mr-2" />
                Komentar
              </Button>
              <Button size="sm" className="flex-1">
                Coba Resep
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}