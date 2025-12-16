/**
 * Enhanced Backend API with Real-Time Data Storage
 * Adds data persistence, backup, and synchronization endpoints
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.'));

// Data storage file
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'curator-data.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Initialize default data structure
 */
function getDefaultData() {
  return {
    curators: {},
    organizations: {
      'EMS': { name: 'EMS', curators: [] },
      'FIB': { name: 'FIB', curators: [] },
      'GOV': { name: 'GOV', curators: [] },
      'LI': { name: 'LI', curators: [] },
      'LSPD': { name: 'LSPD', curators: [] },
      'NG': { name: 'NG', curators: [] },
      'SAHP': { name: 'SAHP', curators: [] }
    },
    questions: {},
    metadata: {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
  };
}

/**
 * Load data from file
 */
function loadData() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return getDefaultData();
}

/**
 * Save data to file
 */
function saveData(data) {
  try {
    data.metadata.lastModified = new Date().toISOString();
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
}

/**
 * Create backup
 */
function createBackup(data) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const backupDir = path.join(dataDir, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupFile = path.join(backupDir, `backup-${timestamp}-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf8');
    return backupFile;
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
}

// ============ API Endpoints ============

/**
 * GET /api/data
 * Retrieve all data
 */
app.get('/api/data', (req, res) => {
  const data = loadData();
  res.json(data);
});

/**
 * POST /api/data/save
 * Save data to persistent storage
 */
app.post('/api/data/save', (req, res) => {
  try {
    const data = req.body;
    
    console.log('📝 Saving data to disk...', {
      curators: Object.keys(data.curators || {}).length,
      timestamp: new Date().toISOString()
    });
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Create automatic backup before saving
    createBackup(data);
    
    // Save to file with proper error handling
    const success = saveData(data);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Data saved successfully',
        timestamp: new Date().toISOString(),
        dataPoints: {
          curators: Object.keys(data.curators || {}).length
        }
      });
      console.log('✅ Data saved successfully');
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Error saving data' 
      });
    }
  } catch (error) {
    console.error('❌ Error in /api/data/save:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * GET /api/data/load
 * Load data from persistent storage
 */
app.get('/api/data/load', (req, res) => {
  try {
    const data = loadData();
    res.json(data);
  } catch (error) {
    console.error('Error loading data:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * GET /api/data/stats
 * Get storage statistics
 */
app.get('/api/data/stats', (req, res) => {
  try {
    const data = loadData();
    const stats = fs.statSync(dataFile);
    
    res.json({
      totalCurators: Object.keys(data.curators).length,
      organizations: Object.keys(data.organizations).length,
      storageSize: stats.size,
      lastModified: stats.mtime.toISOString(),
      dataPoints: {
        curators: Object.keys(data.curators).length,
        questions: Object.keys(data.questions).length
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * POST /api/curators
 * Add new curator
 */
app.post('/api/curators', (req, res) => {
  try {
    const { org, name, metadata } = req.body;
    const data = loadData();
    
    const curatorId = `${org}_${Date.now()}`;
    
    data.curators[curatorId] = {
      id: curatorId,
      name,
      organization: org,
      createdAt: new Date().toISOString(),
      ...metadata
    };

    if (data.organizations[org]) {
      if (!data.organizations[org].curators.includes(curatorId)) {
        data.organizations[org].curators.push(curatorId);
      }
    }

    saveData(data);
    
    res.json({
      success: true,
      curator: data.curators[curatorId]
    });
  } catch (error) {
    console.error('Error adding curator:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * GET /api/curators/:org
 * Get curators by organization
 */
app.get('/api/curators/:org', (req, res) => {
  try {
    const { org } = req.params;
    const data = loadData();
    const orgData = data.organizations[org];
    
    if (!orgData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Organization not found' 
      });
    }
    
    const curators = orgData.curators
      .map(id => data.curators[id])
      .filter(curator => curator)
      .sort((a, b) => a.name.localeCompare(b.name));
    
    res.json(curators);
  } catch (error) {
    console.error('Error getting curators:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * DELETE /api/curators/:curatorId
 * Delete a curator
 */
app.delete('/api/curators/:curatorId', (req, res) => {
  try {
    const { curatorId } = req.params;
    const data = loadData();
    const curator = data.curators[curatorId];
    
    if (!curator) {
      return res.status(404).json({ 
        success: false, 
        message: 'Curator not found' 
      });
    }

    const org = curator.organization;
    if (data.organizations[org]) {
      data.organizations[org].curators = 
        data.organizations[org].curators.filter(id => id !== curatorId);
    }
    
    delete data.curators[curatorId];
    saveData(data);
    
    res.json({ 
      success: true, 
      message: 'Curator deleted' 
    });
  } catch (error) {
    console.error('Error deleting curator:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * GET /api/backups
 * List available backups
 */
app.get('/api/backups', (req, res) => {
  try {
    const backupDir = path.join(dataDir, 'backups');
    
    if (!fs.existsSync(backupDir)) {
      return res.json([]);
    }

    const backups = fs.readdirSync(backupDir)
      .map(filename => {
        const filepath = path.join(backupDir, filename);
        const stats = fs.statSync(filepath);
        return {
          filename,
          size: stats.size,
          createdAt: stats.mtime.toISOString()
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(backups);
  } catch (error) {
    console.error('Error listing backups:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * POST /api/export
 * Export all data
 */
app.post('/api/export', (req, res) => {
  try {
    const data = loadData();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="curator-export-${Date.now()}.json"`);
    res.send(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║  🚀 Grand Interview Backend - Real-Time Data Storage         ║
    ║  Server running at http://localhost:${PORT}                  ║
    ║  📊 API Endpoints:                                           ║
    ║     GET    /api/data              - Get all data             ║
    ║     POST   /api/data/save         - Save data               ║
    ║     GET    /api/data/stats        - Get stats               ║
    ║     POST   /api/curators          - Add curator             ║
    ║     GET    /api/curators/:org     - Get org curators        ║
    ║     DELETE /api/curators/:id      - Delete curator          ║
    ║     GET    /api/backups           - List backups            ║
    ║     POST   /api/export            - Export data             ║
    ║                                                              ║
    ║  📁 Data Location: ${dataFile}                  ║
    ║  💾 Backups: ${path.join(dataDir, 'backups')}                    ║
    ╚══════════════════════════════════════════════════════════════╝
  `);
});
