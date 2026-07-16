import { z } from "zod";
import { resultSchema } from "../schemas/contentSchemas.js";
import { asOptionalString } from "../utils/normalize.js";
import { publicUploadUrl } from "../utils/file.js";
import { toResultResponse } from "../utils/transformers.js";

const resultIdSchema = z.coerce.number().int().positive();

function resultInsertPayload(data, studentPhoto) {
  return {
    student_name: data.studentName,
    exam_type: data.examType,
    exam_label: data.examLabel,
    result_value: data.resultValue,
    year: data.year,
    student_photo: studentPhoto,
    description: asOptionalString(data.description),
    display_order: data.displayOrder,
    status: data.status,
  };
}

async function getResultsForReorder(connection) {
  const [rows] = await connection.query(
    `
      SELECT *
      FROM results
      ORDER BY display_order ASC, year DESC, id ASC
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

async function rewriteDisplayOrder(connection, orderedIds, currentRows) {
  const currentDisplayOrderById = new Map(
    currentRows.map((row) => [row.id, row.display_order]),
  );

  for (const [index, id] of orderedIds.entries()) {
    const nextDisplayOrder = index + 1;
    if (currentDisplayOrderById.get(id) === nextDisplayOrder) {
      continue;
    }

    await connection.query("UPDATE results SET display_order = ? WHERE id = ?", [
      nextDisplayOrder,
      id,
    ]);
  }
}

async function listResults(req, res, includeInactive = false) {
  const pool = req.app.locals.pool;
  const [rows] = await pool.query(
    includeInactive
      ? "SELECT * FROM results ORDER BY display_order ASC, year DESC, id ASC"
      : "SELECT * FROM results WHERE status = 'active' ORDER BY display_order ASC, year DESC, id ASC",
  );
  return res.json(rows.map(toResultResponse));
}

export async function getResults(req, res, next) {
  try {
    return await listResults(req, res, false);
  } catch (error) {
    return next(error);
  }
}

export async function getAdminResults(req, res, next) {
  try {
    return await listResults(req, res, true);
  } catch (error) {
    return next(error);
  }
}

export async function createResult(req, res, next) {
  try {
    const parsed = resultSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: parsed.error.flatten(),
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Student photo is required." });
    }

    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const orderedRows = await getResultsForReorder(connection);
      const payload = resultInsertPayload(parsed.data, publicUploadUrl(req.file.path));
      const insertIndex = resolveDisplayOrderIndex(parsed.data.displayOrder, orderedRows.length);
      const [result] = await connection.query("INSERT INTO results SET ?", [payload]);

      const orderedIds = orderedRows.map((row) => row.id);
      orderedIds.splice(insertIndex, 0, result.insertId);

      await rewriteDisplayOrder(connection, orderedIds, orderedRows);

      const [rows] = await connection.query("SELECT * FROM results WHERE id = ?", [
        result.insertId,
      ]);

      await connection.commit();
      return res.status(201).json(toResultResponse(rows[0]));
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

export async function updateResult(req, res, next) {
  try {
    const resultId = resultIdSchema.parse(req.params.id);
    const parsed = resultSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: parsed.error.flatten(),
      });
    }

    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const orderedRows = await getResultsForReorder(connection);
      const existing = orderedRows.find((row) => row.id === resultId);
      if (!existing) {
        await connection.rollback();
        return res.status(404).json({ message: "Result not found." });
      }

      const studentPhoto = req.file
        ? publicUploadUrl(req.file.path)
        : asOptionalString(req.body.existingStudentPhoto) || existing.student_photo;

      const payload = resultInsertPayload(parsed.data, studentPhoto);
      await connection.query("UPDATE results SET ? WHERE id = ?", [payload, resultId]);

      const orderedIds = orderedRows
        .filter((row) => row.id !== resultId)
        .map((row) => row.id);
      const insertIndex = resolveDisplayOrderIndex(parsed.data.displayOrder, orderedIds.length);

      orderedIds.splice(insertIndex, 0, resultId);

      await rewriteDisplayOrder(connection, orderedIds, orderedRows);

      const [rows] = await connection.query("SELECT * FROM results WHERE id = ?", [resultId]);

      await connection.commit();
      return res.json(toResultResponse(rows[0]));
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

export async function deleteResult(req, res, next) {
  try {
    const resultId = resultIdSchema.parse(req.params.id);
    const pool = req.app.locals.pool;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const orderedRows = await getResultsForReorder(connection);
      const existing = orderedRows.find((row) => row.id === resultId);
      if (!existing) {
        await connection.rollback();
        return res.status(404).json({ message: "Result not found." });
      }

      await connection.query("DELETE FROM results WHERE id = ?", [resultId]);

      const orderedIds = orderedRows
        .filter((row) => row.id !== resultId)
        .map((row) => row.id);

      await rewriteDisplayOrder(connection, orderedIds, orderedRows);
      await connection.commit();

      return res.json({ message: "Result deleted successfully." });
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
