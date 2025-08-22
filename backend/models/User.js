const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['seller', 'buyer', 'agent', 'admin'],
    default: 'buyer'
  },
  // Agent-specific fields
  phone: {
    type: String,
    required: function() { return this.role === 'agent'; },
    trim: true
  },
  licenseNumber: {
    type: String,
    required: function() { return this.role === 'agent'; },
    trim: true
  },
  brokerage: {
    type: String,
    required: function() { return this.role === 'agent'; },
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    required: function() { return this.role === 'agent'; },
    min: [0, 'Years of experience cannot be negative']
  },
  specialization: {
    type: String,
    required: function() { return this.role === 'agent'; },
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  // Security fields
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  // Terms & Conditions
  termsAccepted: {
    type: Boolean,
    default: false
  },
  termsAcceptedAt: {
    type: Date,
    default: null
  },
  termsVersion: {
    type: String,
    default: null
  },
  otp: {
    type: String,
    select: false // Don't include in queries by default
  },
  otpExpiry: {
    type: Date,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isSeeded: {
    type: Boolean,
    default: false // Only true for admin accounts created via seeding
  }
}, {
  timestamps: true
});

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

module.exports = mongoose.model('User', userSchema);