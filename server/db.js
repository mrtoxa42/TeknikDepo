const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, 'teknik_depo.db');
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

const GIST_ID = process.env.GIST_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      board_col TEXT NOT NULL DEFAULT 'notes', -- notes (Uzun Vadeli & Sabit Notlar), todo (Yapılacak), doing (İşlemde), done (Bitti)
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      image TEXT DEFAULT '',
      color TEXT DEFAULT 'amber', -- amber, blue, rose, emerald, purple
      created_by TEXT NOT NULL,
      completed_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Try Gist restore if configured
  if (GIST_ID && GITHUB_TOKEN) {
    restoreFromGist();
  }
}

async function restoreFromGist() {
  if (!GIST_ID || !GITHUB_TOKEN) return false;
  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'TeknikDepo-App'
      }
    });
    if (!res.ok) return false;
    const data = await res.json();
    const file = data.files && data.files['teknik_depo_cards.json'];
    if (!file || !file.content) return false;

    const cards = JSON.parse(file.content);
    if (!Array.isArray(cards) || cards.length === 0) return false;

    db.exec('DELETE FROM cards;');
    const insert = db.prepare(`
      INSERT INTO cards (id, board_col, title, content, image, color, created_by, completed_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of cards) {
      insert.run(
        c.id,
        c.board_col || 'notes',
        c.title,
        c.content || '',
        c.image || '',
        c.color || 'amber',
        c.created_by,
        c.completed_by || null,
        c.created_at || new Date().toISOString(),
        c.updated_at || new Date().toISOString()
      );
    }
    return true;
  } catch (err) {
    console.warn('Gist restore failed:', err.message);
    return false;
  }
}

let syncTimeout = null;
function syncToGist() {
  if (!GIST_ID || !GITHUB_TOKEN) return;
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    try {
      const cards = db.prepare('SELECT * FROM cards ORDER BY id DESC').all();
      const body = {
        description: 'Teknik Depo Kalici Veritabani',
        files: {
          'teknik_depo_cards.json': {
            content: JSON.stringify(cards, null, 2)
          }
        }
      };
      await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TeknikDepo-App',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    } catch (err) {
      console.warn('Gist sync error:', err.message);
    }
  }, 1500);
}

initDatabase();

module.exports = {
  db,
  getCards: () => db.prepare('SELECT * FROM cards ORDER BY id DESC').all(),

  createCard: (data) => {
    const stmt = db.prepare(`
      INSERT INTO cards (board_col, title, content, image, color, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      data.board_col || 'notes',
      data.title,
      data.content || '',
      data.image || '',
      data.color || 'amber',
      data.created_by
    );
    syncToGist();
    return db.prepare('SELECT * FROM cards WHERE id = ?').get(info.lastInsertRowid);
  },

  updateCardCol: (id, board_col, user) => {
    if (board_col === 'done') {
      db.prepare('UPDATE cards SET board_col = ?, completed_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(board_col, user, id);
    } else {
      db.prepare('UPDATE cards SET board_col = ?, completed_by = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(board_col, id);
    }
    syncToGist();
    return db.prepare('SELECT * FROM cards WHERE id = ?').get(id);
  },

  updateCard: (id, data) => {
    db.prepare(`
      UPDATE cards 
      SET title = ?, content = ?, image = COALESCE(?, image), color = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(data.title, data.content || '', data.image !== undefined ? data.image : null, data.color || 'amber', id);
    syncToGist();
    return db.prepare('SELECT * FROM cards WHERE id = ?').get(id);
  },

  deleteCard: (id) => {
    const res = db.prepare('DELETE FROM cards WHERE id = ?').run(id);
    syncToGist();
    return res;
  },

  // Bulk restore/sync from client cache if server is empty
  syncFromClient: (cards) => {
    if (!Array.isArray(cards) || cards.length === 0) return db.prepare('SELECT * FROM cards ORDER BY id DESC').all();
    const currentCount = db.prepare('SELECT count(*) as count FROM cards').get().count;
    if (currentCount === 0) {
      const insert = db.prepare(`
        INSERT INTO cards (id, board_col, title, content, image, color, created_by, completed_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const c of cards) {
        insert.run(
          c.id || null,
          c.board_col || 'notes',
          c.title,
          c.content || '',
          c.image || '',
          c.color || 'amber',
          c.created_by || 'Erkan',
          c.completed_by || null,
          c.created_at || new Date().toISOString(),
          c.updated_at || new Date().toISOString()
        );
      }
      syncToGist();
    }
    return db.prepare('SELECT * FROM cards ORDER BY id DESC').all();
  }
};
