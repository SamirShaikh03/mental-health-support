const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import the chat handler
const chatHandler = require('./pages/api/chat.js');

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  // Simulate Vercel's request/response format
  const mockReq = {
    method: 'POST',
    body: req.body
  };
  
  const mockRes = {
    status: (code) => ({
      json: (data) => res.status(code).json(data),
      send: (data) => res.status(code).send(data),
      end: () => res.status(code).end()
    }),
    setHeader: (name, value) => res.setHeader(name, value)
  };
  
  try {
  await chatHandler(mockReq, mockRes);
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal server error', source: 'fallback' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Chat API server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Chat API server running on http://localhost:${PORT}`);
  console.log(`📡 Chat endpoint: http://localhost:${PORT}/api/chat`);
});