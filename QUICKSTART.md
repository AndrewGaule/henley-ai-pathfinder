# Quick Start Guide

## Prerequisites

Make sure you have Node.js installed (v18 or higher). Check with:
```bash
node --version
```

## One-Time Setup

Run the setup script to install dependencies:
```bash
./setup.sh
```

Or manually:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Create .env file
cp .env.example .env
```

## Running the Application

You need to start TWO servers in SEPARATE terminal windows/tabs:

### Terminal 1: Start the Backend

```bash
./start-backend.sh
```

Or manually:
```bash
cd server
npm run dev
```

You should see:
```
🚀 Survey API server running on http://localhost:3001
📊 Health check: http://localhost:3001/api/health
```

### Terminal 2: Start the Frontend

Open a NEW terminal and run:
```bash
./start-frontend.sh
```

Or manually:
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## Accessing the Application

Once both servers are running:

- **Survey App**: http://localhost:5173
  - Choose "Pre-Workshop Survey" or "Post-Workshop Survey"
  - Fill out the form and submit

- **Admin Dashboard**: http://localhost:5173/admin
  - Login credentials: `admin` / `admin`
  - View survey responses
  - Export data to CSV
  - See statistics

## Testing the Backend

To verify the backend is running:
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-01-13T..."}
```

## Common Issues

### Port Already in Use

If you get "port already in use" errors:

**Backend (port 3001):**
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
```

**Frontend (port 5173):**
```bash
# Find and kill the process
lsof -ti:5173 | xargs kill -9
```

### Dependencies Not Installed

If you see "module not found" errors:
```bash
# Reinstall frontend dependencies
npm install

# Reinstall backend dependencies
cd server && npm install && cd ..
```

### Database Errors

If you see database errors:
```bash
# Ensure data directory exists
mkdir -p server/data

# The database file will be created automatically on first run
```

## Stopping the Servers

Press `Ctrl+C` in each terminal window to stop the servers.

## Next Steps

- Customize survey questions in `src/data/surveys.ts`
- Modify styling in the component files
- Update admin credentials in `src/lib/auth.ts`
- Deploy to production (see README.md)

## Need Help?

Check the full README.md for detailed documentation and API endpoints.
