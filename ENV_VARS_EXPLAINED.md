# Where Environment Variables Go

## Your Serper API Key Location: Azure Portal

### ✅ Correct Location: Azure Functions App → Application Settings

**Where to add it:**
1. Go to: https://portal.azure.com
2. Navigate to: Functions App → `layofflens-func`
3. Click: **Configuration** → **Application settings**
4. Click: **+ New application setting**
5. Add:
   - **Name:** `SERPER_API_KEY`
   - **Value:** (paste your actual Serper API key)
6. Click: **OK** → **Save** (top of page)

---

## Why Azure Portal, Not GitHub Secrets?

### How Your Functions Read Environment Variables:

Your Functions code reads from `process.env`:
```typescript
const SERPER_API_KEY = process.env.SERPER_API_KEY || "";
```

When running in Azure:
- `process.env.SERPER_API_KEY` reads from **Azure Portal Application Settings**
- NOT from GitHub Secrets
- NOT from your local `.env` file

### The Flow:

```
Your Code → process.env.SERPER_API_KEY
                ↓
         Azure Functions Runtime
                ↓
    Azure Portal Application Settings
                ↓
         Your Serper API Key
```

---

## All Environment Variables Go in Azure Portal:

### Required Application Settings:

1. **FUNCTIONS_WORKER_RUNTIME**
   - Value: `node`

2. **WEBSITE_NODE_DEFAULT_VERSION**
   - Value: `~20`

3. **AZURE_STORAGE_CONNECTION_STRING**
   - Value: (Your Azure Storage connection string - get from Storage Account → Access keys)

4. **AzureWebJobsStorage**
   - Value: (Your Azure Storage connection string - same as above)

5. **SERPER_API_KEY** ⬅️ **YOUR SERPER KEY GOES HERE**
   - Value: (Your actual Serper API key)

6. **ADMIN_TOKEN**
   - Value: (A secure random token for manual fetch endpoint)

---

## Where Each Thing Goes:

| Item | Location | Why |
|------|----------|-----|
| **Publish Profile** | GitHub Secrets | Lets GitHub deploy to Azure |
| **Serper API Key** | Azure Portal | Functions read from here at runtime |
| **Storage Connection** | Azure Portal | Functions read from here at runtime |
| **Admin Token** | Azure Portal | Functions read from here at runtime |
| **Local Dev Keys** | `.env` file | Only for local development |

---

## Quick Checklist:

- [x] Publish Profile → GitHub Secrets ✅ (You did this!)
- [ ] Serper API Key → Azure Portal Application Settings ⬅️ **DO THIS**
- [ ] Storage Connection → Azure Portal Application Settings
- [ ] Admin Token → Azure Portal Application Settings
- [ ] Other settings → Azure Portal Application Settings

---

## Step-by-Step: Adding Serper Key to Azure Portal

1. **Open Azure Portal:** https://portal.azure.com
2. **Find your Functions App:** Search for `layofflens-func`
3. **Go to Configuration:**
   - Left sidebar → **Configuration**
   - Tab: **Application settings**
4. **Add New Setting:**
   - Click **+ New application setting**
   - **Name:** `SERPER_API_KEY`
   - **Value:** (paste your Serper API key from your local `.env` file)
   - Click **OK**
5. **Save:**
   - Click **Save** at the top
   - Wait for "Successfully updated" message
   - Functions App will restart automatically

---

## After Adding All Settings:

Once you've added all 6 Application Settings:
1. Your Functions will be able to read them
2. GitHub Actions will deploy code (but not these settings)
3. Settings persist across deployments
4. You only need to set them once

---

## Security Note:

- ✅ Application Settings in Azure Portal are encrypted at rest
- ✅ They're only accessible to your Functions App
- ✅ They're NOT in your code or GitHub
- ✅ Safe to store secrets here

---

## Testing:

After adding the Serper key, test it:

```bash
# This will use the SERPER_API_KEY from Azure Portal
curl -X POST "https://layofflens-func.azurewebsites.net/api/FetchNowHttp?token=<your-admin-token>"
```

If it works, your Serper key is correctly configured!

