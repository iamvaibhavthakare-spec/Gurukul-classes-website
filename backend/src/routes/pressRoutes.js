import { Router } from "express";
import {
  createPressRelease,
  deletePressRelease,
  getAdminPressReleases,
  getPressReleaseById,
  getPressReleases,
  updatePressRelease,
} from "../controllers/pressController.js";
import { requireAdmin } from "../middleware/auth.js";
import { createUpload } from "../utils/file.js";

const pressUpload = createUpload({
  subdir: "press",
  fieldName: "media",
  allowPdf: true,
  maxSizeMb: 15,
});

export const publicPressRouter = Router();
export const adminPressRouter = Router();

publicPressRouter.get("/press-releases", getPressReleases);
publicPressRouter.get("/press-releases/:id", getPressReleaseById);

adminPressRouter.get("/press-releases", requireAdmin, getAdminPressReleases);
adminPressRouter.post("/press-releases", requireAdmin, pressUpload, createPressRelease);
adminPressRouter.put("/press-releases/:id", requireAdmin, pressUpload, updatePressRelease);
adminPressRouter.delete("/press-releases/:id", requireAdmin, deletePressRelease);
