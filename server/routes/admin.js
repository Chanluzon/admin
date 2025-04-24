const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  // Skip token verification for login and health check
  if (req.path === '/login' || req.path === '/health') {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization header' });
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  next();
};

// Apply middleware to all routes
router.use(verifyAdminToken);

// Health check endpoint (no auth required)
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Admin routes are working' });
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    res.json({ 
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const db = admin.database();
    const snapshot = await db.ref('users').once('value');
    const users = snapshot.val() || {};
    res.json(Object.values(users));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get usage statistics
router.get('/usage-stats', async (req, res) => {
  try {
    const db = admin.database();
    const usersSnapshot = await db.ref('users').once('value');
    const users = usersSnapshot.val() || {};
    
    // Get daily login usage for the last 7 days
    const dailyLoginUsage = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const usersLoggedIn = Object.values(users).filter(user => {
        if (!user.lastLoginDate) return false;
        const loginDate = new Date(user.lastLoginDate).toISOString().split('T')[0];
        return loginDate === dateStr;
      });

      dailyLoginUsage.push({
        date: dateStr,
        count: usersLoggedIn.length,
        users: usersLoggedIn.map(user => ({
          email: user.email,
          accountType: user.accountType,
          loginTime: user.lastLoginDate
        }))
      });
    }

    res.json({
      dailyLoginUsage,
      totalUsers: Object.keys(users).length
    });
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    res.status(500).json({ error: 'Failed to fetch usage statistics' });
  }
});

module.exports = router; 