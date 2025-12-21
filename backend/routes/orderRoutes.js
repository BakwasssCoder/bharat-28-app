const express = require('express');
const { 
  createOrder, 
  createPOSOrder, 
  getAllOrders, 
  getOrderById,
  confirmOrder,
  cancelOrder,
  reverseOrder,
  deleteOrder  // Add the new function
} = require('../controllers/orderController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Protected routes (admin only)
router.post('/', authenticateAdmin, createOrder);
router.get('/', authenticateAdmin, getAllOrders);
router.get('/:id', authenticateAdmin, getOrderById);
router.put('/:id/confirm', authenticateAdmin, confirmOrder);
router.put('/:id/cancel', authenticateAdmin, cancelOrder);
router.put('/:id/reverse', authenticateAdmin, reverseOrder);
router.delete('/:id', authenticateAdmin, deleteOrder);  // Add the new route

// Public route (for POS systems)
router.post('/pos', createPOSOrder);

module.exports = router;