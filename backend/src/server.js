import { PORT } from "./config/env.js";
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
  console.error("Failed to start backend:", error);
  process.exit(1);
});
