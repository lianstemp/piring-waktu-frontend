"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dapur-ai/sidebar"
import { ChatHeader } from "@/components/dapur-ai/chat-header"
import { EmptyState } from "@/components/dapur-ai/empty-state"
import { ChatMessages } from "@/components/dapur-ai/chat-messages"
import { SavedRecipesView } from "@/components/dapur-ai/saved-recipes-view"
import { ChatInput } from "@/components/dapur-ai/chat-input"
import { createClient } from "@/lib/supabase/client"
import api from "@/lib/api"

export default function DapurAIPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [savedIds, setSavedIds] = useState([])
  const [savedViewRecipes, setSavedViewRecipes] = useState(null)
  const [cookedRecipes, setCookedRecipes] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [chatSessions, setChatSessions] = useState([])
  const [authLoading, setAuthLoading] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadChatSessions()
      loadSavedRecipes()
    }
  }, [user])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
    } finally {
      setAuthLoading(false)
    }
  }

  const loadChatSessions = async () => {
    try {
      const response = await api.chat.getSessions()
      setChatSessions(response.sessions || [])
    } catch (error) {
      console.error("Error loading chat sessions:", error)
    }
  }

  const loadSavedRecipes = async () => {
    if (!user) return
    
    try {
      const response = await api.recipe.getSavedRecipes()
      setSavedIds(response.recipes?.map(item => item.recipe_id) || [])
    } catch (error) {
      console.error("Error loading saved recipes:", error)
    }
  }

  const loadChatSession = async (sessionId) => {
    try {
      setCurrentSessionId(sessionId)
      const response = await api.chat.getMessages(sessionId)
      const chatMessages = response.messages || []
      const formattedMessages = chatMessages.map(msg => ({
        id: msg.id,
        type: msg.message_type,
        content: msg.content,
        recipes: msg.metadata?.recipes || null,
        selectedRecipe: msg.recipes || null,
        timestamp: msg.created_at
      }))
      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error loading chat session:", error)
    }
  }

  const createNewChatSession = () => {
    setCurrentSessionId(null)
    setMessages([])
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !user) return

    const currentInput = input
    setInput("")

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentInput,
    }
    setMessages((prev) => [...prev, userMessage])

    setIsLoading(true)

    try {
      // Session ID akan null jika ini chat baru
      // Backend akan otomatis create session dan return session_id
      const response = await api.chat.streamChat(currentInput, currentSessionId)
      if (!response.ok) throw new Error("Failed to get response from backend")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let aiMessageContent = ""
      let aiMessageId = (Date.now() + 1).toString()
      let newSessionId = currentSessionId

      const loadingMessage = {
        id: aiMessageId,
        type: "ai",
        content: "",
        isLoading: true
      }
      setMessages((prev) => [...prev, loadingMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              // Terima session_id dari backend (untuk chat baru)
              if (data.type === 'session_id') {
                newSessionId = data.session_id
                setCurrentSessionId(data.session_id)
                // Reload chat sessions list
                await loadChatSessions()
              } 
              else if (data.type === 'text') {
                aiMessageContent += data.content
                setMessages((prev) => 
                  prev.map(msg => 
                    msg.id === aiMessageId 
                      ? { ...msg, content: aiMessageContent, isLoading: false }
                      : msg
                  )
                )
              } 
              else if (data.type === 'recipes') {
                setMessages((prev) => 
                  prev.map(msg => 
                    msg.id === aiMessageId 
                      ? { ...msg, recipes: data.recipes, isLoading: false }
                      : msg
                  )
                )
              } 
              else if (data.type === 'end') {
                setIsLoading(false)
              }
            } catch (error) {
              console.error("Error parsing streaming data:", error)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleSelectRecipe = async (recipeId, recipeName, region) => {
    const userSelection = {
      id: (Date.now() + 1).toString(),
      type: "user",
      content: recipeName,
    }

    setMessages((prev) => [...prev, userSelection])

    try {
      let recipe = await api.recipe.getRecipe(recipeId)
      if (recipe.tags && recipe.tags.includes('loading')) {
        recipe = await api.recipe.generateRecipeDetail(
          recipeId,
          recipeName,
          region,
          messages[messages.length - 2]?.content || "bahan-bahan yang tersedia"
        )
      }

      const detailMessage = {
        id: (Date.now() + 2).toString(),
        type: "ai",
        content: `${recipe.name}:`,
        selectedRecipe: recipe,
      }

      setMessages((prev) => [...prev, detailMessage])
    } catch (error) {
      console.error("Error getting recipe details:", error)
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        type: "ai",
        content: "Maaf, terjadi kesalahan saat memuat detail resep. Silakan coba lagi.",
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const toggleSaveRecipe = async (recipeId) => {
    if (!user) return
    
    try {
      if (savedIds.includes(recipeId)) {
        await api.recipe.unsaveRecipe(recipeId)
        setSavedIds((prev) => prev.filter((id) => id !== recipeId))
      } else {
        await api.recipe.saveRecipe(recipeId, currentSessionId)
        setSavedIds((prev) => [...prev, recipeId])
      }
    } catch (error) {
      console.error("Error toggling save recipe:", error)
    }
  }

  const showSavedRecipes = async () => {
    if (!user) return
    
    try {
      const response = await api.recipe.getSavedRecipes()
      setSavedViewRecipes(response.recipes?.length > 0 ? response.recipes : [])
    } catch (error) {
      console.error("Error loading saved recipes:", error)
      setSavedViewRecipes([])
    }
  }

  const handleMarkAsCooked = (cookedData) => {
    setCookedRecipes((prev) => [...prev, cookedData])
    setSavedIds((prev) => prev.filter((id) => id !== cookedData.recipeId))
    if (cookedData.isPublic) {
      console.log("Recipe marked as cooked and will appear in community:", cookedData)
    }
  }

  if (authLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Anda perlu login untuk menggunakan Dapur AI</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        savedIds={savedIds}
        showSavedRecipes={showSavedRecipes}
        chatSessions={chatSessions}
        onSelectSession={loadChatSession}
        onNewChat={createNewChatSession}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {savedViewRecipes ? (
            <SavedRecipesView
              savedViewRecipes={savedViewRecipes}
              setSavedViewRecipes={setSavedViewRecipes}
              savedIds={savedIds}
              toggleSaveRecipe={toggleSaveRecipe}
              onMarkAsCooked={handleMarkAsCooked}
            />
          ) : messages.length === 0 ? (
            <EmptyState />
          ) : (
            <ChatMessages
              messages={messages}
              handleSelectRecipe={handleSelectRecipe}
              savedIds={savedIds}
              toggleSaveRecipe={toggleSaveRecipe}
              messagesEndRef={messagesEndRef}
              onMarkAsCooked={handleMarkAsCooked}
            />
          )}
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}