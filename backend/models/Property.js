const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make owner optional for public submissions
  },
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'Zip code is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  beds: {
    type: Number,
    required: true,
    min: 0
  },
  baths: {
    type: Number,
    required: true,
    min: 0
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  yearBuilt: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear() + 1
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  mainImage: {
    type: String
  },
  status: {
    type: String,
    enum: ['public', 'private', 'pending'],
    default: 'pending'
  },
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  featured: {
    type: Boolean,
    default: false
  },
  dateListed: {
    type: Date,
    default: Date.now
  },
  daysOnMarket: {
    type: Number,
    default: 0
  },
  addons: [{
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Addon'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  }]
}, {
  timestamps: true
});

// Calculate days on market
propertySchema.pre('save', function(next) {
  if (this.dateListed) {
    const now = new Date();
    const listed = new Date(this.dateListed);
    this.daysOnMarket = Math.floor((now - listed) / (1000 * 60 * 60 * 24));
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);