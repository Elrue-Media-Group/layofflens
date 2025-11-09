# Deployment Checklist

## ✅ Completed:

- [x] GitHub Secrets added
  - [x] AZURE_CREDENTIALS
  - [x] AZURE_STORAGE_ACCOUNT_NAME
  - [x] AZURE_RESOURCE_GROUP

## ⚠️ Remaining Steps:

### 1. Azure Portal Environment Variables

Go to: Functions App `layofflens-func` → Configuration → Environment variables

Verify/Add:
- [ ] `AZURE_STORAGE_ACCOUNT_NAME` = `layofflens`
- [ ] `ADMIN_TOKEN` = (secure token)
- [ ] `SERPER_API_KEY` = (you should already have this)

### 2. Managed Identity Role Assignment

Go to: Storage Account `layofflens` → Access control (IAM)

- [ ] Add role assignment
- [ ] Role: `Storage Table Data Contributor`
- [ ] Assign to: Managed identity → `layofflens-func`

### 3. Commit and Push

Once steps 1-2 are done:
- [ ] Commit all changes
- [ ] Push to GitHub
- [ ] Watch GitHub Actions deploy!

---

## 🚀 Ready to Deploy?

Once you complete steps 1-2 above, you're ready to push and deploy!

