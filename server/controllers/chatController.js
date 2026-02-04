const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Start or get existing conversation
exports.startConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id; // From auth middleware

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId]
      });
      await conversation.save();
    }

    // Populate participants info
    await conversation.populate('participants', 'name email role storeName');

    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user.id;

    const message = new Message({
      conversationId,
      sender: senderId,
      text
    });

    await message.save();

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageDate: Date.now()
    });

    // Populate sender info for the socket event
    await message.populate('sender', 'name email');

    // Emit socket event (if io is available in req.app)
    const io = req.app.get('io');
    if (io) {
      io.to(conversationId).emit('receive_message', message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all conversations for the current user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: { $in: [userId] }
    })
    .populate('participants', 'name email role storeName')
    .sort({ lastMessageDate: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get messages for a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 }); // Oldest first

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
