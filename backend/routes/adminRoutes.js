const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { allowAdmin } = require('../middleware/roleMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');
const {
  getAllUsers,
  toggleUserSuspension,
  deleteUser,
  deleteProperty,
  resetAssignments,
  getTermsLogs
} = require('../controllers/adminController');

// All admin routes require admin role
router.use(authMiddleware, allowAdmin);

router.get('/users', asyncHandler(getAllUsers));
router.patch('/users/:id/suspend', asyncHandler(toggleUserSuspension));
router.delete('/users/:id', asyncHandler(deleteUser));
router.delete('/properties/:id', asyncHandler(deleteProperty));
router.post('/assignments/reset', asyncHandler(resetAssignments));
router.get('/terms-logs', asyncHandler(getTermsLogs));

module.exports = router;