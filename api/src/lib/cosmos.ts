import { CosmosClient, Container } from "@azure/cosmos";
import { getCosmosConfig } from "./config.js";

let cachedContainer: Container | null = null;

export function getContentContainer(): Container {
  if (cachedContainer) {
    return cachedContainer;
  }

  const config = getCosmosConfig();
  const client = new CosmosClient({
    endpoint: config.endpoint,
    key: config.key
  });

  cachedContainer = client.database(config.database).container(config.container);
  return cachedContainer;
}
