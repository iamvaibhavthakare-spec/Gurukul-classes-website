import { Router } from "express";
import {
  createHeroSection,
  deleteHeroSection,
  getAdminHeroSections,
  getHeroSections,
  updateHeroSection,
} from "../controllers/heroController.js";
import { requireAdmin } from "../middleware/auth.js";
import { createUpload } from "../utils/file.js";

const heroUpload = createUpload({
  subdir: "hero",
  fieldName: "backgroundImage",
});

export const publicHeroRouter = Router();
export const adminHeroRouter = Router();

publicHeroRouter.get("/hero", getHeroSections);

adminHeroRouter.get("/hero", requireAdmin, getAdminHeroSections);
adminHeroRouter.post("/hero", requireAdmin, heroUpload, createHeroSection);
adminHeroRouter.put("/hero/:id", requireAdmin, heroUpload, updateHeroSection);
adminHeroRouter.delete("/hero/:id", requireAdmin, deleteHeroSection);
