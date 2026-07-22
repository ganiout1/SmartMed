-- Fix infinite recursion in RLS policies by using a security definer function

-- 1. Create a function that checks if the current user is an admin, bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the old recursive policies from all tables that use it
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to courses" ON public.courses;
DROP POLICY IF EXISTS "Admins have full access to course_lecturers" ON public.course_lecturers;
DROP POLICY IF EXISTS "Admins have full access to enrollment_keys" ON public.enrollment_keys;
DROP POLICY IF EXISTS "Admins have full access to course_members" ON public.course_members;
DROP POLICY IF EXISTS "Admins have full access to quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Admins have full access to questions" ON public.questions;
DROP POLICY IF EXISTS "Admins have full access to quiz_attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Admins have full access to answers" ON public.answers;

-- 3. Recreate them using the new non-recursive function
CREATE POLICY "Admins have full access to profiles" ON public.profiles
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to courses" ON public.courses
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to course_lecturers" ON public.course_lecturers
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to enrollment_keys" ON public.enrollment_keys
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to course_members" ON public.course_members
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to quizzes" ON public.quizzes
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to questions" ON public.questions
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to quiz_attempts" ON public.quiz_attempts
    FOR ALL USING (public.is_admin());

CREATE POLICY "Admins have full access to answers" ON public.answers
    FOR ALL USING (public.is_admin());
