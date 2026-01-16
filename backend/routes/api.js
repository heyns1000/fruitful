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

module.exports = router;
