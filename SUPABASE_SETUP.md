# Supabase Backend Setup Guide

This guide walks you through setting up Supabase as the backend database for the Henley AI Pathfinder application to collect and view real user submissions.

---

## 🎯 What You'll Achieve

- **Collect real submissions** from all users (not just localStorage)
- **View all participants** in the admin dashboard
- **Export data to CSV** with all submissions
- **Real-time database** with automatic API generation
- **Free tier** - No cost for your use case

---

## 📋 Prerequisites

- A [Supabase account](https://supabase.com) (free)
- 15-20 minutes of time

---

## Step 1: Create Supabase Project

### 1.1 Sign Up / Log In

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign in"**
3. Sign up with GitHub, Google, or email

### 1.2 Create New Project

1. Click **"New Project"**
2. Fill in project details:
   - **Name**: `henley-ai-pathfinder` (or your preferred name)
   - **Database Password**: Generate a strong password (save it somewhere safe)
   - **Region**: Choose closest to your users (e.g., `Europe West (London)`)
   - **Pricing Plan**: Select **Free** (includes 500MB database, 50k monthly active users)
3. Click **"Create new project"**
4. Wait 2-3 minutes while Supabase provisions your database

---

## Step 2: Create Database Table

### 2.1 Open SQL Editor

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**

### 2.2 Run Schema SQL

1. Copy the entire contents of `supabase-schema.sql` from this repository
2. Paste into the SQL Editor
3. Click **"Run"** (or press Ctrl/Cmd + Enter)
4. You should see: ✅ **"Success. No rows returned"**

This creates:
- ✅ `participants` table with all required columns
- ✅ Indexes for fast queries
- ✅ Row Level Security (RLS) policies
- ✅ Automatic timestamp updates

### 2.3 Verify Table Creation

1. Click **"Table Editor"** in the left sidebar
2. You should see the `participants` table
3. Click on it to see the schema:
   - `id` (uuid, primary key)
   - `timestamp` (timestamptz)
   - `name`, `organisation`, `role`, `focus_area` (text)
   - `ai_hope`, `ai_stuck`, `ai_tried`, `workshop_success` (text)
   - `summary`, `track`, `readiness` (text)
   - `themes` (jsonb)
   - `created_at`, `updated_at` (timestamptz)

---

## Step 3: Get API Credentials

### 3.1 Find Your Project URL

1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the settings menu
3. Look for **"Project URL"**
   - Example: `https://abcdefghijk.supabase.co`
4. Copy this URL

### 3.2 Find Your Anonymous Key

1. Still in **Settings > API**
2. Scroll down to **"Project API keys"**
3. Look for **"anon"** / **"public"** key
4. Click the copy icon to copy the key
   - This is a long string like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Important:** The `anon` key is safe to use in your frontend code. It only allows operations permitted by your Row Level Security policies.

---

## Step 4: Configure Environment Variables

### 4.1 Local Development

1. In your project root, create a `.env.local` file:

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the placeholder values with your actual credentials from Step 3
3. Save the file

**Note:** `.env.local` is already in `.gitignore` - never commit this file!

### 4.2 Test Locally

```bash
# Restart your dev server to load environment variables
npm run dev
```

Open the browser console and you should see:
- ✅ `"Supabase not configured, saving to localStorage"` → This means env vars not loaded yet
- OR ✅ `"Participant saved to Supabase"` → Success!

If you still see localStorage message after adding `.env.local`, restart the dev server.

---

## Step 5: Deploy to Render

### 5.1 Add Environment Variables to Render

1. Go to your Render dashboard: [https://dashboard.render.com](https://dashboard.render.com)
2. Click on your static site (`henley-ai-pathfinder`)
3. Click **"Environment"** in the left menu
4. Click **"Add Environment Variable"**

Add both variables:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your_anon_key_here` |

5. Click **"Save Changes"**
6. Render will automatically redeploy your site

### 5.2 Verify Deployment

1. Wait for deployment to complete (~2-3 minutes)
2. Visit your deployed site
3. Fill out the intake form completely
4. Open browser console (F12)
5. You should see: ✅ `"Participant saved to Supabase"`

---

## Step 6: Test the Integration

### 6.1 Submit a Test Entry

1. Visit your deployed site: `https://your-app.onrender.com`
2. Complete the intake flow:
   - Welcome screen → Start
   - Fill in basic details
   - Answer all 4 questions
   - Complete the flow
3. Check browser console for `"Participant saved to Supabase"`

### 6.2 View in Supabase

1. Go to your Supabase project
2. Click **"Table Editor"** → **"participants"**
3. You should see your test submission! 🎉

### 6.3 View in Admin Dashboard

1. Go to: `https://your-app.onrender.com/admin`
2. Login with password: `henley2024`
3. You should see your submission in the table
4. Click on it to view details
5. Test CSV export

---

## Step 7: Row Level Security (RLS) Policies

### Current Configuration

The schema creates these RLS policies:

**1. Anonymous Insert Policy** (Form Submissions)
```sql
-- Anyone can INSERT (submit forms)
CREATE POLICY "Allow anonymous inserts" ON participants
  FOR INSERT TO anon WITH CHECK (true);
```

**2. Authenticated Read Policy** (Admin Dashboard)
```sql
-- Only authenticated users can SELECT (view data)
CREATE POLICY "Allow authenticated reads" ON participants
  FOR SELECT TO authenticated USING (true);
```

### Important Notes

- ✅ **Anonymous users CAN submit** forms (INSERT)
- ✅ **Authenticated users CAN view** all data (SELECT)
- ❌ **Anonymous users CANNOT view** data (protected)
- ❌ **No one can UPDATE or DELETE** (not needed)

### Optional: Allow Public Reads

If you want the admin dashboard to work **without** authentication, you can add:

```sql
-- Run this in SQL Editor if you want public read access
CREATE POLICY "Allow public reads" ON participants
  FOR SELECT TO anon USING (true);
```

⚠️ **Warning:** This makes all participant data publicly readable. Only use if you don't have sensitive data.

---

## Step 8: Monitor and Manage Data

### View All Submissions

**Option 1: Supabase Dashboard**
1. Go to **Table Editor** → **participants**
2. Browse, search, and filter data
3. Export to CSV directly from Supabase

**Option 2: Admin Dashboard**
1. Visit `/admin` on your deployed site
2. Login with password
3. Filter by track, readiness
4. Export to CSV

### Database Statistics

**Free Tier Limits:**
- ✅ 500 MB database storage
- ✅ 50,000 monthly active users
- ✅ 2 GB bandwidth
- ✅ 500,000 reads/month
- ✅ 100,000 writes/month

For this workshop app, free tier is more than enough!

### Check Usage

1. In Supabase project, click **"Settings"** → **"Usage"**
2. Monitor database size, API requests, bandwidth
3. Set up email alerts if approaching limits

---

## Troubleshooting

### Issue: "Participant saved to localStorage" (not Supabase)

**Symptoms:**
- Console shows localStorage message instead of Supabase
- Admin dashboard shows no data (even after submissions)

**Solutions:**

1. **Check environment variables are set:**
   ```bash
   # In your terminal
   echo $VITE_SUPABASE_URL
   # Should show your Supabase URL
   ```

2. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check browser console for errors:**
   - Look for Supabase connection errors
   - Check if API keys are correct

4. **Verify .env.local file:**
   - File must be named `.env.local` exactly
   - Must be in project root
   - Must have `VITE_` prefix on variables
   - No spaces around `=` sign

### Issue: "Error: Invalid API key"

**Symptoms:**
- Console shows Supabase error
- Network tab shows 401 Unauthorized

**Solutions:**

1. **Verify anon key is correct:**
   - Go to Supabase **Settings** → **API**
   - Copy the `anon` / `public` key again
   - Update `.env.local` and Render environment variables

2. **Check for extra spaces or quotes:**
   ```bash
   # Wrong:
   VITE_SUPABASE_ANON_KEY="your_key"
   VITE_SUPABASE_ANON_KEY= your_key

   # Correct:
   VITE_SUPABASE_ANON_KEY=your_key
   ```

### Issue: "Row Level Security" errors

**Symptoms:**
- `INSERT` succeeds but `SELECT` fails
- Can submit forms but admin dashboard empty

**Solutions:**

1. **Check RLS policies are created:**
   - Go to **Authentication** → **Policies**
   - Verify `participants` table has policies

2. **Re-run schema SQL:**
   - Open SQL Editor
   - Run `supabase-schema.sql` again

3. **Temporarily disable RLS (testing only):**
   ```sql
   -- In SQL Editor - for debugging only!
   ALTER TABLE participants DISABLE ROW LEVEL SECURITY;
   ```

### Issue: Network/CORS errors

**Symptoms:**
- `Blocked by CORS policy`
- `Network request failed`

**Solutions:**

1. **Check Supabase project is active:**
   - Projects can be paused after inactivity on free tier
   - Visit dashboard to wake it up

2. **Verify project URL is correct:**
   - Must be `https://` (not `http://`)
   - Must end with `.supabase.co`
   - No trailing slash

### Issue: Data not appearing in admin dashboard

**Symptoms:**
- Forms submit successfully
- Supabase Table Editor shows data
- Admin dashboard is empty

**Solutions:**

1. **Check console for errors:**
   - Open DevTools → Console
   - Look for `"Error loading participants"`

2. **Verify RLS policy for SELECT:**
   ```sql
   -- Run in SQL Editor to check policies
   SELECT * FROM pg_policies WHERE tablename = 'participants';
   ```

3. **Check network tab:**
   - Open DevTools → Network
   - Look for Supabase API calls
   - Check response status and data

---

## Advanced: Authentication (Optional)

The current setup allows:
- ✅ Anyone to submit forms (anonymous INSERT)
- ✅ Anyone to view admin dashboard with password (hardcoded)

To add proper authentication:

### Option 1: Supabase Auth

1. Enable email/password auth in Supabase
2. Update `src/lib/auth.ts` to use Supabase auth
3. Replace hardcoded password with Supabase login

### Option 2: SSO / OAuth

1. Configure Google/GitHub OAuth in Supabase
2. Add auth buttons to AdminLogin component
3. Use Supabase session for authentication

See [Supabase Auth Docs](https://supabase.com/docs/guides/auth) for details.

---

## Data Migration

### From localStorage to Supabase

If you have existing data in localStorage:

1. **Export from browser:**
   - Open DevTools → Application → Local Storage
   - Find `henley_participants`
   - Copy the JSON data

2. **Format for Supabase:**
   ```javascript
   // Convert to database format
   const localData = JSON.parse(/* your localStorage data */);
   const dbData = localData.map(p => ({
     id: p.id,
     timestamp: p.timestamp,
     name: p.basicDetails.name,
     organisation: p.basicDetails.organisation,
     role: p.basicDetails.role,
     focus_area: p.basicDetails.focusArea,
     ai_hope: p.answers.aiHope,
     ai_stuck: p.answers.aiStuck,
     ai_tried: p.answers.aiTried,
     workshop_success: p.answers.workshopSuccess,
     summary: p.analysis.summary,
     track: p.analysis.track,
     readiness: p.analysis.readiness,
     themes: p.analysis.themes
   }));
   ```

3. **Insert into Supabase:**
   - Go to **Table Editor** → **participants**
   - Click **"Insert row"** → **"Import from JSON"**
   - Paste formatted data
   - Click **"Save"**

---

## Backup and Export

### Automatic Backups

Supabase automatically backs up your database:
- **Daily backups** (retained for 7 days on free tier)
- **Point-in-time recovery** (available on paid tiers)

### Manual Export

**Option 1: CSV via Admin Dashboard**
1. Visit `/admin`
2. Click **"Export to CSV"** button
3. Save file

**Option 2: SQL Dump from Supabase**
1. Go to **Settings** → **Database**
2. Click **"Connection string"**
3. Use `pg_dump` command:
   ```bash
   pg_dump "postgresql://[connection-string]" > backup.sql
   ```

---

## Cost Estimation

### Free Tier (Sufficient for this project)

| Feature | Limit | Workshop Usage |
|---------|-------|----------------|
| Database | 500 MB | ~50 KB per participant = 10,000 participants |
| Bandwidth | 2 GB | Very low (< 1 GB/month expected) |
| API Requests | 500K reads | More than enough |
| Active Users | 50K MAU | Workshop: ~100-500 expected |

**Conclusion:** Free tier is perfect for this workshop application. You won't need to pay.

### Paid Tiers (If Needed)

If you exceed free tier:
- **Pro**: $25/month - 8 GB database, 50 GB bandwidth
- **Team**: $599/month - 100 GB database, 250 GB bandwidth

---

## Support and Resources

### Supabase Resources

- [Documentation](https://supabase.com/docs)
- [API Reference](https://supabase.com/docs/reference/javascript/introduction)
- [Community Discord](https://discord.supabase.com/)
- [YouTube Tutorials](https://www.youtube.com/c/supabase)

### Project Resources

- [CLAUDE.md](./CLAUDE.md) - Full codebase documentation
- [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) - Deployment guide
- [README.md](./README.md) - Project overview

### Getting Help

1. **Check console logs** - Most issues show clear error messages
2. **Review this guide** - Most solutions are documented above
3. **Supabase dashboard** - Check database, logs, and API usage
4. **GitHub issues** - Report bugs or request features

---

## Next Steps

✅ **You're all set!** Your application now:
- Collects real user submissions
- Stores data in Supabase
- Displays all participants in admin dashboard
- Exports to CSV
- Falls back to localStorage if Supabase unavailable

### Recommended Next Steps

1. **Test thoroughly** - Submit multiple test forms
2. **Set up monitoring** - Check Supabase usage dashboard weekly
3. **Plan data retention** - Decide how long to keep old data
4. **Add analytics** - Track completion rates, drop-offs
5. **Consider authentication** - Add proper admin login with Supabase Auth

---

**Last Updated:** 2025-12-05
**Supabase Version:** v2.86.2
**Application:** Henley AI Pathfinder

For questions or issues, check the troubleshooting section or review Supabase documentation.
