import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { validateEnv } from "../lib/config.js";
import { errorResponse, jsonResponse } from "../lib/response.js";
import { getNumberParam, getQueryParam } from "../lib/request.js";
import { listPublicByType } from "../lib/repository.js";

export async function contentPublicListHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const missing = validateEnv();
  if (missing.length > 0) {
    return errorResponse(500, "Brak konfiguracji backendu", missing);
  }

  const type = getQueryParam(request, "type");
  if (!type) {
    return errorResponse(400, "Parametr 'type' jest wymagany.");
  }

  const limit = Math.max(1, Math.min(getNumberParam(request, "limit", 100), 250));

  try {
    const items = await listPublicByType(type, limit);
    return jsonResponse(200, { ok: true, items });
  } catch (error) {
    context.error("contentPublicListHandler failed", error);
    return errorResponse(500, "Nie udało się pobrać treści.");
  }
}

app.http("contentPublicList", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "content",
  handler: contentPublicListHandler
});
