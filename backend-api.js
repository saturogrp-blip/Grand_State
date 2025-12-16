/**
 * Grand Interview Backend API
 * Simple Express.js server for managing questions in real-time
 * 
 * Usage:
 * 1. Install dependencies: npm install express cors body-parser
 * 2. Run: node backend-api.js
 * 3. Server runs on http://localhost:3000
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database file
const DB_FILE = path.join(__dirname, 'questions-db.json');

// Initialize database file if it doesn't exist
function initializeDB() {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      questions: {
        mandatory: [
          "Why do you want to be Leader of this Organisation?",
          "What is the minimum term of leadership required to avoid removal from the post?",
          "What happens if the leader leaves their post without serious reason?",
          "Is a leader allowed to use the organization's warehouse for personal purposes?",
          "Does a leader have the right to take a 24-hour faction freeze upon appointment?",
          "How many 9th-rank deputies can the leader of state organizations have?",
          "Does a leader have the right to dismiss employees if they lose confidence in them, with/without curator approval?",
          "How long of a freeze can a leader take once per term with senior curator approval?",
          "How often must a leader host a global event?",
          "What are your responsibilites as a leader?",
          "Is there any OOC responsibilites you need to follow?",
          "As a leader of an organizations are you prohibited from any OOC rules?"
        ],
        FIB: ["Sample FIB Question 1", "Sample FIB Question 2"],
        LSPD: ["Sample LSPD Question 1", "Sample LSPD Question 2"],
        SAHP: ["Sample SAHP Question 1", "Sample SAHP Question 2"],
        GOV: ["Sample GOV Question 1", "Sample GOV Question 2"],
        LI: ["Sample LI Question 1", "Sample LI Question 2"],
        NG: ["Sample NG Question 1", "Sample NG Question 2"],
        EMS: ["Sample EMS Question 1", "Sample EMS Question 2"]
      },
      lastModified: new Date().toISOString()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
  }
}

// Read database
function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading database:', e);
    return { questions: {}, lastModified: new Date().toISOString() };
  }
}

// Write database
function writeDB(data) {
  try {
    data.lastModified = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (e) {
    console.error('Error writing database:', e);
    return false;
  }
}

// Routes

/**
 * GET /api/questions/:category
 * Get all questions for a category
 */
app.get('/api/questions/:category', (req, res) => {
  try {
    const db = readDB();
    const category = req.params.category;
    const questions = db.questions[category] || [];
    
    res.json({
      success: true,
      category: category,
      questions: questions,
      count: questions.length,
      lastModified: db.lastModified
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/**
 * GET /api/questions
 * Get all questions and categories
 */
app.get('/api/questions', (req, res) => {
  try {
    const db = readDB();
    res.json({
      success: true,
      data: db.questions,
      lastModified: db.lastModified
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/**
 * POST /api/questions/:category
 * Add a new question to a category
 */
app.post('/api/questions/:category', (req, res) => {
  try {
    const db = readDB();
    const category = req.params.category;
    const { question } = req.body;
    
    if (!question || !question.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Question text is required' 
      });
    }
    
    if (!db.questions[category]) {
      db.questions[category] = [];
    }
    
    // Prevent duplicates
    if (db.questions[category].includes(question.trim())) {
      return res.status(400).json({ 
        success: false, 
        error: 'Question already exists' 
      });
    }
    
    db.questions[category].push(question.trim());
    
    if (writeDB(db)) {
      res.json({
        success: true,
        message: 'Question added successfully',
        questions: db.questions[category]
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to save question' });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/**
 * PUT /api/questions/:category/:index
 * Edit a question at specific index
 */
app.put('/api/questions/:category/:index', (req, res) => {
  try {
    const db = readDB();
    const category = req.params.category;
    const index = parseInt(req.params.index);
    const { question } = req.body;
    
    if (!question || !question.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Question text is required' 
      });
    }
    
    if (!db.questions[category] || !db.questions[category][index]) {
      return res.status(404).json({ 
        success: false, 
        error: 'Question not found' 
      });
    }
    
    db.questions[category][index] = question.trim();
    
    if (writeDB(db)) {
      res.json({
        success: true,
        message: 'Question updated successfully',
        questions: db.questions[category]
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update question' });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/**
 * DELETE /api/questions/:category/:index
 * Delete a question at specific index
 */
app.delete('/api/questions/:category/:index', (req, res) => {
  try {
    const db = readDB();
    const category = req.params.category;
    const index = parseInt(req.params.index);
    
    if (!db.questions[category] || !db.questions[category][index]) {
      return res.status(404).json({ 
        success: false, 
        error: 'Question not found' 
      });
    }
    
    const deleted = db.questions[category][index];
    db.questions[category].splice(index, 1);
    
    if (writeDB(db)) {
      res.json({
        success: true,
        message: 'Question deleted successfully',
        deleted: deleted,
        questions: db.questions[category]
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to delete question' });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Grand Interview Backend API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/export
 * Export all questions as JSON
 */
app.post('/api/export', (req, res) => {
  try {
    const db = readDB();
    res.json({
      success: true,
      data: db
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/**
 * POST /api/import
 * Import questions from JSON
 */
app.post('/api/import', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !data.questions) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid data format' 
      });
    }
    
    if (writeDB(data)) {
      res.json({
        success: true,
        message: 'Questions imported successfully'
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to import questions' });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/**
 * POST /api/reset
 * Reset to default questions
 */
app.post('/api/reset', (req, res) => {
  try {
    initializeDB();
    const db = readDB();
    res.json({
      success: true,
      message: 'Questions reset to defaults',
      data: db
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Initialize and start server
initializeDB();

app.listen(PORT, () => {
  console.log(`✓ Grand Interview Backend API running on http://localhost:${PORT}`);
  console.log(`✓ Database file: ${DB_FILE}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET    /api/questions');
  console.log('  GET    /api/questions/:category');
  console.log('  POST   /api/questions/:category');
  console.log('  PUT    /api/questions/:category/:index');
  console.log('  DELETE /api/questions/:category/:index');
  console.log('  GET    /api/health');
  console.log('  POST   /api/export');
  console.log('  POST   /api/import');
  console.log('  POST   /api/reset');
  console.log('');
});

module.exports = app;
