# Simplified Setup for Flex Consumption Mode

## ✅ What Azure Handles Automatically:

With **Flex Consumption mode** + **managed identity**:
- ✅ Runtime configuration (Node.js, version)
- ✅ Storage connections (via managed identity)
- ✅ AzureWebJobsStorage
- ✅ FUNCTIONS_WORKER_RUNTIME
- ✅ Native bindings

## ✅ What You Actually Need:

Only **application-specific** environment variables:

1. **SERPER_API_KEY** ✅ (You already have this)
2. **ADMIN_TOKEN** (For `/api/FetchNowHttp?token=...` security)

That's it! Much simpler.

---

## ⚠️ Important Note About Storage:

Your code currently uses `process.env.AZURE_STORAGE_CONNECTION_STRING` in `storage.ts`.

**If you're using managed identity:**
- You might need to update `storage.ts` to use managed identity instead of connection strings
- OR keep `AZURE_STORAGE_CONNECTION_STRING` as an environment variable (even with Flex Consumption)

**Check:** Does your `storage.ts` work with managed identity, or does it still need the connection string?

---

## For Static Site Deployment:

I still need your **Storage Account info** for the static website:
- Storage Account name
- Container name (usually `$web`)
- Resource group

This is **separate** from Functions - it's for hosting your Next.js HTML/CSS/JS files.

---

## Summary:

| Component | Status | What You Need |
|-----------|--------|---------------|
| **Functions Runtime** | ✅ Auto | Nothing |
| **Functions Storage** | ✅ Auto (managed identity) | Nothing (or connection string if code needs it) |
| **SERPER_API_KEY** | ✅ Set | Done |
| **ADMIN_TOKEN** | ⚠️ | Add this one |
| **Static Site** | ⚠️ | Need Storage Account details |

---

## Next Steps:

1. **Add ADMIN_TOKEN** to Environment Variables (if not already there)
2. **Provide Static Site Storage Account info** so I can create the deployment workflow
3. **Verify** if `AZURE_STORAGE_CONNECTION_STRING` is needed (check if your code uses managed identity or connection string)

