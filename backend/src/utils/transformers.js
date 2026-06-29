import { parseJsonArray } from "./normalize.js";
import { publicUploadUrl } from "./file.js";

export function toHeroResponse(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    buttonText: row.button_text,
    buttonLink: row.button_link,
    backgroundImage: row.background_image,
    badge: row.badge,
    displayOrder: row.display_order,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toResultResponse(row) {
  return {
    id: row.id,
    studentName: row.student_name,
    examType: row.exam_type,
    examLabel: row.exam_label,
    resultValue: row.result_value,
    year: row.year,
    studentPhoto: row.student_photo,
    description: row.description,
    displayOrder: row.display_order,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toGalleryResponse(row) {
  return {
    id: row.id,
    title: row.title,
    image: row.image_path,
    category: row.category,
    description: row.description,
    displayOrder: row.display_order,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toPressResponse(row) {
  return {
    id: row.id,
    title: row.title,
    shortDescription: row.short_description,
    fullDescription: row.full_description,
    mediaPath: row.media_path,
    mediaType: row.media_type,
    releaseDate: row.release_date,
    sourceName: row.source_name,
    displayOrder: row.display_order,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toBlogResponse(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description,
    fullContent: row.full_content,
    featuredImage: row.featured_image,
    author: row.author,
    category: row.category,
    publishDate: row.publish_date,
    status: row.status,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    readTime: row.read_time,
    imageAlt: row.image_alt,
    body: parseJsonArray(row.body_json, []),
    highlights: parseJsonArray(row.highlights_json, []),
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toUploadUrlResponse(filePath) {
  return publicUploadUrl(filePath);
}
