const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const {
  getAllAgents,
  getTopAgents,
  getAgentById,
  searchAgents,
  getAgentsByArea,
  getGeneralStats
} = require('../controllers/agentsController');

// Get all agents
router.get('/', asyncHandler(getAllAgents));

// Get top performing agents
router.get('/top', asyncHandler(getTopAgents));

// Get general statistics
router.get('/stats', asyncHandler(getGeneralStats));

// Search agents
router.get('/search', asyncHandler(searchAgents));

// Get agents by area
router.get('/area/:area', asyncHandler(getAgentsByArea));

// Get specific agent by ID
router.get('/:id', asyncHandler(getAgentById));

module.exports = router;