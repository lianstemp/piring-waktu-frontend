import { Loader } from "lucide-react"

export function MessageBubble({ message, handleSelectRecipe }) {
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
              onClick={() => handleSelectRecipe(
                `recipe-${Date.now()}-${index}`, 
                recipe.name, 
                recipe.region
              )}
              className="w-full text-left p-3 rounded-lg bg-background hover:bg-muted transition-colors border border-border"
            >
              <h5 className="font-semibold text-foreground text-sm">{recipe.name}</h5>
              <p className="text-xs text-accent">{recipe.region}</p>
            </button>
          ))}
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