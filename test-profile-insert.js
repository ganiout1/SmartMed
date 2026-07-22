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

async function testInsert() {
  console.log("Testing insert with dummy UUID...");
  // Use a random UUID
  const dummyId = "00000000-0000-0000-0000-000000000000";
  
  const { data, error } = await supabaseAdmin.from('profiles').insert([
    {
      id: dummyId,
      full_name: "Test Name",
      email: "test@example.com",
      role: "student"
    }
  ]);
  
  console.log("Error details:");
  console.log(error);
}

testInsert();
