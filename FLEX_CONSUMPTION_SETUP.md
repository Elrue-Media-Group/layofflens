# Flex Consumption Mode - What You Actually Need

## ✅ What Azure Handles Automatically:

With **Flex Consumption mode** and **managed identity**:
- ✅ Runtime configuration (Node.js version)
- ✅ Storage connections (via managed identity)
- ✅ AzureWebJobsStorage (automatic)
- ✅ FUNCTIONS_WORKER_RUNTIME (automatic)

## ✅ What You DO Need to Set:

Only the **application-specific** environment variables:

1. **SERPER_API_KEY** ✅ (You already have this)
2. **ADMIN_TOKEN** (For manual fetch endpoint security)

That's it! Much simpler.

---

## For Static Site Deployment:

I still need your Storage Account info for the static website:
- Storage Account name
- Container name (usually `$web`)
- Resource group

This is separate from Functions - it's for hosting your Next.js static files.

---

## Summary:

- **Functions:** Only need SERPER_API_KEY and ADMIN_TOKEN ✅
- **Static Site:** Need Storage Account details (still pending)

