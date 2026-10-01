# Campus Service — ระบบรับคำร้องงานบริการ (Full-Stack · Week 11)

ระบบรับและจัดการคำร้องงานบริการภายในมหาวิทยาลัย — พัฒนาด้วย React + Express + SQLite
ทำงานได้จริงในโหมด development (2 พอร์ต) และโหมด production (พอร์ตเดียว)

---

## สถาปัตยกรรม 3 ชั้น

```
┌─────────────────┐   HTTP/JSON   ┌──────────────────┐   SQL   ┌──────────────┐
│  React (Vite)   │  ──────────►  │  Express API     │ ──────► │  SQLite DB   │
│  frontend/src/  │  ◄──────────  │  api/src/        │ ◄────── │  api/data/   │
└─────────────────┘               └──────────────────┘         └──────────────┘
     พอร์ต 5173 (dev)                 พอร์ต 3001                campus.db
     หรือ static (prod)
```

| ชั้น | หน้าที่ | โฟลเดอร์ |
|---|---|---|
| **Frontend** | แสดงผล UI รับ input จากผู้ใช้ เรียก API | `frontend/src/` |
| **API (Backend)** | route · controller · service · config · health check | `api/src/` |
| **Database** | เก็บข้อมูล users + requests แบบถาวร | `api/data/` |

เหตุที่แยก 3 ชั้น — เปลี่ยนแหล่งข้อมูลหรือ UI โดยไม่กระทบชั้นอื่น ตลอดวิชานี้เปลี่ยนแหล่งข้อมูล 4 ครั้งโดยแก้เฉพาะชั้น service

---

## วิธีรัน (Development)

ต้องเปิด **2 terminal** พร้อมกัน

```bash
# Terminal 1 — API (Express + SQLite)
cd api
npm install
npm run dev          # http://localhost:3001

# Terminal 2 — Frontend (React + Vite)
cd frontend
npm install
npm run dev          # http://localhost:5173
```

เปิด http://localhost:5173 ในเบราว์เซอร์

---

## วิธีรัน (Production)

โหมด production: API เสิร์ฟหน้าเว็บด้วย — เปิดเพียง **1 พอร์ต**

```bash
# Build frontend ก่อน (จาก root ของโปรเจกต์)
npm run build

# รัน production server
$env:NODE_ENV="production"; npm start     # Windows PowerShell
# หรือ
NODE_ENV=production npm start              # Linux/macOS
```

เปิด http://localhost:3001 — เห็นทั้งหน้าเว็บและเรียก API ได้จากพอร์ตเดียว

---

## Environment Variables

### ฝั่ง API (`api/.env`)

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| `PORT` | `3001` | พอร์ตที่ API ฟัง |
| `NODE_ENV` | `development` | `production` เปิดโหมดเสิร์ฟหน้าเว็บ + log แบบ combined |
| `CORS_ORIGIN` | `http://localhost:5173` | Origin ที่อนุญาตให้เรียก API (dev เท่านั้น) |
| `DB_FILE` | `api/data/campus.db` | path ของไฟล์ฐานข้อมูล |

คัดลอก `api/.env.example` เป็น `api/.env` ก่อนรัน

### ฝั่ง Frontend (`frontend/.env.local`)

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3001` | URL ของ API (dev) — ว่างเมื่อ production |

---

## การตัดสินใจออกแบบ

**ทำไมเลือก SQLite** — ข้อมูลมีโครงสร้างชัดเจน (users + requests มี relation) · ไม่ต้องตั้ง server แยก · ทำงานจากไฟล์เดียว เหมาะกับขนาดโปรเจกต์นี้

**ทำไมแยก config.js** — รวมการอ่าน environment variable ไว้ที่เดียว ชั้นอื่นไม่อ่าน `process.env` โดยตรง ทำให้เปลี่ยนค่า config โดยไม่ต้องแก้ทั่วโค้ด และ deploy บน cloud ได้ (cloud กำหนด PORT ผ่าน env)

**ทำไมต้องมี health check** — cloud เรียก `/api/health` อัตโนมัติเพื่อเช็คว่า deploy สำเร็จ ถ้าตอบ 200 = พร้อม ถ้าตอบ 503 = ยังไม่พร้อม · ระบบของเราเช็คถึงฐานข้อมูลเพราะ API เปิดแต่ต่อ DB ไม่ได้ก็ใช้งานไม่ได้อยู่ดี
