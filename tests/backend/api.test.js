/**
 * Backend API Tests
 * Test suite for Baobab Bush Portal API endpoints
 */

const request = require('supertest');
const app = require('../../backend/server');

describe('Backend API Tests', () => {
  
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'Baobab Bush Portal');
      expect(response.body).toHaveProperty('version', '2.0.0');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/share-price', () => {
    it('should return share price data', async () => {
      const response = await request(app).get('/api/share-price');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('current');
      expect(response.body.data).toHaveProperty('change');
      expect(response.body.data).toHaveProperty('percentChange');
      expect(response.body.data).toHaveProperty('lastUpdate');
      expect(typeof response.body.data.current).toBe('number');
    });
  });

  describe('GET /api/seedwave', () => {
    it('should return seedwave data', async () => {
      const response = await request(app).get('/api/seedwave');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('treatedBrands');
      expect(response.body.data).toHaveProperty('activeBrands');
      expect(response.body.data).toHaveProperty('growth');
      expect(typeof response.body.data.treatedBrands).toBe('number');
    });
  });

  describe('GET /api/ecosystem', () => {
    it('should return ecosystem status', async () => {
      const response = await request(app).get('/api/ecosystem');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('repositories');
      expect(response.body.data).toHaveProperty('status', 'operational');
    });
  });

  describe('GET /api/pulse', () => {
    it('should return pulse data', async () => {
      const response = await request(app).get('/api/pulse');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('timestamp');
      expect(response.body.data).toHaveProperty('pulse', '9s');
      expect(response.body.data).toHaveProperty('status', 'active');
      expect(response.body.data).toHaveProperty('metrics');
    });
  });

  describe('GET /api/sectors', () => {
    it('should return list of sectors', async () => {
      const response = await request(app).get('/api/sectors');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      const sector = response.body.data[0];
      expect(sector).toHaveProperty('id');
      expect(sector).toHaveProperty('name');
      expect(sector).toHaveProperty('icon');
      expect(sector).toHaveProperty('active');
    });
  });

  describe('POST /api/contact', () => {
    it('should accept valid contact form submission', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message'
      };
      
      const response = await request(app)
        .post('/api/contact')
        .send(contactData);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject contact form with missing fields', async () => {
      const contactData = {
        name: 'Test User',
        email: 'test@example.com'
        // message is missing
      };
      
      const response = await request(app)
        .post('/api/contact')
        .send(contactData);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject contact form with invalid email', async () => {
      const contactData = {
        name: 'Test User',
        email: 'invalid-email',
        message: 'This is a test message'
      };
      
      const response = await request(app)
        .post('/api/contact')
        .send(contactData);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.error).toContain('email');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/non-existent-route');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
