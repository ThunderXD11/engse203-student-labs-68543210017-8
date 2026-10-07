import { config } from '../config.js';

export function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;

  if (status >= 500) {
    console.error('เกิดข้อผิดพลาดภายใน:', err.message);
  }

  res.status(status).json({
    error: status >= 500 ? 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' : err.message,
    ...(config.isProduction ? {} : { stack: err.stack?.split('\n').slice(0, 3) }),
  });
}

// เพิ่มฟังก์ชัน notFound ส่งออกไปให้ app.js เรียกใช้
export function notFound(req, res, next) {
  res.status(404).json({ error: 'ไม่พบเส้นทางที่ร้องขอ (Route not found)' });
}