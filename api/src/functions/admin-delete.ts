import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { isAdmin } from "../lib/auth.js";
import { validateEnv } from "../lib/config.js";
import { deleteItem } from "../lib/repository.js";
import { errorResponse, jsonResponse } from "../lib/response.js";

export async function adminDeleteHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

  try {
    const deleted = await deleteItem(id);
    if (!deleted) {
      return errorResponse(404, "Element nie istnieje.");
    }

    return jsonResponse(200, { ok: true, deletedId: id });
  } catch (error) {
    context.error("adminDeleteHandler failed", error);
    return errorResponse(500, "Nie udało się usunąć treści.");
  }
}

app.http("adminDelete", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "admin/content/{id}",
  handler: adminDeleteHandler
});
