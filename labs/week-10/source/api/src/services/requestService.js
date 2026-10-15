import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync } from 'node:fs';
import { AppError } from '../middleware/errorHandler.js';

let db;

/**
 * Week 10 — เปลี่ยน service จากอ่านไฟล์ JSON เป็นฐานข้อมูล SQLite
 *
 * ตอนนี้ยังเป็นเวอร์ชัน Week 07 (อ่านไฟล์ JSON) อยู่
 * งานของสัปดาห์นี้คือเปลี่ยนให้ใช้ node:sqlite
 *
 * ⚠ กฎเหล็ก: signature ของทุกฟังก์ชันต้องเหมือนเดิมทุกตัว
 *   → controller และ frontend จะได้ไม่ต้องแก้เลย
 */

// ── ของเดิม Week 07 (อ่านไฟล์ JSON) — จะถูกแทนที่ ──
const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '../..');
const DB_FILE = process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db');
const SCHEMA_FILE = path.join(API_ROOT, 'data', 'schema.sql');

export async function loadSeed() {
  db = new DatabaseSync(DB_FILE);
  db.exec('PRAGMA foreign_keys = ON');

  // ถ้ายังไม่มีตาราง (ไฟล์ฐานข้อมูลใหม่) ให้สร้างจาก schema.sql
  try {
  const ready = db.prepare(
    "SELECT COUNT(*) c FROM sqlite_master WHERE type='table' AND name='requests'"
  ).get().c;
  if (!ready) db.exec(readFileSync(SCHEMA_FILE, 'utf8'));
  } catch (err) {
    console.error('ไม่สามารถโหลด schema.sql ได้', err);
    throw err;
  }
} 

export function findAll({ status } = {}) {
  /**
   * TODO W10-3 (CP28) · เปลี่ยนเป็น SELECT จากฐานข้อมูล
   *   - ใช้ JOIN กับตาราง users เพื่อคืน requesterName (ไม่ใช่ requester_id)
   *   - ตั้งชื่อคอลัมน์ด้วย AS ให้ตรงกับที่ frontend ใช้
   *   - ถ้ามี status ให้เติม WHERE r.status = ?
   *   คำใบ้: คัดลอก query จาก queries.sql ที่ทำสัปดาห์ที่แล้วมาปรับ
   */

  const SELECT_SHAPE = `
  SELECT r.id,
         u.name          AS requesterName,
         r.request_type  AS requestType,
         r.location,
         r.details,
         r.priority,
         r.status
  FROM requests r
  JOIN users u ON u.id = r.requester_id`; 

  return status 
    ? db.prepare(SELECT_SHAPE + ' WHERE r.status = ?').all(status)
    : db.prepare(SELECT_SHAPE).all();
}

export function findById(id) {
  /** TODO W10-4 (CP28) · SELECT จากฐานข้อมูล
   *   - ใช้ JOIN กับตาราง users เพื่อคืน requesterName (ไม่ใช่ requester_id)
   *   - ตั้งชื่อคอลัมน์ด้วย AS ให้ตรงกับที่ frontend ใช้
   *   - ถ้าไม่พบให้คืน null
   *   คำใบ้: คัดลอก query จาก queries.sql ที่ทำสัปดาห์ที่แล้วมาปรับ
   */

  const SELECT_SHAPE = `
  SELECT r.id,
         u.name          AS requesterName,
         r.request_type  AS requestType,
         r.location,
         r.details,
         r.priority,
         r.status
  FROM requests r
  JOIN users u ON u.id = r.requester_id`;

  return db.prepare(`${SELECT_SHAPE} WHERE r.id = ?`).get(id) ?? null;
}

function resolveUserId(name) {
  const found = db
    .prepare('SELECT id FROM users WHERE name = ?')
    .get(name);

  if (found) return found.id;

  const slug = Date.now().toString(36);

  return db
    .prepare(
      'INSERT INTO users (name, department, email) VALUES (?, ?, ?)'
    )
    .run(
      name,
      'ไม่ระบุ',
      `user-${slug}@rmutl.ac.th`
    )
    .lastInsertRowid;
}

function nextId() {
  const row = db
    .prepare(
      "SELECT id FROM requests WHERE id LIKE 'REQ-%' ORDER BY id DESC LIMIT 1"
    )
    .get();

  const n = row
    ? Number(String(row.id).replace('REQ-', '')) + 1
    : 1;

  return `REQ-${String(n).padStart(3, '0')}`;
}

export function create(input) {
  const id = nextId();

  try {
    db.prepare(
      `INSERT INTO requests (
         id,
         requester_id,
         request_type,
         location,
         details,
         priority
       )
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      resolveUserId(input.requesterName.trim()),
      input.requestType,
      input.location.trim(),
      input.details.trim(),
      input.priority ?? 'normal'
    );
  } catch (err) {
    throw toAppError(err);
  }

  return findById(id);
}

export function updateStatus(id, status) {
  /** TODO W10-6 (CP29) · UPDATE requests SET status = ? WHERE id = ? · ไม่พบคืน null */
  const result = db.prepare(`
    UPDATE requests
    SET status = ?
    WHERE id = ?
  `).run(status, id);
  return result.changes ? findById(id) : null;
}

export function remove(id) {
  const target = findById(id);      // ① หาก่อน
  if (!target) return null;         // ② ไม่พบ → null
  db.prepare('DELETE FROM requests WHERE id = ?').run(id);
  return target;                    // ③ คืนของที่ลบ
}

function toAppError(err) {
  const m = err.message ?? '';
  if (m.includes('FOREIGN KEY')) return new AppError('อ้างถึงข้อมูลที่ไม่มีอยู่จริง', 400);
  if (m.includes('CHECK'))       return new AppError('ค่าที่ส่งมาไม่อยู่ในรายการที่กำหนด', 400);
  if (m.includes('UNIQUE'))      return new AppError('ข้อมูลนี้มีอยู่แล้วในระบบ', 409);
  if (m.includes('NOT NULL'))    return new AppError('ข้อมูลไม่ครบถ้วน', 400);
  return err;   // error อื่นปล่อยผ่าน → errorHandler ตอบ 500
}