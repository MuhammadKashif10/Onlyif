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
const Property = require('../models/Property');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// All admin routes require admin role
router.use(authMiddleware, allowAdmin);

router.get('/users', asyncHandler(getAllUsers));
router.patch('/users/:id/suspend', asyncHandler(toggleUserSuspension));
router.delete('/users/:id', asyncHandler(deleteUser));
router.delete('/properties/:id', asyncHandler(deleteProperty));
router.post('/assignments/reset', asyncHandler(resetAssignments));
router.get('/terms-logs', asyncHandler(getTermsLogs));

// Add this route to your existing adminRoutes.js file
router.get('/dashboard/stats', asyncHandler(async (req, res) => {
  try {
    // Get total properties count
    const totalProperties = await Property.countDocuments({ isDeleted: false });
    
    // Get total agents count (users with role 'agent')
    const totalAgents = await User.countDocuments({ 
      role: 'agent', 
      isDeleted: false 
    });
    
    // Get total users count (all users except admins)
    const totalUsers = await User.countDocuments({ 
      role: { $in: ['buyer', 'seller', 'agent'] }, 
      isDeleted: false 
    });
    
    // Get pending approvals count (properties with status 'pending')
    const pendingApprovals = await Property.countDocuments({ 
      status: 'pending', 
      isDeleted: false 
    });
    
    // Get recent payments count (transactions from last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentPayments = await Transaction.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: 'completed'
    });
    
    // Calculate monthly revenue (sum of completed transactions this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyRevenueResult = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const monthlyRevenue = monthlyRevenueResult.length > 0 ? monthlyRevenueResult[0].total : 0;
    
    const stats = {
      totalProperties,
      totalAgents,
      totalUsers,
      pendingApprovals,
      recentPayments,
      monthlyRevenue
    };
    
    res.json({
      success: true,
      data: stats,
      message: 'Dashboard statistics retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      data: {
        totalProperties: 0,
        totalAgents: 0,
        totalUsers: 0,
        pendingApprovals: 0,
        recentPayments: 0,
        monthlyRevenue: 0
      }
    });
  }
}));
// Individual count endpoints
router.get('/properties/count', asyncHandler(async (req, res) => {
  try {
    const count = await Property.countDocuments({ isDeleted: false });
    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching properties count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties count',
      count: 0
    });
  }
}));

router.get('/agents/count', asyncHandler(async (req, res) => {
  try {
    const count = await User.countDocuments({ 
      role: 'agent', 
      isDeleted: false 
    });
    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching agents count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents count',
      count: 0
    });
  }
}));

router.get('/users/count', asyncHandler(async (req, res) => {
  try {
    const count = await User.countDocuments({ 
      role: { $in: ['buyer', 'seller', 'agent'] }, 
      isDeleted: false 
    });
    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error fetching users count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users count',
      count: 0
    });
  }
}));

router.get('/payments/monthly-revenue', asyncHandler(async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyRevenueResult = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const revenue = monthlyRevenueResult.length > 0 ? monthlyRevenueResult[0].total : 0;
    
    res.json({
      success: true,
      revenue
    });
  } catch (error) {
    console.error('Error fetching monthly revenue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch monthly revenue',
      revenue: 0
    });
  }
}));

router.get('/activity', asyncHandler(async (req, res) => {
  try {
    // Get recent activities from different sources
    const recentProperties = await Property.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('owner', 'name')
      .select('title createdAt status');
    
    const recentAgents = await User.find({ 
      role: 'agent', 
      isDeleted: false 
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name createdAt');
    
    const recentPayments = await Transaction.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('amount createdAt');
    
    // Format activities
    const activities = [];
    
    recentProperties.forEach(property => {
      activities.push({
        id: `property-${property._id}`,
        type: 'property',
        message: `New property listed: ${property.title}`,
        timestamp: property.createdAt,
        status: property.status
      });
    });
    
    recentAgents.forEach(agent => {
      activities.push({
        id: `agent-${agent._id}`,
        type: 'agent',
        message: `Agent registration: ${agent.name}`,
        timestamp: agent.createdAt,
        status: 'pending'
      });
    });
    
    recentPayments.forEach(payment => {
      activities.push({
        id: `payment-${payment._id}`,
        type: 'payment',
        message: `Payment received: $${payment.amount}`,
        timestamp: payment.createdAt,
        status: 'completed'
      });
    });
    
    // Sort by timestamp and limit to 10
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({
      success: true,
      activities: activities.slice(0, 10)
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent activity',
      activities: []
    });
  }
}));
router.delete('/properties/:id', asyncHandler(deleteProperty));
router.post('/assignments/reset', asyncHandler(resetAssignments));
router.get('/terms-logs', asyncHandler(getTermsLogs));

// New stats endpoints as requested
router.get('/stats/properties', asyncHandler(async (req, res) => {
  try {
    const total = await Property.countDocuments({ isDeleted: false });
    
    res.json({
      success: true,
      total
    });
  } catch (error) {
    console.error('Error fetching properties stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties stats'
    });
  }
}));

router.get('/stats/agents', asyncHandler(async (req, res) => {
  try {
    const total = await User.countDocuments({ 
      role: 'agent', 
      isDeleted: false 
    });
    
    res.json({
      success: true,
      total
    });
  } catch (error) {
    console.error('Error fetching agents stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agents stats'
    });
  }
}));

router.get('/stats/users', asyncHandler(async (req, res) => {
  try {
    const total = await User.countDocuments({ 
      role: { $in: ['buyer', 'seller'] }, 
      isDeleted: false 
    });
    
    res.json({
      success: true,
      total
    });
  } catch (error) {
    console.error('Error fetching users stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users stats'
    });
  }
}));

module.exports = router;