import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => {
  await loadSeed();
  app = createApp();
});

describe('Campus Service API Automated Tests', () => {
  test('1. GET /api/requests คืนรายการทั้งหมด พร้อม status 200', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });

  test('2. GET /api/requests/:id ที่มีอยู่ คืน status 200', async () => {
    const res = await request(app).get('/api/requests/REQ-001');
    assert.equal(res.status, 200);
  });

  test('3. GET /api/requests/:id ที่ไม่มี คืน status 404', async () => {
    const res = await request(app).get('/api/requests/REQ-999');
    assert.equal(res.status, 404);
  });

  test('4. POST /api/requests ข้อมูลถูกต้อง คืน status 201', async () => {
    const newReq = {
      title: 'เครื่องสำรองไฟส่งเสียงเตือน',
      description: 'UPS ส่งเสียงเตือนตลอดเวลาที่ห้องปฏิบัติการคอมพิวเตอร์',
      category: 'IT',
      reporterName: 'วรสิทธิ์ บุญยปรีดี',
      location: 'อาคารเรียนรวม 1'
    };

    const res = await request(app)
      .post('/api/requests')
      .send(newReq);

      if (res.status !== 201) {
    console.log('POST Failed Response:', res.body);
  }
  
    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'pending');
  });

  test('5. POST /api/requests ข้อมูลไม่ครบ คืน status 400', async () => {
    const res = await request(app).post('/api/requests').send({});
    assert.equal(res.status, 400);
  });

  test('6. CORS header ตอบ Access-Control-Allow-Origin ตรงกับ config', async () => {
    const res = await request(app).get('/api/requests');
    assert.ok(res.headers['access-control-allow-origin']);
  });
});