import { Menu } from "lucide-react"

export function ChatHeader({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="text-foreground hover:bg-muted p-2 rounded-lg"
      >
        <Menu size={20} />
      </button>
      <h1 className="text-xl font-serif font-bold text-foreground">Dapur AI</h1>
      <div className="w-8" />
    </div>
  )
}