# Quick Deployment Steps for layofflens-func

## Step 1: Configure Azure Functions App Settings

Go to: https://portal.azure.com → Functions App `layofflens-func` → Configuration → Application settings

### Add/Update these settings:

1. **FUNCTIONS_WORKER_RUNTIME**
   - Value: `node`

2. **WEBSITE_NODE_DEFAULT_VERSION**
   - Value: `~20`

3. **AZURE_STORAGE_CONNECTION_STRING**
   - Value: (Your Azure Storage connection string - get from Storage Account → Access keys)

4. **AzureWebJobsStorage**
   - Value: (Your Azure Storage connection string - same as above)
   - (Same connection string - Functions runtime needs this)

5. **SERPER_API_KEY**
   - Value: (Your actual Serper API key from your `.env` file)

6. **ADMIN_TOKEN**
   - Value: (Generate a secure random token, e.g., use a password generator)
   - This is used for the manual fetch endpoint: `/api/FetchNowHttp?token=<your-token>`

### After adding settings:
- Click **Save** at the top
- The Functions App will restart automatically

---

## Step 2: Deploy Functions Code

### Using Azure Functions Core Tools:

```bash
cd apps/api

# Make sure you're logged in to Azure
az login

# Deploy to your Functions App
func azure functionapp publish layofflens-func
```

### If you don't have Azure Functions Core Tools installed:

```bash
# Install globally
npm install -g azure-functions-core-tools@4 --unsafe-perm true

# Then deploy
cd apps/api
func azure functionapp publish layofflens-func
```

---

## Step 3: Verify Deployment

After deployment, test your Functions:

1. **List Items Endpoint:**
   ```bash
   curl https://layofflens-func.azurewebsites.net/api/ListItemsHttp
   ```

2. **Check Functions in Portal:**
   - Go to: Functions App → Functions
   - You should see: `ListItemsHttp`, `FetchNowHttp`, `FetchDailyTimer`

3. **Check Logs:**
   - Functions App → Log stream (to see real-time logs)
   - Or: Functions App → Functions → Monitor (to see execution history)

---

## Step 4: Update Next.js Configuration

Your Functions will be available at:
```
https://layofflens-func.azurewebsites.net/api
```

### For Local Development:
Update `apps/web/.env.local`:
```
NEXT_PUBLIC_API_BASE=https://layofflens-func.azurewebsites.net/api
```

### For Production Build:
Set this environment variable when building your Next.js app, or add to your build process.

---

## Step 5: Test Manual Fetch (Optional)

Once deployed, you can trigger a manual fetch:

```bash
curl -X POST "https://layofflens-func.azurewebsites.net/api/FetchNowHttp?token=<your-admin-token>"
```

Replace `<your-admin-token>` with the value you set in Application Settings.

---

## Your Functions URLs:

- **List Items:** `https://layofflens-func.azurewebsites.net/api/ListItemsHttp`
- **Manual Fetch:** `https://layofflens-func.azurewebsites.net/api/FetchNowHttp?token=<token>`
- **Daily Timer:** Automatically runs at 9 AM daily (no manual URL needed)

---

## Troubleshooting:

### Functions not appearing:
- Check deployment logs: `func azure functionapp publish layofflens-func --verbose`
- Verify `dist/functions.js` exists after building
- Check Functions App → Deployment Center for deployment status

### Connection string issues:
- Verify Table Storage is enabled in your Storage Account
- Test connection string locally first with Azurite
- Check that the connection string is exactly as provided (no extra spaces)

### Environment variables not working:
- Restart Functions App after adding settings
- Check variable names are exact (case-sensitive)
- View in Functions App → Configuration → Application settings

---

## Next Steps:

1. ✅ Configure Application Settings (Step 1)
2. ✅ Deploy Functions (Step 2)
3. ✅ Verify deployment (Step 3)
4. ✅ Update Next.js API base URL (Step 4)
5. Deploy Next.js static files to Storage Account
6. Configure CDN and Route 53
7. Test end-to-end

