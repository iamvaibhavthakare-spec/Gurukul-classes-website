import { z } from "zod";
import { heroSchema } from "../schemas/contentSchemas.js";
import { heroSlides } from "../data/seedData.js";
import { asOptionalString } from "../utils/normalize.js";
import { publicUploadUrl } from "../utils/file.js";
import { toHeroResponse } from "../utils/transformers.js";

const heroIdSchema = z.coerce.number().int().positive();
let ensureHeroTopperColumnPromise;

async function maybeBackfillSeedHeroTopperText(pool) {
  const [rows] = await pool.query(
    "SELECT id, title, display_order, topper_text FROM hero_sections ORDER BY display_order ASC, id ASC",
  );

  const defaultTopperSlides = heroSlides.filter((slide) => slide.topperText?.trim());
  if (defaultTopperSlides.length === 0) {
    return;
  }

  const byDisplayOrder = new Map(
    heroSlides.map((slide) => [slide.displayOrder, slide]),
  );
  const looksLikeSeedData =
    rows.length === heroSlides.length &&
    rows.every((row) => {
      const seedSlide = byDisplayOrder.get(row.display_order);
      return seedSlide && seedSlide.title === row.title;
    });

  if (!looksLikeSeedData) {
    return;
  }

  const hasAnyTopperText = rows.some(
    (row) => typeof row.topper_text === "string" && row.topper_text.trim(),
  );
  if (hasAnyTopperText) {
    return;
  }

  for (const slide of defaultTopperSlides) {
    await pool.query(
      `
        UPDATE hero_sections
        SET topper_text = ?
        WHERE display_order = ?
          AND title = ?
          AND topper_text IS NULL
      `,
      [slide.topperText, slide.displayOrder, slide.title],
    );
  }
}

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

      const hasTopperColumn = Number(rows?.[0]?.count || 0) > 0;
      if (!hasTopperColumn) {
        await pool.query(
          "ALTER TABLE hero_sections ADD COLUMN topper_text VARCHAR(160) NULL AFTER badge",
        );
      }

      await maybeBackfillSeedHeroTopperText(pool);
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

async function getHeroSectionsForReorder(connection) {
  const [rows] = await connection.query(
    `
      SELECT *
      FROM hero_sections
      ORDER BY display_order ASC, id ASC
      FOR UPDATE
    `,
  );
  return rows;
}

function resolveDisplayOrderIndex(displayOrder, itemCount) {
  if (!Number.isFinite(displayOrder) || displayOrder < 1) {
    return itemCount;
  }

  return Math.min(displayOrder - 1, itemCount);
}

async function rewriteHeroDisplayOrder(connection, orderedIds, currentRows) {
  const currentDisplayOrderById = new Map(
    currentRows.map((row) => [row.id, row.display_order]),
  );

  for (const [index, id] of orderedIds.entries()) {
    const nextDisplayOrder = index + 1;
    if (currentDisplayOrderById.get(id) === nextDisplayOrder) {
      continue;
    }

    await connection.query("UPDATE hero_sections SET display_order = ? WHERE id = ?", [
      nextDisplayOrder,
      id,
    ]);
  }
}

async function normalizeHeroDisplayOrder(pool) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const orderedRows = await getHeroSectionsForReorder(connection);
    const orderedIds = orderedRows.map((row) => row.id);
    await rewriteHeroDisplayOrder(connection, orderedIds, orderedRows);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function listHeroSections(req, res, includeInactive = false) {
  const pool = req.app.locals.pool;
  await ensureHeroTopperColumn(pool);
  await normalizeHeroDisplayOrder(pool);
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
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const orderedRows = await getHeroSectionsForReorder(connection);
      const payload = heroInsertPayload(parsed.data, publicUploadUrl(req.file.path));
      const insertIndex = resolveDisplayOrderIndex(parsed.data.displayOrder, orderedRows.length);
      const [result] = await connection.query("INSERT INTO hero_sections SET ?", [payload]);

      const orderedIds = orderedRows.map((row) => row.id);
      orderedIds.splice(insertIndex, 0, result.insertId);

      await rewriteHeroDisplayOrder(connection, orderedIds, orderedRows);

      const [rows] = await connection.query("SELECT * FROM hero_sections WHERE id = ?", [
        result.insertId,
      ]);

      await connection.commit();
      return res.status(201).json(toHeroResponse(rows[0]));
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
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
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const orderedRows = await getHeroSectionsForReorder(connection);
      const existing = orderedRows.find((row) => row.id === heroId);
      if (!existing) {
        await connection.rollback();
        return res.status(404).json({ message: "Hero banner not found." });
      }

      const backgroundImage = req.file
        ? publicUploadUrl(req.file.path)
        : asOptionalString(req.body.existingBackgroundImage) || existing.background_image;

      const payload = heroInsertPayload(parsed.data, backgroundImage);
      await connection.query("UPDATE hero_sections SET ? WHERE id = ?", [payload, heroId]);

      const orderedIds = orderedRows
        .filter((row) => row.id !== heroId)
        .map((row) => row.id);
      const insertIndex = resolveDisplayOrderIndex(parsed.data.displayOrder, orderedIds.length);

      orderedIds.splice(insertIndex, 0, heroId);

      await rewriteHeroDisplayOrder(connection, orderedIds, orderedRows);

      const [rows] = await connection.query("SELECT * FROM hero_sections WHERE id = ?", [heroId]);

      await connection.commit();
      return res.json(toHeroResponse(rows[0]));
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return next(error);
  }
}

export async function deleteHeroSection(req, res, next) {
  try {
    const heroId = heroIdSchema.parse(req.params.id);
    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const orderedRows = await getHeroSectionsForReorder(connection);
      const existing = orderedRows.find((row) => row.id === heroId);
      if (!existing) {
        await connection.rollback();
        return res.status(404).json({ message: "Hero banner not found." });
      }

      await connection.query("DELETE FROM hero_sections WHERE id = ?", [heroId]);

      const orderedIds = orderedRows
        .filter((row) => row.id !== heroId)
        .map((row) => row.id);

      await rewriteHeroDisplayOrder(connection, orderedIds, orderedRows);
      await connection.commit();

      return res.json({ message: "Hero banner deleted successfully." });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    return next(error);
  }
}
