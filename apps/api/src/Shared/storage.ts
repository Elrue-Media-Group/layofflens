import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";

const TABLE_NAME = "layoffitems";

export interface FeedItem {
  partitionKey: string;
  rowKey: string;
  title: string;
  link: string;
  source: string;
  snippet: string;
  date: string;
  type: "news" | "video";
  tags: string; // Stored as JSON string for Azure Table Storage
  score: number;
  imageUrl?: string; // Optional image URL from Serper
}

let tableClient: TableClient | null = null;

export function getTableClient(): TableClient {
  if (tableClient) {
    return tableClient;
  }

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const accountNameFromEnv = process.env.AZURE_STORAGE_ACCOUNT_NAME;

  // Priority: Use connection string if provided, otherwise use managed identity
  if (connectionString && connectionString.includes("UseDevelopmentStorage")) {
    // Local development with Azurite
    const accountName = "devstoreaccount1";
    const accountKey = "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";
    const credential = new AzureNamedKeyCredential(accountName, accountKey);
    const serviceUrl = "http://127.0.0.1:10002/devstoreaccount1";
    tableClient = new TableClient(serviceUrl, TABLE_NAME, credential, {
      allowInsecureConnection: true,
    });
  } else if (connectionString && !connectionString.includes("UseDevelopmentStorage")) {
    // Production with connection string (if provided)
    const accountNameMatch = connectionString.match(/AccountName=([^;]+)/);
    const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/);
    
    if (!accountNameMatch || !accountKeyMatch) {
      throw new Error("Invalid Azure Storage connection string format");
    }

    const accountName = accountNameMatch[1];
    const accountKey = accountKeyMatch[1];
    const credential = new AzureNamedKeyCredential(accountName, accountKey);
    const serviceUrl = `https://${accountName}.table.core.windows.net`;
    tableClient = new TableClient(serviceUrl, TABLE_NAME, credential, {
      allowInsecureConnection: false,
    });
  } else {
    // Production: Use managed identity with DefaultAzureCredential
    // Storage account name is required
    if (!accountNameFromEnv) {
      throw new Error("AZURE_STORAGE_ACCOUNT_NAME environment variable is required when using managed identity. Current value: " + (accountNameFromEnv || "undefined"));
    }

    try {
      const credential = new DefaultAzureCredential();
      const serviceUrl = `https://${accountNameFromEnv}.table.core.windows.net`;
      tableClient = new TableClient(serviceUrl, TABLE_NAME, credential);
    } catch (credError: any) {
      throw new Error(`Failed to create DefaultAzureCredential: ${credError?.message || String(credError)}`);
    }
  }

  return tableClient;
}

export async function ensureTableExists(): Promise<void> {
  const client = getTableClient();
  try {
    await client.createTable();
  } catch (error: any) {
    if (error.statusCode !== 409) {
      throw error;
    }
  }
}

export async function saveItem(item: FeedItem): Promise<void> {
  await ensureTableExists();
  const client = getTableClient();
  await client.upsertEntity(item, "Merge");
}

export async function getItemsForDays(days?: number): Promise<FeedItem[]> {
  await ensureTableExists();
  const client = getTableClient();

  const items: FeedItem[] = [];
  const entities = client.listEntities<FeedItem>();

  // If days is specified, filter by date; otherwise get all items
  let cutoffDate: Date | null = null;
  if (days && days > 0) {
    cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
  }

  for await (const entity of entities) {
    // If we have a cutoff date, filter by it; otherwise include all items
    if (!cutoffDate || new Date(entity.date) >= cutoffDate) {
      // Parse tags from JSON string if needed
      const item = {
        ...entity,
        tags: typeof entity.tags === 'string' ? entity.tags : JSON.stringify(entity.tags || [])
      };
      items.push(item);
    }
  }

  // Sort by date (newest first), then by score (highest first)
  return items.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateB !== dateA) {
      return dateB - dateA; // Newest first
    }
    return b.score - a.score; // Then by score
  });
}

