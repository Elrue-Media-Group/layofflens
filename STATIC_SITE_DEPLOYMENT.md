# Static Site Deployment Setup

## ✅ Workflow Created

I've created `.github/workflows/deploy-static-site.yml` that will:
1. Build your Next.js app with static export
2. Upload to Azure Storage `$web` container
3. Your CDN will serve the new files automatically

## ⚠️ Next.js Configuration Updated

I've updated `next.config.mjs` to enable static export:
- `output: 'export'` - Generates static HTML files
- `images: { unoptimized: true }` - Required for static export
- `trailingSlash: true` - Better routing for static hosting

## 📋 What You Need to Provide

### GitHub Secrets Required:

1. **AZURE_CREDENTIALS** (Service Principal credentials)
   - This allows GitHub Actions to authenticate with Azure
   - Format: JSON with `clientId`, `clientSecret`, `subscriptionId`, `tenantId`

2. **AZURE_STORAGE_ACCOUNT_NAME**
   - Your storage account name (e.g., `layofflens` or `layofflensweb`)

3. **AZURE_RESOURCE_GROUP** (Optional, for CDN purge)
   - Resource group where your storage account lives

### How to Get AZURE_CREDENTIALS:

**Option 1: Create Service Principal (Recommended)**

```bash
# Login to Azure
az login

# Create service principal with contributor role
az ad sp create-for-rbac --name "layofflens-github-actions" \
  --role contributor \
  --scopes /subscriptions/<your-subscription-id>/resourceGroups/<your-resource-group> \
  --sdk-auth
```

Copy the JSON output and add it as `AZURE_CREDENTIALS` secret in GitHub.

**Option 2: Use Managed Identity (if available)**
- Some setups allow using managed identity directly

### Storage Account Info Needed:

- **Storage Account Name:** (e.g., `layofflens`)
- **Container Name:** (usually `$web` for static websites)
- **Resource Group:** (where your storage account is)

---

## 🔧 Setup Steps:

### 1. Add GitHub Secrets:

Go to: GitHub repo → Settings → Secrets and variables → Actions

Add:
- `AZURE_CREDENTIALS` = (JSON from service principal creation)
- `AZURE_STORAGE_ACCOUNT_NAME` = (your storage account name)
- `AZURE_RESOURCE_GROUP` = (your resource group, optional)

### 2. Verify Next.js Config:

The `next.config.mjs` has been updated for static export. Your app should build successfully.

### 3. Test Build Locally (Optional):

```bash
cd apps/web
NEXT_PUBLIC_API_BASE=https://layofflens-func.azurewebsites.net/api pnpm build
```

This will create `apps/web/.next/out` with static files.

### 4. Push to GitHub:

Once secrets are added, push to `main` or `dev` branch and the workflow will:
- Build your Next.js app
- Upload to Azure Storage
- Your CDN will serve the new files

---

## ⚠️ Important Notes:

### Static Export Limitations:

Since we're using static export, your app will:
- ✅ Work perfectly for static content
- ✅ Pre-render pages at build time
- ⚠️ API calls happen at build time (not runtime)
- ⚠️ No server-side rendering at request time

**For your use case:** This means data is fetched when you build, not when users visit. You'll need to:
- Rebuild/redeploy when you want fresh data
- OR consider using ISR (Incremental Static Regeneration) - but that requires a server

### Alternative: Keep Server-Side Rendering

If you need real-time data fetching, you'd need:
- Azure Static Web Apps (includes serverless functions)
- OR a separate Next.js server
- OR convert to client-side data fetching (useEffect)

For now, static export will work - data will be from the last build time.

---

## 📝 Summary:

✅ Workflow created  
✅ Next.js config updated for static export  
⚠️ Need to add GitHub Secrets  
⚠️ Need Storage Account details  
⚠️ Data will be from build time (not real-time)  

---

## Next Steps:

1. **Provide Storage Account details:**
   - Storage Account name
   - Resource Group name

2. **Create Service Principal and add to GitHub Secrets**

3. **Test the build locally** (optional)

4. **Push to GitHub** → Automatic deployment!

