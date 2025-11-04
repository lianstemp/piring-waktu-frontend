"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Settings, Award, Edit2, Save, X, Camera } from "lucide-react"
import Header from "@/components/header"
import { createClient } from "@/lib/supabase/client"
import { getCookedRecipes, getSavedRecipes, getProfile, updateProfile } from "@/lib/supabase"

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [savedRecipes, setSavedRecipes] = useState([])
  const [cookedRecipes, setCookedRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    username: '',
    bio: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
      
      // Get profile data
      const profileData = await getProfile(user.id)
      setProfile(profileData)
      setEditForm({
        full_name: profileData.full_name || '',
        username: profileData.username || '',
        bio: profileData.bio || ''
      })

      // Get saved recipes
      const savedData = await getSavedRecipes(user.id)
      setSavedRecipes(savedData)

      // Get cooked recipes
      const cookedData = await getCookedRecipes(user.id)
      setCookedRecipes(cookedData)

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const updatedProfile = await updateProfile(user.id, editForm)
      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Gagal memperbarui profil. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    })
  }

  const calculateLevel = (cookedCount) => {
    return Math.floor(cookedCount / 5) + 1
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 px-6 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat profil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 px-6 py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Profil tidak ditemukan.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="border border-border bg-card p-8 mb-8 rounded-2xl">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="relative">
                <Image
                  src={profile.avatar_url || user?.user_metadata?.avatar_url || "/placeholder.svg"}
                  alt={profile.full_name || "Profile"}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90">
                    <Camera size={16} />
                  </button>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={editForm.full_name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="Nama lengkap"
                          className="text-2xl font-serif font-bold"
                        />
                        <Input
                          value={editForm.username}
                          onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="Username"
                          className="text-sm"
                        />
                        <Textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Bio singkat tentang Anda..."
                          className="text-sm resize-none"
                          rows={2}
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                          {profile.full_name || user?.user_metadata?.full_name || "Pengguna"}
                        </h1>
                        <p className="text-muted-foreground mb-2">@{profile.username}</p>
                        <p className="text-muted-foreground">{profile.email || user?.email}</p>
                        {profile.bio && (
                          <p className="text-sm text-muted-foreground mt-2 italic">{profile.bio}</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="text-accent" size={20} />
                      <span className="text-lg font-semibold text-foreground">
                        Level {calculateLevel(cookedRecipes.length)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Chef Kuliner Nusantara</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border">
                  <div>
                    <p className="text-2xl font-bold text-primary">{cookedRecipes.length}</p>
                    <p className="text-sm text-muted-foreground">Hidangan yang Dibuat</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">{savedRecipes.length}</p>
                    <p className="text-sm text-muted-foreground">Resep Disimpan</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-secondary">
                      Bergabung {formatDate(profile.created_at)}
                    </p>
                    <p className="text-sm text-muted-foreground"></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                  >
                    <Save size={18} className="mr-2" />
                    {saving ? "Menyimpan..." : "Simpan"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setEditForm({
                        full_name: profile.full_name || '',
                        username: profile.username || '',
                        bio: profile.bio || ''
                      })
                    }}
                    className="border-border text-foreground hover:bg-muted rounded-lg bg-transparent"
                  >
                    <X size={18} className="mr-2" />
                    Batal
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
                  >
                    <Edit2 size={18} className="mr-2" />
                    Edit Profil
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="border-border text-foreground hover:bg-muted rounded-lg bg-transparent"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="cooked" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-card border border-border rounded-lg p-1">
              <TabsTrigger
                value="cooked"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded"
              >
                Sudah Dimasak ({cookedRecipes.length})
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded"
              >
                Resep Disimpan ({savedRecipes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cooked" className="mt-8">
              <div className="space-y-6">
                {cookedRecipes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Belum ada hidangan yang dimasak.</p>
                    <Button 
                      onClick={() => router.push('/dapur-ai')}
                      className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Mulai Memasak
                    </Button>
                  </div>
                ) : (
                  cookedRecipes.map((dish) => (
                    <Card
                      key={dish.id}
                      className="border border-border bg-card p-6 hover:shadow-lg transition-shadow rounded-lg"
                    >
                      <div className="flex gap-4">
                        {dish.user_photo_url && (
                          <Image
                            src={dish.user_photo_url}
                            alt={dish.recipe_name}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-serif font-bold text-lg text-foreground">{dish.recipe_name}</h3>
                              <p className="text-sm text-accent">{dish.recipe_region}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`${i < dish.user_rating ? "★" : "☆"} text-accent`}></span>
                              ))}
                            </div>
                          </div>
                          {dish.user_review && (
                            <p className="text-muted-foreground mb-2">{dish.user_review}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Dimasak pada {new Date(dish.cooked_at).toLocaleDateString('id-ID')}
                          </p>
                          {dish.session_title && (
                            <p className="text-xs text-primary mt-1">
                              Dari chat: {dish.session_title}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-8">
              <div className="space-y-6">
                {savedRecipes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Belum ada resep yang disimpan.</p>
                    <Button 
                      onClick={() => router.push('/dapur-ai')}
                      className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Jelajahi Resep
                    </Button>
                  </div>
                ) : (
                  savedRecipes.map((recipe) => (
                    <Card
                      key={recipe.id}
                      className="border border-border bg-card p-6 hover:shadow-lg transition-shadow rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-serif font-bold text-lg text-foreground">{recipe.recipe_name}</h3>
                          <p className="text-sm text-accent">{recipe.recipe_region}</p>
                          <p className="text-xs text-muted-foreground mt-1">{recipe.recipe_history}</p>
                        </div>
                      </div>
                      {recipe.notes && (
                        <p className="text-muted-foreground mb-2 italic">"{recipe.notes}"</p>
                      )}
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                          Disimpan pada {new Date(recipe.created_at).toLocaleDateString('id-ID')}
                        </p>
                        {recipe.session_title && (
                          <p className="text-xs text-primary">
                            Dari chat: {recipe.session_title}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>


        </div>
      </div>
    </div>
  )
}
