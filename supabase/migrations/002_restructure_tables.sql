-- Drop unnecessary tables and views
DROP TABLE IF EXISTS public.cooked_recipes CASCADE;
DROP TABLE IF EXISTS public.recipes CASCADE;
DROP VIEW IF EXISTS public.user_cooked_recipes_with_context CASCADE;
DROP VIEW IF EXISTS public.user_saved_recipes_with_context CASCADE;
DROP VIEW IF EXISTS public.community_feed CASCADE;

-- Recreate saved_recipes table with proper structure (no recipe_id reference)
DROP TABLE IF EXISTS public.saved_recipes CASCADE;

CREATE TABLE public.saved_recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE NOT NULL,
  recipe_name TEXT NOT NULL,
  recipe_data JSONB NOT NULL, -- Store the full recipe data from AI response
  notes TEXT, -- User's personal notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, session_id, message_id) -- One save per user per message
);

-- Enable RLS on saved_recipes
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_recipes
CREATE POLICY "Users can view their own saved recipes" ON public.saved_recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved recipes" ON public.saved_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved recipes" ON public.saved_recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved recipes" ON public.saved_recipes
  FOR DELETE USING (auth.uid() = user_id);

-- Create cooked_recipes table (recipes that users have actually cooked)
CREATE TABLE public.cooked_recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE NOT NULL,
  recipe_name TEXT NOT NULL,
  recipe_data JSONB NOT NULL, -- Store the full recipe data
  user_photo_url TEXT, -- User's photo of their cooked dish
  user_review TEXT, -- User's review and tips
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  is_public BOOLEAN DEFAULT true, -- Whether to show in community feed
  cooking_notes TEXT, -- Any modifications or notes
  cooked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, session_id, message_id) -- One cooked entry per user per message
);

-- Enable RLS on cooked_recipes
ALTER TABLE public.cooked_recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for cooked_recipes
CREATE POLICY "Users can view their own cooked recipes" ON public.cooked_recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public cooked recipes are viewable by everyone" ON public.cooked_recipes
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own cooked recipes" ON public.cooked_recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cooked recipes" ON public.cooked_recipes
  FOR UPDATE USING (auth.uid() = user_id);

-- Remove recipe-related columns from chat_messages since we're not using recipe entities
ALTER TABLE public.chat_messages 
DROP COLUMN IF EXISTS selected_recipe_id CASCADE;

-- Update chat_messages to store recipe data directly in metadata
-- The recipes_suggested column will now contain full recipe objects instead of IDs

-- Create community_interactions table for the new structure
DROP TABLE IF EXISTS public.community_interactions CASCADE;

CREATE TABLE public.community_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cooked_recipe_id UUID REFERENCES public.cooked_recipes(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'comment', 'share')),
  content TEXT, -- For comments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, cooked_recipe_id, interaction_type) -- Prevent duplicate likes for same type
);

-- Enable RLS on community_interactions
ALTER TABLE public.community_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for community_interactions
CREATE POLICY "Users can view all community interactions" ON public.community_interactions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own interactions" ON public.community_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions" ON public.community_interactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions" ON public.community_interactions
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated community feed view
CREATE VIEW public.community_feed AS
SELECT 
  cr.id,
  cr.user_id,
  p.full_name as author_name,
  p.avatar_url as author_avatar,
  p.username as author_username,
  cr.recipe_name,
  cr.recipe_data,
  cr.user_photo_url,
  cr.user_review,
  cr.user_rating,
  cr.cooking_notes,
  cr.cooked_at,
  cr.created_at,
  cs.title as session_title,
  cm.content as message_content,
  cm.created_at as message_created_at,
  COALESCE(like_count.count, 0) as like_count,
  COALESCE(comment_count.count, 0) as comment_count
FROM public.cooked_recipes cr
JOIN public.profiles p ON cr.user_id = p.id
LEFT JOIN public.chat_sessions cs ON cr.session_id = cs.id
LEFT JOIN public.chat_messages cm ON cr.message_id = cm.id
LEFT JOIN (
  SELECT cooked_recipe_id, COUNT(*) as count 
  FROM public.community_interactions 
  WHERE interaction_type = 'like' 
  GROUP BY cooked_recipe_id
) like_count ON cr.id = like_count.cooked_recipe_id
LEFT JOIN (
  SELECT cooked_recipe_id, COUNT(*) as count 
  FROM public.community_interactions 
  WHERE interaction_type = 'comment' 
  GROUP BY cooked_recipe_id
) comment_count ON cr.id = comment_count.cooked_recipe_id
WHERE cr.is_public = true
ORDER BY cr.created_at DESC;

-- Create indexes for better performance
CREATE INDEX idx_saved_recipes_user_session ON public.saved_recipes(user_id, session_id);
CREATE INDEX idx_saved_recipes_message ON public.saved_recipes(message_id);
CREATE INDEX idx_cooked_recipes_user_session ON public.cooked_recipes(user_id, session_id);
CREATE INDEX idx_cooked_recipes_message ON public.cooked_recipes(message_id);
CREATE INDEX idx_cooked_recipes_public ON public.cooked_recipes(is_public) WHERE is_public = true;
CREATE INDEX idx_community_interactions_cooked_recipe_id ON public.community_interactions(cooked_recipe_id);
CREATE INDEX idx_community_interactions_user_id ON public.community_interactions(user_id);

-- Add updated_at trigger for cooked_recipes
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.cooked_recipes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();