import path from "node:path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { FRONTEND_URL, NODE_ENV } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { adminAuthRouter } from "./routes/authRoutes.js";
import { adminDashboardRouter } from "./routes/dashboardRoutes.js";
import { publicHeroRouter, adminHeroRouter } from "./routes/heroRoutes.js";
import { publicResultsRouter, adminResultsRouter } from "./routes/resultsRoutes.js";
import { publicGalleryRouter, adminGalleryRouter } from "./routes/galleryRoutes.js";
import { publicPressRouter, adminPressRouter } from "./routes/pressRoutes.js";
import { publicBlogRouter, adminBlogRouter } from "./routes/blogRoutes.js";

const allowedOrigins = new Set([
  FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

export function createApp(pool) {
  const app = express();

  app.locals.pool = pool;
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }
        callback(null, true);
      },
    }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use(morgan(NODE_ENV === "development" ? "dev" : "combined"));
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api", publicHeroRouter);
  app.use("/api", publicResultsRouter);
  app.use("/api", publicGalleryRouter);
  app.use("/api", publicPressRouter);
  app.use("/api", publicBlogRouter);

  app.use("/api/admin", adminAuthRouter);
  app.use("/api/admin", adminDashboardRouter);
  app.use("/api/admin", adminHeroRouter);
  app.use("/api/admin", adminResultsRouter);
  app.use("/api/admin", adminGalleryRouter);
  app.use("/api/admin", adminPressRouter);
  app.use("/api/admin", adminBlogRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
