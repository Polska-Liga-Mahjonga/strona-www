const COSMOS_EMULATOR_DEFAULT_ENDPOINT = "https://localhost:8081";
const COSMOS_EMULATOR_DEFAULT_KEY = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";

function readEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
}

function isTruthy(value: string | undefined): boolean {
  const normalized = value?.toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function isFalsey(value: string | undefined): boolean {
  const normalized = value?.toLowerCase();
  return normalized === "0" || normalized === "false" || normalized === "no" || normalized === "off";
}

function shouldUseCosmosEmulatorFallback(endpoint?: string, key?: string): boolean {
  if (endpoint || key) {
    return false;
  }

  const explicitFlag = readEnv("COSMOS_EMULATOR_FALLBACK");
  if (isTruthy(explicitFlag)) {
    return true;
  }
  if (isFalsey(explicitFlag)) {
    return false;
  }

  const functionsEnvironment = readEnv("AZURE_FUNCTIONS_ENVIRONMENT")?.toLowerCase();
  const nodeEnvironment = readEnv("NODE_ENV")?.toLowerCase();
  if (functionsEnvironment === "development" || nodeEnvironment === "development") {
    return true;
  }

  return !readEnv("WEBSITE_SITE_NAME");
}

function resolveCosmosAuth(): { endpoint: string; key: string } {
  const configuredEndpoint = readEnv("COSMOS_ENDPOINT");
  const configuredKey = readEnv("COSMOS_KEY");

  if (shouldUseCosmosEmulatorFallback(configuredEndpoint, configuredKey)) {
    return {
      endpoint: readEnv("COSMOS_EMULATOR_ENDPOINT") ?? COSMOS_EMULATOR_DEFAULT_ENDPOINT,
      key: readEnv("COSMOS_EMULATOR_KEY") ?? COSMOS_EMULATOR_DEFAULT_KEY
    };
  }

  return {
    endpoint: configuredEndpoint ?? "",
    key: configuredKey ?? ""
  };
}

export function validateEnv(): string[] {
  const config = getCosmosConfig();
  const missing: string[] = [];

  if (!config.endpoint) {
    missing.push("COSMOS_ENDPOINT");
  }
  if (!config.key) {
    missing.push("COSMOS_KEY");
  }
  if (!config.database) {
    missing.push("COSMOS_DATABASE");
  }
  if (!config.container) {
    missing.push("COSMOS_CONTAINER");
  }

  return missing;
}

export function getCosmosConfig() {
  const auth = resolveCosmosAuth();

  return {
    endpoint: auth.endpoint,
    key: auth.key,
    database: readEnv("COSMOS_DATABASE") ?? "plm-cms",
    container: readEnv("COSMOS_CONTAINER") ?? "content"
  };
}
