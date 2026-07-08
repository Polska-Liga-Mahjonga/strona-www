import type { HttpResponseInit } from "@azure/functions";

export function jsonResponse(status: number, payload: unknown): HttpResponseInit {
  return {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8"
    },
    jsonBody: payload
  };
}

export function errorResponse(status: number, message: string, details?: unknown): HttpResponseInit {
  return jsonResponse(status, {
    ok: false,
    error: message,
    details: details ?? null
  });
}
