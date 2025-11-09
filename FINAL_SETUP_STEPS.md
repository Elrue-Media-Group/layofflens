# Final Setup Steps - Ready to Deploy!

## ✅ Your Configuration:

- **Storage Account Name:** `layofflens`
- **Resource Group:** `LayoffLens`
- **Functions App:** `layofflens-func`

---

## Step 1: Create Service Principal

Run this command (replace `<subscription-id>` with your Azure subscription ID):

```bash
az login

az ad sp create-for-rbac --name "layofflens-github-actions" \
  --role "Storage Blob Data Contributor" \
  --scopes /subscriptions/<subscription-id>/resourceGroups/LayoffLens \
  --sdk-auth
```

**To find your subscription ID:**
```bash
az account show --query id -o tsv
```

**Or get it from Azure Portal:**
- Azure Portal → Subscriptions → Copy the Subscription ID

**The command will output JSON like:**
```json
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "...",
  "activeDirectoryEndpointUrl": "...",
  "resourceManagerEndpointUrl": "...",
  "activeDirectoryGraphResourceId": "...",
  "sqlManagementEndpointUrl": "...",
  "galleryEndpointUrl": "...",
  "managementEndpointUrl": "..."
}
```

**Copy this entire JSON output** - you'll need it for GitHub Secrets.

---

## Step 2: Add GitHub Secrets

Go to: https://github.com/tcerrato/layofflens/settings/secrets/actions

Click **New repository secret** and add these 3 secrets:

### Secret 1: AZURE_CREDENTIALS
- **Name:** `AZURE_CREDENTIALS`
- **Value:** (Paste the entire JSON from Step 1)

### Secret 2: AZURE_STORAGE_ACCOUNT_NAME
- **Name:** `AZURE_STORAGE_ACCOUNT_NAME`
- **Value:** `layofflens`

### Secret 3: AZURE_RESOURCE_GROUP
- **Name:** `AZURE_RESOURCE_GROUP`
- **Value:** `LayoffLens`

---

## Step 3: Add Environment Variables in Azure Portal

Go to: Functions App `layofflens-func` → Configuration → Environment variables

Add these 2 (if not already there):

1. **AZURE_STORAGE_ACCOUNT_NAME**
   - Value: `layofflens`

2. **ADMIN_TOKEN**
   - Value: (Generate a secure random token)

(You already have `SERPER_API_KEY`)

---

## Step 4: Assign Managed Identity Role

Go to: Storage Account `layofflens` → Access control (IAM)

1. Click **Add role assignment**
2. **Role:** `Storage Table Data Contributor`
3. **Assign access to:** `Managed identity`
4. **Select:** `layofflens-func` (your Functions App)
5. Click **Save**

---

## Step 5: Deploy!

Once all secrets and environment variables are set:

1. **Commit and push your code:**
   ```bash
   git add .
   git commit -m "Add deployment workflows and static export config"
   git push
   ```

2. **GitHub Actions will automatically:**
   - Deploy Functions (when `apps/api/**` changes)
   - Build and deploy Static Site (when `apps/web/**` changes)

3. **Check deployment status:**
   - Go to: https://github.com/tcerrato/layofflens/actions
   - You'll see both workflows running

---

## 🎯 Quick Checklist:

- [ ] Create Service Principal (Step 1)
- [ ] Add 3 GitHub Secrets (Step 2)
- [ ] Add 2 Environment Variables in Azure Portal (Step 3)
- [ ] Assign Storage Table Data Contributor role (Step 4)
- [ ] Commit and push code (Step 5)
- [ ] Watch GitHub Actions deploy! 🚀

---

## 📝 Summary:

| Component | Status | What Happens |
|-----------|--------|--------------|
| **Functions** | ✅ Ready | Auto-deploys on push |
| **Static Site** | ✅ Ready | Auto-builds and deploys on push |
| **Data** | ✅ Ready | Fetched at build time |

---

## 🚀 You're All Set!

Once you complete Steps 1-4, just push your code and everything will deploy automatically!

Need help with any step? Let me know!

