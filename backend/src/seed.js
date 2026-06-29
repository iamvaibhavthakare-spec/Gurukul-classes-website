import { initializeDatabase } from "./services/initDatabase.js";

async function run() {
  const pool = await initializeDatabase();
  await pool.end();
  console.log("Database seeded successfully.");
}

run().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
