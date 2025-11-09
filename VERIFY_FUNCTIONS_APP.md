# Verify Functions App Deployment

## Issue: Functions URL Not Resolving

The error "Could not resolve host" means the Functions App might not exist or the name is incorrect.

---

## Steps to Verify:

### 1. Check Functions App in Azure Portal

1. Go to: https://portal.azure.com
2. Search for: "Function App" or "layofflens"
3. Look for your Functions App

**Questions:**
- Does `layofflens-func` exist?
- What's the exact name? (might be slightly different)
- Is it in the correct resource group?

### 2. Get the Correct Functions URL

Once you find the Functions App:

1. Click on it
2. Go to: **Overview** tab
3. Look for: **URL** or **Function App URL**
4. It should be something like: `https://<actual-name>.azurewebsites.net`

**Common variations:**
- `layofflens-func.azurewebsites.net`
- `layofflensfunc.azurewebsites.net` (no hyphen)
- `layofflens-func-<region>.azurewebsites.net`
- Or a completely different name

### 3. Check Deployment Status

1. Go to: Functions App → **Deployment Center** or **Deployment**
2. Check if there are any recent deployments
3. Look for errors or failed deployments

### 4. Check Functions

1. Go to: Functions App → **Functions**
2. You should see:
   - `ListItemsHttp`
   - `FetchNowHttp`
   - `FetchDailyTimer`

If Functions are missing, the deployment might have failed.

---

## Possible Issues:

### Issue 1: Functions App Name is Different

**Solution:** Update the workflow with the correct name

### Issue 2: Functions App Doesn't Exist

**Solution:** The deployment might have failed. Check GitHub Actions logs.

### Issue 3: Functions App Exists But Not Deployed

**Solution:** Check deployment logs in Azure Portal

---

## What I Need:

Please check Azure Portal and tell me:
1. **Does the Functions App exist?** (Yes/No)
2. **What's the exact name?** (if it exists)
3. **What's the URL shown in Overview?**

Then I can update the workflows with the correct name!

