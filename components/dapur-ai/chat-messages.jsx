import { MessageBubble } from "./message-bubble"
import { RecipeCard } from "./recipe-card"

export function ChatMessages({ 
  messages, 
  handleSelectRecipe, 
  savedIds, 
  toggleSaveRecipe,
  messagesEndRef,
  onMarkAsCooked 
}) {
  return (
    <>
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
          {msg.selectedRecipe ? (
            <div className="max-w-2xl w-full">
              <RecipeCard
                recipe={msg.selectedRecipe}
                savedIds={savedIds}
                toggleSaveRecipe={toggleSaveRecipe}
                onMarkAsCooked={onMarkAsCooked}
              />
            </div>
          ) : (
            <MessageBubble
              message={msg}
              handleSelectRecipe={handleSelectRecipe}
            />
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </>
  )
}