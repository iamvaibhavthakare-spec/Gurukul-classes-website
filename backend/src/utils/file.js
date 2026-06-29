import fs from "node:fs";
import path from "node:path";
import multer from "multer";

export const UPLOAD_ROOT = path.resolve(process.cwd(), "uploads");
export const UPLOAD_PREFIX = "/uploads";

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const PRESS_ALLOWED_MIME_TYPES = new Set([
  ...IMAGE_MIME_TYPES,
  "application/pdf",
]);

export function ensureUploadRoot() {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

export function ensureUploadFolders() {
  ensureUploadRoot();
  ["seed", "hero", "results", "gallery", "press", "blogs"].forEach((folder) => {
    fs.mkdirSync(path.join(UPLOAD_ROOT, folder), { recursive: true });
  });
}

function safeFileName(fileName) {
  const base = path
    .basename(fileName, path.extname(fileName))
    .trim()
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "upload";
}

function createStorage(subdir) {
  return multer.diskStorage({
    destination(_req, _file, callback) {
      const destination = path.join(UPLOAD_ROOT, subdir);
      fs.mkdirSync(destination, { recursive: true });
      callback(null, destination);
    },
    filename(_req, file, callback) {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      callback(null, `${safeFileName(file.originalname)}-${unique}${path.extname(file.originalname).toLowerCase()}`);
    },
  });
}

function makeFileFilter({ allowPdf = false }) {
  return (_req, file, callback) => {
    const allowed = allowPdf ? PRESS_ALLOWED_MIME_TYPES : IMAGE_MIME_TYPES;
    if (allowed.has(file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(new Error("Only image files" + (allowPdf ? " or PDF files" : "") + " are allowed."));
  };
}

export function createUpload({ subdir, fieldName, multiple = false, maxCount = 1, allowPdf = false, maxSizeMb = 10 }) {
  const upload = multer({
    storage: createStorage(subdir),
    fileFilter: makeFileFilter({ allowPdf }),
    limits: { fileSize: maxSizeMb * 1024 * 1024 },
  });

  if (multiple) {
    return upload.array(fieldName, maxCount);
  }
  return upload.single(fieldName);
}

export function publicUploadUrl(filePath) {
  if (!filePath) {
    return null;
  }
  const normalized = String(filePath).replace(/\\/g, "/");
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  if (normalized.startsWith(UPLOAD_PREFIX)) {
    return normalized;
  }
  const relative = path.relative(UPLOAD_ROOT, filePath).replace(/\\/g, "/");
  return `${UPLOAD_PREFIX}/${relative}`;
}
