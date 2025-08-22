const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');
const { getSellerProperties } = require('../controllers/propertyController');

// All seller routes require authentication
router.use(authMiddleware);

router.get('/properties', asyncHandler(getSellerProperties));

module.exports = router;