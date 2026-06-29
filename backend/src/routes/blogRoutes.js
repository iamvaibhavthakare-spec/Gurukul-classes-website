import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAdminBlogs,
  getBlogBySlug,
  getBlogs,
  updateBlog,
} from "../controllers/blogController.js";
import { requireAdmin } from "../middleware/auth.js";
import { createUpload } from "../utils/file.js";

const blogUpload = createUpload({
  subdir: "blogs",
  fieldName: "featuredImage",
});

export const publicBlogRouter = Router();
export const adminBlogRouter = Router();

publicBlogRouter.get("/blogs", getBlogs);
publicBlogRouter.get("/blogs/:slug", getBlogBySlug);

adminBlogRouter.get("/blogs", requireAdmin, getAdminBlogs);
adminBlogRouter.post("/blogs", requireAdmin, blogUpload, createBlog);
adminBlogRouter.put("/blogs/:id", requireAdmin, blogUpload, updateBlog);
adminBlogRouter.delete("/blogs/:id", requireAdmin, deleteBlog);
