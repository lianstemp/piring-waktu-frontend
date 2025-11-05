import { Button } from "@/components/ui/button"
import { Plus, MessageSquare, Bookmark, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Sidebar({ 
  sidebarOpen, 
  savedRecipes, 
  cookedRecipes,
  showSavedRecipes,
  showCookedRecipes,
  chatSessions,
  onSelectSession,
  onNewChat
}) {
  return (
    <div
      className={`${sidebarOpen ? "w-64" : "w-0"} bg-card border-r border-border transition-all duration-300 overflow-hidden flex flex-col`}
    >
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-serif font-bold text-foreground">
          <Image src="/piring-waktu-logo.svg" alt="Piring Waktu" width={32} height={32} className="rounded-full" />
          <span>Piring Waktu</span>
        </Link>
      </div>

      <div className="p-4">
        <Button 
          onClick={onNewChat}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Chat Baru
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-3">
        <div className="mb-6">
          {/* Button bar: Resep Disimpan & Sudah Dimasak */}
          <div className="flex flex-col gap-2 mb-3">
            <Button
              variant="ghost"
              onClick={showSavedRecipes}
              className={`w-full px-3 py-2 rounded-lg flex items-center justify-between ${
                savedRecipes?.length > 0 ? "bg-yellow-400 text-black" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Bookmark size={16} />
                <span className="text-sm">Resep Disimpan</span>
              </div>
              <span className="text-xs bg-muted px-2 rounded-full">{savedRecipes?.length || 0}</span>
            </Button>

            <Button 
              variant="ghost" 
              onClick={showCookedRecipes}
              className={`w-full px-3 py-2 rounded-lg flex items-center justify-between ${
                cookedRecipes?.length > 0 ? "bg-green-400 text-black" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Check size={16} />
                <span className="text-sm">Sudah Dimasak</span>
              </div>
              <span className="text-xs bg-muted px-2 rounded-full">{cookedRecipes?.length || 0}</span>
            </Button>
          </div>

          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Percakapan Terbaru</h3>
          <div className="space-y-2">
            {chatSessions.length > 0 ? (
              chatSessions.slice(0, 10).map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
                >
                  <MessageSquare size={16} className="inline mr-2" />
                  {session.title}
                </button>
              ))
            ) : (
              <div className="text-xs text-muted-foreground px-3 py-2">
                Belum ada percakapan
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <Link
          href="/profile"
          className="w-full px-3 py-2 rounded-lg hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors block"
        >
          Profil
        </Link>
      </div>
    </div>
  )
}