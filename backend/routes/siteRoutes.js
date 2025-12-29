const express = require('express');
const { 
  getAllSiteContent,
  getSiteContentByKey
} = require('../controllers/siteController');

const router = express.Router();

// Public routes (for website)
router.get('/content', getAllSiteContent);
router.get('/content/:key', getSiteContentByKey);

module.exports = router;