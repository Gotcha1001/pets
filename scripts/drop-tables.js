require("dotenv/config");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DRIZZLE_DATABASE_URL);

async function dropTables() {
  try {
    console.log("Dropping tables...");

    // Drop tables in reverse order of dependencies
    // (tables with foreign keys first, then referenced tables)
    await sql`DROP TABLE IF EXISTS likes CASCADE;`;
    await sql`DROP TABLE IF EXISTS pets CASCADE;`;
    await sql`DROP TABLE IF EXISTS users CASCADE;`;

    console.log("Tables dropped successfully!");
  } catch (error) {
    console.error("Error dropping tables:", error);
    throw error;
  }
}

dropTables().then(() => process.exit(0));
