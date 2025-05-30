const http = require('http');
const connectDB = require('./db');
const handleNotes = require('./routes/notes');

connectDB();

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/notes')) {
    handleNotes(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
