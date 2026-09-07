const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const server = http.createServer(app);

// CORS for local Vite dev server and production
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

app.use(cors());
app.use(express.json());

// API Routes

// 1. Initial full state
app.get('/api/init', (req, res) => {
  try {
    const users = db.getUsers();
    const tasks = db.getTasks();
    const rules = db.getRules();
    const sapGuides = db.getSapGuides();
    const logs = db.getLogs();
    res.json({ users, tasks, rules, sapGuides, logs });
  } catch (err) {
    console.error('Init error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Tasks
app.get('/api/tasks', (req, res) => {
  res.json(db.getTasks());
});

app.post('/api/tasks', (req, res) => {
  try {
    const newTask = db.createTask(req.body);
    // Notify via log
    db.createLog({
      content: `Yeni iş eklendi: "${newTask.title}" (Kime: ${newTask.assigned_to})`,
      category: 'material',
      shift: req.body.shift || 'Gündüz Vardiyası',
      created_by: req.body.created_by
    });

    // Broadcast to all connected devices
    io.emit('task_created', { task: newTask, by: req.body.created_by });
    io.emit('tasks_updated', db.getTasks());
    io.emit('logs_updated', db.getLogs());

    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/tasks/:id', (req, res) => {
  try {
    const { status, user } = req.body;
    const updated = db.updateTaskStatus(req.params.id, status, user);
    
    const actionText = status === 'completed' 
      ? `"${updated.title}" görevini tamamladı.` 
      : `"${updated.title}" durumunu "${status}" olarak güncelledi.`;

    db.createLog({
      content: actionText,
      category: status === 'completed' ? 'info' : 'warning',
      shift: req.body.shift || 'Gündüz Vardiyası',
      created_by: user || 'Biri'
    });

    io.emit('task_status_changed', { task: updated, by: user });
    io.emit('tasks_updated', db.getTasks());
    io.emit('logs_updated', db.getLogs());

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    db.deleteTask(req.params.id);
    io.emit('tasks_updated', db.getTasks());
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Rules (Wiki)
app.get('/api/rules', (req, res) => {
  res.json(db.getRules());
});

app.post('/api/rules', (req, res) => {
  try {
    const newRule = db.createRule(req.body);
    db.createLog({
      content: `Yeni depo kuralı eklendi: "${newRule.title}" (${newRule.category})`,
      category: 'warning',
      shift: 'Gündüz Vardiyası',
      created_by: req.body.created_by
    });

    io.emit('rule_created', { rule: newRule, by: req.body.created_by });
    io.emit('rules_updated', db.getRules());
    io.emit('logs_updated', db.getLogs());

    res.status(201).json(newRule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/rules/:id', (req, res) => {
  try {
    db.deleteRule(req.params.id);
    io.emit('rules_updated', db.getRules());
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. SAP Guides
app.get('/api/sap', (req, res) => {
  res.json(db.getSapGuides());
});

app.post('/api/sap', (req, res) => {
  try {
    const newGuide = db.createSapGuide(req.body);
    db.createLog({
      content: `Yeni SAP rehberi eklendi: "${newGuide.tcode} - ${newGuide.title}"`,
      category: 'info',
      shift: 'Gündüz Vardiyası',
      created_by: req.body.created_by
    });

    io.emit('sap_created', { guide: newGuide, by: req.body.created_by });
    io.emit('sap_updated', db.getSapGuides());
    io.emit('logs_updated', db.getLogs());

    res.status(201).json(newGuide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/sap/:id', (req, res) => {
  try {
    db.deleteSapGuide(req.params.id);
    io.emit('sap_updated', db.getSapGuides());
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Logs (Logbook)
app.get('/api/logs', (req, res) => {
  res.json(db.getLogs());
});

app.post('/api/logs', (req, res) => {
  try {
    const newLog = db.createLog(req.body);
    io.emit('log_created', newLog);
    io.emit('logs_updated', db.getLogs());
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Serve frontend build in production
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.use((req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Teknik Depo API Sunucusu Çalışıyor. Frontend build edilince burada görüntülenecektir.');
  }
});

// Socket connection
io.on('connection', (socket) => {
  console.log('Yeni cihaz bağlandı:', socket.id);
  socket.on('disconnect', () => {
    console.log('Cihaz ayrıldı:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`Teknik Depo Sunucusu Başlatıldı!`);
  console.log(`Yerel Adres: http://localhost:${PORT}`);
  console.log(`Port: ${PORT}`);
  console.log(`=========================================`);
});
