import { Button } from "@/components/ui/button"
import { MessageSquare, Camera, Upload } from "lucide-react"

export function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <MessageSquare className="text-primary" size={48} />
      </div>
      <h2 className="text-2xl font-serif font-bold text-foreground mb-3">Mulai Percakapan Kuliner</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Tanyakan tentang resep tradisional, bagikan bahan-bahan, atau minta saran dari AI kami yang ahli dalam
        kuliner Nusantara.
      </p>
      
      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mb-8">
        <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
          <Camera className="text-primary" size={20} />
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Foto Kulkas</p>
            <p className="text-xs text-muted-foreground">Upload foto untuk analisis bahan</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
          <Upload className="text-primary" size={20} />
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Foto Bahan</p>
            <p className="text-xs text-muted-foreground">Dapatkan rekomendasi resep</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Mulai dengan mengetik pesan atau upload foto bahan makanan di bawah
      </p>
    </div>
  )
}