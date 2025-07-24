import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'metadata.db');
const db = new Database(dbPath);

db.exec(`CREATE TABLE IF NOT EXISTS descriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fileName TEXT NOT NULL,
  description TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

export function saveDescription(fileName: string, description: string) {
  const stmt = db.prepare('INSERT INTO descriptions (fileName, description) VALUES (?, ?)');
  stmt.run(fileName, description);
}

export function getDescriptions(fileName: string) {
  const stmt = db.prepare('SELECT * FROM descriptions WHERE fileName = ? ORDER BY createdAt DESC');
  return stmt.all(fileName);
} 