# Deploying Henley AI Pathfinder to Render

This guide walks you through deploying the Henley AI Pathfinder application to Render as a static site.

## Prerequisites

- A [Render account](https://render.com) (free tier available)
- Your code pushed to GitHub repository
- `render.yaml` configuration file (already included)

---

## Deployment Options

### Option 1: Deploy via Render Dashboard (Recommended)

#### Step 1: Create New Static Site

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button
3. Select **"Static Site"**

#### Step 2: Connect Repository

1. Connect your GitHub account (if not already connected)
2. Select the repository: `AndrewGaule/henley-ai-pathfinder`
3. Click **"Connect"**

#### Step 3: Configure Build Settings

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `henley-ai-pathfinder` (or your preferred name) |
| **Branch** | `main` (or your deployment branch) |
| **Root Directory** | Leave empty (uses repository root) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

#### Step 4: Advanced Settings (Optional)

- **Auto-Deploy**: Enable (recommended) - deploys on every push to branch
- **Environment Variables**: None required for this app

#### Step 5: Deploy

1. Click **"Create Static Site"**
2. Render will start building your application
3. Build typically takes 2-5 minutes
4. Once complete, you'll receive a live URL like: `https://henley-ai-pathfinder.onrender.com`

---

### Option 2: Deploy via render.yaml (Infrastructure as Code)

#### Step 1: Create New Blueprint

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button
3. Select **"Blueprint"**

#### Step 2: Connect Repository

1. Connect your GitHub account
2. Select the repository: `AndrewGaule/henley-ai-pathfinder`
3. Render will automatically detect the `render.yaml` file

#### Step 3: Apply Blueprint

1. Review the configuration from `render.yaml`
2. Click **"Apply"**
3. Render will create the static site with all settings pre-configured

---

### Option 3: Deploy via Render CLI

#### Step 1: Install Render CLI

```bash
npm install -g @render/cli
```

#### Step 2: Login to Render

```bash
render login
```

#### Step 3: Deploy

```bash
# From the project root directory
render blueprint launch
```

---

## Configuration Files

### render.yaml

Located at the root of the project, this file defines the infrastructure:

```yaml
services:
  - type: web
    name: henley-ai-pathfinder
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

**Key configurations:**
- **type: web** - Web service
- **env: static** - Static site hosting
- **buildCommand** - Installs dependencies and builds the app
- **staticPublishPath** - Serves files from `dist` folder
- **routes** - Rewrites all routes to `index.html` for React Router SPA support

### public/_redirects

This file ensures all routes are handled by React Router:

```
/* /index.html 200
```

This file is automatically copied to `dist/` during build.

---

## Post-Deployment

### Access Your Application

Once deployed, you'll receive a URL like:
- **Default:** `https://henley-ai-pathfinder.onrender.com`
- **Custom Domain:** Configure in Render Dashboard > Settings > Custom Domains

### Test Your Deployment

1. **Home Page**: Visit the root URL to see the intake flow
2. **Admin Dashboard**: Navigate to `/admin` (password: `henley2024`)
3. **Direct URL Access**: Test direct navigation to `/admin` to verify routing works

### Monitor Your Application

- **Dashboard**: View logs, metrics, and deployment history
- **Logs**: Real-time logs available in Render Dashboard
- **Builds**: Each deployment creates a new build with full history

---

## Automatic Deployments

### Enable Auto-Deploy

In Render Dashboard:
1. Go to your static site settings
2. Enable **"Auto-Deploy"**
3. Select the branch to deploy (e.g., `main`)

Now every push to the selected branch will automatically trigger a new deployment.

### Manual Deployments

Trigger a manual deployment:
1. Go to your static site in Render Dashboard
2. Click **"Manual Deploy"** button
3. Select **"Clear build cache & deploy"** if needed

---

## Environment Variables

### Supabase Configuration (Recommended)

To enable real database storage and collect submissions from all users, configure Supabase:

1. **Set up Supabase** - Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to create your database
2. **Add environment variables** in Render:
   - Go to **Settings** > **Environment**
   - Click **"Add Environment Variable"**
   - Add both variables:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | Your Supabase project URL |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` | Your Supabase anonymous key |

3. **Save and redeploy** - Render will automatically rebuild with new variables

**Without Supabase:**
- App will fall back to localStorage (browser-only storage)
- You won't be able to see submissions from other users
- Admin dashboard only shows data from your own browser

**Important:**
- Vite requires environment variables to be prefixed with `VITE_`
- Never commit `.env` files to git (already in `.gitignore`)
- The `anon` key is safe to expose in frontend (protected by Row Level Security)

---

## Custom Domain

### Add Custom Domain

1. Go to **Settings** > **Custom Domains**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `pathfinder.henley.ac.uk`)
4. Follow DNS configuration instructions:
   - **CNAME record**: Point to your Render URL
   - **A record**: Use Render's IP address

### SSL Certificate

- Render automatically provisions and renews **free SSL certificates**
- HTTPS is enabled by default
- No configuration required

---

## Troubleshooting

### Build Fails

**Check build logs:**
1. Go to your static site dashboard
2. Click on the failed build
3. Review logs for errors

**Common issues:**
- Missing dependencies: Ensure `package.json` is up to date
- Build command errors: Verify `npm run build` works locally
- Node version mismatch: Render uses Node 20 by default

**Fix Node version:**
Add to `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Routes Not Working

**Symptom:** Direct navigation to `/admin` returns 404

**Solution:** Ensure `public/_redirects` exists:
```
/* /index.html 200
```

Or verify `render.yaml` has the routes configuration.

### Blank Page After Deployment

**Check console errors:**
1. Open browser DevTools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed requests

**Common causes:**
- Asset path issues: Vite should use relative paths by default
- Missing environment variables
- Build errors not caught during deployment

**Solution:** Test production build locally:
```bash
npm run build
npm run preview
```

### CSS Not Loading

Verify `index.html` is loading CSS files from correct paths in the built `dist/` folder.

---

## Performance Optimization

### Build Optimization

Render automatically:
- ✅ Serves compressed assets (gzip/brotli)
- ✅ Sets proper cache headers
- ✅ Serves static files from global CDN

### Additional Optimizations

1. **Enable Caching**: Render automatically caches static assets
2. **Minification**: Vite already minifies JS/CSS during build
3. **Image Optimization**: Consider using Render's image optimization (paid feature)

---

## Cost

### Free Tier

Render's free tier for static sites includes:
- ✅ Unlimited bandwidth
- ✅ Global CDN
- ✅ Automatic SSL
- ✅ Custom domains
- ❌ No custom build minutes limit

**Note:** Free tier sites may spin down after 15 minutes of inactivity and take a few seconds to restart.

### Paid Tiers

For production applications:
- **Starter**: $7/month - No spin down, priority support
- **Standard**: $25/month - Advanced features, higher priority

---

## Maintenance

### Update Dependencies

```bash
# Update packages
npm update

# Commit changes
git add package.json package-lock.json
git commit -m "chore: update dependencies"
git push

# Render will auto-deploy if enabled
```

### Rollback Deployment

If a deployment breaks your site:
1. Go to **Deploys** tab
2. Find a previous successful deployment
3. Click **"Rollback to this version"**

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Static Sites Guide](https://render.com/docs/static-sites)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deploying)

---

## Support

**Render Support:**
- [Community Forum](https://community.render.com/)
- [Support Portal](https://render.com/support)

**Project Issues:**
- [GitHub Issues](https://github.com/AndrewGaule/henley-ai-pathfinder/issues)

---

**Last Updated:** 2025-12-05
**Deployment Method:** Static Site
**Render Service Type:** Web (Static)
