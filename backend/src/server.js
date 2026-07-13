import { DB_HOST, DB_NAME, DB_PORT, DB_USER, PORT } from "./config/env.js";
import { UPLOAD_ROOT } from "./config/paths.js";
import { initializeDatabase } from "./services/initDatabase.js";
import { createApp } from "./app.js";

async function bootstrap() {
  const pool = await initializeDatabase();
  const app = createApp(pool);

  app.listen(PORT, () => {
    console.log(`Gurukul backend running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start backend:", {
    message: error?.message,
    code: error?.code,
    errno: error?.errno,
    sqlMessage: error?.sqlMessage,
    port: PORT,
    dbHost: DB_HOST,
    dbPort: DB_PORT,
    dbName: DB_NAME,
    dbUser: DB_USER,
    uploadRoot: UPLOAD_ROOT,
  });
  process.exit(1);
});
