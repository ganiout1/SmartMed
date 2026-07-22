const { Client } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env.local'));

async function checkRLS() {
  const client = new Client({
    connectionString: envConfig.DATABASE_URL
  });
  
  await client.connect();
  
  try {
    const res = await client.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      WHERE relname IN ('profiles', 'courses', 'quizzes', 'quiz_attempts')
    `);
    console.log("RLS Status:");
    console.table(res.rows);
  } catch (e) {
    console.log("Error querying:", e.message);
  }

  await client.end();
}

checkRLS();
