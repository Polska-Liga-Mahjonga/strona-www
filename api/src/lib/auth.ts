import type { HttpRequest } from "@azure/functions";
import type { ClientPrincipal } from "./types.js";

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
  return normalizedRoles.includes("admin") || normalizedRoles.includes("administrator");
}
