# Fix Missing index.html Issue

## Problem:

The `$web` container has files but is missing `index.html` in the root, causing "InvalidUri" error.

## Root Cause:

With `trailingSlash: true` and dynamic `searchParams`, Next.js might be generating the root page as `index.html` in a subdirectory or failing to generate it.

## Solution:

The build should create `index.html` at the root. Let's verify the build output and ensure it's uploaded correctly.

## Check GitHub Actions Logs:

1. Go to: https://github.com/tcerrato/layofflens/actions
2. Click on latest "Deploy Static Site" workflow
3. Check the "Verify build output" step
4. Look for what files were created

## Expected Build Output:

The `apps/web/out` directory should contain:
- `index.html` (root - required!)
- `404.html`
- `archive/` folder
- `_next/` folder

If `index.html` is missing from the build, the issue is in the Next.js build process.

## Quick Test:

Let's check if the build is working locally:

```bash
cd apps/web
NEXT_PUBLIC_API_BASE=https://layofflens-func-fcdubwg4b8hnhhgx.eastus-01.azurewebsites.net/api pnpm build
ls -la out/
```

This will show if `index.html` is being created.

