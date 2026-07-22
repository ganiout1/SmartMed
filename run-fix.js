const { Client } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));

async function fixDatabase() {
  const client = new Client({
    connectionString: envConfig.DATABASE_URL
  });
  
  await client.connect();
  
  const query = `
    -- Pastikan Enum user_role tersedia
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('admin', 'lecturer', 'student');
        END IF;
    END$$;

    -- Buat tabel untuk menampung error
    CREATE TABLE IF NOT EXISTS public.debug_logs (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Perbarui/Buat Ulang Fungsi Trigger
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

    -- Hapus trigger lama (jika ada) dan buat ulang
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  `;
  
  try {
    await client.query(query);
    console.log("Trigger successfully updated.");
  } catch (e) {
    console.log("Error updating trigger:", e.message);
  }

  await client.end();
}

fixDatabase();
