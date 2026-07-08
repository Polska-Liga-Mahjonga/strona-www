import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { validateEnv } from "../lib/config.js";
import { errorResponse, jsonResponse } from "../lib/response.js";
import { getByTypeSlug } from "../lib/repository.js";

export async function contentPublicGetHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const missing = validateEnv();
  if (missing.length > 0) {
    return errorResponse(500, "Brak konfiguracji backendu", missing);
  }

  const type = request.params.type?.trim();
  const slug = request.params.slug?.trim();

  if (!type || !slug) {
    return errorResponse(400, "Parametry 'type' i 'slug' są wymagane.");
  }

  try {
    const item = await getByTypeSlug(type, slug);
    if (!item || !item.published) {
      return errorResponse(404, "Treść nie została znaleziona.");
    }

    return jsonResponse(200, { ok: true, item });
  } catch (error) {
    context.error("contentPublicGetHandler failed", error);
    return errorResponse(500, "Nie udało się pobrać treści.");
  }
}

app.http("contentPublicGet", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "content/{type}/{slug}",
  handler: contentPublicGetHandler
});
