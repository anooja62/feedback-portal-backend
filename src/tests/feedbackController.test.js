// src/tests/feedbackController.test.js
import request from 'supertest';
import app from '../app.js';

describe('Feedback API', () => {
  it('should return 403 if user is not a client', async () => {
    const res = await request(app).post('/api/feedback').send({
      rating: 5,
      text: 'Test feedback',
    });

    expect(res.statusCode).toBe(403);
  });
});
