const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Notification type is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true
  },
  body: {
    type: String,
    required: [true, 'Notification body is required'],
    trim: true
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);