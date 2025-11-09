# Deployment Guide for Azure Functions App

## Step 1: Configure Application Settings in Azure Portal

Go to your Functions App → Configuration → Application settings and add:

### Required Settings:

1. **FUNCTIONS_WORKER_RUNTIME**
   - Value: `node`

2. **WEBSITE_NODE_DEFAULT_VERSION**
   - Value: `~20`

3. **AZURE_STORAGE_CONNECTION_STRING**
   - Value: Your Azure Table Storage connection string
   - Get this from: Storage Account → Access keys → Connection string

4. **AzureWebJobsStorage**
   - Value: Same connection string as above (or a different storage account for Functions runtime)
   - This is used by Azure Functions runtime itself

5. **SERPER_API_KEY**
   - Value: Your actual Serper API key

6. **ADMIN_TOKEN**
   - Value: A secure token for the manual fetch endpoint (e.g., generate a random string)

### Optional but Recommended:

7. **WEBSITE_RUN_FROM_PACKAGE**
   - Value: `1`
   - Helps with deployment reliability

---

## Step 2: Get Your Functions App URL

After deployment, your Functions will be available at:
- `https://<your-function-app-name>.azurewebsites.net/api/`

Example endpoints:
- `https://<your-function-app-name>.azurewebsites.net/api/ListItemsHttp`
- `https://<your-function-app-name>.azurewebsites.net/api/FetchNowHttp?token=<your-admin-token>`

---

## Step 3: Update Next.js App Configuration

Update `apps/web/.env.local` or set environment variable:

```
NEXT_PUBLIC_API_BASE=https://<your-function-app-name>.azurewebsites.net/api
```

Or if you're building for production, set this in your build environment.

---

## Step 4: Deploy Functions Code

### Option A: Using Azure Functions Core Tools (CLI)

```bash
cd apps/api
# Login to Azure
az login

# Deploy
func azure functionapp publish <your-function-app-name>
```

### Option B: Using VS Code Extension

1. Install "Azure Functions" extension in VS Code
2. Right-click on `apps/api` folder
3. Select "Deploy to Function App"
4. Choose your Functions App

### Option C: Using GitHub Actions (Recommended for CI/CD)

Create `.github/workflows/deploy-functions.yml`:

```yaml
name: Deploy Azure Functions

on:
  push:
    branches: [main]
    paths:
      - 'apps/api/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build Functions
        working-directory: apps/api
        run: pnpm build
      
      - name: Deploy to Azure Functions
        uses: Azure/functions-action@v1
        with:
          app-name: '<your-function-app-name>'
          package: 'apps/api'
          publish-profile: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}
```

To get the publish profile:
1. Functions App → Get publish profile
2. Copy the content
3. Add as GitHub secret: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`

---

## Step 5: Verify Deployment

1. Check Functions App → Functions
   - You should see: `ListItemsHttp`, `FetchNowHttp`, `FetchDailyTimer`

2. Test the API:
   ```bash
   curl https://<your-function-app-name>.azurewebsites.net/api/ListItemsHttp
   ```

3. Check logs:
   - Functions App → Functions → Monitor
   - Or: Functions App → Log stream

---

## Step 6: Enable Timer Trigger

The `FetchDailyTimer` function should automatically be enabled, but verify:
- Functions App → Functions → FetchDailyTimer
- Check that it's enabled and the schedule is correct (currently set to 9 AM daily)

---

## Troubleshooting

### Functions not appearing:
- Check that `dist/functions.js` exists after build
- Verify `host.json` is in the root of `apps/api`
- Check deployment logs in Azure Portal

### Environment variables not working:
- Restart the Functions App after adding settings
- Check that variable names match exactly (case-sensitive)

### CORS issues:
- Functions already have `Access-Control-Allow-Origin: *` in responses
- If issues persist, check Functions App → CORS settings

### Table Storage connection:
- Verify connection string is correct
- Check that Table Storage is enabled in your Storage Account
- Test connection locally first with Azurite

---

## Next Steps After Functions Deployment

1. Update Next.js `NEXT_PUBLIC_API_BASE` environment variable
2. Deploy Next.js static files to Storage Account
3. Test the full application end-to-end
4. Set up GitHub Actions for automated deployments

