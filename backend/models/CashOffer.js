const mongoose = require('mongoose');

const cashOfferSchema = new mongoose.Schema({
  // Property Information
  address: {
    type: String,
    required: [true, 'Property address is required'],
    trim: true
  },
  zipCode: {
    type: String,
    required: [true, 'ZIP code is required'],
    trim: true
  },
  
  // Contact Information
  contactName: {
    type: String,
    required: [true, 'Contact name is required'],
    trim: true
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  
  // Offer Details
  offerId: {
    type: String,
    unique: true,
    required: true
  },
  estimatedValue: {
    type: Number,
    min: 0
  },
  offerAmount: {
    type: Number,
    min: 0
  },
  
  // Property Details (populated after inspection)
  propertyType: {
    type: String,
    trim: true,
    default: 'Single Family Home'
  },
  bedrooms: {
    type: Number,
    min: 0,
    default: 3
  },
  bathrooms: {
    type: Number,
    min: 0,
    default: 2
  },
  squareFootage: {
    type: Number,
    min: 0,
    default: 1800
  },
  
  // Flow Status
  status: {
    type: String,
    enum: ['submitted', 'inspection_scheduled', 'offer_made', 'accepted', 'closed', 'cancelled'],
    default: 'submitted'
  },
  
  // Inspection Details
  inspectionDate: {
    type: Date
  },
  inspectionTimeSlot: {
    type: String
  },
  inspectionStatus: {
    type: String,
    enum: ['pending', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Closing Details
  estimatedClosingDate: {
    type: String,
    default: 'Within 7-14 days'
  },
  fees: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String
    }
  }],
  netProceeds: {
    type: Number,
    min: 0
  },
  
  // Closing Checklist
  closingChecklist: [{
    itemId: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    }
  }],
  
  // Timestamps and Notes
  notes: {
    type: String,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date
  },
  closedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate unique offer ID
cashOfferSchema.pre('save', function(next) {
  if (!this.offerId) {
    this.offerId = `OFF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  
  // Set default fees if not provided
  if (!this.fees || this.fees.length === 0) {
    this.fees = [
      {
        name: 'Property Inspection',
        amount: 500,
        description: 'Professional inspection and assessment'
      },
      {
        name: 'Title Search & Insurance',
        amount: 1200,
        description: 'Legal title verification and insurance'
      },
      {
        name: 'Closing Costs',
        amount: 2500,
        description: 'Escrow, recording, and other closing fees'
      },
      {
        name: 'Processing Fee',
        amount: 800,
        description: 'Document processing and administrative costs'
      }
    ];
  }
  
  // Calculate net proceeds
  if (this.offerAmount && this.fees) {
    const totalFees = this.fees.reduce((sum, fee) => sum + fee.amount, 0);
    this.netProceeds = this.offerAmount - totalFees;
  }
  
  next();
});

// Index for efficient queries
cashOfferSchema.index({ contactEmail: 1 });
cashOfferSchema.index({ offerId: 1 });
cashOfferSchema.index({ status: 1 });
cashOfferSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CashOffer', cashOfferSchema);