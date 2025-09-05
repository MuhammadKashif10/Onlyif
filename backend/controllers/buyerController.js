const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const stripeService = require('../services/stripeService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const BuyerProfile = require('../models/BuyerProfile');
const BuyerNotification = require('../models/BuyerNotification');
const SavedSearch = require('../models/SavedSearch');
const { formatResponse } = require('../utils/responseFormatter');

// @desc    Purchase property unlock ($49)
// @route   POST /api/buyer/unlock-property
// @access  Private (Buyer only)
const unlockProperty = async (req, res) => {
  const { propertyId, paymentData } = req.body;

  // Validate property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json(
      errorResponse('Property not found', 404)
    );
  }

  // Check if user is a buyer
  if (req.user.role !== 'buyer') {
    return res.status(403).json(
      errorResponse('Only buyers can unlock properties', 403)
    );
  }

  // Check if property is already unlocked by this user
  const existingTransaction = await Transaction.findOne({
    user: req.user.id,
    property: propertyId,
    items: { $elemMatch: { addonType: 'property_unlock' } },
    status: 'succeeded'
  });

  if (existingTransaction) {
    return res.status(400).json(
      errorResponse('Property already unlocked by this user', 400)
    );
  }

  const unlockAmount = 4900; // A$49.00 in cents
  // Create Stripe PaymentIntent for property unlock
  const paymentIntent = await stripeService.createPaymentIntent(
    unlockAmount,
    'aud', // Changed from 'usd' to 'aud'
    {
      userId: req.user.id,
      propertyId,
      type: 'property_unlock'
    }
  );

  // Create transaction record
  const transaction = await Transaction.create({
    user: req.user.id,
    property: propertyId,
    items: [{
      addonType: 'property_unlock',
      unitPrice: unlockAmount,
      qty: 1
    }],
    amount: unlockAmount,
    stripePaymentIntentId: paymentIntent.id,
    status: paymentIntent.status
  });

  // If payment succeeded (for demo purposes, we'll mark as succeeded)
  if (paymentIntent.status === 'succeeded' || process.env.NODE_ENV === 'development') {
    // Update transaction status
    transaction.status = 'succeeded';
    await transaction.save();
  
    // Update user's unlocked properties (if you have such a field)
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { unlockedProperties: propertyId }
    });
  }

  res.json(
    successResponse({
      success: true,
      data: {
        transactionId: transaction._id,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: unlockAmount,
        status: transaction.status,
        propertyId: propertyId,
        userName: req.user.name
      }
    }, 'Property unlock payment processed successfully')
  );
};

// @desc    Get buyer's unlocked properties
// @route   GET /api/buyer/unlocked-properties
// @access  Private (Buyer only)
const getUnlockedProperties = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all successful transactions for property unlocks by this user
    const transactions = await Transaction.find({
      user: userId,
      items: { $elemMatch: { addonType: 'property_unlock' } },
      status: 'succeeded'
    }).populate('property');

    // Extract property IDs
    const unlockedPropertyIds = transactions.map(t => t.property._id);
    
    // Get full property details
    const unlockedProperties = await Property.find({
      _id: { $in: unlockedPropertyIds },
      isDeleted: false
    }).populate('owner', 'firstName lastName email');

    res.json({
      success: true,
      data: unlockedProperties
    });
  } catch (error) {
    console.error('Error fetching unlocked properties:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const createProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const profileData = { ...req.body, userId };
    
    // Check if profile already exists
    const existingProfile = await BuyerProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json(formatResponse(false, 'Profile already exists', null));
    }
    
    const profile = new BuyerProfile(profileData);
    await profile.save();
    
    res.status(201).json(formatResponse(true, 'Profile created successfully', profile));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error creating profile', null, error.message));
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const profile = await BuyerProfile.findOne({ userId }).populate('userId', 'name email');
    
    if (!profile) {
      return res.status(404).json(formatResponse(false, 'Profile not found', null));
    }
    
    res.json(formatResponse(true, 'Profile retrieved successfully', profile));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error retrieving profile', null, error.message));
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const updates = req.body;
    
    const profile = await BuyerProfile.findOneAndUpdate(
      { userId },
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!profile) {
      return res.status(404).json(formatResponse(false, 'Profile not found', null));
    }
    
    res.json(formatResponse(true, 'Profile updated successfully', profile));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error updating profile', null, error.message));
  }
};

// Notifications Management
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const query = { userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }
    
    const notifications = await BuyerNotification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await BuyerNotification.countDocuments(query);
    
    res.json(formatResponse(true, 'Notifications retrieved successfully', {
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error retrieving notifications', null, error.message));
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user;
    const { notificationId } = req.params;
    
    const notification = await BuyerNotification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true, readAt: Date.now() },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json(formatResponse(false, 'Notification not found', null));
    }
    
    res.json(formatResponse(true, 'Notification marked as read', notification));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error marking notification as read', null, error.message));
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    const { userId } = req.user;
    
    await BuyerNotification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: Date.now() }
    );
    
    res.json(formatResponse(true, 'All notifications marked as read', null));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error marking all notifications as read', null, error.message));
  }
};

const createSavedSearch = async (req, res) => {
  try {
    const { userId } = req.user;
    const searchData = { ...req.body, userId };
    
    const savedSearch = new SavedSearch(searchData);
    await savedSearch.save();
    
    res.status(201).json(formatResponse(true, 'Saved search created successfully', savedSearch));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error creating saved search', null, error.message));
  }
};

const getSavedSearches = async (req, res) => {
  try {
    const { userId } = req.user;
    const savedSearches = await SavedSearch.find({ userId, isActive: true }).sort({ createdAt: -1 });
    
    res.json(formatResponse(true, 'Saved searches retrieved successfully', savedSearches));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error retrieving saved searches', null, error.message));
  }
};

const updateSavedSearch = async (req, res) => {
  try {
    const { userId } = req.user;
    const { searchId } = req.params;
    const updates = req.body;
    
    const savedSearch = await SavedSearch.findOneAndUpdate(
      { _id: searchId, userId },
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!savedSearch) {
      return res.status(404).json(formatResponse(false, 'Saved search not found', null));
    }
    
    res.json(formatResponse(true, 'Saved search updated successfully', savedSearch));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error updating saved search', null, error.message));
  }
};

const deleteSavedSearch = async (req, res) => {
  try {
    const { userId } = req.user;
    const { searchId } = req.params;
    
    const savedSearch = await SavedSearch.findOneAndUpdate(
      { _id: searchId, userId },
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!savedSearch) {
      return res.status(404).json(formatResponse(false, 'Saved search not found', null));
    }
    
    res.json(formatResponse(true, 'Saved search deleted successfully', null));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error deleting saved search', null, error.message));
  }
};

const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.user;
    
    // Get buyer profile to understand preferences
    const profile = await BuyerProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json(formatResponse(false, 'Buyer profile not found', null));
    }
    
    // Build query based on preferences
    const query = {
      isDeleted: false,
      status: 'active'
    };
    
    // Add budget filter
    if (profile.preferences.budget) {
      query.price = {
        $gte: profile.preferences.budget.minPrice || 0,
        $lte: profile.preferences.budget.maxPrice || 999999999
      };
    }
    
    // Add property type filter
    if (profile.preferences.propertyTypes && profile.preferences.propertyTypes.length > 0) {
      query.propertyType = { $in: profile.preferences.propertyTypes };
    }
    
    // Add location filter
    if (profile.preferences.location && profile.preferences.location.preferredCities && profile.preferences.location.preferredCities.length > 0) {
      query.city = { $in: profile.preferences.location.preferredCities };
    }
    
    // Add features filter
    if (profile.preferences.features) {
      if (profile.preferences.features.minBedrooms) {
        query.bedrooms = { $gte: profile.preferences.features.minBedrooms };
      }
      if (profile.preferences.features.minBathrooms) {
        query.bathrooms = { $gte: profile.preferences.features.minBathrooms };
      }
      if (profile.preferences.features.minSquareFootage) {
        query.squareFootage = { $gte: profile.preferences.features.minSquareFootage };
      }
    }
    
    const recommendations = await Property.find(query)
      .populate('owner', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(formatResponse(true, 'Recommendations retrieved successfully', recommendations));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error retrieving recommendations', null, error.message));
  }
};

// Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.user;
    
    const [savedPropertiesCount, viewedPropertiesCount, savedSearchesCount, unreadNotifications] = await Promise.all([
      // You'll need to implement saved properties functionality
      0, // Placeholder
      0, // Placeholder - track viewed properties
      SavedSearch.countDocuments({ userId, isActive: true }),
      BuyerNotification.countDocuments({ userId, isRead: false })
    ]);
    
    const stats = {
      savedProperties: savedPropertiesCount,
      viewedProperties: viewedPropertiesCount,
      savedSearches: savedSearchesCount,
      unreadNotifications
    };
    
    res.json(formatResponse(true, 'Dashboard stats retrieved successfully', stats));
  } catch (error) {
    res.status(500).json(formatResponse(false, 'Error retrieving dashboard stats', null, error.message));
  }
};

module.exports = {
  unlockProperty,
  getUnlockedProperties,
  createProfile,
  getProfile,
  updateProfile,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createSavedSearch,
  getSavedSearches,
  updateSavedSearch,
  deleteSavedSearch,
  getRecommendations,
  getDashboardStats
};