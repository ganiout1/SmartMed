const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');
const env = dotenv.parse(fs.readFileSync('.env.local'));

async function testUserRead() {
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  // Login as test user
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'testlogin@test.com',
    password: 'Test1234!'
  });
  
  if (authErr) {
    console.error("Login failed:", authErr.message);
    return;
  }
  
  console.log("Logged in user ID:", authData.user.id);
  
  // Try to read profile
  const { data: profile, error: profErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();
    
  if (profErr) {
    console.error("Profile read failed:", profErr);
  } else {
    console.log("Profile read success:", profile);
  }
}

testUserRead();
