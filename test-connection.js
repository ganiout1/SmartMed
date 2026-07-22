const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSupabaseConnection() {
  console.log("Testing connection...");
  const { data, error } = await supabaseAdmin.from('profiles').select('*').limit(1);
  if (error) {
    console.log("Error querying profiles:");
    console.log(error);
  } else {
    console.log("Query profiles success. Number of rows:", data.length);
  }
}

testSupabaseConnection();
