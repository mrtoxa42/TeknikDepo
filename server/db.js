const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'teknik_depo.db');
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

function initDatabase() {
  // Pano Kartları (Trello / Beyaz Tahta modeli)
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      board_col TEXT NOT NULL DEFAULT 'notes', -- notes (Depo Notları & Hatırlatma), todo (Yapılacaklar), doing (İşlemde), done (Bitti)
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      tag TEXT DEFAULT 'Genel',
      color TEXT DEFAULT 'amber', -- amber, blue, rose, emerald, purple
      created_by TEXT NOT NULL,
      completed_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const cardCount = db.prepare('SELECT count(*) as count FROM cards').get().count;
  if (cardCount === 0) {
    const insertCard = db.prepare(`
      INSERT INTO cards (board_col, title, content, tag, color, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    // Örnek gerçek teknik depo notları
    insertCard.run(
      'notes',
      '4120 Kodlu Kimyasal (+1 Stok Fazlası)',
      'Rafta 1 adet fazlası var. Raf stok dışı görünmesin diye üzerine yazılmadı, atölye isteyince doğrudan verilecek.',
      'Stok Notu',
      'amber',
      'Erkan'
    );

    insertCard.run(
      'notes',
      'Badem Desenli Sac Önceliği',
      'Atölyeye sac verildiğinde önce badem desenliler eritilecek. Düz sacları hemen açmayın.',
      'Hatırlatma',
      'purple',
      'Berkay'
    );

    insertCard.run(
      'todo',
      'Gidecek Malzeme Hazır - İrsaliyesi Kesildi',
      'Paketlendi ve hazırlandı, irsaliye numarası alındı. Kamyon gelince yüklenecek.',
      'İrsaliye',
      'blue',
      'Emircan'
    );

    insertCard.run(
      'todo',
      'Gelen SKF rulmanların raflara dizilmesi',
      '4. koridor B rafına kaldırılacak.',
      'İş',
      'emerald',
      'Berkay'
    );

    insertCard.run(
      'doing',
      'Haftalık cıvata kutuları kontrolü',
      'Eksik olan M8 ve M10 cıvatalar listeleniyor.',
      'İş',
      'blue',
      'Erkan'
    );
  }
}

initDatabase();

module.exports = {
  db,
  getCards: () => db.prepare('SELECT * FROM cards ORDER BY id DESC').all(),

  createCard: (data) => {
    const stmt = db.prepare(`
      INSERT INTO cards (board_col, title, content, tag, color, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      data.board_col || 'notes',
      data.title,
      data.content || '',
      data.tag || 'Genel',
      data.color || 'amber',
      data.created_by
    );
    return db.prepare('SELECT * FROM cards WHERE id = ?').get(info.lastInsertRowid);
  },

  updateCardCol: (id, board_col, user) => {
    if (board_col === 'done') {
      db.prepare('UPDATE cards SET board_col = ?, completed_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(board_col, user, id);
    } else {
      db.prepare('UPDATE cards SET board_col = ?, completed_by = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(board_col, id);
    }
    return db.prepare('SELECT * FROM cards WHERE id = ?').get(id);
  },

  updateCard: (id, data) => {
    db.prepare(`
      UPDATE cards 
      SET title = ?, content = ?, tag = ?, color = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(data.title, data.content || '', data.tag || 'Genel', data.color || 'amber', id);
    return db.prepare('SELECT * FROM cards WHERE id = ?').get(id);
  },

  deleteCard: (id) => {
    return db.prepare('DELETE FROM cards WHERE id = ?').run(id);
  }
};
