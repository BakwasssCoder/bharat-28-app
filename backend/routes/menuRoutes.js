const express = require('express');
const { 
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuController');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Protected routes (admin only)
router.get('/categories', authenticateAdmin, getCategories);
router.post('/categories', authenticateAdmin, createCategory);
router.put('/categories/:id', authenticateAdmin, updateCategory);
router.delete('/categories/:id', authenticateAdmin, deleteCategory);

router.get('/items', authenticateAdmin, getMenuItems);
router.post('/items', authenticateAdmin, createMenuItem);
router.put('/items/:id', authenticateAdmin, updateMenuItem);
router.delete('/items/:id', authenticateAdmin, deleteMenuItem);

module.exports = router;