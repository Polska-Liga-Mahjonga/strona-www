import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { isAdmin } from "../lib/auth.js";
import { validateEnv } from "../lib/config.js";
import { errorResponse, jsonResponse } from "../lib/response.js";
import { readJson } from "../lib/request.js";
import { createItem, getByTypeSlug } from "../lib/repository.js";
import type { CmsWritePayload } from "../lib/types.js";
import { validatePayload } from "../lib/validation.js";

export async function adminCreateHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const missing = validateEnv();
  if (missing.length > 0) {
    return errorResponse(500, "Brak konfiguracji backendu", missing);
  }

  if (!isAdmin(request)) {
    return errorResponse(403, "Brak uprawnień administracyjnych.");
  }

  const payload = await readJson<CmsWritePayload>(request);
  if (!payload) {
    return errorResponse(400, "Niepoprawny JSON wejściowy.");
  }

  const validation = validatePayload(payload);
  if (!validation.value) {
    return errorResponse(400, "Błąd walidacji.", validation.errors);
  }

  try {
    const duplicate = await getByTypeSlug(validation.value.type, validation.value.slug);
    if (duplicate) {
      return errorResponse(409, "Element z takim type/slug już istnieje.");
    }

    const item = await createItem(validation.value);
    return jsonResponse(201, { ok: true, item });
  } catch (error) {
    context.error("adminCreateHandler failed", error);
    return errorResponse(500, "Nie udało się utworzyć treści.");
  }
}

app.http("adminCreate", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "cms-admin/content",
  handler: adminCreateHandler
});
