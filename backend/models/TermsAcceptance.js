const mongoose = require('mongoose');

const termsAcceptanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['seller', 'buyer', 'agent', 'admin'],
    required: true
  },
  version: {
    type: String,
    required: [true, 'Terms version is required'],
    trim: true
  },
  acceptedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure one acceptance per user per version
termsAcceptanceSchema.index({ user: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('TermsAcceptance', termsAcceptanceSchema);