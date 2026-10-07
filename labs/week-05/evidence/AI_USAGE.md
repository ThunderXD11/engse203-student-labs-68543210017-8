# ENGSE203 LAB05 — AI / Resource Usage

| Tool / Resource | Purpose | Used portion | How I verified | My final decision |
|---|---|---|---|---|
| ChatGPT / Gemini | ช่วยวิเคราะห์แนวทางการแก้ไข Error Handling, Validation และ Storage Recovery | แนะนำแนวคิดการสร้าง custom validation function และการเช็ค schemaVersion  | source review / runtime test | นำแนวคิดมาปรับใช้และเขียนฟังก์ชัน validateRequests() ด้วยตนเองเพื่อให้ตรงตามข้อกำหนดของ Lab |
| คู่มือ LAB05 | ใช้อ้างอิง Checkpoint, ตรวจสอบความถูกต้องของโค้ด | รายการ 10 ภาพบังคับ, ขั้นตอนการจำลองข้อผิดพลาด และชุดคำสั่งสำหรับ Build/Deploy บน GitHub Pages  | runtime test | ปฏิบัติตามขั้นตอนในคู่มือเพื่อตรวจสอบผลลัพธ์การทำงานของระบบและ บันทึกผล |


คำรับรอง:

- [x] ไม่ส่ง token, password, secret หรือข้อมูลส่วนบุคคลจริงให้เครื่องมือ
- [x] ตรวจ source และรัน test ด้วยตนเอง
- [x] อธิบาย Route, Effect, Service Layer และ persistence ของ final code ได้