-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (automatically populated from auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create recipes table (master recipe data)
CREATE TABLE public.recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  history TEXT NOT NULL,
  ingredients JSONB NOT NULL, -- Array of ingredients
  steps JSONB NOT NULL, -- Array of cooking steps
  image_url TEXT,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER,
  tags JSONB DEFAULT '[]'::jsonb, -- Array of tags like ["spicy", "traditional", etc.]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on recipes
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Create policy for recipes (readable by everyone)
CREATE POLICY "Recipes are viewable by everyone" ON public.recipes
  FOR SELECT USING (true);

-- Create chat_sessions table
CREATE TABLE public.chat_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'Chat Baru',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on chat_sessions
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_sessions
CREATE POLICY "Users can view their own chat sessions" ON public.chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions" ON public.chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" ON public.chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions" ON public.chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'ai')),
  content TEXT NOT NULL,
  recipes_suggested JSONB DEFAULT '[]'::jsonb, -- Array of recipe IDs suggested by AI
  selected_recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional data like images, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_messages
CREATE POLICY "Users can view messages from their own sessions" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions 
      WHERE id = chat_messages.session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their own sessions" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.chat_sessions 
      WHERE id = session_id AND user_id = auth.uid()
    )
  );

-- Create saved_recipes table (bookmarked recipes)
CREATE TABLE public.saved_recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL, -- Reference to where it was saved
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE SET NULL, -- Reference to specific message
  notes TEXT, -- User's personal notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
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
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE SET NULL, -- Reference to where it was cooked from
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE SET NULL, -- Reference to specific message
  user_photo_url TEXT, -- User's photo of their cooked dish
  user_review TEXT, -- User's review and tips
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  is_public BOOLEAN DEFAULT true, -- Whether to show in community feed
  cooking_notes TEXT, -- Any modifications or notes
  cooked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id) -- One cooked entry per user per recipe
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

CREATE POLICY "Users can delete their own cooked recipes" ON public.cooked_recipes
  FOR DELETE USING (auth.uid() = user_id);

-- Create community_interactions table (likes, comments, shares)
CREATE TABLE public.community_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  cooked_recipe_id UUID REFERENCES public.cooked_recipes(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'comment', 'share')),
  content TEXT, -- For comments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, cooked_recipe_id, interaction_type) -- Prevent duplicate likes
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

-- Create function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.cooked_recipes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_saved_recipes_user_id ON public.saved_recipes(user_id);
CREATE INDEX idx_saved_recipes_recipe_id ON public.saved_recipes(recipe_id);
CREATE INDEX idx_cooked_recipes_user_id ON public.cooked_recipes(user_id);
CREATE INDEX idx_cooked_recipes_recipe_id ON public.cooked_recipes(recipe_id);
CREATE INDEX idx_cooked_recipes_public ON public.cooked_recipes(is_public) WHERE is_public = true;
CREATE INDEX idx_community_interactions_cooked_recipe_id ON public.community_interactions(cooked_recipe_id);
CREATE INDEX idx_community_interactions_user_id ON public.community_interactions(user_id);

-- Create views for easier querying
CREATE VIEW public.community_feed AS
SELECT 
  cr.id,
  cr.user_id,
  p.full_name as author_name,
  p.avatar_url as author_avatar,
  p.username as author_username,
  r.name as recipe_name,
  r.region as recipe_region,
  r.history as recipe_history,
  r.ingredients as recipe_ingredients,
  r.steps as recipe_steps,
  cr.user_photo_url,
  cr.user_review,
  cr.user_rating,
  cr.cooking_notes,
  cr.cooked_at,
  cr.created_at,
  -- Aggregate interaction counts
  COALESCE(likes.count, 0) as likes_count,
  COALESCE(comments.count, 0) as comments_count,
  COALESCE(shares.count, 0) as shares_count
FROM public.cooked_recipes cr
JOIN public.profiles p ON cr.user_id = p.id
JOIN public.recipes r ON cr.recipe_id = r.id
LEFT JOIN (
  SELECT cooked_recipe_id, COUNT(*) as count
  FROM public.community_interactions
  WHERE interaction_type = 'like'
  GROUP BY cooked_recipe_id
) likes ON cr.id = likes.cooked_recipe_id
LEFT JOIN (
  SELECT cooked_recipe_id, COUNT(*) as count
  FROM public.community_interactions
  WHERE interaction_type = 'comment'
  GROUP BY cooked_recipe_id
) comments ON cr.id = comments.cooked_recipe_id
LEFT JOIN (
  SELECT cooked_recipe_id, COUNT(*) as count
  FROM public.community_interactions
  WHERE interaction_type = 'share'
  GROUP BY cooked_recipe_id
) shares ON cr.id = shares.cooked_recipe_id
WHERE cr.is_public = true
ORDER BY cr.created_at DESC;

-- Create view for user's saved recipes with chat context
CREATE VIEW public.user_saved_recipes_with_context AS
SELECT 
  sr.id,
  sr.user_id,
  sr.recipe_id,
  sr.notes,
  sr.created_at,
  r.name as recipe_name,
  r.region as recipe_region,
  r.history as recipe_history,
  r.ingredients as recipe_ingredients,
  r.steps as recipe_steps,
  r.image_url as recipe_image_url,
  cs.title as session_title,
  cm.content as message_content,
  cm.created_at as message_created_at
FROM public.saved_recipes sr
JOIN public.recipes r ON sr.recipe_id = r.id
LEFT JOIN public.chat_sessions cs ON sr.session_id = cs.id
LEFT JOIN public.chat_messages cm ON sr.message_id = cm.id
ORDER BY sr.created_at DESC;

-- Create view for user's cooked recipes with chat context
CREATE VIEW public.user_cooked_recipes_with_context AS
SELECT 
  cr.id,
  cr.user_id,
  cr.recipe_id,
  cr.user_photo_url,
  cr.user_review,
  cr.user_rating,
  cr.is_public,
  cr.cooking_notes,
  cr.cooked_at,
  cr.created_at,
  r.name as recipe_name,
  r.region as recipe_region,
  r.history as recipe_history,
  r.ingredients as recipe_ingredients,
  r.steps as recipe_steps,
  r.image_url as recipe_image_url,
  cs.title as session_title,
  cm.content as message_content,
  cm.created_at as message_created_at
FROM public.cooked_recipes cr
JOIN public.recipes r ON cr.recipe_id = r.id
LEFT JOIN public.chat_sessions cs ON cr.session_id = cs.id
LEFT JOIN public.chat_messages cm ON cr.message_id = cm.id
ORDER BY cr.created_at DESC;