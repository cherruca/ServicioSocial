import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';

describe('Student routes', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('POST /student/create should create a student and return 201', async () => {
    const payload = {
      carnet: '00111111',
      name: 'Student Test',
      hours: 0,
      email: '00111111@uca.edu.sv',
      careers: []
    };

    const res = await request(app).post('/student/create').send(payload).set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('email', '00111111@uca.edu.sv');
  });

  test('GET /student/students should return array including created student', async () => {
    const res = await request(app).get('/student/students');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    const found = res.body.data.find(s => s.email === '00111111@uca.edu.sv');
    expect(found).toBeTruthy();
  });
});
