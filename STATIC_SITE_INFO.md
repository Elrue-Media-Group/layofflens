# Static Site Deployment - What I Need

## Information Needed for Static Site Deployment:

I need details about your **Storage Account that hosts your static website** (this is different from Table Storage).

---

## Where to Find This Info:

### Option 1: Azure Portal (Easiest)

1. **Go to Azure Portal:** https://portal.azure.com
2. **Find your Storage Account:**
   - Search for "Storage accounts" in the top search bar
   - Look for the one that has "Static website" enabled
   - (This might be the same as `layofflens` or a different one)

3. **Get the Info:**
   - Click on your Storage Account
   - **Overview** tab shows:
     - **Storage account name** (e.g., `layofflens` or `layofflensweb`)
     - **Resource group** (e.g., `layofflens-rg`)

4. **Check Static Website:**
   - Left sidebar → **Data management** → **Static website**
   - Note the **Container name** (usually `$web`)
   - Note if it's enabled

### Option 2: Get Connection String

1. **Storage Account** → **Access keys**
2. Copy the **Connection string** (key1 or key2)
3. This is for the static website storage account (not Table Storage)

---

## What I Need (Choose One):

### Option A: Storage Account Details
- **Storage Account Name:** (e.g., `layofflens`)
- **Container Name:** (usually `$web`)
- **Resource Group:** (e.g., `layofflens-rg`)

### Option B: Connection String
- **Storage Account Connection String:** (for static website)

---

## Quick Checklist:

- [ ] Storage Account name (for static website)
- [ ] Container name (usually `$web`)
- [ ] Resource group name
- [ ] OR: Connection string for static website storage

---

## Important Notes:

- **This is DIFFERENT from Table Storage:**
  - Table Storage connection string = for your Functions data
  - Static website storage = for your Next.js HTML/CSS/JS files

- **They might be the same Storage Account:**
  - If you're using one Storage Account for both, that's fine!
  - Just need to know the container name for static website

---

## Once I Have This Info:

I'll create a GitHub Actions workflow that:
1. Builds your Next.js app
2. Uploads the static files to your Storage Account
3. CDN will automatically serve the new files

---

## Where This Info Lives:

- **Azure Portal** → Storage Account → Overview/Static website
- **Or** your deployment notes/documentation
- **Or** you can check your CDN endpoint configuration

