const Note = require('../models/Note');
const { getRequestBody } = require('../utils/parseBody');
const url = require('url');

const handleNotes = async (req, res) => {
  const { pathname } = url.parse(req.url, true);
  const idMatch = pathname.match(/^\/notes\/([a-fA-F0-9]{24})$/);

  try {
    if (req.method === 'GET' && pathname === '/notes') {
      const notes = await Note.find();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(notes));
    }

    else if (req.method === 'POST' && pathname === '/notes') {
      const body = await getRequestBody(req);
      const newNote = new Note(JSON.parse(body));
      const savedNote = await newNote.save();
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(savedNote));
    }

    else if (req.method === 'DELETE' && idMatch) {
      const id = idMatch[1];
      await Note.findByIdAndDelete(id);
      res.writeHead(204);
      res.end();
    }

    else if (req.method === 'PUT' && idMatch) {
      const id = idMatch[1];
      const body = await getRequestBody(req);
      const updated = await Note.findByIdAndUpdate(id, JSON.parse(body), { new: true });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updated));
    }

    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Route not found' }));
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
};

module.exports = handleNotes;
