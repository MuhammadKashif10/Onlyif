const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');
const { getSellerProperties } = require('../controllers/propertyController');
const { getSellerOverview, getSellerListings } = require('../controllers/sellerController');

// All seller routes require authentication
router.use(authMiddleware);

// Seller overview statistics
router.get('/:id/overview', asyncHandler(getSellerOverview));

// Seller listings (enhanced version)
router.get('/:id/listings', asyncHandler(getSellerListings));

// Legacy route (keeping for backward compatibility)
router.get('/properties', asyncHandler(getSellerProperties));

module.exports = router;