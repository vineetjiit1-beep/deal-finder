const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'poa.sqlite');

let db;
function initDb(){
  db = new sqlite3.Database(dbPath, (err) => {
    if(err) return console.error('Failed to open DB', err);
  });
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      is_admin INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS refresh_tokens (
      token TEXT PRIMARY KEY,
      user_id INTEGER,
      expires_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS password_resets (
      token TEXT PRIMARY KEY,
      user_id INTEGER,
      expires_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS offers (
      id TEXT PRIMARY KEY,
      title TEXT,
      provider_id TEXT,
      merchant TEXT,
      type TEXT,
      start_date TEXT,
      end_date TEXT,
      monthly_limit INTEGER,
      single_use INTEGER,
      applicability TEXT,
      formula TEXT,
      affiliate_link TEXT,
      last_refreshed TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS usage_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      offer_id TEXT,
      used_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT,
      offer_id TEXT,
      details TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`);
  });

  const bcrypt = require('bcrypt');
  const username = process.env.BASIC_USER || 'admin';
  const pass = process.env.BASIC_PASS || 'adminpass';
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if(err) return console.error(err);
    if(!row){
      bcrypt.hash(pass, 10).then(hash => {
        db.run('INSERT INTO users (username, password_hash, is_admin) VALUES (?,?,?)', [username, hash, 1]);
        console.log('Seeded admin user:', username);
      });
    }
  });
}

function getDb(){ if(!db) initDb(); return db; }

module.exports = { initDb, getDb };
