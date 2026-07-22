const { Client } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));

async function checkSchema() {
  const client = new Client({
    connectionString: envConfig.DATABASE_URL
  });
  
  await client.connect();
  
  try {
    const res = await client.query(`
      SELECT n.nspname AS schema_name, t.typname
      FROM pg_type t
      JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE t.typname = 'user_role';
    `);
    console.log("USER_ROLE SCHEMA:");
    console.log(res.rows);
  } catch (e) {
    console.log("Error querying schema:", e.message);
  }

  await client.end();
}

checkSchema();
