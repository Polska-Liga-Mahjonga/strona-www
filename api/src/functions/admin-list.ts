import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { isAdmin } from "../lib/auth.js";
import { validateEnv } from "../lib/config.js";
import { errorResponse, jsonResponse } from "../lib/response.js";
import { getQueryParam } from "../lib/request.js";
import { listAdmin } from "../lib/repository.js";

export async function adminListHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const missing = validateEnv();
  if (missing.length > 0) {
    return errorResponse(500, "Brak konfiguracji backendu", missing);
  }

  if (!isAdmin(request)) {
    return errorResponse(403, "Brak uprawnień administracyjnych.");
  }

  const type = getQueryParam(request, "type");

  try {
    const items = await listAdmin(type);
    return jsonResponse(200, { ok: true, items });
  } catch (error) {
    context.error("adminListHandler failed", error);
    return errorResponse(500, "Nie udało się pobrać treści administracyjnych.");
  }
}

app.http("adminList", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "cms-admin/content",
  handler: adminListHandler
});
