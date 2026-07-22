-- Buat tabel untuk menampung error
CREATE TABLE IF NOT EXISTS public.debug_logs (
    id SERIAL PRIMARY KEY,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
