import { Router } from "express";
import {
  createResult,
  deleteResult,
  getAdminResults,
  getResults,
  updateResult,
} from "../controllers/resultsController.js";
import { requireAdmin } from "../middleware/auth.js";
import { createUpload } from "../utils/file.js";

const resultUpload = createUpload({
  subdir: "results",
  fieldName: "studentPhoto",
});

export const publicResultsRouter = Router();
export const adminResultsRouter = Router();

publicResultsRouter.get("/results", getResults);

adminResultsRouter.get("/results", requireAdmin, getAdminResults);
adminResultsRouter.post("/results", requireAdmin, resultUpload, createResult);
adminResultsRouter.put("/results/:id", requireAdmin, resultUpload, updateResult);
adminResultsRouter.delete("/results/:id", requireAdmin, deleteResult);
