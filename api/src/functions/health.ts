import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { validateEnv } from "../lib/config.js";
import { jsonResponse } from "../lib/response.js";

export async function healthHandler(_request: HttpRequest): Promise<HttpResponseInit> {
  const missing = validateEnv();

  return jsonResponse(200, {
    ok: true,
    service: "plm-cms-api",
    configured: missing.length === 0,
    missing
  });
}

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "health",
  handler: healthHandler
});
