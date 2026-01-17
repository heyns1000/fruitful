/**
 * API Routes for Baobab Bush Portal
 */

const express = require('express');
const router = express.Router();

// Mock data for demonstration
const mockData = {
  sharePrice: {
    current: 4247.89,
    change: 23.45,
    percentChange: 0.55,
    lastUpdate: new Date().toISOString()
  },
  seedwaveData: {
    treatedBrands: 7038,
    activeBrands: 6891,
    growth: 147,
    lastUpdate: new Date().toISOString()
  },
  ecosystemStatus: {
    repositories: 84,
    activeWorkflows: 8,
    pulseInterval: '9s',
    status: 'operational'
  }
};

/**
 * GET /api/share-price
 * Get current FAA share price
 */
router.get('/share-price', (req, res) => {
  try {
    // Simulate real-time fluctuation
    const fluctuation = (Math.random() - 0.5) * 10;
    const currentPrice = mockData.sharePrice.current + fluctuation;
    
    res.json({
      success: true,
      data: {
        ...mockData.sharePrice,
        current: parseFloat(currentPrice.toFixed(2)),
        lastUpdate: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/seedwave
 * Get Seedwave brand growth data
 */
router.get('/seedwave', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.seedwaveData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/ecosystem
 * Get ecosystem status
 */
router.get('/ecosystem', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockData.ecosystemStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/pulse
 * Get real-time pulse data
 */
router.get('/pulse', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        pulse: '9s',
        status: 'active',
        metrics: {
          requestsPerSecond: Math.floor(Math.random() * 100) + 50,
          activeConnections: Math.floor(Math.random() * 500) + 200,
          uptime: process.uptime()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/contact
 * Handle contact form submissions
 */
router.post('/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    // In production, this would send an email or save to database
    console.log('Contact form submission:', { name, email, message });
    
    res.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sectors
 * Get list of available sectors
 */
router.get('/sectors', (req, res) => {
  try {
    const sectors = [
      { id: 'agriculture', name: 'Agriculture', icon: '🌾', active: true },
      { id: 'banking', name: 'Banking', icon: '🏦', active: true },
      { id: 'creative-tech', name: 'Creative Tech', icon: '🎨', active: true },
      { id: 'logistics', name: 'Logistics', icon: '🚚', active: true },
      { id: 'energy', name: 'Energy', icon: '⚡', active: true },
      { id: 'health', name: 'Health', icon: '🏥', active: true },
      { id: 'housing', name: 'Housing', icon: '🏘️', active: true },
      { id: 'justice', name: 'Justice', icon: '⚖️', active: true },
      { id: 'knowledge', name: 'Knowledge', icon: '📚', active: true },
      { id: 'media', name: 'Media', icon: '📡', active: true }
    ];
    
    res.json({
      success: true,
      data: sectors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sectors/:id
 * Get specific sector details
 */
router.get('/sectors/:id', (req, res) => {
  try {
    const { id } = req.params;
    const sectors = {
      'agriculture': { id: 'agriculture', name: 'Agriculture', icon: '🌾', active: true, description: 'Agricultural sector solutions' },
      'banking': { id: 'banking', name: 'Banking', icon: '🏦', active: true, description: 'Financial services and banking' },
      'creative-tech': { id: 'creative-tech', name: 'Creative Tech', icon: '🎨', active: true, description: 'Creative technology solutions' },
    };
    
    const sector = sectors[id];
    if (!sector) {
      return res.status(404).json({
        success: false,
        error: 'Sector not found'
      });
    }
    
    res.json({
      success: true,
      data: sector
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/sectors/:id/subscribe
 * Subscribe to a sector
 */
router.post('/sectors/:id/subscribe', (req, res) => {
  try {
    const { id } = req.params;
    
    // In production, this would save subscription to database
    console.log(`User subscribed to sector: ${id}`);
    
    res.json({
      success: true,
      data: { subscribed: true }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/pulses
 * Get pulse history data
 */
router.get('/pulses', (req, res) => {
  try {
    const pulses = [];
    const now = Date.now();
    
    // Generate mock pulse history for the last hour
    for (let i = 0; i < 10; i++) {
      pulses.push({
        timestamp: new Date(now - i * 9000).toISOString(),
        pulse: '9s',
        status: 'active',
        metrics: {
          requestsPerSecond: Math.floor(Math.random() * 100) + 50,
          activeConnections: Math.floor(Math.random() * 500) + 200,
          uptime: process.uptime()
        }
      });
    }
    
    res.json({
      success: true,
      data: pulses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/users
 * Get list of users
 */
router.get('/users', (req, res) => {
  try {
    const users = [
      {
        id: '1',
        email: 'admin@fruitful.faa.zone',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'user@fruitful.faa.zone',
        name: 'Test User',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/users/:id
 * Get specific user
 */
router.get('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = {
      id,
      email: 'user@fruitful.faa.zone',
      name: 'Test User',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/users
 * Create new user
 */
router.post('/users', (req, res) => {
  try {
    const { email, name, role } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email and name are required'
      });
    }
    
    const user = {
      id: Date.now().toString(),
      email,
      name,
      role: role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/users/:id
 * Update user
 */
router.put('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role } = req.body;
    
    const user = {
      id,
      email: email || 'user@fruitful.faa.zone',
      name: name || 'Test User',
      role: role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/users/:id
 * Delete user
 */
router.delete('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // In production, this would delete from database
    console.log(`User deleted: ${id}`);
    
    res.json({
      success: true,
      data: { deleted: true }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
