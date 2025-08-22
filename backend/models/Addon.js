const mongoose = require('mongoose');

const addonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['photo', 'floorplan', 'drone', 'walkthrough'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Addon title is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  features: [{
    type: String,
    trim: true
  }],
  image: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  purchasedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Addon', addonSchema);