// Import WebClient correctly for ES modules
import pkg from 'slack-sdk';
const { WebClient } = pkg;

/**
 * Utility class for sending messages to Slack
 */
class SlackMessenger {
  constructor() {
    this.botToken = process.env.SLACK_BOT_TOKEN;
    this.channelId = process.env.SLACK_CHANNEL_ID;
    
    this.isConfigured = !!(this.botToken && this.channelId);
  }
  
  /**
   * Send a message to Slack channel
   */
  async sendMessage(message) {
    if (!this.isConfigured) {
      throw new Error('Slack API not configured. Please check your environment variables.');
    }
    
    try {
      // Verify token starts with xoxb- (bot token)
      if (!this.botToken.startsWith('xoxb-')) {
        return {
          success: false,
          message: "Invalid token type. Please use a Bot Token that starts with 'xoxb-'. " +
                  "Create a Slack app with chat:write permissions and install it to your workspace."
        };
      }
      
      const client = new WebClient(this.botToken);
      
      // Send the message
      const response = await client.chat.postMessage({
        channel: this.channelId,
        text: message,
        mrkdwn: true // Enable markdown formatting
      });
      
      if (response.ok) {
        return { success: true, message: "Message sent successfully!" };
      } else {
        return { success: false, message: `Failed to send message: Unknown error` };
      }
      
    } catch (error) {
      // Handle specific Slack API errors with guidance
      if (error.code === "slack_webapi_platform_error") {
        const errorType = error.data?.error || "unknown_error";
        let guidance = "";
        
        switch (errorType) {
          case "not_allowed_token_type":
            guidance = "\nPlease ensure you're using a Bot Token (starts with xoxb-) and not a User Token or Classic Token. " +
                      "Create a Slack app with chat:write permissions and install it to your workspace.";
            break;
            
          case "channel_not_found":
            guidance = "\nPlease check your SLACK_CHANNEL_ID value. Use the actual ID (e.g., C0123456789), not the channel name.";
            break;
            
          case "invalid_auth":
            guidance = "\nYour token appears to be invalid. Generate a new Bot Token from your Slack app.";
            break;
        }
        
        return { success: false, message: `Error sending Slack message: ${errorType}${guidance}` };
      }
      
      return { success: false, message: `Error sending Slack message: ${error.message}` };
    }
  }
}

export default SlackMessenger;