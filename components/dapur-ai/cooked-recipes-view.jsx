"use client"

import { Star, Clock, Users, ChefHat, Calendar, Eye } from "lucide-react"

export function CookedRecipesView({ 
  cookedViewRecipes
}) {
  const renderStars = (rating) => {
    if (!rating) return null
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">{rating}</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl w-full mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif font-bold text-foreground">Resep Sudah Dimasak</h2>
      </div>

      {cookedViewRecipes?.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Belum Ada Resep yang Dimasak</h3>
          <p className="text-muted-foreground">
            Mulai memasak resep dari chat atau resep yang disimpan untuk melihatnya di sini
          </p>
        </div>
      ) : (
        cookedViewRecipes?.map((cookedRecipe) => (
          <div key={cookedRecipe.id} className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Header with photos */}
            <div className="relative">
              {cookedRecipe.user_photos && cookedRecipe.user_photos.length > 0 ? (
                <div className="aspect-video w-full">
                  {cookedRecipe.user_photos.length === 1 ? (
                    <img 
                      src={cookedRecipe.user_photos[0].url} 
                      alt={cookedRecipe.recipe_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-1 h-full">
                      {cookedRecipe.user_photos.slice(0, 4).map((photo, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={photo.url} 
                            alt={`${cookedRecipe.recipe_name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 3 && cookedRecipe.user_photos.length > 4 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold">
                              +{cookedRecipe.user_photos.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : cookedRecipe.user_photo_url ? (
                <div className="aspect-video w-full">
                  <img 
                    src={cookedRecipe.user_photo_url} 
                    alt={cookedRecipe.recipe_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <ChefHat size={48} className="text-orange-400" />
                </div>
              )}
              
              {/* Recipe info overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h3 className="text-xl font-bold text-white mb-2">{cookedRecipe.recipe_name}</h3>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>
                      {new Date(cookedRecipe.cooked_at || cookedRecipe.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  {cookedRecipe.is_public && (
                    <div className="flex items-center gap-1">
                      <Eye size={14} />
                      <span>Publik</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Rating and Review */}
              {(cookedRecipe.user_rating || cookedRecipe.user_review) && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Review Anda</h4>
                  {cookedRecipe.user_rating && (
                    <div className="mb-2">
                      {renderStars(cookedRecipe.user_rating)}
                    </div>
                  )}
                  {cookedRecipe.user_review && (
                    <p className="text-sm text-foreground italic">
                      "{cookedRecipe.user_review}"
                    </p>
                  )}
                </div>
              )}

              {/* Cooking Notes */}
              {cookedRecipe.cooking_notes && (
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Catatan Memasak</h4>
                  <p className="text-sm text-muted-foreground">
                    {cookedRecipe.cooking_notes}
                  </p>
                </div>
              )}

              {/* Recipe Details */}
              {cookedRecipe.recipe_data && (
                <div className="space-y-4">
                  {/* Recipe Meta */}
                  <div className="grid grid-cols-3 gap-4">
                    {cookedRecipe.recipe_data.prep_time && (
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <Clock size={16} className="mx-auto mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground">Persiapan</p>
                        <p className="text-sm font-semibold">{cookedRecipe.recipe_data.prep_time}</p>
                      </div>
                    )}
                    
                    {cookedRecipe.recipe_data.cook_time && (
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <ChefHat size={16} className="mx-auto mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground">Memasak</p>
                        <p className="text-sm font-semibold">{cookedRecipe.recipe_data.cook_time}</p>
                      </div>
                    )}
                    
                    {cookedRecipe.recipe_data.servings && (
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <Users size={16} className="mx-auto mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground">Porsi</p>
                        <p className="text-sm font-semibold">{cookedRecipe.recipe_data.servings}</p>
                      </div>
                    )}
                  </div>

                  {/* Ingredients and Instructions Preview */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Bahan-bahan</h4>
                      <ul className="text-sm text-foreground space-y-1">
                        {cookedRecipe.recipe_data.ingredients?.slice(0, 5).map((ingredient, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {ingredient}
                          </li>
                        ))}
                        {cookedRecipe.recipe_data.ingredients?.length > 5 && (
                          <li className="text-muted-foreground text-xs">
                            ... dan {cookedRecipe.recipe_data.ingredients.length - 5} bahan lainnya
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Cara Memasak</h4>
                      <ol className="text-sm text-foreground space-y-1">
                        {cookedRecipe.recipe_data.instructions?.slice(0, 3).map((step, index) => (
                          <li key={index} className="flex gap-2">
                            <span className="text-primary font-semibold">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                        {cookedRecipe.recipe_data.instructions?.length > 3 && (
                          <li className="text-muted-foreground text-xs">
                            ... dan {cookedRecipe.recipe_data.instructions.length - 3} langkah lainnya
                          </li>
                        )}
                      </ol>
                    </div>
                  </div>

                  {/* Tags */}
                  {cookedRecipe.recipe_data.tags && cookedRecipe.recipe_data.tags.length > 0 && (
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {cookedRecipe.recipe_data.tags.map((tag, index) => (
                          <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Chat Context */}
              {cookedRecipe.chat_sessions && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Dimasak dari chat: {cookedRecipe.chat_sessions.title}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}