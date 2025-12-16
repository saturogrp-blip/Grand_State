/**
 * Curator Database System
 * Manages curators for organizations with real-time localStorage persistence
 * and cross-tab synchronization
 */

(function() {
  const DB_KEY = 'curators_database_v2';
  const ORGS = ['FIB', 'LSPD', 'SAHP', 'GOV', 'LI', 'NG', 'EMS'];

  // Default curator configuration
  const DEFAULT_DATA = {
    curators: {
      FIB: ['Sleazy', 'Nikkie', 'Moe', 'Onur', 'Saturo'],
      LSPD: ['Donte', 'Mahmut', 'Saturo'],
      SAHP: ['Lilith', 'Donte', 'Nikkie', 'Trashley'],
      GOV: ['Lilith', 'Vanilla'],
      LI: ['Vanilla', 'Markus', 'Siven'],
      NG: ['James', 'Mego'],
      EMS: ['James', 'Mego', 'Nikkie']
    },
    seniorCurator: 'Zaid Pluxury',
    lastModified: new Date().toISOString()
  };

  /**
   * Get all curator data
   */
  function getData() {
    try {
      const stored = localStorage.getItem(DB_KEY);
      return stored ? JSON.parse(stored) : structuredClone(DEFAULT_DATA);
    } catch (e) {
      console.error('Failed to load curator data:', e);
      return structuredClone(DEFAULT_DATA);
    }
  }

  /**
   * Save curator data to localStorage
   */
  function setData(data) {
    try {
      data.lastModified = new Date().toISOString();
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      // Trigger custom event for cross-tab sync
      window.dispatchEvent(new CustomEvent('curatorDbChanged', { detail: data }));
      return true;
    } catch (e) {
      console.error('Failed to save curator data:', e);
      return false;
    }
  }

  /**
   * Get curators for a specific organization
   */
  function getCurators(org) {
    const data = getData();
    return (data.curators[org] || []).slice();
  }

  /**
   * Set curators for a specific organization
   */
  function setCurators(org, curatorList) {
    if (!ORGS.includes(org)) {
      console.warn(`Invalid organization: ${org}`);
      return false;
    }
    const data = getData();
    data.curators[org] = curatorList.filter(c => c && typeof c === 'string').map(c => c.trim());
    return setData(data);
  }

  /**
   * Add a single curator to an organization
   */
  function addCurator(org, name) {
    const trimmed = (name || '').trim();
    if (!trimmed) return false;
    if (!ORGS.includes(org)) {
      console.warn(`Invalid organization: ${org}`);
      return false;
    }

    const data = getData();
    if (!data.curators[org]) data.curators[org] = [];

    // Prevent duplicates (case-insensitive)
    if (data.curators[org].some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }

    data.curators[org].push(trimmed);
    return setData(data);
  }

  /**
   * Remove a curator from an organization
   */
  function removeCurator(org, name) {
    const trimmed = (name || '').trim();
    if (!trimmed) return false;
    if (!ORGS.includes(org)) {
      console.warn(`Invalid organization: ${org}`);
      return false;
    }

    const data = getData();
    if (!data.curators[org]) return false;

    const idx = data.curators[org].findIndex(c => c.toLowerCase() === trimmed.toLowerCase());
    if (idx === -1) return false;

    data.curators[org].splice(idx, 1);
    return setData(data);
  }

  /**
   * Get senior curator
   */
  function getSeniorCurator() {
    const data = getData();
    return data.seniorCurator || 'Zaid Pluxury';
  }

  /**
   * Set senior curator
   */
  function setSeniorCurator(name) {
    const trimmed = (name || '').trim();
    if (!trimmed) return false;

    const data = getData();
    data.seniorCurator = trimmed;
    return setData(data);
  }

  /**
   * Get all organizations with their curators
   */
  function getAllCurators() {
    const data = getData();
    return {
      curators: data.curators,
      seniorCurator: data.seniorCurator,
      lastModified: data.lastModified
    };
  }

  /**
   * Reset to default curators
   */
  function resetToDefaults() {
    return setData(structuredClone(DEFAULT_DATA));
  }

  /**
   * Export curator data as JSON
   */
  function exportToJSON() {
    return JSON.stringify(getAllCurators(), null, 2);
  }

  /**
   * Import curator data from JSON
   */
  function importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.curators || typeof data.curators !== 'object') {
        throw new Error('Invalid curator data structure');
      }
      // Validate each org
      for (const org of ORGS) {
        if (data.curators[org] && !Array.isArray(data.curators[org])) {
          data.curators[org] = [];
        }
      }
      if (!data.seniorCurator) {
        data.seniorCurator = 'Zaid Pluxury';
      }
      return setData(data);
    } catch (e) {
      console.error('Failed to import curator data:', e);
      return false;
    }
  }

  /**
   * Get database statistics
   */
  function getStats() {
    const data = getData();
    let totalCurators = 0;
    const stats = {};
    for (const org of ORGS) {
      const count = (data.curators[org] || []).length;
      stats[org] = count;
      totalCurators += count;
    }
    return {
      totalCurators,
      perOrg: stats,
      seniorCurator: data.seniorCurator,
      lastModified: data.lastModified
    };
  }

  // Expose API globally
  window.CuratorDB = {
    getData,
    setData,
    getCurators,
    setCurators,
    addCurator,
    removeCurator,
    getSeniorCurator,
    setSeniorCurator,
    getAllCurators,
    resetToDefaults,
    exportToJSON,
    importFromJSON,
    getStats,
    ORGS
  };

  console.log('✓ Curator Database loaded');
})();
