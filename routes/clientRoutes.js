const express = require('express');
const router = express.Router();
const { getClientPurchases,getClientProfile } = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware'); // Aapka JWT middleware

// GET /api/client/my-sales
router.get('/my-sales', protect, getClientPurchases);
router.get('/clientProfile',protect,getClientProfile)
module.exports = router;