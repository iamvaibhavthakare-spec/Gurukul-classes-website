import { z } from "zod";
import { pressSchema } from "../schemas/contentSchemas.js";
import { asOptionalString } from "../utils/normalize.js";
import { publicUploadUrl } from "../utils/file.js";
import { toPressResponse } from "../utils/transformers.js";

const pressIdSchema = z.coerce.number().int().positive();

function pressInsertPayload(data, mediaPath, mediaType) {
  return {
    title: data.title,
    short_description: data.shortDescription,
    full_description: data.fullDescription,
    media_path: mediaPath,
    media_type: mediaType,
    release_date: data.releaseDate,
    source_name: data.sourceName,
    display_order: data.displayOrder,
    status: data.status,
  };
}

async function listPressReleases(req, res, includeInactive = false) {
  const pool = req.app.locals.pool;
  const [rows] = await pool.query(
    includeInactive
      ? "SELECT * FROM press_releases ORDER BY release_date DESC, display_order DESC, id DESC"
      : "SELECT * FROM press_releases WHERE status = 'active' ORDER BY release_date DESC, display_order DESC, id DESC",
  );
  return res.json(rows.map(toPressResponse));
}

export async function getPressReleases(req, res, next) {
  try {
    return await listPressReleases(req, res, false);
  } catch (error) {
    return next(error);
  }
}

export async function getPressReleaseById(req, res, next) {
  try {
    const pressId = pressIdSchema.parse(req.params.id);
    const pool = req.app.locals.pool;
    const [rows] = await pool.query("SELECT * FROM press_releases WHERE id = ? AND status = 'active' LIMIT 1", [
      pressId,
    ]);

    if (!rows[0]) {
      return res.status(404).json({ message: "Press release not found." });
    }

    return res.json(toPressResponse(rows[0]));
  } catch (error) {
    return next(error);
  }
}

export async function getAdminPressReleases(req, res, next) {
  try {
    return await listPressReleases(req, res, true);
  } catch (error) {
    return next(error);
  }
}

export async function createPressRelease(req, res, next) {
  try {
    const parsed = pressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: parsed.error.flatten(),
      });
    }

    const file = req.file || null;
    const pool = req.app.locals.pool;
    const payload = pressInsertPayload(
      parsed.data,
      file ? publicUploadUrl(file.path) : null,
      file ? (file.mimetype === "application/pdf" ? "pdf" : "image") : null,
    );
    const [result] = await pool.query("INSERT INTO press_releases SET ?", [payload]);
    const [rows] = await pool.query("SELECT * FROM press_releases WHERE id = ?", [result.insertId]);
    return res.status(201).json(toPressResponse(rows[0]));
  } catch (error) {
    return next(error);
  }
}

export async function updatePressRelease(req, res, next) {
  try {
    const pressId = pressIdSchema.parse(req.params.id);
    const parsed = pressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: parsed.error.flatten(),
      });
    }

    const pool = req.app.locals.pool;
    const [existingRows] = await pool.query("SELECT * FROM press_releases WHERE id = ? LIMIT 1", [pressId]);
    const existing = existingRows[0];
    if (!existing) {
      return res.status(404).json({ message: "Press release not found." });
    }

    const file = req.file || null;
    const mediaPath = file
      ? publicUploadUrl(file.path)
      : asOptionalString(req.body.existingMediaPath) || existing.media_path;
    const mediaType = file
      ? file.mimetype === "application/pdf"
        ? "pdf"
        : "image"
      : asOptionalString(req.body.existingMediaType) || existing.media_type;

    const payload = pressInsertPayload(parsed.data, mediaPath, mediaType);
    await pool.query("UPDATE press_releases SET ? WHERE id = ?", [payload, pressId]);

    const [rows] = await pool.query("SELECT * FROM press_releases WHERE id = ?", [pressId]);
    return res.json(toPressResponse(rows[0]));
  } catch (error) {
    return next(error);
  }
}

export async function deletePressRelease(req, res, next) {
  try {
    const pressId = pressIdSchema.parse(req.params.id);
    const pool = req.app.locals.pool;
    const [result] = await pool.query("DELETE FROM press_releases WHERE id = ?", [pressId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Press release not found." });
    }

    return res.json({ message: "Press release deleted successfully." });
  } catch (error) {
    return next(error);
  }
}
