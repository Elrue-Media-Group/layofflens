# Managed Identity Setup - Complete

## ✅ Code Updated

I've updated `storage.ts` to use `DefaultAzureCredential` for managed identity authentication.

### Changes Made:

1. **Added `@azure/identity` package** to `package.json`
2. **Updated `storage.ts`** to use `DefaultAzureCredential` when no connection string is provided
3. **Kept local development support** - still uses Azurite with connection string for local dev

### How It Works:

1. **Local Development:** Uses connection string with Azurite (unchanged)
2. **Production with Connection String:** Falls back to connection string if provided
3. **Production with Managed Identity:** Uses `DefaultAzureCredential` (automatic with Flex Consumption)

---

## ⚠️ One Environment Variable Needed:

For managed identity to work, you need:

**`AZURE_STORAGE_ACCOUNT_NAME`** = Your storage account name (e.g., `layofflens`)

This is just the account name, not a connection string. Azure uses managed identity to authenticate automatically.

---

## Environment Variables Summary:

### Required in Azure Portal:

1. **SERPER_API_KEY** ✅ (You have this)
2. **ADMIN_TOKEN** (For manual fetch endpoint)
3. **AZURE_STORAGE_ACCOUNT_NAME** ⬅️ **Add this** (just the name, e.g., `layofflens`)

### NOT Needed:

- ❌ `AZURE_STORAGE_CONNECTION_STRING` (managed identity handles this)
- ❌ `FUNCTIONS_WORKER_RUNTIME` (auto with Flex Consumption)
- ❌ `AzureWebJobsStorage` (auto with Flex Consumption)
- ❌ `WEBSITE_NODE_DEFAULT_VERSION` (auto with Flex Consumption)

---

## Next Steps:

1. **Install the new package:**
   ```bash
   cd apps/api
   pnpm install
   ```

2. **Add `AZURE_STORAGE_ACCOUNT_NAME` to Azure Portal:**
   - Functions App → Configuration → Environment variables
   - Name: `AZURE_STORAGE_ACCOUNT_NAME`
   - Value: `layofflens` (or whatever your storage account name is)

3. **Ensure managed identity is enabled:**
   - Functions App → Identity
   - System assigned: **On**
   - Add role assignment: **Storage Table Data Contributor** to your storage account

4. **Test locally** (still uses connection string for Azurite)

5. **Deploy** - managed identity will work automatically in Azure

---

## Managed Identity Role Assignment:

Your Functions App needs permission to access Table Storage:

1. Go to: Storage Account → Access control (IAM)
2. Click: **Add role assignment**
3. Role: **Storage Table Data Contributor**
4. Assign access to: **Managed identity**
5. Select: Your Functions App (`layofflens-func`)
6. Click: **Save**

---

## Summary:

✅ Code updated to use `DefaultAzureCredential`  
✅ Local development still works with Azurite  
✅ Production uses managed identity automatically  
⚠️ Need to add `AZURE_STORAGE_ACCOUNT_NAME` environment variable  
⚠️ Need to assign Storage Table Data Contributor role  

