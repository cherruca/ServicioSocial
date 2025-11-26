import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';

describe('User routes', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('POST /user/create should create a user and return 201', async () => {
    const payload = {
      carnet: '99999999',
      name: 'Test User',
      email: 'testuser@example.com',
      role: 'student',
      picture: 'http://example.com/pic.jpg',
      careers: []
    };

    const res = await request(app).post('/user/create').send(payload).set('Accept', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('email', 'testuser@example.com');
  });

  test('GET /user/users should return array including created user', async () => {
    const res = await request(app).get('/user/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    const found = res.body.data.find(u => u.email === 'testuser@example.com');
    expect(found).toBeTruthy();
  });
});
