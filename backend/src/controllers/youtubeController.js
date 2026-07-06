import { z } from "zod";
import { loadYoutubeUploads } from "../services/youtubeUploads.js";

const youtubeQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).optional(),
});

export async function getYoutubeUploads(req, res, next) {
  try {
    const parsed = youtubeQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: parsed.error.flatten(),
      });
    }

    const uploads = await loadYoutubeUploads(parsed.data.limit);
    return res.json(uploads);
  } catch (error) {
    return next(error);
  }
}
