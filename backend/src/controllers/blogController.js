import { z } from "zod";
import { blogSchema } from "../schemas/contentSchemas.js";
import { asOptionalString, splitLines, splitParagraphs } from "../utils/normalize.js";
import { slugify } from "../utils/slugify.js";
import { publicUploadUrl } from "../utils/file.js";
import { toBlogResponse } from "../utils/transformers.js";

const blogIdSchema = z.coerce.number().int().positive();

function blogInsertPayload(data, featuredImage, slug, bodyJson, highlightsJson) {
  return {
    title: data.title,
    slug,
    short_description: data.shortDescription,
    full_content: data.fullContent,
    featured_image: featuredImage,
    author: data.author,
    category: data.category,
    publish_date: data.publishDate,
    status: data.status,
    meta_title: data.metaTitle,
    meta_description: data.metaDescription,
    read_time: data.readTime,
    image_alt: data.imageAlt,
    body_json: JSON.stringify(bodyJson),
    highlights_json: JSON.stringify(highlightsJson),
    display_order: data.displayOrder,
  };
}

async function ensureUniqueSlug(pool, baseSlug, currentId = null) {
  let candidate = baseSlug || "blog-post";
  let counter = 2;

  while (true) {
    const [rows] = currentId
      ? await pool.query("SELECT id FROM blogs WHERE slug = ? AND id <> ? LIMIT 1", [candidate, currentId])
      : await pool.query("SELECT id FROM blogs WHERE slug = ? LIMIT 1", [candidate]);

    if (rows.length === 0) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

async function listBlogs(req, res, includeInactive = false) {
  const pool = req.app.locals.pool;
  const [rows] = await pool.query(
    includeInactive
      ? "SELECT * FROM blogs ORDER BY publish_date DESC, display_order DESC, id DESC"
      : "SELECT * FROM blogs WHERE status = 'active' ORDER BY publish_date DESC, display_order DESC, id DESC",
  );
  return res.json(rows.map(toBlogResponse));
}

export async function getBlogs(req, res, next) {
  try {
    return await listBlogs(req, res, false);
  } catch (error) {
    return next(error);
  }
}

export async function getBlogBySlug(req, res, next) {
  try {
    const slug = asOptionalString(req.params.slug);
    if (!slug) {
      return res.status(400).json({ message: "Slug is required." });
    }

    const pool = req.app.locals.pool;
    const [rows] = await pool.query("SELECT * FROM blogs WHERE slug = ? AND status = 'active' LIMIT 1", [slug]);
    if (!rows[0]) {
      return res.status(404).json({ message: "Blog not found." });
    }

    return res.json(toBlogResponse(rows[0]));
  } catch (error) {
    return next(error);
  }
}

export async function getAdminBlogs(req, res, next) {
  try {
    return await listBlogs(req, res, true);
  } catch (error) {
    return next(error);
  }
}

export async function createBlog(req, res, next) {
  try {
    const parsed = blogSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: parsed.error.flatten(),
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Featured image is required." });
    }

    const pool = req.app.locals.pool;
    const slugBase = slugify(parsed.data.slug || parsed.data.title);
    const slug = await ensureUniqueSlug(pool, slugBase);
    const bodyJson = splitParagraphs(parsed.data.body || parsed.data.fullContent);
    const highlightsJson = splitLines(parsed.data.highlights);
    const payload = blogInsertPayload(
      parsed.data,
      publicUploadUrl(req.file.path),
      slug,
      bodyJson.length > 0 ? bodyJson : splitParagraphs(parsed.data.fullContent),
      highlightsJson,
    );

    const [result] = await pool.query("INSERT INTO blogs SET ?", [payload]);
    const [rows] = await pool.query("SELECT * FROM blogs WHERE id = ?", [result.insertId]);
    return res.status(201).json(toBlogResponse(rows[0]));
  } catch (error) {
    return next(error);
  }
}

export async function updateBlog(req, res, next) {
  try {
    const blogId = blogIdSchema.parse(req.params.id);
    const parsed = blogSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed.",
        errors: parsed.error.flatten(),
      });
    }

    const pool = req.app.locals.pool;
    const [existingRows] = await pool.query("SELECT * FROM blogs WHERE id = ? LIMIT 1", [blogId]);
    const existing = existingRows[0];
    if (!existing) {
      return res.status(404).json({ message: "Blog not found." });
    }

    const file = req.file || null;
    const featuredImage = file
      ? publicUploadUrl(file.path)
      : asOptionalString(req.body.existingFeaturedImage) || existing.featured_image;
    const slugBase = slugify(parsed.data.slug || parsed.data.title);
    const slug = await ensureUniqueSlug(pool, slugBase, blogId);
    const bodyJson = splitParagraphs(parsed.data.body || parsed.data.fullContent);
    const highlightsJson = splitLines(parsed.data.highlights);

    const payload = blogInsertPayload(
      parsed.data,
      featuredImage,
      slug,
      bodyJson.length > 0 ? bodyJson : splitParagraphs(parsed.data.fullContent),
      highlightsJson,
    );

    await pool.query("UPDATE blogs SET ? WHERE id = ?", [payload, blogId]);
    const [rows] = await pool.query("SELECT * FROM blogs WHERE id = ?", [blogId]);
    return res.json(toBlogResponse(rows[0]));
  } catch (error) {
    return next(error);
  }
}

export async function deleteBlog(req, res, next) {
  try {
    const blogId = blogIdSchema.parse(req.params.id);
    const pool = req.app.locals.pool;
    const [result] = await pool.query("DELETE FROM blogs WHERE id = ?", [blogId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Blog not found." });
    }

    return res.json({ message: "Blog deleted successfully." });
  } catch (error) {
    return next(error);
  }
}
