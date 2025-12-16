# Grand Interview - Curator Management System

A production-ready web application for managing interview curators with real-time data synchronization and cross-tab updates.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/grand-interview.git
   cd grand-interview
   ```

2. **Open in browser**
   - Questions Generator: `index.html`
   - Admin Panel: `admin.html`

3. **Start backend (optional)**
   ```bash
   npm install
   node backend-api.js
   ```

## ✨ Features

- ✅ Real-time curator management
- ✅ Cross-tab synchronization
- ✅ Auto-population of curators
- ✅ Export/import data as JSON
- ✅ Admin panel interface
- ✅ Zero external dependencies for frontend
- ✅ Fully responsive design
- ✅ Dark/Light theme support

## 📁 Project Structure

```
├── index.html              # Questions Generator
├── admin.html              # Curator Management
├── curator-db.js           # Database engine
├── curator.js              # Curator data
├── data-storage.js         # Client-side sync
├── backend-api.js          # Express.js API
├── backend-data.js         # Data persistence
├── style.css               # Styling
├── package.json            # Dependencies
└── [Question Bank Files]
    ├── FIB.js, LSPD.js, SAHP.js, etc.
```

## 🎯 How to Use

### Questions Generator (index.html)
1. Open `index.html` in your browser
2. Select an organization from dropdown
3. Curators auto-populate from database
4. Questions organized by category

### Curator Management (admin.html)
1. Open `admin.html` in another browser tab
2. Select an organization
3. Add/Remove curators
4. Changes sync instantly to questions generator
5. Export data for backup or import saved data

## 💾 Data Persistence

- **localStorage**: Primary browser-based storage
- **Backend API**: Optional server-side persistence (requires Node.js)

## 🔧 Curator Database API

```javascript
// Get curators for organization
CuratorDB.getCurators('FIB')

// Add curator
CuratorDB.addCurator('LSPD', 'Officer Name')

// Remove curator
CuratorDB.removeCurator('SAHP', 'Curator Name')

// Export as JSON
const json = CuratorDB.exportToJSON()

// Import from JSON
CuratorDB.importFromJSON(jsonString)

// Get all data
CuratorDB.getAllCurators()

// Reset to defaults
CuratorDB.resetToDefaults()
```

## 🌐 Browser Support

- ✅ Chrome 4+
- ✅ Firefox 3.5+
- ✅ Safari 4+
- ✅ Edge (all versions)
- ✅ IE 8+

## 🚀 Deployment

### Static Hosting (Recommended)
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

### Node.js Hosting (For Backend API)
- Heroku
- DigitalOcean
- AWS EC2
- Any Node.js hosting

### GitHub Pages Setup
1. Push to GitHub
2. Go to Settings → Pages
3. Select `main` branch as source
4. Site will be available at `https://your-username.github.io/grand-interview/`

## 📋 Organizations Supported

- FIB (Federal Investigation Bureau)
- LSPD (Los Santos Police Department)
- SAHP (San Andreas Highway Patrol)
- GOV (Government)
- LI (Life Invader)
- NG (News Station)
- EMS (Emergency Medical Services)

## 🔒 Data Privacy

- ✅ All data stored locally in browser
- ✅ No cloud transmission
- ✅ No external API calls (except optional backend)
- ✅ Completely private and secure

## 📝 Configuration

Edit curator data in `curator.js`:
```javascript
window.CURATORS.FIB = ['Curator1', 'Curator2'];
window.SENIOR_CURATOR = 'Senior Name';
```

## ⚙️ Backend Setup (Optional)

If you want to use the Node.js backend:

```bash
npm install
node backend-api.js
```

Server will run on `http://localhost:3000`

### Backend Endpoints
- `GET /api/questions` - Get all questions
- `POST /api/questions/save` - Save questions
- `GET /api/data` - Get curator data
- `POST /api/data/save` - Save curator data

## 🐛 Troubleshooting

**Q: Curators not syncing between tabs?**
- A: Refresh the page, ensure localStorage is enabled

**Q: Data disappeared?**
- A: Use the Export feature to backup regularly
- Click "Import" to restore from backup

**Q: Backend API not working?**
- A: Ensure Node.js is installed
- Check port 3000 is available
- Run `npm install` first

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Feel free to:
- Fork the repository
- Create a feature branch
- Submit pull requests

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Version:** 1.0  
**Last Updated:** December 16, 2025  
**Status:** Production Ready ✅
