const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  items: [{
    addonType: {
      type: String,
      enum: ['photo', 'floorplan', 'drone', 'walkthrough', 'property_unlock'],
      required: true
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  }],
  amount: {
    type: Number,
    required: [true, 'Transaction amount is required'],
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  stripePaymentIntentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['succeeded', 'requires_action', 'failed'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);