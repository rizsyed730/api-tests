const request = require('supertest');
const api = require('../utils/config');

describe('Status API', () => {
  it('should return OK status for healthy API', async () => {
    const res = await request(api).get('/status');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});
