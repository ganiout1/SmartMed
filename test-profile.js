const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');
const crypto = require('crypto');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testInsertProfile() {
  console.log("Attempting direct profile insert...");
  // We need an auth user ID to satisfy the foreign key constraint.
  // Wait, if auth.users is empty, we can't insert into profiles!
  // Let's first fetch an existing user to use their ID for a test (update) or we can just try to see if auth.users has anything.
  const { data: users, error: err } = await supabaseAdmin.auth.admin.listUsers();
  if (err) {
     console.log("Failed to list users", err);
     return;
  }
  
  console.log(`Found ${users.users.length} users.`);
  if (users.users.length > 0) {
      const user = users.users[0];
      console.log(`Testing profile update for ${user.id}...`);
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select();
        
      if (error) {
        console.log("PROFILE UPDATE ERROR:");
        console.log(error);
      } else {
        console.log("PROFILE UPDATE SUCCESS:");
        console.log(data);
      }
  } else {
      console.log("No users found to test profile.");
  }
}

testInsertProfile();
