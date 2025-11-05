import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, MessageSquare, Bookmark, Check, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export function Sidebar({ 
  sidebarOpen, 
  savedRecipes, 
  cookedRecipes,
  showSavedRecipes,
  showCookedRecipes,
  chatSessions,
  onSelectSession,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  resetViews
}) {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [newTitle, setNewTitle] = useState("")

  const handleRename = (session) => {
    setSelectedSession(session)
    setNewTitle(session.title)
    setRenameDialogOpen(true)
  }

  const handleDelete = (session) => {
    setSelectedSession(session)
    setDeleteDialogOpen(true)
  }

  const confirmRename = async () => {
    if (selectedSession && newTitle.trim()) {
      await onRenameSession(selectedSession.id, newTitle.trim())
      setRenameDialogOpen(false)
      setSelectedSession(null)
      setNewTitle("")
    }
  }

  const confirmDelete = async () => {
    if (selectedSession) {
      await onDeleteSession(selectedSession.id)
      setDeleteDialogOpen(false)
      setSelectedSession(null)
    }
  }
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
          onClick={() => {
            resetViews()
            onNewChat()
          }}
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
                <div
                  key={session.id}
                  className="group flex items-center w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <button
                    onClick={() => {
                      resetViews()
                      onSelectSession(session.id)
                    }}
                    className="flex-1 text-left text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
                  >
                    <MessageSquare size={16} className="inline mr-2" />
                    {session.title}
                  </button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      >
                        <MoreHorizontal size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRename(session)}>
                        <Edit size={14} className="mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(session)}
                        className="text-destructive"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
              Enter a new name for this chat session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    confirmRename()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedSession?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}