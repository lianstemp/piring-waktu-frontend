import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export function EmptyState({ startMockConversation }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <MessageSquare className="text-primary" size={48} />
      </div>
      <h2 className="text-2xl font-serif font-bold text-foreground mb-3">Mulai Percakapan Kuliner</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Tanyakan tentang resep tradisional, bagikan bahan-bahan, atau minta saran dari AI kami yang ahli dalam
        kuliner Nusantara.
      </p>
      <Button
        type="button"
        onClick={startMockConversation}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
      >
        Mulai Sekarang
      </Button>
    </div>
  )
}