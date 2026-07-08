const REQUIRED = ["COSMOS_ENDPOINT", "COSMOS_KEY", "COSMOS_DATABASE", "COSMOS_CONTAINER"];

export function validateEnv(): string[] {
  return REQUIRED.filter((key) => !process.env[key]);
}

export function getCosmosConfig() {
  return {
    endpoint: process.env.COSMOS_ENDPOINT ?? "",
    key: process.env.COSMOS_KEY ?? "",
    database: process.env.COSMOS_DATABASE ?? "plm-cms",
    container: process.env.COSMOS_CONTAINER ?? "content"
  };
}
