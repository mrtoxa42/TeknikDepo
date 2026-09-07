const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/cards', (req, res) => {
  try {
    res.json(db.getCards());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cards', (req, res) => {
  try {
    const card = db.createCard(req.body);
    io.emit('card_created', { card, by: req.body.created_by });
    io.emit('cards_updated', db.getCards());
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/cards/:id/col', (req, res) => {
  try {
    const { board_col, user } = req.body;
    const card = db.updateCardCol(req.params.id, board_col, user);
    io.emit('card_moved', { card, by: user, to: board_col });
    io.emit('cards_updated', db.getCards());
    res.json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/cards/:id', (req, res) => {
  try {
    const card = db.updateCard(req.params.id, req.body);
    io.emit('cards_updated', db.getCards());
    res.json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/cards/:id', (req, res) => {
  try {
    db.deleteCard(req.params.id);
    io.emit('cards_updated', db.getCards());
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Serve frontend build
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.use((req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Teknik Depo API Sunucusu Çalışıyor.');
  }
});

io.on('connection', (socket) => {
  console.log('Cihaz bağlandı:', socket.id);
  socket.on('disconnect', () => {
    console.log('Cihaz ayrıldı:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Teknik Depo Panosu Port ${PORT} üzerinde hazır!`);
});
