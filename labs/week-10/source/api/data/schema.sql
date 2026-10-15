PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  department  TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE
);

CREATE TABLE requests (
  id            TEXT PRIMARY KEY,
  requester_id  INTEGER NOT NULL,
  request_type  TEXT NOT NULL,
  location      TEXT NOT NULL,
  details       TEXT NOT NULL,
  priority      TEXT NOT NULL DEFAULT 'normal',
  status        TEXT NOT NULL DEFAULT 'pending',
  created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  FOREIGN KEY (requester_id) REFERENCES users(id)
);

INSERT INTO users (name, department, email) VALUES
  ('สมชาย ใจดี', 'วิศวกรรมซอฟต์แวร์', 'somchai@rmutl.ac.th'),
  ('สุภาวดี รักเรียน', 'วิศวกรรมซอฟต์แวร์', 'supawadee@rmutl.ac.th'),
  ('ธนกฤต ตั้งใจ', 'วิศวกรรมไฟฟ้า', 'thanakrit@rmutl.ac.th'),
  ('ปรียา ขยันยิ่ง', 'สำนักวิทยบริการ', 'preeya@rmutl.ac.th');

INSERT INTO requests
  (id, requester_id, request_type, location, details, priority, status)
VALUES
  ('REQ-001', 1, 'แจ้งซ่อม', 'ห้องปฏิบัติการ 301',
   'เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า', 'urgent', 'pending'),

  ('REQ-002', 2, 'บริการบัญชีผู้ใช้', 'อาคารวิศวกรรมซอฟต์แวร์',
   'เข้าสู่ระบบห้องปฏิบัติการไม่ได้', 'normal', 'in-progress'),

  ('REQ-003', 3, 'ขอใช้อุปกรณ์', 'ห้องประชุม 2',
   'ขอยืมโปรเจกเตอร์สำหรับนำเสนอโครงงาน', 'normal', 'completed'),

  ('REQ-004', 1, 'แจ้งซ่อม', 'ห้องปฏิบัติการ 302',
   'คอมพิวเตอร์เครื่องที่ 5 เปิดไม่ติด', 'urgent', 'pending'),

  ('REQ-005', 4, 'อื่น ๆ', 'ห้องสมุด ชั้น 2',
   'ขอเพิ่มปลั๊กไฟบริเวณโต๊ะอ่านหนังสือ', 'normal', 'pending'),

  ('REQ-006', 2, 'แจ้งซ่อม', 'ห้องปฏิบัติการ 303',
   'เครื่องพิมพ์ใช้งานไม่ได้', 'normal', 'pending'),

  ('REQ-007', 3, 'ขอใช้อุปกรณ์', 'ห้องเรียน 401',
   'ขอยืมสาย HDMI', 'normal', 'completed'),

  ('REQ-008', 4, 'แจ้งซ่อม', 'ห้องสมุด ชั้น 1',
   'ไฟส่องสว่างเสีย', 'urgent', 'in-progress');