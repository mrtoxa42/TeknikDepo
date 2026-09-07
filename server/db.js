const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'teknik_depo.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for concurrency
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'Teknik Depo',
      color TEXT DEFAULT 'blue',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priority TEXT DEFAULT 'normal', -- urgent, normal, low
      status TEXT DEFAULT 'pending', -- pending, in_progress, completed
      assigned_to TEXT DEFAULT 'Hepsi',
      created_by TEXT NOT NULL,
      completed_by TEXT,
      due_date TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL, -- Sac & Metal, Rulman & Kayış, Hırdavat, Yağ & Kimyasal, Genel
      importance TEXT DEFAULT 'high', -- critical, high, normal
      created_by TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sap_guides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tcode TEXT NOT NULL,
      title TEXT NOT NULL,
      movement_type TEXT DEFAULT '',
      steps TEXT NOT NULL,
      tips TEXT DEFAULT '',
      created_by TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'info', -- info, warning, malfunction, material
      shift TEXT DEFAULT 'Gündüz Vardiyası',
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed Users if not exists
  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare('INSERT INTO users (name, role, color) VALUES (?, ?, ?)');
    insertUser.run('Erkan', 'Teknik Depo', 'emerald');
    insertUser.run('Berkay', 'Teknik Depo', 'blue');
    insertUser.run('Emircan', 'Teknik Depo', 'amber');
  }

  // Seed Rules if not exists
  const ruleCount = db.prepare('SELECT count(*) as count FROM rules').get().count;
  if (ruleCount === 0) {
    const insertRule = db.prepare('INSERT INTO rules (title, content, category, importance, created_by) VALUES (?, ?, ?, ?, ?)');
    insertRule.run(
      'Sac Verilme Kuralı (Öncelik Sırası)',
      'Üretime veya atölyeye sac verildiğinde, mutlaka İLK OLARAK badem desenli sac verilecektir. Yeni gelen düz saclar hemen verilmez, eski stok ve badem desenliler eritilmelidir.',
      'Sac & Metal',
      'critical',
      'Sistem'
    );
    insertRule.run(
      'Açık Rulmanların Muhafazası',
      'Paketi açılan rulmanlar kesinlikle açıkta tozlu raflarda bırakılamaz. Yağlanıp streç filme sarılmalı ve nemden korunmalıdır.',
      'Rulman & Kayış',
      'high',
      'Sistem'
    );
    insertRule.run(
      'Kalıp ve Hidrolik Yağları Düzeni',
      'Açılan yağ varillerinin üzerine açılış tarihi yazılır. Damlatma tavası olmadan zemin üzerine doğrudan varil konulamaz.',
      'Yağ & Kimyasal',
      'normal',
      'Sistem'
    );
    insertRule.run(
      'Ödünç Takım ve Cihaz Teslimi',
      'Bakım veya kalıphaneye verilen tork anahtarı, mikrometre vb. hassas aletler mutlaka Günlük Olay Defteri sekmesine kime verildiği yazılarak teslim edilecektir.',
      'Genel',
      'high',
      'Sistem'
    );
  }

  // Seed SAP Guides
  const sapCount = db.prepare('SELECT count(*) as count FROM sap_guides').get().count;
  if (sapCount === 0) {
    const insertSap = db.prepare('INSERT INTO sap_guides (tcode, title, movement_type, steps, tips, created_by) VALUES (?, ?, ?, ?, ?, ?)');
    insertSap.run(
      'MIGO',
      'Depolar Arası Transfer Çıkışı',
      '311 Hareket',
      '1. İşlem: "Transfer Kaydı", Belge: "Diğer"\n2. Hareket Türü alanına "311" yaz ve Enter\'a bas.\n3. Malzeme kodunu ve miktarını gir.\n4. Çıkan Depo (0001) ve Hedef Depo (0002 vb.) seç.\n5. Kalem Tamam kutucuğunu işaretle ve "Kontrol Et" de.\n6. Sorun yoksa "Kaydet" butonuna basarak belge numarasını al.',
      'Hedef depoda parti kontrolü varsa parti no girmeyi unutmayın.',
      'Sistem'
    );
    insertSap.run(
      'MIGO',
      'Masraf Merkezine Mal Çıkışı (Bakım/Üretim)',
      '201 Hareket',
      '1. İşlem: "Mal Çıkışı", Belge: "Diğer"\n2. Hareket Türü: 201 yazın.\n3. Malzeme kodu ve verilen adeti girin.\n4. "Hesap Tayini" sekmesinde ilgili Masraf Merkezini (örn: Bakım 1102) yazın.\n5. Kalem Tamam deyip Kaydet\'e basın.',
      'Masraf merkezi yazılmazsa sistem kayıt almaz.',
      'Sistem'
    );
    insertSap.run(
      'MB52',
      'Depo Stok Miktarı & Lokasyon Sorgulama',
      'Raporlama',
      '1. MB52 ekranına girin.\n2. Malzeme numarasını veya *filtre* ile malzeme adını yazın.\n3. Üretim Yeri (Plant) ve Depo Yeri kodunu girin.\n4. F8 (Yürüt) tuşuna basın.\n5. Serbest kullanılabilir stok sütunundan depodaki reel adeti görün.',
      'Toplu sorgu yaparken gereksiz malzemeleri listelememek için depo kodunu mutlaka filtreleyin.',
      'Sistem'
    );
  }

  // Seed Tasks
  const taskCount = db.prepare('SELECT count(*) as count FROM tasks').get().count;
  if (taskCount === 0) {
    const insertTask = db.prepare('INSERT INTO tasks (title, description, priority, status, assigned_to, created_by, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertTask.run(
      'Yarın sabah badem sac sayımı ve düzeni',
      'Kalan badem sac adetleri kontrol edilecek, kesim atölyesine 3 adet teslim edilecek.',
      'urgent',
      'pending',
      'Hepsi',
      'Erkan',
      'Yarın Sabah'
    );
    insertTask.run(
      'Gelen SKF rulmanların raflara yerleşimi',
      'İrsaliyesi kontrol edildi, 4. koridor B rafına dizilecek ve SAP girişi yapılacak.',
      'normal',
      'in_progress',
      'Berkay',
      'Berkay',
      'Bugün'
    );
  }

  // Seed Log
  const logCount = db.prepare('SELECT count(*) as count FROM logs').get().count;
  if (logCount === 0) {
    const insertLog = db.prepare('INSERT INTO logs (content, category, shift, created_by) VALUES (?, ?, ?, ?)');
    insertLog.run('Sistem kurulumu yapıldı. Teknik Depo ekibi için canlı senkronizasyon aktif edildi.', 'info', 'Gündüz Vardiyası', 'Sistem');
  }
}

initDatabase();

module.exports = {
  db,
  getUsers: () => db.prepare('SELECT * FROM users ORDER BY id ASC').all(),
  
  getTasks: () => db.prepare("SELECT * FROM tasks ORDER BY CASE WHEN status = 'pending' THEN 1 WHEN status = 'in_progress' THEN 2 ELSE 3 END, id DESC").all(),
  createTask: (data) => {
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, priority, status, assigned_to, created_by, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      data.title,
      data.description || '',
      data.priority || 'normal',
      data.status || 'pending',
      data.assigned_to || 'Hepsi',
      data.created_by,
      data.due_date || ''
    );
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
  },
  updateTaskStatus: (id, status, completed_by) => {
    if (status === 'completed') {
      db.prepare('UPDATE tasks SET status = ?, completed_by = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, completed_by, id);
    } else {
      db.prepare('UPDATE tasks SET status = ?, completed_by = NULL, completed_at = NULL WHERE id = ?').run(status, id);
    }
    return db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  },
  deleteTask: (id) => {
    return db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  },

  getRules: () => db.prepare("SELECT * FROM rules ORDER BY CASE WHEN importance = 'critical' THEN 1 WHEN importance = 'high' THEN 2 ELSE 3 END, id DESC").all(),
  createRule: (data) => {
    const stmt = db.prepare(`
      INSERT INTO rules (title, content, category, importance, created_by)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(data.title, data.content, data.category, data.importance || 'normal', data.created_by);
    return db.prepare('SELECT * FROM rules WHERE id = ?').get(info.lastInsertRowid);
  },
  deleteRule: (id) => {
    return db.prepare('DELETE FROM rules WHERE id = ?').run(id);
  },

  getSapGuides: () => db.prepare('SELECT * FROM sap_guides ORDER BY tcode ASC, id ASC').all(),
  createSapGuide: (data) => {
    const stmt = db.prepare(`
      INSERT INTO sap_guides (tcode, title, movement_type, steps, tips, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(data.tcode, data.title, data.movement_type || '', data.steps, data.tips || '', data.created_by);
    return db.prepare('SELECT * FROM sap_guides WHERE id = ?').get(info.lastInsertRowid);
  },
  deleteSapGuide: (id) => {
    return db.prepare('DELETE FROM sap_guides WHERE id = ?').run(id);
  },

  getLogs: () => db.prepare('SELECT * FROM logs ORDER BY id DESC LIMIT 100').all(),
  createLog: (data) => {
    const stmt = db.prepare(`
      INSERT INTO logs (content, category, shift, created_by)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(data.content, data.category || 'info', data.shift || 'Gündüz Vardiyası', data.created_by);
    return db.prepare('SELECT * FROM logs WHERE id = ?').get(info.lastInsertRowid);
  }
};
