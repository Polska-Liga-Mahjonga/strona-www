import { getContentContainer } from "./cosmos.js";
import type { CmsContentItem } from "./types.js";
import type { ValidatedPayload } from "./validation.js";

export async function listPublicByType(type: string, limit = 100): Promise<CmsContentItem[]> {
  const container = getContentContainer();
  const querySpec = {
    query: "SELECT * FROM c WHERE c.type = @type AND c.published = true ORDER BY c[\"order\"] ASC OFFSET 0 LIMIT @limit",
    parameters: [
      { name: "@type", value: type },
      { name: "@limit", value: limit }
    ]
  };

  const { resources } = await container.items.query<CmsContentItem>(querySpec).fetchAll();
  return resources;
}

export async function listAdmin(type?: string): Promise<CmsContentItem[]> {
  const container = getContentContainer();
  const querySpec = type
    ? {
        query: "SELECT * FROM c WHERE c.type = @type ORDER BY c[\"order\"] ASC",
        parameters: [{ name: "@type", value: type }]
      }
    : {
        query: "SELECT * FROM c ORDER BY c[\"order\"] ASC",
        parameters: []
      };

  const { resources } = await container.items.query<CmsContentItem>(querySpec).fetchAll();
  return resources;
}

export async function getById(id: string): Promise<CmsContentItem | null> {
  const container = getContentContainer();
  const querySpec = {
    query: "SELECT TOP 1 * FROM c WHERE c.id = @id",
    parameters: [{ name: "@id", value: id }]
  };

  const { resources } = await container.items.query<CmsContentItem>(querySpec).fetchAll();
  return resources[0] ?? null;
}

export async function getByTypeSlug(type: string, slug: string): Promise<CmsContentItem | null> {
  const container = getContentContainer();
  const querySpec = {
    query: "SELECT TOP 1 * FROM c WHERE c.type = @type AND c.slug = @slug",
    parameters: [
      { name: "@type", value: type },
      { name: "@slug", value: slug }
    ]
  };

  const { resources } = await container.items.query<CmsContentItem>(querySpec).fetchAll();
  return resources[0] ?? null;
}

export async function createItem(payload: ValidatedPayload): Promise<CmsContentItem> {
  const container = getContentContainer();
  const now = new Date().toISOString();

  const item: CmsContentItem = {
    id: crypto.randomUUID(),
    ...payload,
    createdAt: now,
    updatedAt: now
  };

  const { resource } = await container.items.create<CmsContentItem>(item);
  return resource as CmsContentItem;
}

export async function updateItem(id: string, payload: Partial<ValidatedPayload>): Promise<CmsContentItem | null> {
  const existing = await getById(id);
  if (!existing) {
    return null;
  }

  const updated: CmsContentItem = {
    ...existing,
    ...payload,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString()
  };

  const container = getContentContainer();
  if (existing.type === updated.type) {
    const { resource } = await container.item(existing.id, existing.type).replace<CmsContentItem>(updated);
    return resource as CmsContentItem;
  }

  await container.item(existing.id, existing.type).delete();
  const { resource } = await container.items.create<CmsContentItem>(updated);
  return resource as CmsContentItem;
}

export async function deleteItem(id: string): Promise<boolean> {
  const container = getContentContainer();
  const existing = await getById(id);
  if (!existing) {
    return false;
  }

  await container.item(id, existing.type).delete();
  return true;
}

export async function countAll(): Promise<number> {
  const container = getContentContainer();
  const { resources } = await container.items.query<number>({
    query: "SELECT VALUE COUNT(1) FROM c"
  }).fetchAll();
  return resources[0] ?? 0;
}
