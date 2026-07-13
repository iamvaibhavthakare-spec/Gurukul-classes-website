import { z } from "zod";
import { heroSchema } from "../schemas/contentSchemas.js";
import { asOptionalString } from "../utils/normalize.js";
import { publicUploadUrl } from "../utils/file.js";
import { toHeroResponse } from "../utils/transformers.js";

const heroIdSchema = z.coerce.number().int().positive();
let ensureHeroTopperColumnPromise;

async function ensureHeroTopperColumn(pool) {
  if (!ensureHeroTopperColumnPromise) {
    ensureHeroTopperColumnPromise = (async () => {
      const [rows] = await pool.query(
        `
          SELECT COUNT(*) AS count
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'hero_sections'
            AND COLUMN_NAME = 'topper_text'
        `,
      );

      if (Number(rows?.[0]?.count || 0) === 0) {
        await pool.query(
          "ALTER TABLE hero_sections ADD COLUMN topper_text VARCHAR(160) NULL AFTER badge",
        );
      }
    })().catch((error) => {
      ensureHeroTopperColumnPromise = null;
      throw error;
    });
  }

  return ensureHeroTopperColumnPromise;
}

function heroInsertPayload(data, backgroundImage) {
  return {
    title: data.title,
    subtitle: asOptionalString(data.subtitle),
    description: data.description,
    button_text: data.buttonText,
    button_link: data.buttonLink,
    background_image: backgroundImage,
    badge: asOptionalString(data.badge),
    topper_text: asOptionalString(data.topperText),
    display_order: data.displayOrder,
    status: data.status,
  };
}

async function listHeroSections(req, res, includeInactive = false) {
  const pool = req.app.locals.pool;
  await ensureHeroTopperColumn(pool);
  const [rows] = await pool.query(
    includeInactive
      ? "SELECT * FROM hero_sections ORDER BY display_order ASC, id ASC"
      : "SELECT * FROM hero_sections WHERE status = 'active' ORDER BY display_order ASC, id ASC",
  );
  return res.json(rows.map(toHeroResponse));
}

export async function getHeroSections(req, res, next) {
  try {
    return await listHeroSections(req, res, false);
  } catch (error) {
    return next(error);
  }
}

export async function getAdminHeroSections(req, res, next) {
  try {
    return await listHeroSections(req, res, true);
  } catch (error) {
    return next(error);
  }
}

export async function createHeroSection(req, res, next) {
  try {
    const parsed = heroSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: parsed.error.flatten(),
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Background image is required." });
    }

    const pool = req.app.locals.pool;
    await ensureHeroTopperColumn(pool);
    const payload = heroInsertPayload(parsed.data, publicUploadUrl(req.file.path));
    const [result] = await pool.query("INSERT INTO hero_sections SET ?", [payload]);
    const [rows] = await pool.query("SELECT * FROM hero_sections WHERE id = ?", [result.insertId]);

    return res.status(201).json(toHeroResponse(rows[0]));
  } catch (error) {
    return next(error);
  }
}

export async function updateHeroSection(req, res, next) {
  try {
    const heroId = heroIdSchema.parse(req.params.id);
    const parsed = heroSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: parsed.error.flatten(),
      });
    }

    const pool = req.app.locals.pool;
    await ensureHeroTopperColumn(pool);
    const [existingRows] = await pool.query("SELECT * FROM hero_sections WHERE id = ? LIMIT 1", [heroId]);
    const existing = existingRows[0];
    if (!existing) {
      return res.status(404).json({ message: "Hero banner not found." });
    }

    const backgroundImage = req.file
      ? publicUploadUrl(req.file.path)
      : asOptionalString(req.body.existingBackgroundImage) || existing.background_image;

    const payload = heroInsertPayload(parsed.data, backgroundImage);
    await pool.query("UPDATE hero_sections SET ? WHERE id = ?", [payload, heroId]);

    const [rows] = await pool.query("SELECT * FROM hero_sections WHERE id = ?", [heroId]);
    return res.json(toHeroResponse(rows[0]));
  } catch (error) {
    return next(error);
  }
}

export async function deleteHeroSection(req, res, next) {
  try {
    const heroId = heroIdSchema.parse(req.params.id);
    const pool = req.app.locals.pool;
    const [result] = await pool.query("DELETE FROM hero_sections WHERE id = ?", [heroId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Hero banner not found." });
    }

    return res.json({ message: "Hero banner deleted successfully." });
  } catch (error) {
    return next(error);
  }
}
