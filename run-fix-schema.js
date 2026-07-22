const { Client } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));

async function fixTriggerSchema() {
  const client = new Client({
    connectionString: envConfig.DATABASE_URL
  });
  
  await client.connect();
  
  const query = `
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
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
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
  `;
  
  try {
    await client.query(query);
    console.log("Trigger successfully updated with public schema and search_path.");
  } catch (e) {
    console.log("Error updating trigger:", e.message);
  }

  await client.end();
}

fixTriggerSchema();
