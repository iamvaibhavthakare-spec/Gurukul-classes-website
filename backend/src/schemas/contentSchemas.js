import { z } from "zod";

const statusSchema = z.enum(["active", "inactive"]).default("active");

export const heroSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  subtitle: z.string().trim().optional().nullable(),
  description: z.string().trim().min(1, "Description is required."),
  buttonText: z.string().trim().min(1, "Button text is required."),
  buttonLink: z.string().trim().min(1, "Button link is required."),
  badge: z.string().trim().optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: statusSchema,
});

export const resultSchema = z.object({
  studentName: z.string().trim().min(1, "Student name is required."),
  examType: z.string().trim().min(1, "Exam type is required."),
  examLabel: z.string().trim().min(1, "Exam label is required."),
  resultValue: z.string().trim().min(1, "Result value is required."),
  year: z.coerce.number().int().min(1900).max(2100),
  description: z.string().trim().optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: statusSchema,
});

export const gallerySchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  category: z.string().trim().min(1, "Category is required."),
  description: z.string().trim().optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: statusSchema,
});

export const pressSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  shortDescription: z.string().trim().min(1, "Short description is required."),
  fullDescription: z.string().trim().min(1, "Full description is required."),
  releaseDate: z.string().trim().min(8, "Release date is required."),
  sourceName: z.string().trim().min(1, "Source name is required."),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: statusSchema,
});

export const blogSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: z.string().trim().optional().nullable(),
  shortDescription: z.string().trim().min(1, "Short description is required."),
  fullContent: z.string().trim().min(1, "Full content is required."),
  author: z.string().trim().min(1, "Author is required."),
  category: z.string().trim().min(1, "Category is required."),
  publishDate: z.string().trim().min(8, "Publish date is required."),
  status: statusSchema,
  metaTitle: z.string().trim().min(1, "Meta title is required."),
  metaDescription: z.string().trim().min(1, "Meta description is required."),
  readTime: z.string().trim().min(1, "Read time is required."),
  imageAlt: z.string().trim().min(1, "Image alt text is required."),
  body: z.string().trim().optional().nullable(),
  highlights: z.string().trim().optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
});
