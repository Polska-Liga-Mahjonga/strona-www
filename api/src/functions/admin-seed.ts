import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { isAdmin } from "../lib/auth.js";
import { validateEnv } from "../lib/config.js";
import { seedItems } from "../data/seed.js";
import { countAll, createItem, getByTypeSlug } from "../lib/repository.js";
import { errorResponse, jsonResponse } from "../lib/response.js";

export async function adminSeedHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const missing = validateEnv();
  if (missing.length > 0) {
    return errorResponse(500, "Brak konfiguracji backendu", missing);
  }

  if (!isAdmin(request)) {
    return errorResponse(403, "Brak uprawnień administracyjnych.");
  }

  try {
    const existingCount = await countAll();
    let inserted = 0;
    let skipped = 0;

    for (const item of seedItems) {
      const duplicate = await getByTypeSlug(item.type, item.slug);
      if (duplicate) {
        skipped += 1;
        continue;
      }

      await createItem(item);
      inserted += 1;
    }

    return jsonResponse(200, {
      ok: true,
      existingBeforeSeed: existingCount,
      inserted,
      skipped
    });
  } catch (error) {
    context.error("adminSeedHandler failed", error);
    return errorResponse(500, "Nie udało się wykonać seedowania danych.");
  }
}

app.http("adminSeed", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "cms-admin/seed",
  handler: adminSeedHandler
});
