import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Star } from "lucide-react"
import { CookedModal } from "./cooked-modal"
import { RecipeContextButton } from "./recipe-context-button"

export function RecipeCard({ 
  recipe, 
  savedIds, 
  toggleSaveRecipe, 
  onMarkAsCooked,
  sessionTitle,
  messageContent,
  messageCreatedAt,
  onNavigateToChat
}) {
  const [showCookedModal, setShowCookedModal] = useState(false)

  const handleMarkAsCooked = (cookedData) => {
    if (onMarkAsCooked) {
      onMarkAsCooked(cookedData)
    }
  }
  return (
    <div className="bg-card border border-border rounded-2xl p-6 w-full">
      <h3 className="font-serif font-bold text-xl text-foreground mb-2">{recipe.name}</h3>
      <p className="text-accent mb-4">{recipe.region}</p>

      <div className="mb-6">
        <h4 className="font-semibold text-foreground mb-2">Sejarah & Asal:</h4>
        <p className="text-sm text-muted-foreground">{recipe.history}</p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-foreground mb-3">Bahan-Bahan:</h4>
        <ul className="space-y-2">
          {recipe.ingredients.map((ingredient, idx) => (
            <li key={idx} className="text-sm text-muted-foreground flex items-start">
              <span className="text-primary mr-2">•</span>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      {recipe.steps && (
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3">Cara Memasak:</h4>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Chat Context Button */}
      {(sessionTitle || messageContent) && (
        <div className="mb-4 flex justify-start">
          <RecipeContextButton
            sessionTitle={sessionTitle}
            messageContent={messageContent}
            messageCreatedAt={messageCreatedAt}
            onNavigateToChat={onNavigateToChat}
          />
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          size="sm"
          className="border-border text-foreground bg-transparent hover:bg-muted rounded-lg flex items-center gap-2"
        >
          <Mic size={16} />
          Dengarkan
        </Button>

        {savedIds.includes(recipe.id) ? (
          <Button
            size="sm"
            onClick={() => toggleSaveRecipe(recipe.id)}
            className="bg-yellow-400 text-black rounded-lg flex items-center gap-2 px-3 py-1"
          >
            <Star size={16} />
            {recipe.steps ? "Ditandai - Akan Dimasak" : "Ditandai"}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSaveRecipe(recipe.id)}
            className="border-border text-foreground bg-transparent hover:bg-muted rounded-lg flex items-center gap-2"
          >
            <Star size={16} />
            {recipe.steps ? "Tandai Akan Dimasak" : "Tandai"}
          </Button>
        )}

        <Button
          size="sm"
          onClick={() => setShowCookedModal(true)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg flex items-center gap-2"
        >
          ✓ {recipe.steps ? "Dimasak" : "Selesai Dimakan"}
        </Button>
      </div>

      <CookedModal
        recipe={recipe}
        isOpen={showCookedModal}
        onClose={() => setShowCookedModal(false)}
        onSubmit={handleMarkAsCooked}
      />
    </div>
  )
}