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

  // Get chat sessions (using Supabase directly)
  getSessions: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return { sessions: data || [] }
  },

  // Get messages for a session (using Supabase directly)
  getMessages: async (sessionId) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return { messages: data || [] }
  },

  // Update session title (rename)
  updateSessionTitle: async (sessionId, newTitle) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ title: newTitle, updated_at: new Date().toISOString() })
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .select()
    
    if (error) throw error
    return { session: data[0] }
  },

  // Delete session
  deleteSession: async (sessionId) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')
    
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', user.id)
    
    if (error) throw error
    return { message: 'Session deleted successfully' }
  }
}

// Recipe API functions (using Supabase directly)
export const recipeAPI = {
  // Save recipe from chat context
  saveRecipe: async (sessionId, messageId, recipeName, recipeData, notes = null) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('saved_recipes')
      .upsert({
        user_id: user.id,
        session_id: sessionId,
        message_id: messageId,
        recipe_name: recipeName,
        recipe_data: recipeData,
        notes: notes
      })
      .select()
    
    if (error) throw error
    return { saved_recipe: data[0] }
  },

  // Unsave recipe from chat context
  unsaveRecipe: async (sessionId, messageId) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')
    
    const { error } = await supabase
      .from('saved_recipes')
      .delete()
      .eq('user_id', user.id)
      .eq('session_id', sessionId)
      .eq('message_id', messageId)
    
    if (error) throw error
    return { message: 'Recipe unsaved successfully' }
  },

  // Get saved recipes
  getSavedRecipes: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('saved_recipes')
      .select(`
        *,
        chat_sessions!inner(title),
        chat_messages!inner(content, created_at)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { recipes: data || [] }
  },

  // Mark recipe as cooked from chat context
  markAsCooked: async (sessionId, messageId, recipeName, recipeData, cookedData) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')
    
    // Use upsert with onConflict to handle duplicates properly
    const { data, error } = await supabase
      .from('cooked_recipes')
      .upsert({
        user_id: user.id,
        session_id: sessionId,
        message_id: messageId,
        recipe_name: recipeName,
        recipe_data: recipeData,
        user_photo_url: cookedData.user_photo_url || null,
        user_review: cookedData.user_review || null,
        user_rating: cookedData.user_rating || null,
        is_public: cookedData.is_public !== undefined ? cookedData.is_public : true,
        cooking_notes: cookedData.cooking_notes || null
      }, {
        onConflict: 'user_id,session_id,message_id'
      })
      .select()
    
    if (error) throw error
    return { cooked_recipe: data[0] }
  },

  // Get cooked recipes
  getCookedRecipes: async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')
    
    const { data, error } = await supabase
      .from('cooked_recipes')
      .select(`
        *,
        chat_sessions!inner(title),
        chat_messages!inner(content, created_at)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return { recipes: data || [] }
  },

  // Get community feed (public cooked recipes directly from cooked_recipes table)
  getCommunityFeed: async (limit = 20, offset = 0) => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('cooked_recipes')
      .select(`
        *,
        profiles!inner(full_name, avatar_url, username),
        chat_sessions(title),
        chat_messages(content, created_at)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    return { recipes: data || [] }
  },

  // Like/Unlike a cooked recipe
  toggleLike: async (cookedRecipeId) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    // Check if user already liked this recipe
    const { data: existingLike, error: checkError } = await supabase
      .from('community_interactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('cooked_recipe_id', cookedRecipeId)
      .eq('interaction_type', 'like')
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingLike) {
      // Unlike - delete the like
      const { error } = await supabase
        .from('community_interactions')
        .delete()
        .eq('id', existingLike.id)
      
      if (error) throw error
      return { liked: false }
    } else {
      // Like - create new like
      const { error } = await supabase
        .from('community_interactions')
        .insert({
          user_id: user.id,
          cooked_recipe_id: cookedRecipeId,
          interaction_type: 'like'
        })
      
      if (error) throw error
      return { liked: true }
    }
  },

  // Add comment to a cooked recipe
  addComment: async (cookedRecipeId, content) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('community_interactions')
      .insert({
        user_id: user.id,
        cooked_recipe_id: cookedRecipeId,
        interaction_type: 'comment',
        content: content
      })
      .select(`
        *,
        profiles!inner(full_name, avatar_url, username)
      `)

    if (error) throw error
    return { comment: data[0] }
  },

  // Get interactions for a recipe (likes and comments)
  getRecipeInteractions: async (cookedRecipeId) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get all interactions
    const { data: interactions, error } = await supabase
      .from('community_interactions')
      .select(`
        *,
        profiles!inner(full_name, avatar_url, username)
      `)
      .eq('cooked_recipe_id', cookedRecipeId)
      .order('created_at', { ascending: true })

    if (error) throw error

    const likes = interactions.filter(i => i.interaction_type === 'like')
    const comments = interactions.filter(i => i.interaction_type === 'comment')
    
    // Check if current user liked this recipe
    const userLiked = user ? likes.some(like => like.user_id === user.id) : false

    return {
      likes: likes,
      comments: comments,
      likeCount: likes.length,
      commentCount: comments.length,
      userLiked: userLiked
    }
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