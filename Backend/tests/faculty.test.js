import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';

describe('Faculty routes', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('POST /faculty/create should create a faculty and return 201', async () => {
    const payload = { name: 'Facultad de Prueba' };
    const res = await request(app).post('/faculty/create').send(payload).set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('name', 'Facultad de Prueba');
  });

  test('GET /faculty/faculties should include created faculty', async () => {
    const res = await request(app).get('/faculty/faculties');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    const found = res.body.data.find(f => f.name === 'Facultad de Prueba');
    expect(found).toBeTruthy();
  });
});
