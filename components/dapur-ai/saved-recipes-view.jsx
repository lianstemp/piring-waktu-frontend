import { Button } from "@/components/ui/button"
import { RecipeCard } from "./recipe-card"

export function SavedRecipesView({ 
  savedViewRecipes, 
  setSavedViewRecipes, 
  savedIds, 
  toggleSaveRecipe,
  onMarkAsCooked 
}) {
  return (
    <div className="max-w-4xl w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-foreground">Resep Disimpan</h2>
        <Button variant="ghost" onClick={() => setSavedViewRecipes(null)}>
          Kembali
        </Button>
      </div>

      {savedViewRecipes.length === 0 ? (
        <div className="text-muted-foreground">Belum ada resep yang ditandai.</div>
      ) : (
        savedViewRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            savedIds={savedIds}
            toggleSaveRecipe={toggleSaveRecipe}
            onMarkAsCooked={onMarkAsCooked}
          />
        ))
      )}
    </div>
  )
}