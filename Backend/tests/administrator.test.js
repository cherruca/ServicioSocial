import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';

describe('Administrator routes', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('POST /administrator/create should create an administrator and return 201', async () => {
    const payload = {
      carnet: 'A1234567',
      name: 'Admin Test',
      email: 'admin@test.com',
      password: 'secret'
    };
    const res = await request(app).post('/administrator/create').send(payload).set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('email', 'admin@test.com');
  });

  test('GET /administrator/administrators should include created admin', async () => {
    const res = await request(app).get('/administrator/administrators');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    const found = res.body.data.find(a => a.email === 'admin@test.com');
    expect(found).toBeTruthy();
  });
});
