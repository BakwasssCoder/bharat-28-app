const express = require('express');
const { 
  getSalesDashboard,
  getSalesReport
} = require('../controllers/salesController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Protected routes (admin only)
router.get('/dashboard', authenticateAdmin, getSalesDashboard);
router.get('/report', authenticateAdmin, getSalesReport);

module.exports = router;