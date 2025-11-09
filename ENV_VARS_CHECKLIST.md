# Environment Variables Checklist

## Verify These Are Set in Azure Portal:

Go to: Functions App `layofflens-func` → Configuration → Environment variables

### Required Variables:

- [ ] **FUNCTIONS_WORKER_RUNTIME** = `node`
- [ ] **WEBSITE_NODE_DEFAULT_VERSION** = `~20`
- [ ] **AZURE_STORAGE_CONNECTION_STRING** = (your Table Storage connection string)
- [ ] **AzureWebJobsStorage** = (your Table Storage connection string)
- [ ] **SERPER_API_KEY** = (your Serper key) ✅ You said this is set
- [ ] **ADMIN_TOKEN** = (secure random token)

### Quick Check:

If all 6 are there, you're good! If any are missing, add them.

---

## What Each One Does:

1. **FUNCTIONS_WORKER_RUNTIME** - Tells Azure to use Node.js runtime
2. **WEBSITE_NODE_DEFAULT_VERSION** - Sets Node.js version to 20
3. **AZURE_STORAGE_CONNECTION_STRING** - Your Functions use this to connect to Table Storage
4. **AzureWebJobsStorage** - Azure Functions runtime needs this for its own storage
5. **SERPER_API_KEY** - Your Functions use this to call Serper API
6. **ADMIN_TOKEN** - Security token for manual fetch endpoint

---

## If You're Missing Any:

1. Go to Azure Portal
2. Functions App → Configuration → Environment variables
3. Click **+ New environment variable**
4. Add the missing ones
5. Click **Save**

