import type { HttpRequest } from "@azure/functions";

export function getQueryParam(request: HttpRequest, key: string): string | undefined {
  const value = request.query.get(key);
  if (!value) {
    return undefined;
  }
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function getNumberParam(request: HttpRequest, key: string, defaultValue: number): number {
  const raw = getQueryParam(request, key);
  if (!raw) {
    return defaultValue;
  }

  const value = Number(raw);
  if (Number.isNaN(value)) {
    return defaultValue;
  }
  return value;
}

export async function readJson<T>(request: HttpRequest): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}
