-- Fix handle_new_user trigger to properly reference public.user_role with empty search_path

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
            COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role)
        );
    EXCEPTION WHEN OTHERS THEN
        INSERT INTO public.debug_logs (message) VALUES (SQLERRM);
    END;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert missing profiles for any users created while the trigger was broken
INSERT INTO public.profiles (id, full_name, email, role)
SELECT id, split_part(email, '@', 1), email, 'student'::public.user_role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
