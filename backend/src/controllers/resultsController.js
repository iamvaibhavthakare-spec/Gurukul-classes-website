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
    const payload = resultInsertPayload(parsed.data, publicUploadUrl(req.file.path));
    const [result] = await pool.query("INSERT INTO results SET ?", [payload]);
    const [rows] = await pool.query("SELECT * FROM results WHERE id = ?", [result.insertId]);
    return res.status(201).json(toResultResponse(rows[0]));
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
    const [existingRows] = await pool.query("SELECT * FROM results WHERE id = ? LIMIT 1", [resultId]);
    const existing = existingRows[0];
    if (!existing) {
      return res.status(404).json({ message: "Result not found." });
    }

    const studentPhoto = req.file
      ? publicUploadUrl(req.file.path)
      : asOptionalString(req.body.existingStudentPhoto) || existing.student_photo;

    const payload = resultInsertPayload(parsed.data, studentPhoto);
    await pool.query("UPDATE results SET ? WHERE id = ?", [payload, resultId]);

    const [rows] = await pool.query("SELECT * FROM results WHERE id = ?", [resultId]);
    return res.json(toResultResponse(rows[0]));
  } catch (error) {
    return next(error);
  }
}

export async function deleteResult(req, res, next) {
  try {
    const resultId = resultIdSchema.parse(req.params.id);
    const pool = req.app.locals.pool;
    const [result] = await pool.query("DELETE FROM results WHERE id = ?", [resultId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Result not found." });
    }

    return res.json({ message: "Result deleted successfully." });
  } catch (error) {
    return next(error);
  }
}
