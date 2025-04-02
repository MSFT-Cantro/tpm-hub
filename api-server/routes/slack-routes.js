import express from 'express';
import SlackMessenger from '../utils/slack-messenger.js';

const router = express.Router();

// POST /slack-message
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message content is required' 
      });
    }
    
    const slackMessenger = new SlackMessenger();
    const result = await slackMessenger.sendMessage(message);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
    
  } catch (error) {
    console.error('Slack message error:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Server error: ${error.message}` 
    });
  }
});

export default router;