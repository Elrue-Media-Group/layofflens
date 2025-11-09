# Correct URLs for Your Deployment

## ✅ Functions App URL:

**Correct URL:**
```
https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net
```

**Endpoints:**
- List Items: `https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net/api/ListItemsHttp`
- Manual Fetch: `https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net/api/FetchNowHttp?token=<your-admin-token>`

**Note:** Flex Consumption plan uses a different domain format than standard Functions Apps.

---

## ✅ Static Site URLs:

**CDN URL (Recommended):**
- Your CDN endpoint URL (from Azure Portal)
- Format: `https://<your-cdn-endpoint>.azureedge.net`

**Storage Account Direct URL:**
- Format: `https://layofflens.z<number>.web.core.windows.net`
- Get from: Storage Account → Static website → Primary endpoint

**Custom Domain:**
- Your domain from Route 53

---

## ⚠️ Updated:

I've updated the static site workflow to use the correct Functions URL. The next deployment will use:
- `https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net/api`

---

## Test Your Functions:

```bash
# Test List Items
curl https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net/api/ListItemsHttp

# Test Manual Fetch (use your ADMIN_TOKEN)
curl -X POST "https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net/api/FetchNowHttp?token=<your-admin-token>"
```

