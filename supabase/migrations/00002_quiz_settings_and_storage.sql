-- ============================================================================
-- 1. ADD QUIZ SETTINGS COLUMNS
-- ============================================================================

ALTER TABLE public.quizzes
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS randomize_questions BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS randomize_answers BOOLEAN DEFAULT false;

-- Add check constraint for status
ALTER TABLE public.quizzes
ADD CONSTRAINT valid_quiz_status CHECK (status IN ('draft', 'published'));

-- ============================================================================
-- 2. SUPABASE STORAGE FOR EXPLANATION IMAGES
-- ============================================================================

-- Create a new bucket named 'explanation_images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('explanation_images', 'explanation_images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for the storage bucket
-- Only lecturers and admins can upload images
CREATE POLICY "Lecturers can upload explanation images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'explanation_images' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('lecturer', 'admin')
        )
    );

CREATE POLICY "Lecturers can update their own uploaded images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'explanation_images' AND
        auth.uid() = owner
    );

CREATE POLICY "Lecturers can delete their own uploaded images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'explanation_images' AND
        auth.uid() = owner
    );

-- Everyone can read explanation images (since the bucket is public, they can fetch it)
CREATE POLICY "Anyone can read explanation images" ON storage.objects
    FOR SELECT USING (bucket_id = 'explanation_images');
