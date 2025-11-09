# Timer Function - How It Works

## ✅ Current Setup:

Your `FetchDailyTimer` function is configured to run **nightly at midnight UTC**.

## How It Works:

1. **Automatic:** Azure Functions automatically runs the timer based on the schedule
2. **No Manual Setup:** Once deployed, it runs automatically - no configuration needed in Azure Portal
3. **Schedule:** `0 0 0 * * *` = Midnight (12:00 AM) UTC every day

## What Happens:

Every night at midnight UTC, Azure Functions will:
1. Automatically trigger `FetchDailyTimer`
2. Fetch news and videos from Serper API
3. Save items to Azure Table Storage
4. Log the results

## Time Zone Note:

- **UTC Time:** The timer uses UTC (Coordinated Universal Time)
- **Your Local Time:** 
  - If you're in EST (UTC-5): Midnight UTC = 7:00 PM EST previous day
  - If you're in PST (UTC-8): Midnight UTC = 4:00 PM PST previous day
  - If you're in GMT (UTC+0): Midnight UTC = Midnight GMT

## To Change the Time:

Edit `apps/api/src/FetchDailyTimer/index.ts`:

**Current (Midnight UTC):**
```typescript
schedule: "0 0 0 * * *"
```

**Other Options:**
- `0 0 2 * * *` = 2:00 AM UTC (common for nightly jobs)
- `0 0 3 * * *` = 3:00 AM UTC
- `0 0 9 * * *` = 9:00 AM UTC (previous setting)

## Cron Format:

`second minute hour day month day-of-week`

- `0 0 0 * * *` = Every day at 00:00:00 (midnight)

## Summary:

- ✅ Timer is configured and will run automatically
- ✅ Currently set to midnight UTC (nightly)
- ✅ No Azure Portal configuration needed
- ✅ Just deploy the code and it works!

---

## After Deployment:

Once you push the code, the timer will:
- Start running automatically
- Execute every night at midnight UTC
- Fetch and save new data
- No manual intervention needed!

