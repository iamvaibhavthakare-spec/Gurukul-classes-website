import { z } from "zod";
import { gallerySchema } from "../schemas/contentSchemas.js";
import { asOptionalString } from "../utils/normalize.js";
import { publicUploadUrl } from "../utils/file.js";
import { toGalleryResponse } from "../utils/transformers.js";

const galleryIdSchema = z.coerce.number().int().positive();

function galleryInsertPayload(data, imagePath) {
  return {
    title: data.title,
    image_path: imagePath,
    category: data.category,
    description: asOptionalString(data.description),
    display_order: data.displayOrder,
    status: data.status,
  };
}

async function listGalleryItems(req, res, includeInactive = false) {
  const pool = req.app.locals.pool;
  const [rows] = await pool.query(
    includeInactive
      ? "SELECT * FROM gallery ORDER BY display_order ASC, id ASC"
      : "SELECT * FROM gallery WHERE status = 'active' ORDER BY display_order ASC, id ASC",
  );
  return res.json(rows.map(toGalleryResponse));
}

export async function getGallery(req, res, next) {
  try {
    return await listGalleryItems(req, res, false);
  } catch (error) {
    return next(error);
  }
}

export async function getAdminGallery(req, res, next) {
  try {
    return await listGalleryItems(req, res, true);
  } catch (error) {
    return next(error);
  }
}

export async function createGalleryItem(req, res, next) {
  try {
    const parsed = gallerySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: parsed.error.flatten(),
      });
    }

    const files = Array.isArray(req.files) ? req.files : [];
    if (files.length === 0) {
      return res.status(400).json({ message: "At least one gallery image is required." });
    }

    const pool = req.app.locals.pool;
    const inserted = [];

    for (const [index, file] of files.entries()) {
      const payload = galleryInsertPayload(parsed.data, publicUploadUrl(file.path));
      payload.display_order = parsed.data.displayOrder + index;
      const [result] = await pool.query("INSERT INTO gallery SET ?", [payload]);
      const [rows] = await pool.query("SELECT * FROM gallery WHERE id = ?", [result.insertId]);
      inserted.push(toGalleryResponse(rows[0]));
    }

    return res.status(201).json(files.length === 1 ? inserted[0] : inserted);
  } catch (error) {
    return next(error);
  }
}

export async function updateGalleryItem(req, res, next) {
  try {
    const galleryId = galleryIdSchema.parse(req.params.id);
    const parsed = gallerySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: parsed.error.flatten(),
      });
    }

    const pool = req.app.locals.pool;
    const [existingRows] = await pool.query("SELECT * FROM gallery WHERE id = ? LIMIT 1", [galleryId]);
    const existing = existingRows[0];
    if (!existing) {
      return res.status(404).json({ message: "Gallery item not found." });
    }

    const file = Array.isArray(req.files) ? req.files[0] : req.file;
    const imagePath = file
      ? publicUploadUrl(file.path)
      : asOptionalString(req.body.existingImage) || existing.image_path;

    const payload = galleryInsertPayload(parsed.data, imagePath);
    await pool.query("UPDATE gallery SET ? WHERE id = ?", [payload, galleryId]);

    const [rows] = await pool.query("SELECT * FROM gallery WHERE id = ?", [galleryId]);
    return res.json(toGalleryResponse(rows[0]));
  } catch (error) {
    return next(error);
  }
}

export async function deleteGalleryItem(req, res, next) {
  try {
    const galleryId = galleryIdSchema.parse(req.params.id);
    const pool = req.app.locals.pool;
    const [result] = await pool.query("DELETE FROM gallery WHERE id = ?", [galleryId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Gallery item not found." });
    }

    return res.json({ message: "Gallery item deleted successfully." });
  } catch (error) {
    return next(error);
  }
}
