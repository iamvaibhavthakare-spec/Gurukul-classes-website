import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { requireAdmin } from "../middleware/auth.js";

export const adminDashboardRouter = Router();

adminDashboardRouter.get("/dashboard", requireAdmin, getDashboard);
