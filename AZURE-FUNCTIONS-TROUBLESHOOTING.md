# Azure Functions Troubleshooting Guide

## Quick Reference

### Function App Details
- **Name**: `layofflens-func`
- **Resource Group**: `LayoffLens`
- **Region**: East US
- **Runtime**: Node.js (Azure Functions v4)

### Function URLs
- Base URL: `https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net`
- Functions:
  - `FetchNowHttp` - Manual data fetch trigger
  - `FetchDailyTimer` - Scheduled daily fetch
  - `ListItemsHttp` - List/search items with pagination
  - `GetLayoffStatsHttp` - Analytics statistics
  - `GetTopChannelsHttp` - YouTube channel statistics

## Common Issues and Solutions

### Issue 1: Function Returns 404

**Symptoms:**
- URL returns "404 Not Found"
- Function shows as "Enabled" in Azure Portal

**Causes:**
1. Function requires authentication code
2. Function not deployed
3. Wrong URL casing (Azure is case-sensitive for some endpoints)

**Solutions:**
```bash
# Get function URL with auth code
az functionapp function show \
  --name layofflens-func \
  --resource-group LayoffLens \
  --function-name FetchNowHttp \
  --query "invokeUrlTemplate" -o tsv

# Or get master key and append to URL
az functionapp keys list \
  --name layofflens-func \
  --resource-group LayoffLens \
  --query "masterKey" -o tsv

# Then use: https://[url]/api/FetchNowHttp?code=[master-key]
```

### Issue 2: Function Times Out or Returns Empty Response

**Symptoms:**
- curl hangs indefinitely
- No response body returned
- Function shows as running but no output

**Causes:**
1. Function is actually running but takes long time (Serper calls)
2. Missing environment variables
3. Code not deployed to production

**Solutions:**
```bash
# Check if latest code is deployed - compare git commit with deployment
git log -1 --oneline

# Check Azure deployment logs
az webapp log tail \
  --name layofflens-func \
  --resource-group LayoffLens

# Verify environment variables are set
az functionapp config appsettings list \
  --name layofflens-func \
  --resource-group LayoffLens \
  --query "[?name=='SERPER_API_KEY']"
```

### Issue 3: New Function Not Appearing After Deployment

**Symptoms:**
- Added new Azure Function but it doesn't show in portal
- Function works locally but not in production

**Causes:**
1. Function not registered in `functions.ts`
2. Build/deployment didn't complete
3. Function app needs restart

**Solutions:**
```bash
# 1. Verify function is registered in apps/api/src/functions.ts
# Check that require("./YourFunctionHttp/index") is present

# 2. Check recent deployments
az functionapp deployment list \
  --name layofflens-func \
  --resource-group LayoffLens \
  --output table

# 3. Restart function app
az functionapp restart \
  --name layofflens-func \
  --resource-group LayoffLens

# 4. Force redeploy (if using GitHub Actions)
# Push a new commit or re-run the workflow
```

### Issue 4: Function Runs but Data Not Persisted

**Symptoms:**
- FetchNowHttp completes successfully
- No errors shown
- Data doesn't appear in storage or API results

**Causes:**
1. Wrong storage connection string (pointing to emulator)
2. Storage credentials expired
3. Table doesn't exist

**Solutions:**
```bash
# Verify storage connection string
az functionapp config appsettings list \
  --name layofflens-func \
  --resource-group LayoffLens \
  --query "[?name=='AzureWebJobsStorage']"

# Check if using emulator (should NOT see UseDevelopmentStorage=true)
# Production should have: DefaultEndpointsProtocol=https;AccountName=...

# Get correct connection string
az storage account show-connection-string \
  --name layofflensstorage \
  --resource-group LayoffLens \
  --query connectionString -o tsv
```

### Issue 5: Environment Variables Missing

**Symptoms:**
- Function fails with "SERPER_API_KEY is not defined" or similar
- Works locally but not in production

**Solutions:**
```bash
# List all app settings
az functionapp config appsettings list \
  --name layofflens-func \
  --resource-group LayoffLens \
  --output table

# Add missing setting
az functionapp config appsettings set \
  --name layofflens-func \
  --resource-group LayoffLens \
  --settings "SERPER_API_KEY=your-key-here"

# Required settings:
# - SERPER_API_KEY
# - AzureWebJobsStorage
# - AZURE_OPENAI_ENDPOINT
# - AZURE_OPENAI_API_KEY
```

## Deployment Checklist

When deploying new function changes:

- [ ] Code committed and pushed to main branch
- [ ] Check GitHub Actions deployment status
- [ ] Verify function appears in Azure Portal
- [ ] Test function with curl or browser
- [ ] Check function logs for errors
- [ ] Verify data persisted correctly (if applicable)

## Manual Deployment Steps

If GitHub Actions fails or you need to deploy manually:

```bash
# Navigate to API directory
cd apps/api

# Build the project
npm install
npm run build

# Deploy using Azure Functions Core Tools
func azure functionapp publish layofflens-func

# Or deploy using Azure CLI
az functionapp deployment source config-zip \
  --name layofflens-func \
  --resource-group LayoffLens \
  --src dist.zip
```

## Testing Functions

### Test FetchNowHttp (trigger data fetch)
```bash
# Get master key
MASTER_KEY=$(az functionapp keys list \
  --name layofflens-func \
  --resource-group LayoffLens \
  --query "masterKey" -o tsv)

# Trigger fetch
curl "https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net/api/FetchNowHttp?code=$MASTER_KEY"
```

### Test GetTopChannelsHttp (should work without auth)
```bash
curl "https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net/api/GetTopChannelsHttp?days=30"
```

### Test ListItemsHttp
```bash
curl "https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net/api/ListItemsHttp?days=7&limit=10"
```

## Viewing Logs

### Real-time log streaming
```bash
az webapp log tail \
  --name layofflens-func \
  --resource-group LayoffLens
```

### Recent invocations in portal
1. Go to Azure Portal
2. Navigate to Function App → Functions → [Function Name]
3. Click "Monitor" tab
4. View recent invocations and their logs

## Cost Monitoring

### Check Serper API usage
- Each NEWS_QUERIES entry = 1 search per fetch
- Each VIDEO_QUERIES entry = 1 search per fetch
- Current: 3 news + 7 videos = **10 searches per fetch**
- Daily: 10 searches/day × 30 days = **300 searches/month**
- Cost: $50/5000 searches = **~$3/month**

### Monitor Azure Function executions
```bash
# Get execution count for last 30 days
az monitor metrics list \
  --resource /subscriptions/[subscription-id]/resourceGroups/LayoffLens/providers/Microsoft.Web/sites/layofflens-func \
  --metric "FunctionExecutionCount" \
  --start-time $(date -u -v-30d +%Y-%m-%dT%H:%M:%SZ) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ)
```

## Previous Issue Resolution

### The "Full Day" Function Issue (Reference)
**Problem**: Functions weren't working in production after deployment

**What Fixed It**:
1. Verified all functions registered in `functions.ts`
2. Checked environment variables were set correctly
3. Restarted function app
4. Cleared any cached builds/deployments
5. Verified storage connection string was production (not emulator)

**Key Lesson**: Always check that:
- Code is actually deployed (check commit hash)
- Environment variables match production needs
- Storage connection points to real Azure Storage, not `UseDevelopmentStorage=true`

## Quick Diagnostic Commands

Run these when functions misbehave:

```bash
# 1. Check deployment status
az functionapp show --name layofflens-func --resource-group LayoffLens --query "state"

# 2. Get master key
az functionapp keys list --name layofflens-func --resource-group LayoffLens --query "masterKey" -o tsv

# 3. List all functions
az functionapp function list --name layofflens-func --resource-group LayoffLens --output table

# 4. Check environment variables
az functionapp config appsettings list --name layofflens-func --resource-group LayoffLens --output table

# 5. View recent logs
az webapp log tail --name layofflens-func --resource-group LayoffLens
```
