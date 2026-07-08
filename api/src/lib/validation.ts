import type { CmsWritePayload } from "./types.js";

function toTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface ValidatedPayload {
  type: string;
  slug: string;
  title: string;
  excerpt?: string;
  body?: string;
  imageUrl?: string;
  data?: Record<string, unknown>;
  published: boolean;
  order: number;
}

export function validatePayload(payload: CmsWritePayload, partial = false): { value?: ValidatedPayload; errors: string[] } {
  const errors: string[] = [];

  const type = toTrimmedString(payload.type);
  const title = toTrimmedString(payload.title);
  const slugInput = toTrimmedString(payload.slug);
  const slug = toSlug(slugInput || title);
  const excerpt = toTrimmedString(payload.excerpt);
  const body = toTrimmedString(payload.body);
  const imageUrl = toTrimmedString(payload.imageUrl);

  const published = typeof payload.published === "boolean" ? payload.published : false;
  const order = typeof payload.order === "number" ? payload.order : Number(payload.order ?? 0);

  if (!partial || payload.type !== undefined) {
    if (!type) {
      errors.push("Pole 'type' jest wymagane.");
    }
  }

  if (!partial || payload.title !== undefined) {
    if (!title) {
      errors.push("Pole 'title' jest wymagane.");
    }
  }

  if (!partial || payload.slug !== undefined || payload.title !== undefined) {
    if (!slug) {
      errors.push("Pole 'slug' lub poprawny 'title' jest wymagane.");
    }
  }

  if (payload.order !== undefined && Number.isNaN(order)) {
    errors.push("Pole 'order' musi być liczbą.");
  }

  if (payload.data !== undefined && (typeof payload.data !== "object" || payload.data === null || Array.isArray(payload.data))) {
    errors.push("Pole 'data' musi być obiektem JSON.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    errors,
    value: {
      type,
      slug,
      title,
      excerpt: excerpt || undefined,
      body: body || undefined,
      imageUrl: imageUrl || undefined,
      data: (payload.data as Record<string, unknown> | undefined) ?? undefined,
      published,
      order: Number.isNaN(order) ? 0 : order
    }
  };
}
