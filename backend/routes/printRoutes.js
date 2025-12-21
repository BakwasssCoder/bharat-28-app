const express = require('express');
const { printKOT, printBill } = require('../controllers/printController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Protected routes (admin only)
router.post('/kot/:orderId', authenticateAdmin, printKOT);
router.post('/bill/:orderId', authenticateAdmin, printBill);

module.exports = router;