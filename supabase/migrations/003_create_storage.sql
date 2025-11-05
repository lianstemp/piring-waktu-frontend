-- Create storage bucket for cooked recipe photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cooked-recipes',
  'cooked-recipes',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policies
CREATE POLICY "Users can upload their own cooked recipe photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cooked-recipes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view all public cooked recipe photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'cooked-recipes');

CREATE POLICY "Users can update their own cooked recipe photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cooked-recipes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own cooked recipe photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cooked-recipes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );