import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for database operations

// Recipes
export const getRecipes = async () => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getRecipeById = async (id) => {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Chat Sessions
export const createChatSession = async (userId, title = 'Chat Baru') => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{ user_id: userId, title }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getChatSessions = async (userId) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getChatMessages = async (sessionId) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(`
      *,
      recipes:selected_recipe_id(*)
    `)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export const createChatMessage = async (sessionId, userId, messageType, content, metadata = {}) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{
      session_id: sessionId,
      user_id: userId,
      message_type: messageType,
      content,
      metadata
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Saved Recipes
export const saveRecipe = async (userId, recipeId, sessionId = null, messageId = null, notes = null) => {
  const { data, error } = await supabase
    .from('saved_recipes')
    .upsert([{
      user_id: userId,
      recipe_id: recipeId,
      session_id: sessionId,
      message_id: messageId,
      notes
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const unsaveRecipe = async (userId, recipeId) => {
  const { error } = await supabase
    .from('saved_recipes')
    .delete()
    .eq('user_id', userId)
    .eq('recipe_id', recipeId)
  
  if (error) throw error
}

export const getSavedRecipes = async (userId) => {
  const { data, error } = await supabase
    .from('user_saved_recipes_with_context')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Cooked Recipes
export const markRecipeAsCooked = async (cookedData) => {
  const { data, error } = await supabase
    .from('cooked_recipes')
    .upsert([cookedData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getCookedRecipes = async (userId) => {
  const { data, error } = await supabase
    .from('user_cooked_recipes_with_context')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Community Feed
export const getCommunityFeed = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('community_feed')
    .select('*')
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Community Interactions
export const toggleLike = async (userId, cookedRecipeId) => {
  // Check if like exists
  const { data: existingLike } = await supabase
    .from('community_interactions')
    .select('id')
    .eq('user_id', userId)
    .eq('cooked_recipe_id', cookedRecipeId)
    .eq('interaction_type', 'like')
    .single()
  
  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('community_interactions')
      .delete()
      .eq('id', existingLike.id)
    
    if (error) throw error
    return { liked: false }
  } else {
    // Like
    const { data, error } = await supabase
      .from('community_interactions')
      .insert([{
        user_id: userId,
        cooked_recipe_id: cookedRecipeId,
        interaction_type: 'like'
      }])
      .select()
      .single()
    
    if (error) throw error
    return { liked: true, data }
  }
}

export const addComment = async (userId, cookedRecipeId, content) => {
  const { data, error } = await supabase
    .from('community_interactions')
    .insert([{
      user_id: userId,
      cooked_recipe_id: cookedRecipeId,
      interaction_type: 'comment',
      content
    }])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// User Profile
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}