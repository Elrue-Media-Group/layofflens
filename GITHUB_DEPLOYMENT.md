# GitHub Actions Deployment Explained

## Yes, GitHub CAN Deploy Your Functions Automatically!

But you need to set it up first. Here's what that means:

---

## Two Deployment Options:

### Option 1: Manual Deployment (One-Time Setup)
- You run a command once: `func azure functionapp publish layofflens-func`
- Functions get deployed immediately
- **Good for:** Testing, initial setup, quick fixes

### Option 2: GitHub Actions (Automated)
- Every time you push code to GitHub, it automatically deploys
- No manual commands needed
- **Good for:** Ongoing development, team collaboration, production

---

## What GitHub Actions Needs to Work:

### 1. The Workflow File ✅ (I just created this)
- Location: `.github/workflows/deploy-functions.yml`
- This tells GitHub: "When code changes, build and deploy Functions"

### 2. Azure Publish Profile (You need to get this)
- This is like a "password" that lets GitHub deploy to your Azure Functions App
- It's secure and stored as a GitHub Secret

### 3. Application Settings in Azure (Still Required)
- GitHub Actions deploys the CODE
- But Azure Portal still needs the ENVIRONMENT VARIABLES
- These are separate things:
  - **Code deployment** = GitHub Actions handles this
  - **Environment variables** = You set in Azure Portal

---

## Step-by-Step: Setting Up GitHub Actions

### Step 1: Get Your Azure Publish Profile

1. Go to Azure Portal: https://portal.azure.com
2. Navigate to: Functions App → `layofflens-func`
3. Click: **Get publish profile** (top menu bar)
4. A file will download: `layofflens-func.PublishSettings`

### Step 2: Add Publish Profile to GitHub Secrets

1. Go to your GitHub repo: https://github.com/tcerrato/layofflens
2. Click: **Settings** → **Secrets and variables** → **Actions**
3. Click: **New repository secret**
4. Name: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
5. Value: Open the downloaded `.PublishSettings` file, copy ALL its contents, paste here
6. Click: **Add secret**

### Step 3: That's It!

Now when you:
- Push code to `main` or `dev` branch
- Change files in `apps/api/` folder

GitHub will automatically:
1. Build your Functions
2. Deploy to `layofflens-func`
3. Your Functions are live!

---

## What You Still Need to Do in Azure Portal:

**Application Settings** (these don't deploy with code, you set them once):

1. Go to: Functions App → Configuration → Application settings
2. Add these 6 settings:
   - `FUNCTIONS_WORKER_RUNTIME` = `node`
   - `WEBSITE_NODE_DEFAULT_VERSION` = `~20`
   - `AZURE_STORAGE_CONNECTION_STRING` = (your connection string)
   - `AzureWebJobsStorage` = (your connection string)
   - `SERPER_API_KEY` = (your Serper key)
   - `ADMIN_TOKEN` = (your secure token)

**Why?** These are environment variables that your code reads at runtime. They're not in your code (for security), so you set them in Azure Portal.

---

## Summary:

| What | Who Does It | When |
|------|------------|------|
| **Deploy Code** | GitHub Actions (after setup) | Every push to GitHub |
| **Set Environment Variables** | You (in Azure Portal) | One-time setup |
| **Build Functions** | GitHub Actions | Automatically |
| **Test Functions** | You | After deployment |

---

## First Time Setup (Choose One):

### Quick Start (Manual):
```bash
cd apps/api
func azure functionapp publish layofflens-func
```
Then set up GitHub Actions later for automation.

### Automated (GitHub Actions):
1. Get publish profile from Azure Portal
2. Add to GitHub Secrets
3. Push code → automatic deployment!

---

## The Workflow I Created:

The file `.github/workflows/deploy-functions.yml` will:
- ✅ Trigger on pushes to `main` or `dev` branch
- ✅ Only run when `apps/api/**` files change
- ✅ Build your Functions
- ✅ Deploy to `layofflens-func`
- ✅ Use your publish profile (secure)

---

## Questions Answered:

**Q: Won't GitHub deploy the functions?**  
A: Yes! But you need to:
   1. Get the publish profile from Azure
   2. Add it as a GitHub Secret
   3. Then it works automatically

**Q: What are these "asks" (requirements)?**  
A: Two separate things:
   1. **Code deployment** → GitHub Actions (automated after setup)
   2. **Environment variables** → Azure Portal (one-time manual setup)

**Q: Do I need to do both?**  
A: Yes, but they're different:
   - GitHub Actions = deploys your code
   - Azure Portal settings = configures runtime environment

---

## Next Steps:

1. **For immediate deployment:** Use manual command (Option 1)
2. **For automation:** Set up GitHub Actions (Option 2)
3. **Either way:** Set Application Settings in Azure Portal

Would you like me to help you get the publish profile, or do you want to deploy manually first?

