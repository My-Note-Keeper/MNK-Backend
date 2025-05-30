const http = require('http');
const connectDB = require('./db');
const handleNotes = require('./routes/notes');
const cors = require('cors');
const url = require('url');

connectDB();

// CORS middleware function
const corsMiddleware = (req, res) => {
  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
  res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true; // Indicates that the request has been handled
  }
  return false; // Continue with normal request handling
};

const server = http.createServer((req, res) => {
  // Apply CORS middleware
  if (corsMiddleware(req, res)) return;
  
  if (req.url.startsWith('/notes')) {
    handleNotes(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
