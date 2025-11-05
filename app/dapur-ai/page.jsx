"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [savedRecipes, setSavedRecipes] = useState([])
  const [savedViewRecipes, setSavedViewRecipes] = useState(null)
  const [cookedRecipes, setCookedRecipes] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [chatSessions, setChatSessions] = useState([])
  const [authLoading, setAuthLoading] = useState(true)
  const [isStreamingNewSession, setIsStreamingNewSession] = useState(false)
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
      loadCookedRecipes()
      
      // Check for session parameter
      const sessionId = searchParams.get('session')
      if (sessionId && sessionId !== 'new' && sessionId !== currentSessionId) {
        // Only load if it's a different session and not currently streaming a new session
        if (!isLoading && !isStreamingNewSession) {
          loadChatSession(sessionId)
        }
      } else if (!sessionId) {
        // New chat or no session parameter
        setMessages([])
        setCurrentSessionId(null)
      }
    }
  }, [user, searchParams])

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

  const handleRenameSession = async (sessionId, newTitle) => {
    try {
      await api.chat.updateSessionTitle(sessionId, newTitle)
      await loadChatSessions() // Refresh sessions list
    } catch (error) {
      console.error("Error renaming session:", error)
    }
  }

  const handleDeleteSession = async (sessionId) => {
    try {
      await api.chat.deleteSession(sessionId)
      
      // If we're currently viewing the deleted session, redirect to new chat
      if (currentSessionId === sessionId) {
        router.push('/dapur-ai')
        setCurrentSessionId(null)
        setMessages([])
      }
      
      await loadChatSessions() // Refresh sessions list
    } catch (error) {
      console.error("Error deleting session:", error)
    }
  }

  const loadSavedRecipes = async () => {
    if (!user) return
    
    try {
      const response = await api.recipe.getSavedRecipes()
      setSavedRecipes(response.recipes || [])
    } catch (error) {
      console.error("Error loading saved recipes:", error)
    }
  }

  const loadCookedRecipes = async () => {
    if (!user) return
    
    try {
      const response = await api.recipe.getCookedRecipes()
      setCookedRecipes(response.recipes || [])
    } catch (error) {
      console.error("Error loading cooked recipes:", error)
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
        recipeDetail: msg.metadata?.recipe_detail || null,
        selectedRecipe: msg.recipes || null,
        timestamp: msg.created_at
      }))
      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error loading chat session:", error)
    }
  }

  const createNewChatSession = () => {
    router.push('/dapur-ai')
    setCurrentSessionId(null)
    setMessages([])
  }

  const handleSelectSession = (sessionId) => {
    router.push(`/dapur-ai?session=${sessionId}`)
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
    
    // Set flag jika ini chat baru (tidak ada session ID)
    if (!currentSessionId) {
      setIsStreamingNewSession(true)
    }

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
                // Update URL dengan session ID baru tanpa reload hanya jika belum ada session
                const currentSessionParam = searchParams.get('session')
                if (!currentSessionParam || currentSessionParam !== data.session_id) {
                  window.history.replaceState(null, '', `/dapur-ai?session=${data.session_id}`)
                }
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
              else if (data.type === 'recipe_detail') {
                setMessages((prev) => 
                  prev.map(msg => 
                    msg.id === aiMessageId 
                      ? { ...msg, recipeDetail: data.recipe, isLoading: false }
                      : msg
                  )
                )
              }
              else if (data.type === 'end') {
                setIsLoading(false)
                setIsStreamingNewSession(false)
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
      setIsStreamingNewSession(false)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleSelectRecipe = async (recipe, messageId, sessionId) => {
    const userSelection = {
      id: (Date.now() + 1).toString(),
      type: "user",
      content: `Tolong berikan detail lengkap resep ${recipe.name}`,
    }

    setMessages((prev) => [...prev, userSelection])
    setIsLoading(true)

    try {
      // Send request for detailed recipe using the unified agent
      const response = await api.chat.streamChat(
        `Tolong berikan detail lengkap resep ${recipe.name} dari ${recipe.region}`, 
        currentSessionId
      )
      
      if (!response.ok) throw new Error("Failed to get response from backend")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let aiMessageContent = ""
      let aiMessageId = (Date.now() + 1).toString()

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
              
              if (data.type === 'text') {
                aiMessageContent += data.content
                setMessages((prev) => 
                  prev.map(msg => 
                    msg.id === aiMessageId 
                      ? { ...msg, content: aiMessageContent, isLoading: false }
                      : msg
                  )
                )
              } 
              else if (data.type === 'recipe_detail') {
                setMessages((prev) => 
                  prev.map(msg => 
                    msg.id === aiMessageId 
                      ? { ...msg, recipeDetail: data.recipe, isLoading: false }
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
      console.error("Error getting recipe details:", error)
      setIsLoading(false)
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        type: "ai",
        content: "Maaf, terjadi kesalahan saat memuat detail resep. Silakan coba lagi.",
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const toggleSaveRecipe = async (sessionId, messageId, recipeName, recipeData) => {
    if (!user) return
    
    try {
      const isAlreadySaved = savedRecipes.some(saved => 
        saved.session_id === sessionId && saved.message_id === messageId
      )
      
      if (isAlreadySaved) {
        await api.recipe.unsaveRecipe(sessionId, messageId)
      } else {
        await api.recipe.saveRecipe(sessionId, messageId, recipeName, recipeData)
      }
      
      // Refresh saved recipes list
      await loadSavedRecipes()
    } catch (error) {
      console.error("Error toggling save recipe:", error)
    }
  }

  const showSavedRecipes = async () => {
    if (!user) return
    
    try {
      const response = await api.recipe.getSavedRecipes()
      setSavedViewRecipes(response.recipes || [])
    } catch (error) {
      console.error("Error loading saved recipes:", error)
      setSavedViewRecipes([])
    }
  }

  const showCookedRecipes = async () => {
    if (!user) return
    
    try {
      const response = await api.recipe.getCookedRecipes()
      // You can create a separate state for cooked recipes view if needed
      console.log("Cooked recipes:", response.recipes)
    } catch (error) {
      console.error("Error loading cooked recipes:", error)
    }
  }

  const handleMarkAsCooked = async (cookedData) => {
    if (!user) return
    
    try {
      await api.recipe.markAsCooked(
        cookedData.sessionId,
        cookedData.messageId,
        cookedData.recipeName,
        cookedData.recipeData,
        {
          is_public: true,
          user_review: "",
          user_rating: null,
          cooking_notes: ""
        }
      )
      
      // Refresh cooked recipes list
      await loadCookedRecipes()
      
      // Remove from saved recipes if it was saved
      setSavedRecipes((prev) => prev.filter(saved => 
        !(saved.session_id === cookedData.sessionId && saved.message_id === cookedData.messageId)
      ))
      
      console.log("Recipe marked as cooked and will appear in community:", cookedData)
    } catch (error) {
      console.error("Error marking recipe as cooked:", error)
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
        savedRecipes={savedRecipes}
        cookedRecipes={cookedRecipes}
        showSavedRecipes={showSavedRecipes}
        showCookedRecipes={showCookedRecipes}
        chatSessions={chatSessions}
        onSelectSession={handleSelectSession}
        onNewChat={createNewChatSession}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
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
              savedRecipes={savedRecipes}
              toggleSaveRecipe={toggleSaveRecipe}
              onMarkAsCooked={handleMarkAsCooked}
            />
          ) : messages.length === 0 ? (
            <EmptyState />
          ) : (
            <ChatMessages
              messages={messages}
              handleSelectRecipe={handleSelectRecipe}
              savedRecipes={savedRecipes}
              toggleSaveRecipe={toggleSaveRecipe}
              messagesEndRef={messagesEndRef}
              onMarkAsCooked={handleMarkAsCooked}
              sessionId={currentSessionId}
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