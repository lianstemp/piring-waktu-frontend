import { Button } from "@/components/ui/button"
import { CookedModal } from "./cooked-modal"
import { useState } from "react"

export function SavedRecipesView({ 
  savedViewRecipes, 
  setSavedViewRecipes, 
  savedRecipes, 
  cookedRecipes,
  toggleSaveRecipe,
  onMarkAsCooked 
}) {
  const [cookedModalOpen, setCookedModalOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  return (
    <div className="max-w-4xl w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-foreground">Resep Disimpan</h2>
        <Button variant="ghost" onClick={() => setSavedViewRecipes(null)}>
          Kembali
        </Button>
      </div>

      {savedViewRecipes?.length === 0 ? (
        <div className="text-muted-foreground">Belum ada resep yang disimpan.</div>
      ) : (
        savedViewRecipes?.map((savedRecipe) => {
          const isRecipeCooked = cookedRecipes.some(cooked => 
            cooked.session_id === savedRecipe.session_id && cooked.message_id === savedRecipe.message_id
          )
          
          return (
          <div key={savedRecipe.id} className="bg-card border border-border rounded-2xl p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-foreground">{savedRecipe.recipe_name}</h3>
              <p className="text-sm text-muted-foreground">
                Disimpan dari: {savedRecipe.chat_sessions?.title || 'Chat'}
              </p>
              {savedRecipe.notes && (
                <p className="text-sm text-muted-foreground mt-2">
                  Catatan: {savedRecipe.notes}
                </p>
              )}
            </div>
            
            {savedRecipe.recipe_data && (
              <div className="space-y-4">
                {savedRecipe.recipe_data.history && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Sejarah</h4>
                    <p className="text-sm text-foreground">{savedRecipe.recipe_data.history}</p>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Bahan-bahan</h4>
                    <ul className="text-sm text-foreground space-y-1">
                      {savedRecipe.recipe_data.ingredients?.map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Cara Memasak</h4>
                    <ol className="text-sm text-foreground space-y-1">
                      {savedRecipe.recipe_data.instructions?.slice(0, 3).map((step, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="text-primary font-semibold">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                      {savedRecipe.recipe_data.instructions?.length > 3 && (
                        <li className="text-muted-foreground">... dan {savedRecipe.recipe_data.instructions.length - 3} langkah lainnya</li>
                      )}
                    </ol>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    onClick={() => toggleSaveRecipe(
                      savedRecipe.session_id, 
                      savedRecipe.message_id, 
                      savedRecipe.recipe_name, 
                      savedRecipe.recipe_data
                    )}
                    variant="outline"
                    size="sm"
                  >
                    Hapus dari Simpanan
                  </Button>
                  
                  <Button
                    onClick={() => {
                      if (!isRecipeCooked) {
                        setSelectedRecipe(savedRecipe)
                        setCookedModalOpen(true)
                      }
                    }}
                    disabled={isRecipeCooked}
                    size="sm"
                    variant={isRecipeCooked ? "secondary" : "default"}
                  >
                    {isRecipeCooked ? "Sudah Dimasak ✓" : "Tandai Sudah Dimasak"}
                  </Button>
                </div>
              </div>
            )}
          </div>
          )
        })
      )}

      {selectedRecipe && (
        <CookedModal
          isOpen={cookedModalOpen}
          onClose={() => {
            setCookedModalOpen(false)
            setSelectedRecipe(null)
          }}
          onSubmit={onMarkAsCooked}
          recipe={selectedRecipe.recipe_data}
          sessionId={selectedRecipe.session_id}
          messageId={selectedRecipe.message_id}
        />
      )}
    </div>
  )
}