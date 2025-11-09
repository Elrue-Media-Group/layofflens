# Troubleshooting "InvalidUri" Error on layofflens.com

## Error You're Seeing:

- **URL:** https://www.layofflens.com
- **Error:** "The request URI is invalid"
- **HttpStatusCode:** 400
- **ErrorCode:** InvalidUri

This typically means the request format is wrong or files are missing.

---

## Possible Causes:

1. **Files not uploaded to `$web` container**
2. **Missing `index.html` in root**
3. **CDN not configured correctly**
4. **Static website not enabled**
5. **Next.js build didn't create proper output**

---

## Step-by-Step Troubleshooting:

### 1. Check if Files Were Uploaded

**In Azure Portal:**
1. Go to: Storage Account `layofflens` → Containers → `$web`
2. Check if you see:
   - `index.html` (should be in root)
   - `_next/` folder
   - Other HTML files

**If container is empty:**
- The deployment might have failed
- Check GitHub Actions logs for errors

### 2. Verify Static Website is Enabled

**In Azure Portal:**
1. Go to: Storage Account `layofflens` → Data management → Static website
2. Verify:
   - ✅ Static website: **Enabled**
   - ✅ Index document name: `index.html`
   - ✅ Error document path: (can be blank or `404.html`)

### 3. Check CDN Configuration

**In Azure Portal:**
1. Go to: Your CDN profile → Endpoint
2. Verify:
   - ✅ Origin: Points to your Storage Account static website
   - ✅ Origin host header: Should match your storage account
   - ✅ HTTPS: Enabled

### 4. Check GitHub Actions Build Logs

**In GitHub:**
1. Go to: https://github.com/tcerrato/layofflens/actions
2. Click on latest "Deploy Static Site" workflow
3. Check:
   - Did build succeed?
   - Did upload succeed?
   - Any errors in logs?

### 5. Test Direct Storage URL

Try accessing the storage account directly (bypassing CDN):

1. Get URL from: Storage Account → Static website → Primary endpoint
2. Format: `https://layofflens.z<number>.web.core.windows.net`
3. Test this URL directly

If this works but CDN doesn't, it's a CDN configuration issue.

---

## Quick Fixes:

### Fix 1: Re-run Static Site Deployment

If files are missing, manually trigger the workflow:
1. GitHub Actions → "Deploy Static Site" → "Run workflow"

### Fix 2: Check Build Output

The workflow should create `apps/web/out` directory. Check GitHub Actions logs to see if:
- Build completed successfully
- `out` directory was created
- Files were uploaded

### Fix 3: Verify CDN Origin

Make sure CDN origin points to:
- Storage Account static website endpoint
- Not the blob storage endpoint

---

## What to Check:

Please verify:
1. **Are files in `$web` container?** (Yes/No)
2. **Is static website enabled?** (Yes/No)
3. **What does GitHub Actions log show?** (Any errors?)
4. **What's the CDN origin configured to?** (Storage account static website URL?)

Share what you find and I can help fix the specific issue!

