import type { HttpRequest } from "@azure/functions";
import type { ClientPrincipal } from "./types.js";

function isTruthy(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function allowLocalAuthenticatedAdmin(): boolean {
  return isTruthy(process.env.CMS_LOCAL_AUTHENTICATED_IS_ADMIN);
}

function isLocalRequest(request: HttpRequest): boolean {
  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").toLowerCase();
  return host.includes("localhost") || host.includes("127.0.0.1");
}

export function getClientPrincipal(request: HttpRequest): ClientPrincipal | null {
  const encodedPrincipal = request.headers.get("x-ms-client-principal");
  if (!encodedPrincipal) {
    return null;
  }

  try {
    const decoded = Buffer.from(encodedPrincipal, "base64").toString("utf-8");
    return JSON.parse(decoded) as ClientPrincipal;
  } catch {
    return null;
  }
}

export function isAdmin(request: HttpRequest): boolean {
  const principal = getClientPrincipal(request);
  if (!principal?.userRoles?.length) {
    return false;
  }

  const normalizedRoles = principal.userRoles.map((role) => role.toLowerCase());
  if (normalizedRoles.includes("admin") || normalizedRoles.includes("administrator")) {
    return true;
  }

  if (allowLocalAuthenticatedAdmin() && isLocalRequest(request)) {
    return normalizedRoles.includes("authenticated");
  }

  return false;
}
