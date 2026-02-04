const express = require('express');
const router = express.Router();
const { startConversation, sendMessage, getConversations, getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/auth'); // Assuming you have an auth middleware

// All routes require authentication
router.use(protect);

router.post('/start', startConversation);
router.post('/message', sendMessage);
router.get('/conversations', getConversations);
router.get('/:conversationId', getMessages);

module.exports = router;
