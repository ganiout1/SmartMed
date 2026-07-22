const { Client } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));

async function checkDb() {
  const client = new Client({
    connectionString: envConfig.DATABASE_URL
  });
  
  await client.connect();
  
  try {
    const res = await client.query('SELECT * FROM public.debug_logs ORDER BY created_at DESC LIMIT 5');
    console.log("DEBUG LOGS:");
    console.log(res.rows);
  } catch (e) {
    console.log("Error querying debug_logs:", e.message);
  }

  // Let's also check if user_role enum exists and what values it has
  try {
    const res = await client.query(`SELECT enumlabel FROM pg_enum WHERE enumtypid = 'user_role'::regtype`);
    console.log("USER_ROLE ENUM VALUES:");
    console.log(res.rows);
  } catch (e) {
    console.log("Error querying user_role:", e.message);
  }

  await client.end();
}

checkDb();
