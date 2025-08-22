const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');
const { unlockProperty, getUnlockedProperties } = require('../controllers/buyerController');

// All buyer routes require authentication
router.use(authMiddleware);

router.post('/unlock-property', asyncHandler(unlockProperty));
router.get('/unlocked-properties', asyncHandler(getUnlockedProperties));

module.exports = router;