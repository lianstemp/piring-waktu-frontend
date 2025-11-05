-- Add images support to chat messages
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Add multiple images support to cooked recipes
ALTER TABLE public.cooked_recipes 
ADD COLUMN IF NOT EXISTS user_photos JSONB DEFAULT '[]'::jsonb;

-- Update existing user_photo_url to user_photos array format
UPDATE public.cooked_recipes 
SET user_photos = CASE 
  WHEN user_photo_url IS NOT NULL AND user_photo_url != '' 
  THEN jsonb_build_array(jsonb_build_object('url', user_photo_url, 'caption', ''))
  ELSE '[]'::jsonb
END
WHERE user_photos = '[]'::jsonb;

-- Create images table for better organization (optional, for future use)
CREATE TABLE IF NOT EXISTS public.message_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id UUID REFERENCES public.chat_messages(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on message_images
ALTER TABLE public.message_images ENABLE ROW LEVEL SECURITY;

-- Create policies for message_images
CREATE POLICY "Users can view images from their messages" ON public.message_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_messages cm 
      WHERE cm.id = message_images.message_id 
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert images to their messages" ON public.message_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_messages cm 
      WHERE cm.id = message_images.message_id 
      AND cm.user_id = auth.uid()
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_message_images_message_id ON public.message_images(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_images ON public.chat_messages USING GIN(images);
CREATE INDEX IF NOT EXISTS idx_cooked_recipes_photos ON public.cooked_recipes USING GIN(user_photos);

-- Create storage bucket for cooked recipe images (run this manually in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('cooked-recipes', 'cooked-recipes', true);

-- Create storage policies for cooked-recipes bucket
-- CREATE POLICY "Users can upload their own cooked recipe images" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'cooked-recipes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Anyone can view cooked recipe images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'cooked-recipes');

-- CREATE POLICY "Users can update their own cooked recipe images" ON storage.objects
--   FOR UPDATE USING (bucket_id = 'cooked-recipes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete their own cooked recipe images" ON storage.objects
--   FOR DELETE USING (bucket_id = 'cooked-recipes' AND auth.uid()::text = (storage.foldername(name))[1]);