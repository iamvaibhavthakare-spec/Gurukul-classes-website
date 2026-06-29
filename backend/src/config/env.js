import dotenv from "dotenv";

dotenv.config();

function readNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const PORT = readNumber(process.env.PORT, 5000);
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASSWORD = process.env.DB_PASSWORD || "root";
export const DB_NAME = process.env.DB_NAME || "gurukul_classes";
export const JWT_SECRET = process.env.JWT_SECRET || "gurukul_admin_secret";
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const NODE_ENV = process.env.NODE_ENV || "development";
