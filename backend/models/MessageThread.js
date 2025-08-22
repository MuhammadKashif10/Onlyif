const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Message text is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const messageThreadSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  context: {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    kind: {
      type: String,
      enum: ['buyer-agent', 'agent-seller'],
      required: true
    }
  },
  messages: [messageSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('MessageThread', messageThreadSchema);