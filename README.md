# Quina Auto Getter

A simple static HTML page + API server for displaying Quina lottery results from your PostgreSQL database.

## Quick Start (Local)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database:**
   - Install PostgreSQL locally, or use Railway/other cloud provider
   - Set `DATABASE_URL` environment variable:
     ```bash
     export DATABASE_URL="postgresql://user:password@localhost:5432/quina_db"
     ```

3. **Create database table:**
   ```bash
   node create-table.js
   ```
   Or run `create-table.sql` in your PostgreSQL client

4. **Start server:**
   ```bash
   npm start
   ```

5. **Open:** http://localhost:3000

## Deploy to Railway

### Quick Railway Deploy:

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL Database:**
   - In Railway dashboard, click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically provides `DATABASE_URL` environment variable

4. **Create table:**
   - Go to your PostgreSQL database in Railway
   - Click "Query" tab
   - Run the SQL from `create-table.sql`

5. **Done!** Your site will be live at `https://your-app.up.railway.app`

## Database Structure

```sql
CREATE TABLE quina_results (
    id SERIAL PRIMARY KEY,
    draw_number INTEGER UNIQUE NOT NULL,
    date TEXT NOT NULL,
    numbers TEXT NOT NULL,  -- JSON array: "[23, 41, 46, 58, 66]"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

- `GET /api/results` - Returns JSON with latest and previous results
- `GET /health` - Health check endpoint

Response format:
```json
{
  "latest": {
    "drawNumber": "6907",
    "date": "19th December 2025",
    "numbers": [23, 41, 46, 58, 66]
  },
  "previous": [...],
  "lastUpdated": "2025-12-19T10:30:00.000Z"
}
```

## Files

- `index.html` - Static HTML page
- `api-server.js` - Express API server (reads from PostgreSQL)
- `create-table.js` - Helper script to create database table
- `create-table.sql` - SQL script to create table

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)
- `PORT` - Server port (default: 3000, Railway sets this automatically)

## Notes

- Your scraper program should insert data into the `quina_results` table
- Use `draw_number` (not `drawNumber`) as the column name
- The HTML page auto-refreshes every 5 minutes
- Railway automatically provides `DATABASE_URL` when you add PostgreSQL database
