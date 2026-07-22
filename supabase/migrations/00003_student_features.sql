-- ============================================================================
-- 1. ADD AVATAR TO PROFILES
-- ============================================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ============================================================================
-- 2. SUPABASE STORAGE FOR AVATARS
-- ============================================================================

-- Create a new bucket named 'avatars'
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for the storage bucket
-- Anyone can read avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Users can upload their own avatars
CREATE POLICY "Users can upload their own avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid() = owner
    );

-- Users can update their own avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND
        auth.uid() = owner
    );

-- Users can delete their own avatars
CREATE POLICY "Users can delete their own avatars" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' AND
        auth.uid() = owner
    );
