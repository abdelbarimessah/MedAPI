const request = require('supertest');
const app = require('../src/app');

describe('GET /api/auth', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/api/auth');
    expect(response.status).toBe(200);
  });
});