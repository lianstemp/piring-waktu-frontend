import { MessageBubble } from "./message-bubble"
import { RecipeCard } from "./recipe-card"

export function ChatMessages({ 
  messages, 
  handleSelectRecipe, 
  savedRecipes, 
  cookedRecipes,
  toggleSaveRecipe,
  messagesEndRef,
  onMarkAsCooked,
  sessionId
}) {
  return (
    <>
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
          <MessageBubble
            message={msg}
            handleSelectRecipe={handleSelectRecipe}
            sessionId={sessionId}
            savedRecipes={savedRecipes}
            cookedRecipes={cookedRecipes}
            toggleSaveRecipe={toggleSaveRecipe}
            onMarkAsCooked={onMarkAsCooked}
          />
        </div>
      ))}
      <div ref={messagesEndRef} />
    </>
  )
}