"use client"

import { useState, useEffect } from "react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Star, Upload, X, Plus, Minus, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function CookedModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  recipe,
  sessionId,
  messageId 
}) {
  const [formData, setFormData] = useState({
    user_photo_url: "",
    user_review: "",
    user_rating: 0,
    is_public: true,
    cooking_notes: "",
    // Editable recipe data
    recipe_name: recipe?.name || "",
    ingredients: recipe?.ingredients || [],
    instructions: recipe?.instructions || [],
    prep_time: recipe?.prep_time || "",
    cook_time: recipe?.cook_time || "",
    servings: recipe?.servings || 1,
    difficulty: recipe?.difficulty || "mudah"
  })

  // Update form data when recipe prop changes
  useEffect(() => {
    if (recipe) {
      setFormData(prev => ({
        ...prev,
        recipe_name: recipe.name || "",
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        prep_time: recipe.prep_time || "",
        cook_time: recipe.cook_time || "",
        servings: recipe.servings || 1,
        difficulty: recipe.difficulty || "mudah"
      }))
    }
  }, [recipe])

  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  // Cleanup preview URL when component unmounts
  const cleanupPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
  }

  // Reset form when modal closes
  const handleClose = () => {
    cleanupPreview()
    setSelectedFile(null)
    setPreviewUrl("")
    setUploading(false)
    setError("")
    onClose()
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file")
        return
      }

      setError("")
      setSelectedFile(file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const uploadFile = async () => {
    if (!selectedFile) return null

    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Create unique filename
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('cooked-recipes')
        .upload(fileName, selectedFile)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cooked-recipes')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      let photoUrl = formData.user_photo_url

      // Upload file if selected
      if (selectedFile) {
        photoUrl = await uploadFile()
      }

      const cookedData = {
        sessionId,
        messageId,
        recipeName: formData.recipe_name,
        recipeData: {
          name: formData.recipe_name,
          region: recipe?.region || "",
          history: recipe?.history || "",
          ingredients: formData.ingredients,
          instructions: formData.instructions,
          prep_time: formData.prep_time,
          cook_time: formData.cook_time,
          servings: formData.servings,
          difficulty: formData.difficulty,
          tags: recipe?.tags || []
        },
        user_photo_url: photoUrl,
        user_review: formData.user_review,
        user_rating: formData.user_rating,
        is_public: formData.is_public,
        cooking_notes: formData.cooking_notes
      }
      
      await onSubmit(cookedData)
      handleClose()
    } catch (error) {
      console.error('Error submitting cooked recipe:', error)
      setError("Failed to submit recipe. Please try again.")
    }
  }

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ""]
    }))
  }

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const updateIngredient = (index, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) => i === index ? value : item)
    }))
  }

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ""]
    }))
  }

  const removeInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }))
  }

  const updateInstruction = (index, value) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((item, i) => i === index ? value : item)
    }))
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, user_rating: i + 1 }))}
        className={`${
          i < formData.user_rating ? "text-yellow-400" : "text-gray-300"
        } hover:text-yellow-400 transition-colors`}
      >
        <Star size={20} fill={i < formData.user_rating ? "currentColor" : "none"} />
      </button>
    ))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tandai Sudah Dimasak</DialogTitle>
          <DialogDescription>
            Bagikan pengalaman memasak Anda dan sesuaikan resep jika diperlukan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          {/* Recipe Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informasi Resep</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipe_name">Nama Resep</Label>
                <Input
                  id="recipe_name"
                  value={formData.recipe_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipe_name: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="servings">Porsi</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={formData.servings}
                  onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prep_time">Waktu Persiapan</Label>
                <Input
                  id="prep_time"
                  placeholder="15 menit"
                  value={formData.prep_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, prep_time: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="cook_time">Waktu Memasak</Label>
                <Input
                  id="cook_time"
                  placeholder="30 menit"
                  value={formData.cook_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, cook_time: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="difficulty">Tingkat Kesulitan</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mudah">Mudah</SelectItem>
                    <SelectItem value="sedang">Sedang</SelectItem>
                    <SelectItem value="sulit">Sulit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Bahan-bahan</h3>
              <Button type="button" onClick={addIngredient} size="sm" variant="outline">
                <Plus size={16} className="mr-2" />
                Tambah Bahan
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="Contoh: Daging sapi 500g"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    size="sm"
                    variant="outline"
                  >
                    <Minus size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Cara Memasak</h3>
              <Button type="button" onClick={addInstruction} size="sm" variant="outline">
                <Plus size={16} className="mr-2" />
                Tambah Langkah
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-2">
                    {index + 1}
                  </div>
                  <Textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder="Masukkan langkah memasak..."
                    className="flex-1"
                    rows={2}
                  />
                  <Button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    size="sm"
                    variant="outline"
                    className="mt-2"
                  >
                    <Minus size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* User Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pengalaman Memasak</h3>
            
            <div>
              <Label htmlFor="user_photo">Foto Hasil Masakan</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    id="user_photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="flex-1"
                  />
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 size={16} className="animate-spin" />
                      Uploading...
                    </div>
                  )}
                </div>
                
                {previewUrl && (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full max-w-xs h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl("")
                        URL.revokeObjectURL(previewUrl)
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}


              </div>
            </div>

            <div>
              <Label>Rating</Label>
              <div className="flex gap-1 mt-2">
                {renderStars()}
              </div>
            </div>

            <div>
              <Label htmlFor="user_review">Review & Tips</Label>
              <Textarea
                id="user_review"
                placeholder="Bagikan pengalaman memasak, tips, atau modifikasi yang Anda lakukan..."
                value={formData.user_review}
                onChange={(e) => setFormData(prev => ({ ...prev, user_review: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="cooking_notes">Catatan Memasak</Label>
              <Textarea
                id="cooking_notes"
                placeholder="Catatan pribadi, substitusi bahan, atau penyesuaian yang dilakukan..."
                value={formData.cooking_notes}
                onChange={(e) => setFormData(prev => ({ ...prev, cooking_notes: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
              />
              <Label htmlFor="is_public">
                Bagikan ke komunitas (resep dan review akan terlihat oleh pengguna lain)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Tandai Sudah Dimasak"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}