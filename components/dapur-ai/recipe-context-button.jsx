import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, ArrowRight } from "lucide-react"

export function RecipeContextButton({ 
  sessionTitle, 
  messageContent, 
  messageCreatedAt, 
  onNavigateToChat 
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  if (!sessionTitle && !messageContent) {
    return null
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={onNavigateToChat}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="text-xs text-muted-foreground hover:text-foreground border border-border/50 hover:border-border rounded-lg flex items-center gap-2 px-3 py-1"
      >
        <MessageSquare size={14} />
        <span>Lihat Chat</span>
        <ArrowRight size={12} />
      </Button>

      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 z-10 w-80 p-3 bg-popover border border-border rounded-lg shadow-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar size={12} />
              <span>{formatDate(messageCreatedAt)}</span>
            </div>
            
            <div className="text-sm font-medium text-foreground">
              {sessionTitle || "Chat Tanpa Judul"}
            </div>
            
            {messageContent && (
              <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border-l-2 border-primary/30">
                <p className="line-clamp-3">"{messageContent}"</p>
              </div>
            )}
            
            <div className="text-xs text-primary font-medium">
              Klik untuk kembali ke percakapan ini
            </div>
          </div>
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border"></div>
        </div>
      )}
    </div>
  )
}