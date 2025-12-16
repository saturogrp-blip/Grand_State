# Curator Management System

## Quick Start

1. **Start the server:**
   ```bash
   npm install
   node backend-api.js
   ```

2. **Open in browser:**
   - Tab 1: `admin.html` (manage curators)
   - Tab 2: `index.html` (questions generator)

3. **Add a curator in admin.html and watch it sync to index.html instantly!**

## Features

- ✅ Real-time data sync across browser tabs
- ✅ Automatic curator population
- ✅ Export/import curator data
- ✅ Zero dependencies (pure JavaScript)

## Project Files

### Core System
- **curator-db.js** - Database engine
- **curator.js** - Legacy data
- **backend-api.js** - API server
- **backend-data.js** - Data layer
- **data-storage.js** - Client-side sync
- **admin.html** - Management panel
- **index.html** - Questions generator
- **style.css** - Styling

## Data Storage

Data is automatically saved to:
- **localStorage** (client-side)
- **Server file** (via backend-api.js)

## Troubleshooting

- **Curators not syncing?** → Refresh the page
- **Server won't start?** → Check port 3001 is available  
- **Browser issue?** → Open dev console (F12) for error details
