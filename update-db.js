const { Client } = require("pg");

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.preosnupfugfsbovstsc:unrammec12@@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
  });
  await client.connect();
  
  try {
    await client.query("ALTER TABLE questions ADD COLUMN option_e TEXT;");
    console.log("Successfully added option_e");
  } catch (err) {
    console.error("Error adding option_e:", err);
  } finally {
    await client.end();
  }
}

main();
