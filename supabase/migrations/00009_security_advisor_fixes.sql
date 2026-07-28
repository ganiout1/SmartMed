-- Security fixes based on Supabase Security Advisor

-- 1. Fix: Function Search Path Mutable for is_admin and handle_new_user
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SET search_path = ''
AS $$
BEGIN
    BEGIN
        INSERT INTO public.profiles (id, full_name, email, role)
        VALUES (
            new.id, 
            COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
            new.email, 
            COALESCE((new.raw_user_meta_data->>'role')::user_role, 'student'::user_role)
        );
    EXCEPTION WHEN OTHERS THEN
        INSERT INTO public.debug_logs (message) VALUES (SQLERRM);
    END;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Fix: Public and Signed-In Users Can Execute SECURITY DEFINER Functions
-- Triggers and RLS functions should only be called by the database internally, not exposed to the PostgREST API.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
