# Deployment Success - What to Check

## ✅ Functions App is Live!

**Correct Functions URL:**
```
https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net
```

**Test Endpoints:**
- List Items: `https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net/api/ListItemsHttp`
- Manual Fetch: `https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net/api/FetchNowHttp?token=<your-admin-token>`

---

## ✅ Static Site Deployment

**Check if files were uploaded:**

1. Go to: Azure Portal → Storage Account `layofflens` → Containers → `$web`
2. You should see:
   - `index.html`
   - `_next/` folder
   - Other HTML files

**Access your static site:**

**Option 1: CDN URL (Recommended)**
- Your CDN endpoint from Azure Portal
- Format: `https://<your-cdn-endpoint>.azureedge.net`

**Option 2: Storage Account Direct URL**
- Go to: Storage Account `layofflens` → Static website
- Copy the **Primary endpoint** URL
- Format: `https://layofflens.z<number>.web.core.windows.net`

**Option 3: Custom Domain**
- Your domain from Route 53
- Should point to your CDN endpoint

---

## 🔍 About the "InvalidUri" Error

If you're still seeing "InvalidUri" error, it's likely because:

1. **Wrong URL format** - Make sure you're using the CDN URL or storage account static website URL
2. **Missing index.html** - Check that files were uploaded to `$web` container
3. **Static website not enabled** - Verify in Storage Account → Static website

---

## 📝 Next Steps:

1. **Test Functions:**
   ```bash
   curl https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net/api/ListItemsHttp
   ```

2. **Check Static Site Files:**
   - Verify files in `$web` container
   - Get the correct URL from Azure Portal

3. **Access Static Site:**
   - Use CDN URL or storage account static website URL
   - Not the storage account blob URL directly

---

## Summary:

- ✅ Functions App: `layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net`
- ✅ Workflow updated with correct URL
- ⚠️ Static Site: Check `$web` container and use correct URL format

