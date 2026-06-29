import { Router } from "express";
import {
  createGalleryItem,
  deleteGalleryItem,
  getAdminGallery,
  getGallery,
  updateGalleryItem,
} from "../controllers/galleryController.js";
import { requireAdmin } from "../middleware/auth.js";
import { createUpload } from "../utils/file.js";

const galleryCreateUpload = createUpload({
  subdir: "gallery",
  fieldName: "images",
  multiple: true,
  maxCount: 20,
});

const gallerySingleUpload = createUpload({
  subdir: "gallery",
  fieldName: "image",
});

export const publicGalleryRouter = Router();
export const adminGalleryRouter = Router();

publicGalleryRouter.get("/gallery", getGallery);

adminGalleryRouter.get("/gallery", requireAdmin, getAdminGallery);
adminGalleryRouter.post("/gallery", requireAdmin, galleryCreateUpload, createGalleryItem);
adminGalleryRouter.put("/gallery/:id", requireAdmin, gallerySingleUpload, updateGalleryItem);
adminGalleryRouter.delete("/gallery/:id", requireAdmin, deleteGalleryItem);
