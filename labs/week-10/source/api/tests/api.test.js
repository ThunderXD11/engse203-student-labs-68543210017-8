import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => { await loadSeed(); app = createApp(); });

/**
 * TODO W10-TEST (🏠 CP33) · เขียน test อย่างน้อย 6 เคส ที่ยิงเข้าฐานข้อมูลจริง
 *   1. GET /api/requests → 200 และได้ array
 *   2. คืน requesterName ไม่ใช่ requester_id
 *   3. GET /:id พบ → 200 · ไม่พบ → 404
 *   4. POST ถูกต้อง → 201
 *   5. POST ไม่ครบ → 400
 *   6. ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด
 */
const validRequest = {
  requesterName: 'นักศึกษา ทดสอบ',
  requestType: 'แจ้งซ่อม',
  location: 'ห้อง 501',
  details: 'รายละเอียดสำหรับการทดสอบระบบ',
  priority: 'normal'
};

describe('API test', () => {

  describe('GET /api/requests', () => {
    test('คืนรายการทั้งหมด พร้อม status 200', async () => {
      const res = await request(app).get('/api/requests');
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body));
    });
  
    test('คืน requesterName ไม่ใช่ requester_id', async () => {
      const res = await request(app).get('/api/requests');
      if (res.body.length > 0) {
        assert.ok('requesterName' in res.body[0]);
        assert.ok(!('requester_id' in res.body[0]));
      }
    });
  });

  describe('GET /api/requests/:id', () => {
    test('กรณีพบข้อมูลคำร้อง พร้อม status 200', async () => {
      const res = await request(app).get('/api/requests/REQ-001');
      assert.equal(res.status, 200);
      assert.equal(res.body.id , 'REQ-001');
    });

    test('กรณีไม่พบข้อมูลคำร้อง พร้อม status 404', async () => {
      const res = await request(app).get('/api/requests/REQ-999');
      assert.equal(res.status, 404);
      assert.ok(res.status, 404);
    });
  });

  describe('POST /api/requests', () => {
    test('ข้อมูลถูกต้อง พร้อม status 201 และ status เป็น pending', async () => {
      const res = await request(app).post('/api/requests').send(validRequest);
      assert.equal(res.status, 201);
      assert.equal(res.body.status, 'pending');
      assert.ok(res.body.id.startsWith('REQ-'));
    });

    test('ข้อมูลไม่ครบ พร้อม status 400' , async () => {
      const invalidReq = { ...validRequest , requesterName: '' };
      const res = await request(app).post('/api/requests').send(invalidReq);
      assert.equal(res.status , 400);
    });
  });

  describe('Security', () => {
    test('ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด', async () => {
      const evil = encodeURIComponent("x' OR '1'='1");
      const res = await request(app).get(`/api/requests?status=${evil}`);
      assert.equal(res.status , 200);
      assert.equal(res.body.length , 0);
    });
  });

  describe('CORS', () => {
    test('CORS header ตอบ origin ที่อนุญาต', async () => {
      const res = await request(app)
        .get('/api/requests')
        .set('Origin', 'http://localhost:5173');
      assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173');
    });
  });
});