import { createClient } from './supabase/client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Helper function to get auth token
const getAuthToken = async () => {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = await getAuthToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers
  })
}

// Chat API functions
export const chatAPI = {
  // Stream chat response
  streamChat: async (message, sessionId = null) => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    
    const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({
        message,
        session_id: sessionId 
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response
  },

  // Get chat sessions
  getSessions: async () => {
    const response = await makeAuthenticatedRequest('/api/chat/sessions')
    
    if (!response.ok) {
      throw new Error('Failed to get chat sessions')
    }
    
    return response.json()
  },

  // Get messages for a session
  getMessages: async (sessionId) => {
    const response = await makeAuthenticatedRequest(`/api/chat/sessions/${sessionId}/messages`)
    
    if (!response.ok) {
      throw new Error('Failed to get chat messages')
    }
    
    return response.json()
  }
}

// Recipe API functions (now chat-context based)
export const recipeAPI = {
  // Save recipe from chat context
  saveRecipe: async (sessionId, messageId, recipeName, recipeData, notes = null) => {
    const response = await makeAuthenticatedRequest('/api/chat/save-recipe', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        message_id: messageId,
        recipe_name: recipeName,
        recipe_data: recipeData,
        notes: notes
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to save recipe')
    }
    
    return response.json()
  },

  // Unsave recipe from chat context
  unsaveRecipe: async (sessionId, messageId) => {
    const response = await makeAuthenticatedRequest('/api/chat/save-recipe', {
      method: 'DELETE',
      body: JSON.stringify({
        session_id: sessionId,
        message_id: messageId
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to unsave recipe')
    }
    
    return response.json()
  },

  // Get saved recipes
  getSavedRecipes: async () => {
    const response = await makeAuthenticatedRequest('/api/chat/saved-recipes')
    
    if (!response.ok) {
      throw new Error('Failed to get saved recipes')
    }
    
    return response.json()
  },

  // Mark recipe as cooked from chat context
  markAsCooked: async (sessionId, messageId, recipeName, recipeData, cookedData) => {
    const response = await makeAuthenticatedRequest('/api/chat/mark-cooked', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        message_id: messageId,
        recipe_name: recipeName,
        recipe_data: recipeData,
        ...cookedData
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to mark recipe as cooked')
    }
    
    return response.json()
  },

  // Get cooked recipes
  getCookedRecipes: async () => {
    const response = await makeAuthenticatedRequest('/api/chat/cooked-recipes')
    
    if (!response.ok) {
      throw new Error('Failed to get cooked recipes')
    }
    
    return response.json()
  }
}

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/api/health`)
  
  if (!response.ok) {
    throw new Error('Health check failed')
  }
  
  return response.json()
}

// Export default API object
const api = {
  chat: chatAPI,
  recipe: recipeAPI,
  health: healthCheck
}

export default api