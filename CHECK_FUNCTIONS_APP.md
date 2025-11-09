# Check Functions App - Troubleshooting

## Issue: Functions URL Not Resolving

The error "Could not resolve host: layofflens-func.azurewebsites.net" means either:
1. The Functions App doesn't exist with that name
2. The deployment failed
3. The name is slightly different

---

## Quick Checks:

### 1. Verify Functions App Exists

**In Azure Portal:**
1. Go to: https://portal.azure.com
2. Search for: "Function App" in the top search bar
3. Or go to: All resources → Filter by "Function App"

**Questions:**
- Do you see a Functions App?
- What's the exact name? (might be `layofflens-func` or something else)
- Is it in resource group `LayoffLens`?

### 2. Check GitHub Actions Deployment Logs

**In GitHub:**
1. Go to: https://github.com/tcerrato/layofflens/actions
2. Click on the latest "Deploy Azure Functions" workflow run
3. Check the "Deploy to Azure Functions" step
4. Look for:
   - ✅ Success message
   - ❌ Error messages
   - The actual Functions App name it tried to deploy to

### 3. Get the Correct URL

**If Functions App exists:**
1. Click on the Functions App in Azure Portal
2. Go to: **Overview** tab
3. Look for: **URL** field
4. Copy that exact URL

**Common URL formats:**
- `https://layofflens-func.azurewebsites.net`
- `https://layofflensfunc.azurewebsites.net`
- `https://layofflens-func-<region>.azurewebsites.net`

---

## What to Share:

Please check Azure Portal and tell me:
1. **Does a Functions App exist?** (Yes/No)
2. **What's the exact name?** (if it exists)
3. **What's the URL from Overview tab?**
4. **What do the GitHub Actions logs show?** (any errors?)

Once I have this info, I can:
- Update the workflow with the correct name
- Fix any deployment issues
- Get your Functions working!

---

## Alternative: Check Deployment Logs

If the Functions App doesn't exist, the deployment might have failed. Check:
- GitHub Actions → Latest workflow run → Look for errors
- The "Deploy to Azure Functions" step should show success or failure

