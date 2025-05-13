const request = require('supertest');
const api = require('../utils/config');

describe('Auth API', () => {
  it('should login successfully with correct credentials', async () => {
    const res = await request(api)
      .post('/auth/login')
      .send({ username: 'user01', password: 'secpassword*' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with incorrect password', async () => {
    const res = await request(api)
      .post('/auth/login')
      .send({ username: 'user01', password: 'wrongpassword' });
    expect(res.statusCode).toBe(400);
  });

  it('should fail login with missing fields', async () => {
    const res = await request(api)
      .post('/auth/login')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});
