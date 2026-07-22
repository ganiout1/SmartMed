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

async function readDebugLogs() {
  const { data, error } = await supabaseAdmin.from('debug_logs').select('*');
  console.log("DEBUG LOGS:", data);
  console.log("Error:", error);
}

readDebugLogs();
