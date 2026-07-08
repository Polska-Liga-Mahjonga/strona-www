import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { isAdmin } from "../lib/auth.js";
import { validateEnv } from "../lib/config.js";
import { errorResponse, jsonResponse } from "../lib/response.js";
import { readJson } from "../lib/request.js";
import { getById, getByTypeSlug, updateItem } from "../lib/repository.js";
import type { CmsWritePayload } from "../lib/types.js";
import { validatePayload } from "../lib/validation.js";

export async function adminUpdateHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const missing = validateEnv();
  if (missing.length > 0) {
    return errorResponse(500, "Brak konfiguracji backendu", missing);
  }

  if (!isAdmin(request)) {
    return errorResponse(403, "Brak uprawnień administracyjnych.");
  }

  const id = request.params.id?.trim();
  if (!id) {
    return errorResponse(400, "Parametr 'id' jest wymagany.");
  }

  const existing = await getById(id);
  if (!existing) {
    return errorResponse(404, "Element nie istnieje.");
  }

  const payload = await readJson<CmsWritePayload>(request);
  if (!payload) {
    return errorResponse(400, "Niepoprawny JSON wejściowy.");
  }

  const validation = validatePayload(payload, true);
  if (validation.errors.length > 0) {
    return errorResponse(400, "Błąd walidacji.", validation.errors);
  }

  const nextType = validation.value?.type ?? existing.type;
  const nextSlug = validation.value?.slug ?? existing.slug;

  try {
    const duplicate = await getByTypeSlug(nextType, nextSlug);
    if (duplicate && duplicate.id !== id) {
      return errorResponse(409, "Element z takim type/slug już istnieje.");
    }

    const item = await updateItem(id, validation.value ?? {});
    return jsonResponse(200, { ok: true, item });
  } catch (error) {
    context.error("adminUpdateHandler failed", error);
    return errorResponse(500, "Nie udało się zaktualizować treści.");
  }
}

app.http("adminUpdate", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "admin/content/{id}",
  handler: adminUpdateHandler
});
