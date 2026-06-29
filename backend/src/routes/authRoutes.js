import { Router } from "express";
import { loginAdmin, getAdminProfile } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/auth.js";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", loginAdmin);
adminAuthRouter.get("/me", requireAdmin, getAdminProfile);
