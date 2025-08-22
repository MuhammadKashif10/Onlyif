const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const stripeService = require('../services/stripeService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

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

  const unlockAmount = 4900; // $49.00 in cents

  try {
    // Create Stripe PaymentIntent for property unlock
    const paymentIntent = await stripeService.createPaymentIntent(
      unlockAmount,
      'usd',
      {
        propertyId: propertyId,
        userId: req.user.id,
        userName: req.user.name,
        service: 'property_unlock'
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
  } catch (error) {
    console.error('Property unlock payment error:', error);
    res.status(500).json(
      errorResponse('Payment processing failed', 500)
    );
  }
};

// @desc    Get buyer's unlocked properties
// @route   GET /api/buyer/unlocked-properties
// @access  Private (Buyer only)
const getUnlockedProperties = async (req, res) => {
  if (req.user.role !== 'buyer') {
    return res.status(403).json(
      errorResponse('Only buyers can access this endpoint', 403)
    );
  }

  try {
    const transactions = await Transaction.find({
      user: req.user.id,
      items: { $elemMatch: { addonType: 'property_unlock' } },
      status: 'succeeded'
    }).populate('property', 'title address price images');

    const unlockedProperties = transactions.map(t => ({
      transactionId: t._id,
      property: t.property,
      unlockedAt: t.createdAt,
      amount: t.amount
    }));

    res.json(
      successResponse(unlockedProperties, 'Unlocked properties retrieved successfully')
    );
  } catch (error) {
    console.error('Error fetching unlocked properties:', error);
    res.status(500).json(
      errorResponse('Failed to fetch unlocked properties', 500)
    );
  }
};

// Remove the duplicate unlockProperty function (lines 140-190)
// Keep only the first implementation which is more complete

module.exports = {
  unlockProperty,
  getUnlockedProperties
};