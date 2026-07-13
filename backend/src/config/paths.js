import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

export const BACKEND_ROOT = path.resolve(currentDir, "../..");
export const UPLOAD_ROOT = path.join(BACKEND_ROOT, "uploads");
export const ENV_FILE = path.join(BACKEND_ROOT, ".env");
