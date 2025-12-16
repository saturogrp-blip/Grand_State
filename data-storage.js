/**
 * Real-Time Data Storage System
 * Provides persistent storage, real-time sync, and data management
 */

class DataStorage {
  constructor() {
    this.storageKey = 'grandInterviewData';
    this.watchers = new Map();
    this.syncTimeout = null;
    this.lastSavedData = null;
    this.initializeStorage();
    this.setupAutoSave();
    this.setupCrosTabSync();
    console.log('✅ DataStorage initialized - Real-time sync enabled');
  }

  /**
   * Initialize storage with default structure
   */
  initializeStorage() {
    const existingData = this.getAllData();
    
    if (!existingData || Object.keys(existingData).length === 0) {
      const defaultData = {
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
      this.saveAllData(defaultData);
    }
  }

  /**
   * Get all stored data
   */
  getAllData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading storage:', error);
      return null;
    }
  }

  /**
   * Save all data to storage
   */
  saveAllData(data) {
    try {
      data.metadata.lastModified = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      this.notifyWatchers('all', data);
      this.scheduleSyncToFile();
      return true;
    } catch (error) {
      console.error('Error saving storage:', error);
      return false;
    }
  }

  /**
   * Get specific section of data
   */
  getSection(section) {
    const data = this.getAllData();
    return data ? data[section] || null : null;
  }

  /**
   * Update specific section
   */
  setSection(section, value) {
    const data = this.getAllData();
    if (data) {
      data[section] = value;
      this.saveAllData(data);
      return true;
    }
    return false;
  }

  /**
   * Add or update a curator
   */
  addCurator(org, curatorName, metadata = {}) {
    const data = this.getAllData();
    const curatorId = `${org}_${Date.now()}`;
    
    data.curators[curatorId] = {
      id: curatorId,
      name: curatorName,
      organization: org,
      createdAt: new Date().toISOString(),
      ...metadata
    };

    if (data.organizations[org]) {
      if (!data.organizations[org].curators.includes(curatorId)) {
        data.organizations[org].curators.push(curatorId);
      }
    }

    this.saveAllData(data);
    return data.curators[curatorId];
  }

  /**
   * Remove a curator
   */
  removeCurator(curatorId) {
    const data = this.getAllData();
    const curator = data.curators[curatorId];
    
    if (curator) {
      const org = curator.organization;
      if (data.organizations[org]) {
        data.organizations[org].curators = 
          data.organizations[org].curators.filter(id => id !== curatorId);
      }
      delete data.curators[curatorId];
      this.saveAllData(data);
      return true;
    }
    return false;
  }

  /**
   * Get curators by organization
   */
  getCuratorsByOrg(org) {
    const data = this.getAllData();
    const orgData = data.organizations[org];
    
    if (!orgData) return [];
    
    return orgData.curators
      .map(id => data.curators[id])
      .filter(curator => curator)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Update curator
   */
  updateCurator(curatorId, updates) {
    const data = this.getAllData();
    if (data.curators[curatorId]) {
      data.curators[curatorId] = {
        ...data.curators[curatorId],
        ...updates,
        id: curatorId
      };
      this.saveAllData(data);
      return data.curators[curatorId];
    }
    return null;
  }

  /**
   * Watch for changes to a section
   */
  watch(section, callback) {
    if (!this.watchers.has(section)) {
      this.watchers.set(section, []);
    }
    this.watchers.get(section).push(callback);
    
    // Return unwatch function
    return () => {
      const callbacks = this.watchers.get(section);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify all watchers of changes
   */
  notifyWatchers(section, data) {
    if (this.watchers.has(section)) {
      this.watchers.get(section).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in watcher callback:', error);
        }
      });
    }

    // Also notify 'all' watchers
    if (section !== 'all' && this.watchers.has('all')) {
      this.watchers.get('all').forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in watcher callback:', error);
        }
      });
    }
  }

  /**
   * Set up auto-save to file system (server-side)
   */
  setupAutoSave() {
    // Save every 5 seconds if data changed
    setInterval(() => {
      const data = this.getAllData();
      if (data && this.lastSavedData !== JSON.stringify(data)) {
        this.saveToServer(data);
        this.lastSavedData = JSON.stringify(data);
      }
    }, 5000); // Save every 5 seconds
  }

  /**
   * Schedule sync to file
   */
  scheduleSyncToFile() {
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }
    this.syncTimeout = setTimeout(() => {
      const data = this.getAllData();
      if (data) {
        this.saveToServer(data);
        this.lastSavedData = JSON.stringify(data);
      }
    }, 1000); // Save immediately after 1 second
  }

  /**
   * Save data to server
   */
  async saveToServer(data) {
    try {
      const dataSize = JSON.stringify(data).length;
      console.log(`📤 Sending data to server (${dataSize} bytes)...`);
      
      // Try server endpoint first
      const response = await fetch('http://localhost:3001/api/data/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Data synced to server:', result);
        return true;
      } else {
        console.error('❌ Server returned error:', response.status, response.statusText);
        const error = await response.text();
        console.error('Response:', error);
        return false;
      }
    } catch (error) {
      // Server not available, continue with localStorage
      console.error('⚠️ Server sync failed:', error.message);
      console.log('ℹ️ Using localStorage only (server not available)');
    }
    return false;
  }

  /**
   * Load data from server
   */
  async loadFromServer() {
    try {
      const response = await fetch('/api/data/load');
      if (response.ok) {
        const data = await response.json();
        this.saveAllData(data);
        return data;
      }
    } catch (error) {
      console.warn('Could not load from server (offline mode):', error);
    }
    return null;
  }

  /**
   * Setup cross-tab synchronization
   */
  setupCrosTabSync() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey) {
        const newData = JSON.parse(event.newValue);
        this.notifyWatchers('all', newData);
      }
    });
  }

  /**
   * Export data as JSON file
   */
  exportData() {
    const data = this.getAllData();
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curator-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Import data from JSON file
   */
  async importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          this.saveAllData(data);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  /**
   * Clear all data
   */
  clearAllData() {
    if (confirm('Are you sure? This will delete all curator data.')) {
      localStorage.removeItem(this.storageKey);
      this.initializeStorage();
      return true;
    }
    return false;
  }

  /**
   * Add a question
   */
  addQuestion(title, content, organization = '', metadata = {}) {
    const data = this.getAllData();
    const id = 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    data.questions[id] = {
      id,
      title,
      content,
      organization,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...metadata
    };
    
    this.saveAllData(data);
    this.notifyWatchers('questions', data.questions);
    console.log('✅ Question added:', id);
    return id;
  }

  /**
   * Get all questions
   */
  getAllQuestions() {
    const data = this.getAllData();
    return data.questions || {};
  }

  /**
   * Get questions by organization
   */
  getQuestionsByOrg(org) {
    const questions = this.getAllQuestions();
    return Object.values(questions)
      .filter(q => q.organization === org)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  /**
   * Get a specific question
   */
  getQuestion(id) {
    const questions = this.getAllQuestions();
    return questions[id] || null;
  }

  /**
   * Update a question
   */
  updateQuestion(id, updates) {
    const data = this.getAllData();
    if (data.questions[id]) {
      data.questions[id] = {
        ...data.questions[id],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveAllData(data);
      this.notifyWatchers('questions', data.questions);
      console.log('✅ Question updated:', id);
      return true;
    }
    return false;
  }

  /**
   * Remove a question
   */
  removeQuestion(id) {
    const data = this.getAllData();
    if (data.questions[id]) {
      delete data.questions[id];
      this.saveAllData(data);
      this.notifyWatchers('questions', data.questions);
      console.log('✅ Question removed:', id);
      return true;
    }
    return false;
  }

  /**
   * Get storage stats
   */
  getStats() {
    const data = this.getAllData();
    return {
      totalCurators: Object.keys(data.curators).length,
      totalQuestions: Object.keys(data.questions).length,
      organizations: Object.keys(data.organizations).length,
      storageUsed: new Blob([JSON.stringify(data)]).size,
      lastModified: data.metadata.lastModified
    };
  }
}

// Create global instance
const dataStorage = new DataStorage();
