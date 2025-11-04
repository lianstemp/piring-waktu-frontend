import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Upload, Camera, Star } from "lucide-react"

export function CookedModal({ recipe, isOpen, onClose, onSubmit }) {
  const [photo, setPhoto] = useState(null)
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(5)
  const [isPublic, setIsPublic] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setPhoto(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const cookedData = {
      recipeId: recipe.id,
      photo,
      review,
      rating,
      isPublic,
      cookedAt: new Date().toISOString()
    }
    
    await onSubmit(cookedData)
    setIsSubmitting(false)
    onClose()
    
    // Reset form
    setPhoto(null)
    setReview("")
    setRating(5)
    setIsPublic(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-foreground">
            Tandai "{recipe.name}" Sudah Dimasak
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-muted"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Foto Hasil Masakan <span className="text-destructive">*</span>
            </label>
            
            {photo ? (
              <div className="relative">
                <img
                  src={photo}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/90"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG atau JPEG (MAX. 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  required
                />
              </label>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Rating Hasil Masakan
            </label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="text-2xl transition-colors"
                >
                  <Star
                    size={24}
                    className={`${i < rating ? "fill-accent text-accent" : "text-muted-foreground"}`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
            </div>
          </div>

          {/* Review */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Review & Tips (Opsional)
            </label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Bagikan pengalaman memasak Anda, tips, atau modifikasi yang dilakukan..."
              className="min-h-24 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">{review.length}/500 karakter</p>
          </div>

          {/* Privacy Setting */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Pengaturan Privasi
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="w-4 h-4 text-primary"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Publik</p>
                  <p className="text-xs text-muted-foreground">Tampilkan di komunitas untuk semua orang</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="w-4 h-4 text-primary"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">Privat</p>
                  <p className="text-xs text-muted-foreground">Hanya untuk catatan pribadi Anda</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isSubmitting || !photo}
            >
              {isSubmitting ? "Menyimpan..." : "Tandai Sudah Dimasak"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}