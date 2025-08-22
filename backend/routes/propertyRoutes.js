const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  assignAgent,
  getPriceCheck,
  getSellerProperties,
  getPropertyStats,
  submitPropertyPublic,
  getFilterOptions  // Add this import
} = require('../controllers/propertyController');

// Public routes
router.get('/', asyncHandler(getAllProperties));
router.get('/stats', asyncHandler(getPropertyStats));
router.get('/filter-options', asyncHandler(getFilterOptions));  // Add this route
router.get('/:id', asyncHandler(getPropertyById));
router.get('/:id/price-check', asyncHandler(getPriceCheck));
router.post('/public-submit', asyncHandler(submitPropertyPublic));

// Protected routes (require authentication)
router.post('/', authMiddleware, asyncHandler(createProperty));
router.put('/:id', authMiddleware, asyncHandler(updateProperty));
router.delete('/:id', authMiddleware, asyncHandler(deleteProperty));
router.post('/:id/assign-agent', authMiddleware, asyncHandler(assignAgent));

module.exports = router;