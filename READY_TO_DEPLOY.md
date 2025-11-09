# Ready to Deploy - Final Checklist

## ✅ Completed:

- [x] GitHub Secrets added
- [x] ADMIN_TOKEN added to Azure Portal
- [x] Code ready (workflows, static export config, managed identity)

## ⚠️ Final Verification:

### 1. Verify Environment Variables in Azure Portal

Go to: Functions App `layofflens-func` → Configuration → Environment variables

Make sure these 3 are set:
- [x] `ADMIN_TOKEN` = (you just added this)
- [ ] `AZURE_STORAGE_ACCOUNT_NAME` = `layofflens` (verify this exists)
- [ ] `SERPER_API_KEY` = (verify this exists)

### 2. Verify Managed Identity Role Assignment

Go to: Storage Account `layofflens` → Access control (IAM)

- [ ] Check if `layofflens-func` has `Storage Table Data Contributor` role
- [ ] If not, add it:
  - Click **Add role assignment**
  - Role: `Storage Table Data Contributor`
  - Assign to: Managed identity → `layofflens-func`

### 3. Commit and Push Code

Once steps 1-2 are verified:

```bash
git add .
git commit -m "Add deployment workflows and static export configuration"
git push
```

---

## 🚀 What Happens Next:

After you push:

1. **GitHub Actions will automatically:**
   - Deploy Functions (when `apps/api/**` changes)
   - Build and deploy Static Site (when `apps/web/**` changes)

2. **Check deployment status:**
   - Go to: https://github.com/tcerrato/layofflens/actions
   - You'll see both workflows running

3. **Test your deployment:**
   - Functions: `https://layofflens-func.azurewebsites.net/api/ListItemsHttp`
   - Static Site: Your CDN URL

---

## 📝 Quick Summary:

| Item | Status |
|------|--------|
| GitHub Secrets | ✅ Done |
| ADMIN_TOKEN | ✅ Done |
| AZURE_STORAGE_ACCOUNT_NAME | ⚠️ Verify |
| SERPER_API_KEY | ⚠️ Verify |
| Managed Identity Role | ⚠️ Verify |
| Code Ready | ✅ Ready |
| **Ready to Push** | ⚠️ After verification |

---

## 🎯 You're Almost There!

Just verify the 2 items above, then commit and push!

