# Deploying to Railway

## Quick Deploy Steps

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect Node.js and deploy

3. **Add Database (Important!)**
   
   **Option A: Use Railway PostgreSQL (Recommended)**
   - In Railway dashboard, click "New" → "Database" → "Add PostgreSQL"
   - Railway will provide connection string as `DATABASE_URL`
   - Update `api-server.js` to use PostgreSQL (see below)

   **Option B: Use Railway Volume for SQLite**
   - In Railway dashboard, click "New" → "Volume"
   - Mount it to `/data`
   - Update `DB_PATH` in `api-server.js` to `/data/quina.db`

4. **Set Environment Variables** (if needed)
   - In Railway dashboard → Variables
   - Add any custom variables

5. **Get Your URL**
   - Railway will provide a URL like `https://your-app.up.railway.app`
   - Your API will be at: `https://your-app.up.railway.app/api/results`
   - Your HTML page will be at: `https://your-app.up.railway.app/`

### Option 2: Deploy with Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Important Notes

### Database Persistence

**⚠️ Railway uses ephemeral filesystems** - SQLite files will be lost on redeploy!

**Solutions:**

1. **Use Railway PostgreSQL** (Best option)
   - More reliable for production
   - See PostgreSQL setup below

2. **Use Railway Volume** (For SQLite)
   - Create a Volume in Railway dashboard
   - Mount to `/data`
   - Update `DB_PATH` to `/data/quina.db`

3. **Use External Database**
   - Host SQLite on external storage (S3, etc.)
   - Or use Railway PostgreSQL/MySQL

### Updating Your Scraper

Your scraper program needs to connect to the Railway database:

- **If using Railway PostgreSQL**: Use the `DATABASE_URL` connection string
- **If using SQLite Volume**: You'll need to upload the database file or use Railway's file system

## Using PostgreSQL on Railway

If you want to switch to PostgreSQL (recommended for Railway):

1. Add PostgreSQL database in Railway
2. Update `api-server.js` to use PostgreSQL (uncomment PostgreSQL section)
3. Your scraper should insert into PostgreSQL instead of SQLite

## Environment Variables

Railway automatically provides:
- `PORT` - Server port (already handled in code)
- `DATABASE_URL` - If you add PostgreSQL database

## Custom Domain

1. In Railway dashboard → Settings → Domains
2. Add your custom domain
3. Railway will provide DNS settings

## Monitoring

- Check Railway dashboard for logs
- View metrics and usage
- Set up alerts if needed

