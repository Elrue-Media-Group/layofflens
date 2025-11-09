# Final Environment Variables - Managed Identity Setup

## ✅ Code Updated

The `storage.ts` file now uses `DefaultAzureCredential` with managed identity - no connection strings needed!

## ✅ Required Environment Variables (Only 3!)

In Azure Portal → Functions App → Configuration → Environment variables:

1. **AZURE_STORAGE_ACCOUNT_NAME**
   - Value: `layofflens` (or your storage account name)
   - Just the name, not a connection string

2. **SERPER_API_KEY**
   - Value: Your Serper API key
   - ✅ You already have this

3. **ADMIN_TOKEN**
   - Value: Secure random token for manual fetch endpoint
   - Used for: `/api/FetchNowHttp?token=<your-token>`

## ✅ Managed Identity Role Assignment

Your Functions App needs the **Storage Table Data Contributor** role:

1. Storage Account → Access control (IAM)
2. Add role assignment
3. Role: **Storage Table Data Contributor**
4. Assign to: **Managed identity** → Your Functions App (`layofflens-func`)

## ✅ That's It!

- No connection strings needed
- No runtime configuration needed (Flex Consumption handles it)
- Secure authentication via managed identity
- Only 3 environment variables total

---

## Summary:

| Variable | Purpose | Status |
|----------|---------|--------|
| `AZURE_STORAGE_ACCOUNT_NAME` | Storage account name for SDK | ⬅️ Add this |
| `SERPER_API_KEY` | Serper API authentication | ✅ You have this |
| `ADMIN_TOKEN` | Manual fetch endpoint security | ⬅️ Add this |

---

## Next Steps:

1. Add `AZURE_STORAGE_ACCOUNT_NAME` to Environment Variables
2. Add `ADMIN_TOKEN` to Environment Variables
3. Assign Storage Table Data Contributor role
4. Deploy Functions (GitHub Actions will handle it)
5. Provide static site Storage Account info (for static site deployment workflow)

