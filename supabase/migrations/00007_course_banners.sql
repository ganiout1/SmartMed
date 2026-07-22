-- 1. Add banner_url to courses table
ALTER TABLE public.courses ADD COLUMN banner_url TEXT;

-- 2. Create course_banners bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course_banners', 'course_banners', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies for course_banners
-- Admins can do anything
CREATE POLICY "Admins have full access to course_banners" ON storage.objects
    FOR ALL USING (
        bucket_id = 'course_banners' AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Anyone can read
CREATE POLICY "Public can view course banners" ON storage.objects
    FOR SELECT USING (bucket_id = 'course_banners');
