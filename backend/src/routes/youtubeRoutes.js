import { Router } from "express";
import { getYoutubeUploads } from "../controllers/youtubeController.js";

export const publicYoutubeRouter = Router();

publicYoutubeRouter.get("/youtube/uploads", getYoutubeUploads);
