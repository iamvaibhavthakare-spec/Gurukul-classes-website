export function asString(value, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }
  const text = String(value).trim();
  return text.length > 0 ? text : fallback;
}

export function asOptionalString(value) {
  const text = asString(value, "");
  return text.length > 0 ? text : null;
}

export function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function asStatus(value) {
  return String(value).toLowerCase() === "inactive" ? "inactive" : "active";
}

export function parseJsonArray(value, fallback = []) {
  if (!value) {
    return fallback;
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return fallback;
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function splitParagraphs(value) {
  const text = asString(value, "");
  if (!text) {
    return [];
  }
  return text
    .split(/\n\s*\n/g)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function splitLines(value) {
  const text = asString(value, "");
  if (!text) {
    return [];
  }
  return text
    .split(/\r?\n/g)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function mergeFileValue(existingValue, fileUrl) {
  return fileUrl || asOptionalString(existingValue);
}
