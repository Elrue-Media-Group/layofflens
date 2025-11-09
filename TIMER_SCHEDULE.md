# Timer Function Schedule Configuration

## Current Schedule:

Your `FetchDailyTimer` function is currently set to run at **9 AM daily**:
- Schedule: `0 0 9 * * *` (9:00 AM every day)

## How Timer Functions Work:

1. **Automatic:** Azure Functions automatically runs timer triggers based on the schedule
2. **No Setup Needed:** Once deployed, the timer runs automatically
3. **Cron Format:** Uses 6-field cron expression

## Current Configuration:

**File:** `apps/api/src/FetchDailyTimer/index.ts`
```typescript
app.timer("FetchDailyTimer", {
  schedule: "0 0 9 * * *",  // 9 AM daily
  handler: fetchDailyTimer,
});
```

**File:** `apps/api/src/FetchDailyTimer/function.json`
```json
{
  "schedule": "0 0 9 * * *"
}
```

---

## Cron Schedule Format:

The format is: `second minute hour day month day-of-week`

Examples:
- `0 0 9 * * *` = 9:00 AM every day
- `0 0 0 * * *` = Midnight (12:00 AM) every day
- `0 0 2 * * *` = 2:00 AM every day
- `0 30 23 * * *` = 11:30 PM every day

---

## To Change to Nightly (Midnight):

Change the schedule to run at midnight:

**Option 1: Midnight (12:00 AM)**
```typescript
schedule: "0 0 0 * * *"
```

**Option 2: 2:00 AM (common for nightly jobs)**
```typescript
schedule: "0 0 2 * * *"
```

**Option 3: 11:00 PM**
```typescript
schedule: "0 0 23 * * *"
```

---

## How to Change It:

1. **Update the code:**
   - Edit `apps/api/src/FetchDailyTimer/index.ts`
   - Change the `schedule` value

2. **Update function.json (if it exists):**
   - Edit `apps/api/src/FetchDailyTimer/function.json`
   - Change the `schedule` value

3. **Commit and push:**
   - The change will deploy automatically via GitHub Actions

---

## Recommended Nightly Times:

- **Midnight (00:00):** `0 0 0 * * *` - Start of day
- **2:00 AM:** `0 0 2 * * *` - Low traffic time
- **3:00 AM:** `0 0 3 * * *` - Very low traffic
- **11:00 PM:** `0 0 23 * * *` - End of day

---

## Time Zone:

Azure Functions timers use **UTC** by default. To adjust for your timezone:
- If you want 12:00 AM EST, that's 5:00 AM UTC
- If you want 12:00 AM PST, that's 8:00 AM UTC

---

## Summary:

- ✅ Timer is already configured to run automatically
- ✅ Currently runs at 9 AM daily
- ⚠️ To change: Update the `schedule` value in the code
- ⚠️ After change: Commit and push (auto-deploys)

