const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testSignup() {
  console.log("Attempting signup...");
  const { data, error } = await supabase.auth.signUp({
    email: 'test_signup_agent@example.com',
    password: 'password123',
    options: {
      data: {
        full_name: 'Test Agent',
        role: 'student'
      }
    }
  });

  if (error) {
    console.log("SIGNUP ERROR:");
    console.log(error);
    console.log("Error JSON:", JSON.stringify(error));
  } else {
    console.log("SIGNUP SUCCESS:");
    console.log(data);
  }
}

testSignup();
