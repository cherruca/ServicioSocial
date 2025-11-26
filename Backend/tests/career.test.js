import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';

describe('Career routes', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('POST /career/create should create a career and return 201', async () => {
    const payload = { name: 'Ingenieria de Prueba', faculty: [] };
    const res = await request(app).post('/career/create').send(payload).set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('name', 'Ingenieria de Prueba');
  });

  test('GET /career/careers should include created career', async () => {
    const res = await request(app).get('/career/careers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    const found = res.body.data.find(c => c.name === 'Ingenieria de Prueba');
    expect(found).toBeTruthy();
  });
});
