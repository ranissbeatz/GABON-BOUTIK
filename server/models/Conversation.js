const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageDate: {
    type: Date,
    default: Date.now
  },
  // To handle unread counts if needed later
  unreadCounts: {
    type: Map,
    of: Number,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);
