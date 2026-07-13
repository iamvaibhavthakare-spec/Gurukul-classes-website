import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

export const BACKEND_ROOT = path.resolve(currentDir, "../..");
export const BUNDLED_UPLOAD_ROOT = path.join(BACKEND_ROOT, "uploads");
const runtimeHome =
  process.env.HOME || process.env.USERPROFILE || os.tmpdir();
const defaultUploadRoot =
  process.env.NODE_ENV === "production"
    ? path.join(runtimeHome, "gurukul-uploads")
    : path.join(BACKEND_ROOT, "uploads");
export const UPLOAD_ROOT = process.env.UPLOAD_ROOT
  ? path.resolve(process.env.UPLOAD_ROOT)
  : defaultUploadRoot;
export const ENV_FILE = path.join(BACKEND_ROOT, ".env");
