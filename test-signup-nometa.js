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

async function testAdminSignupEmptyMeta() {
  console.log("Attempting admin signup with empty meta...");
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'test_admin_signup_nometa@example.com',
    password: 'password123',
    email_confirm: true,
  });

  if (error) {
    console.log("ADMIN SIGNUP ERROR:");
    console.log(error);
  } else {
    console.log("ADMIN SIGNUP SUCCESS:");
    console.log(data);
    
    // Cleanup
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
  }
}

testAdminSignupEmptyMeta();
