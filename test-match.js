const { Client } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));

async function checkProfiles() {
  const client = new Client({
    connectionString: envConfig.DATABASE_URL
  });
  
  await client.connect();
  
  try {
    const res = await client.query(`SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5`);
    console.log("AUTH USERS:");
    console.log(res.rows);
    
    const res2 = await client.query(`SELECT id, email, full_name, role FROM public.profiles ORDER BY created_at DESC LIMIT 5`);
    console.log("PROFILES:");
    console.log(res2.rows);
  } catch (e) {
    console.log("Error querying:", e.message);
  }

  await client.end();
}

checkProfiles();
