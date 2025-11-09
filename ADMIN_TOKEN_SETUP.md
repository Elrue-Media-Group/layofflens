# ADMIN_TOKEN Setup

## What is ADMIN_TOKEN?

The `ADMIN_TOKEN` is a security token that protects your manual fetch endpoint:
- **Endpoint:** `/api/FetchNowHttp?token=<your-token>`
- **Purpose:** Prevents unauthorized access to trigger data fetches
- **Usage:** You'll use this token when you want to manually trigger a data fetch

---

## How to Generate a Secure Token

### Option 1: Using OpenSSL (Recommended)

```bash
openssl rand -hex 32
```

This generates a 64-character hexadecimal string (very secure).

### Option 2: Using Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option 3: Using Online Generator

Use a secure password generator to create a random string (at least 32 characters).

### Option 4: Simple Random String

Any long, random string works. Examples:
- `my-secure-token-2024-layofflens-xyz123`
- `layofflens-admin-key-abc789def456`
- Or use a UUID: `550e8400-e29b-41d4-a716-446655440000`

---

## What Value to Use

**Recommendation:** Use a long, random string (32+ characters)

**Examples:**
- `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0` (40 chars)
- `layofflens-secure-token-2024-xyz789` (32 chars)
- Or generate one using the commands above

**Important:** 
- Make it long and random
- Don't use something obvious like "password" or "admin"
- Store it securely (you'll need it to trigger manual fetches)

---

## How to Add It

1. **Generate your token** (use one of the methods above)

2. **Add to Azure Portal:**
   - Go to: Functions App `layofflens-func` → Configuration → Environment variables
   - Click: **+ New environment variable**
   - **Name:** `ADMIN_TOKEN`
   - **Value:** (paste your generated token)
   - Click: **OK** → **Save**

---

## How to Use It

After deployment, you can trigger a manual fetch:

```bash
curl -X POST "https://layofflens-func.azurewebsites.net/api/FetchNowHttp?token=<your-admin-token>"
```

Replace `<your-admin-token>` with the value you set in Azure Portal.

---

## Security Notes

- ✅ This token protects your manual fetch endpoint
- ✅ Only people with the token can trigger fetches
- ✅ Keep it secret - don't commit it to GitHub
- ✅ You can rotate it anytime by updating the environment variable

---

## Quick Example

If you generate: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`

Add to Azure Portal:
- **Name:** `ADMIN_TOKEN`
- **Value:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`

Then use it like:
```bash
curl -X POST "https://layofflens-func.azurewebsites.net/api/FetchNowHttp?token=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
```

---

## Summary

1. Generate a random token (32+ characters)
2. Add it to Azure Portal as `ADMIN_TOKEN`
3. Use it when calling the manual fetch endpoint
4. Keep it secret!

