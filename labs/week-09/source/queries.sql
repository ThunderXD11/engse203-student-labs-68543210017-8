-- ═══════════════════════════════════════════════════════════
-- queries.sql — คำสั่งค้นหาตอบโจทย์
-- 🏠 TODO W09-QUERY (CP22) · เขียนอย่างน้อย 8 ข้อ
--
-- เขียนคำสั่งจริงที่รันได้ ไม่ใช่เขียนบรรยาย
-- ทุกข้อต้องทดสอบแล้วว่าได้ผลลัพธ์ถูกต้อง
-- ═══════════════════════════════════════════════════════════

-- Q1: แสดงคำร้องทั้งหมด
SELECT *
FROM requests;

-- Q2: แสดงเฉพาะคำร้องที่มี priority เป็น urgent
SELECT *
FROM requests
WHERE priority = 'urgent';

-- Q3: แสดงคำร้องที่ยัง pending
SELECT *
FROM requests
WHERE status = 'pending';

-- Q4: แสดงคำร้องเรียงตาม priority
SELECT id, request_type, priority, status
FROM requests
ORDER BY priority ASC;

-- Q5: แสดงคำร้องเรียงจากใหม่ไปเก่า
SELECT id, request_type, created_at
FROM requests
ORDER BY created_at DESC;

-- Q6: JOIN requests กับ users
SELECT
  r.id,
  u.name,
  r.request_type,
  r.location,
  r.status
FROM requests r
JOIN users u
  ON r.requester_id = u.id;

-- Q7: JOIN และกรองเฉพาะคำร้อง urgent
SELECT
  r.id,
  u.name,
  r.request_type,
  r.priority
FROM requests r
JOIN users u
  ON r.requester_id = u.id
WHERE r.priority = 'urgent';

-- Q8: JOIN และเรียงตามชื่อผู้แจ้ง
SELECT
  r.id,
  u.name,
  r.request_type,
  r.status
FROM requests r
JOIN users u
  ON r.requester_id = u.id
ORDER BY u.name ASC;

-- Q9: แสดงคำร้องของแผนกวิศวกรรมซอฟต์แวร์
SELECT
  r.id,
  u.name,
  u.department,
  r.request_type,
  r.status
FROM requests r
JOIN users u
  ON r.requester_id = u.id
WHERE u.department = 'วิศวกรรมซอฟต์แวร์'
ORDER BY r.id;

-- Q10: นับจำนวนคำร้อง
SELECT COUNT(*) AS total_requests
FROM requests;

-- Q11: นับจำนวนคำร้องแยกตามสถานะ
SELECT
  status,
  COUNT(*) AS total
FROM requests
GROUP BY status;

-- Q12: นับจำนวนคำร้องของแต่ละผู้ใช้
SELECT
  u.name,
  COUNT(r.id) AS request_count
FROM users u
LEFT JOIN requests r
  ON r.requester_id = u.id
GROUP BY u.id, u.name
ORDER BY request_count DESC;

-- Q13: นับจำนวนคำร้องแยกตามประเภท
SELECT
  request_type,
  COUNT(*) AS total
FROM requests
GROUP BY request_type;

-- Q14: สร้าง INDEX เพื่อช่วยค้นหาด้วย requester_id
CREATE INDEX IF NOT EXISTS idx_requests_requester_id
ON requests(requester_id);

-- ⭐ Challenge ─────────────────────────────────────────────
-- ⑨ นับจำนวนคำร้องแยกตามสถานะ  (GROUP BY + COUNT)
-- ⑩ ใครแจ้งคำร้องมากที่สุด  (คำใบ้: LEFT JOIN เพื่อให้คนที่ยังไม่เคยแจ้งติดมาด้วย)
-- ⑪ สร้าง INDEX ให้การค้นด้วย status เร็วขึ้น
