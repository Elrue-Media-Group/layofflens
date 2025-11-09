# Verify Deployment - What to Check

## ✅ Both Workflows Deployed Successfully!

Now let's verify everything is working:

---

## 1. Functions Deployment

### Test Functions Endpoints:

**List Items:**
```bash
curl https://layofflens-func.azurewebsites.net/api/ListItemsHttp
```

**Manual Fetch (use your ADMIN_TOKEN):**
```bash
curl -X POST "https://layofflens-func.azurewebsites.net/api/FetchNowHttp?token=<your-admin-token>"
```

**Expected:** JSON response with items or success message

---

## 2. Static Site Deployment

### The Error You're Seeing:

The "InvalidUri" error suggests you might be:
1. Accessing the storage account directly (not through CDN)
2. Using HTTP instead of HTTPS
3. Missing the CDN endpoint configuration

### How to Access Your Static Site:

**Option 1: Through Azure CDN (Recommended)**
- Your CDN endpoint URL (from Azure Portal)
- Format: `https://<your-cdn-endpoint>.azureedge.net`
- This is the URL you configured in Route 53

**Option 2: Storage Account Static Website URL (Direct)**
- Format: `https://<storage-account-name>.z<number>.web.core.windows.net`
- Example: `https://layofflens.z13.web.core.windows.net`
- This is the direct storage URL (not recommended for production)

**Option 3: Custom Domain (If Configured)**
- Your domain name from Route 53
- Should point to your CDN endpoint

---

## 3. What to Check in Azure Portal

### Storage Account Static Website:

1. Go to: Storage Account `layofflens` → Data management → Static website
2. Verify:
   - ✅ Static website: **Enabled**
   - ✅ Index document name: `index.html` (or appropriate)
   - ✅ Error document path: `404.html` (optional)

### CDN Configuration:

1. Go to: Azure CDN → Your CDN profile → Endpoint
2. Verify:
   - ✅ Origin: Points to your Storage Account static website
   - ✅ HTTPS: Enabled
   - ✅ Custom domain: Configured (if using Route 53)

### Route 53 DNS:

1. Go to: AWS Route 53 → Your hosted zone
2. Verify:
   - ✅ CNAME or A record points to your CDN endpoint
   - ✅ Record is active

---

## 4. Common Issues

### Issue: "InvalidUri" Error

**Causes:**
- Accessing storage account directly with wrong URL format
- Missing `index.html` in the root
- Static website not enabled
- Wrong container name (should be `$web`)

**Fix:**
- Use CDN URL, not storage account URL directly
- Verify static website is enabled
- Check that files were uploaded to `$web` container

### Issue: No HTTPS

**Causes:**
- CDN HTTPS not configured
- Custom domain not configured with SSL certificate
- Using storage account URL directly (may not have HTTPS)

**Fix:**
- Use CDN endpoint (has HTTPS by default)
- Configure custom domain with SSL in CDN

---

## 5. Verify Files Were Uploaded

### Check Storage Account:

1. Go to: Storage Account `layofflens` → Containers → `$web`
2. You should see:
   - `index.html`
   - `_next/` folder with static assets
   - Other HTML files

If files are missing, the deployment might have failed silently.

---

## 6. Test URLs

### Functions:
- ✅ `https://layofflens-func.azurewebsites.net/api/ListItemsHttp`

### Static Site (CDN):
- ⚠️ `https://<your-cdn-endpoint>.azureedge.net`
- ⚠️ Or your custom domain

### Static Site (Direct - Not Recommended):
- ⚠️ `https://layofflens.z<number>.web.core.windows.net`

---

## What URL Are You Using?

Please share:
1. The exact URL you're trying to access
2. Whether you're using CDN or direct storage URL
3. Your CDN endpoint name (if you have it)

This will help me diagnose the issue!

