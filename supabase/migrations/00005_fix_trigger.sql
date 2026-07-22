-- ============================================================================
-- FIX: RECREATE USER ROLE AND TRIGGER
-- ============================================================================

-- Pastikan Enum user_role tersedia
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'lecturer', 'student');
    END IF;
END$$;

-- Perbarui/Buat Ulang Fungsi Trigger dengan search_path yang benar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (
        new.id, 
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
        new.email, 
        COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role)
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Hapus trigger lama (jika ada) dan buat ulang
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
