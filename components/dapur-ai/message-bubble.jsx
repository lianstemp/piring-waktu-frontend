import { Loader } from "lucide-react"

import { Clock, Users, ChefHat, BookOpen, Heart, Share2 } from "lucide-react"

export function MessageBubble({ message, handleSelectRecipe, sessionId, savedRecipes, toggleSaveRecipe, onMarkAsCooked }) {
  if (message.type === "user") {
    return (
      <div className="max-w-lg bg-primary text-primary-foreground rounded-2xl p-4">
        <p className="text-sm">{message.content}</p>
      </div>
    )
  }

  // AI message with recipe recommendations
  if (message.recipes && message.recipes.length > 0) {
    return (
      <div className="max-w-lg bg-card border border-border rounded-2xl p-4 w-full">
        <p className="text-sm text-foreground mb-4">{message.content}</p>
        <div className="space-y-2">
          {message.recipes.map((recipe, index) => (
            <button
              key={`${recipe.name}-${index}`}
              onClick={() => handleSelectRecipe(recipe, message.id, sessionId)}
              className="w-full text-left p-3 rounded-lg bg-background hover:bg-muted transition-colors border border-border"
            >
              <h5 className="font-semibold text-foreground text-sm">{recipe.name}</h5>
              <p className="text-xs text-muted-foreground">{recipe.region}</p>
              {recipe.description && (
                <p className="text-xs text-muted-foreground mt-1">{recipe.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                {recipe.difficulty && (
                  <span className="flex items-center gap-1">
                    <ChefHat size={12} />
                    {recipe.difficulty}
                  </span>
                )}
                {recipe.time && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {recipe.time}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // AI message with detailed recipe
  if (message.recipeDetail) {
    const recipe = message.recipeDetail
    const isRecipeSaved = savedRecipes.some(saved => 
      saved.session_id === sessionId && saved.message_id === message.id
    )

    return (
      <div className="max-w-2xl bg-card border border-border rounded-2xl p-6 w-full">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-foreground">{recipe.name}</h3>
          <p className="text-sm text-muted-foreground">{recipe.region}</p>
        </div>

        {recipe.history && (
          <div className="mb-4">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <BookOpen size={16} />
              Sejarah
            </h4>
            <p className="text-sm text-foreground">{recipe.history}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Bahan-bahan</h4>
            <ul className="text-sm text-foreground space-y-1">
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            {recipe.prep_time && recipe.cook_time && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Persiapan: {recipe.prep_time}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Masak: {recipe.cook_time}
                </span>
              </div>
            )}
            
            {recipe.servings && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users size={14} />
                {recipe.servings} porsi
              </div>
            )}

            {recipe.difficulty && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <ChefHat size={14} />
                Tingkat kesulitan: {recipe.difficulty}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-foreground mb-2">Cara Memasak</h4>
          <ol className="text-sm text-foreground space-y-2">
            {recipe.instructions?.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {recipe.tips && recipe.tips.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-foreground mb-2">Tips</h4>
            <ul className="text-sm text-foreground space-y-1">
              {recipe.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary">💡</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t border-border">
          <button
            onClick={() => toggleSaveRecipe(sessionId, message.id, recipe.name, recipe)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              isRecipeSaved
                ? "bg-primary text-primary-foreground"
                : "bg-background border border-border hover:bg-muted"
            }`}
          >
            <Heart size={16} className={isRecipeSaved ? "fill-current" : ""} />
            {isRecipeSaved ? "Tersimpan" : "Simpan"}
          </button>
          
          <button
            onClick={() => onMarkAsCooked({
              sessionId,
              messageId: message.id,
              recipeName: recipe.name,
              recipeData: recipe
            })}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-background border border-border hover:bg-muted transition-colors"
          >
            <ChefHat size={16} />
            Sudah Dimasak
          </button>
          
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-background border border-border hover:bg-muted transition-colors">
            <Share2 size={16} />
            Bagikan
          </button>
        </div>
      </div>
    )
  }

  // Regular AI message or loading
  return (
    <div className="max-w-lg bg-card border border-border rounded-2xl p-4">
      {message.isLoading ? (
        <div className="flex items-center gap-2">
          <Loader size={16} className="animate-spin" />
          <span className="text-sm">Sedang berpikir...</span>
        </div>
      ) : (
        <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
      )}
    </div>
  )
}