import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Upload, Mic } from "lucide-react"

export function ChatInput({ 
  input, 
  setInput, 
  handleSendMessage, 
  isLoading 
}) {
  return (
    <div className="border-t border-border bg-card p-6">
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Upload size={20} />
        </button>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan tentang resep atau bahan makanan..."
          className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground rounded-full px-6"
          disabled={isLoading}
        />

        <button
          type="button"
          className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Mic size={20} />
        </button>

        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2"
          size="sm"
          disabled={isLoading}
        >
          <Send size={20} />
        </Button>
      </form>
    </div>
  )
}