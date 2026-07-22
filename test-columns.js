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

async function checkColumns() {
  const { data, error } = await supabaseAdmin
    .rpc('get_columns', { table_name: 'profiles' }); // This might not exist
  
  if (error) {
    // We can just query with an invalid column and read the hint
    const { error: err2 } = await supabaseAdmin.from('profiles').select('id, role, full_name, email, tier, is_banned, non_existent_column').limit(1);
    console.log(err2);
  }
}

checkColumns();
