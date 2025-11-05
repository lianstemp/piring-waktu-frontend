import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Upload, Mic, X, Image } from "lucide-react"
import { useRef, useState } from "react"

export function ChatInput({ 
  input, 
  setInput, 
  handleSendMessage, 
  isLoading,
  onImageUpload,
  uploadedImages,
  onRemoveImage
}) {
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const imageFiles = files.filter(file => allowedTypes.includes(file.type.toLowerCase()))
    
    if (imageFiles.length > 0) {
      imageFiles.forEach(file => onImageUpload(file))
    } else if (files.length > 0) {
      alert("Hanya mendukung format JPG, PNG, dan WebP")
    }
    // Reset input
    event.target.value = ''
  }

  return (
    <div className="border-t border-border bg-card p-6">
      {/* Images Preview */}
      {uploadedImages && uploadedImages.length > 0 && (
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Image size={16} className="text-primary" />
              <span className="text-sm font-medium">
                {uploadedImages.length} gambar terlampir
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => uploadedImages.forEach((_, index) => onRemoveImage(index))}
              className="h-6 w-6 p-0"
            >
              <X size={14} />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image.preview} 
                  alt={`Preview ${index + 1}`} 
                  className="w-full h-20 object-cover rounded border"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveImage(index)}
                  className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 rounded-b">
                  <p className="truncate">{image.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
          disabled={isLoading}
        >
          <Upload size={20} />
        </button>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={uploadedImages?.length > 0 ? "Deskripsikan gambar atau tanyakan sesuatu..." : "Tanyakan tentang resep atau bahan makanan..."}
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
          disabled={isLoading || (!input.trim() && (!uploadedImages || uploadedImages.length === 0))}
        >
          <Send size={20} />
        </Button>
      </form>
    </div>
  )
}