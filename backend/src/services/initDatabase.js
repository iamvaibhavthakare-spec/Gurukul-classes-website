import bcrypt from "bcryptjs";
import { DB_NAME } from "../config/env.js";
import { createPool, createRootConnection } from "../config/db.js";
import { ensureUploadFolders } from "../utils/file.js";
import {
  blogs,
  defaultAdmin,
  galleryItems,
  heroSlides,
  pressReleases,
  results,
} from "../data/seedData.js";

const SCHEMA_STATEMENTS = [
  `
    CREATE TABLE IF NOT EXISTS admins (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(40) NOT NULL DEFAULT 'superadmin',
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      last_login_at DATETIME NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  `
    CREATE TABLE IF NOT EXISTS hero_sections (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) NULL,
      description TEXT NOT NULL,
      button_text VARCHAR(120) NOT NULL,
      button_link VARCHAR(255) NOT NULL,
      background_image VARCHAR(255) NOT NULL,
      badge VARCHAR(120) NULL,
      display_order INT NOT NULL DEFAULT 0,
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  `
    CREATE TABLE IF NOT EXISTS results (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      student_name VARCHAR(160) NOT NULL,
      exam_type VARCHAR(60) NOT NULL,
      exam_label VARCHAR(160) NOT NULL,
      result_value VARCHAR(120) NOT NULL,
      year INT NOT NULL,
      student_photo VARCHAR(255) NULL,
      description TEXT NULL,
      display_order INT NOT NULL DEFAULT 0,
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  `
    CREATE TABLE IF NOT EXISTS gallery (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      image_path VARCHAR(255) NOT NULL,
      category VARCHAR(120) NOT NULL,
      description TEXT NULL,
      display_order INT NOT NULL DEFAULT 0,
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  `
    CREATE TABLE IF NOT EXISTS press_releases (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      short_description VARCHAR(500) NOT NULL,
      full_description LONGTEXT NOT NULL,
      media_path VARCHAR(255) NULL,
      media_type VARCHAR(50) NULL,
      release_date DATE NOT NULL,
      source_name VARCHAR(160) NOT NULL,
      display_order INT NOT NULL DEFAULT 0,
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
  `
    CREATE TABLE IF NOT EXISTS blogs (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      short_description VARCHAR(500) NOT NULL,
      full_content LONGTEXT NOT NULL,
      featured_image VARCHAR(255) NOT NULL,
      author VARCHAR(160) NOT NULL,
      category VARCHAR(160) NOT NULL,
      publish_date DATE NOT NULL,
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      meta_title VARCHAR(255) NOT NULL,
      meta_description VARCHAR(500) NOT NULL,
      read_time VARCHAR(60) NOT NULL,
      image_alt VARCHAR(255) NOT NULL,
      body_json LONGTEXT NOT NULL,
      highlights_json LONGTEXT NOT NULL,
      display_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      INDEX idx_blogs_publish_date (publish_date),
      INDEX idx_blogs_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
];

async function ensureDatabaseExists() {
  const connection = await createRootConnection();
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await connection.end();
  }
}

async function createTables(pool) {
  for (const statement of SCHEMA_STATEMENTS) {
    await pool.query(statement);
  }
}

async function insertRows(pool, table, columns, rows) {
  if (rows.length === 0) {
    return;
  }
  const quotedColumns = columns.map((column) => `\`${column}\``).join(", ");
  const singleRowPlaceholders = `(${columns.map(() => "?").join(", ")})`;
  const sql = `INSERT INTO \`${table}\` (${quotedColumns}) VALUES ${rows
    .map(() => singleRowPlaceholders)
    .join(", ")}`;
  const values = rows.flatMap((row) => columns.map((column) => row[column]));
  await pool.query(sql, values);
}

async function tableCount(pool, table) {
  const [rows] = await pool.query(`SELECT COUNT(*) AS count FROM \`${table}\``);
  return Number(rows?.[0]?.count || 0);
}

async function seedData(pool) {
  const adminCount = await tableCount(pool, "admins");
  if (adminCount === 0) {
    const passwordHash = await bcrypt.hash(defaultAdmin.password, 10);
    await insertRows(pool, "admins", ["name", "email", "password_hash", "role", "status"], [
      {
        name: defaultAdmin.name,
        email: defaultAdmin.email,
        password_hash: passwordHash,
        role: defaultAdmin.role,
        status: "active",
      },
    ]);
  }

  if ((await tableCount(pool, "hero_sections")) === 0) {
    await insertRows(
      pool,
      "hero_sections",
      [
        "title",
        "subtitle",
        "description",
        "button_text",
        "button_link",
        "background_image",
        "badge",
        "display_order",
        "status",
      ],
      heroSlides.map((item) => ({
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        button_text: item.buttonText,
        button_link: item.buttonLink,
        background_image: item.backgroundImage,
        badge: item.badge,
        display_order: item.displayOrder,
        status: item.status,
      })),
    );
  }

  if ((await tableCount(pool, "results")) === 0) {
    await insertRows(
      pool,
      "results",
      [
        "student_name",
        "exam_type",
        "exam_label",
        "result_value",
        "year",
        "student_photo",
        "description",
        "display_order",
        "status",
      ],
      results.map((item) => ({
        student_name: item.studentName,
        exam_type: item.examType,
        exam_label: item.examLabel,
        result_value: item.resultValue,
        year: item.year,
        student_photo: item.studentPhoto,
        description: item.description,
        display_order: item.displayOrder,
        status: item.status,
      })),
    );
  }

  if ((await tableCount(pool, "gallery")) === 0) {
    await insertRows(
      pool,
      "gallery",
      ["title", "image_path", "category", "description", "display_order", "status"],
      galleryItems.map((item) => ({
        title: item.title,
        image_path: item.image,
        category: item.category,
        description: item.description,
        display_order: item.displayOrder,
        status: item.status,
      })),
    );
  }

  if ((await tableCount(pool, "press_releases")) === 0) {
    await insertRows(
      pool,
      "press_releases",
      [
        "title",
        "short_description",
        "full_description",
        "media_path",
        "media_type",
        "release_date",
        "source_name",
        "display_order",
        "status",
      ],
      pressReleases.map((item) => ({
        title: item.title,
        short_description: item.shortDescription,
        full_description: item.fullDescription,
        media_path: item.mediaPath,
        media_type: item.mediaType,
        release_date: item.releaseDate,
        source_name: item.sourceName,
        display_order: item.displayOrder,
        status: item.status,
      })),
    );
  }

  if ((await tableCount(pool, "blogs")) === 0) {
    await insertRows(
      pool,
      "blogs",
      [
        "title",
        "slug",
        "short_description",
        "full_content",
        "featured_image",
        "author",
        "category",
        "publish_date",
        "status",
        "meta_title",
        "meta_description",
        "read_time",
        "image_alt",
        "body_json",
        "highlights_json",
        "display_order",
      ],
      blogs.map((item) => ({
        title: item.title,
        slug: item.slug,
        short_description: item.shortDescription,
        full_content: item.fullContent,
        featured_image: item.featuredImage,
        author: item.author,
        category: item.category,
        publish_date: item.publishDate,
        status: item.status,
        meta_title: item.metaTitle,
        meta_description: item.metaDescription,
        read_time: item.readTime,
        image_alt: item.imageAlt,
        body_json: JSON.stringify(item.body),
        highlights_json: JSON.stringify(item.highlights),
        display_order: item.displayOrder,
      })),
    );
  }
}

export async function initializeDatabase() {
  ensureUploadFolders();
  await ensureDatabaseExists();
  const pool = createPool();
  await createTables(pool);
  await seedData(pool);
  return pool;
}
