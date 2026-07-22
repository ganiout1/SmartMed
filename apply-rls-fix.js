const { Client } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));

async function applyFix() {
  const client = new Client({
    connectionString: envConfig.DATABASE_URL
  });
  
  await client.connect();
  console.log("Connected to Supabase Postgres.");
  
  try {
    const sql = fs.readFileSync('./supabase/migrations/00007_fix_rls_recursion.sql', 'utf8');
    await client.query(sql);
    console.log("SUCCESS: RLS Recursion Fix Applied!");
  } catch (e) {
    console.log("FAILED to apply fix:", e.message);
  } finally {
    await client.end();
  }
}

applyFix();
