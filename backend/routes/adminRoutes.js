const express = require('express');
const { adminLogin, getAdminProfile, refreshAdminToken } = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes
router.get('/profile', authenticateAdmin, getAdminProfile);
router.post('/refresh-token', authenticateAdmin, refreshAdminToken);  // Add refresh token route

module.exports = router;