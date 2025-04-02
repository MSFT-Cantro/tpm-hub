import * as msal from 'msal';
import axios from 'axios';

/**
 * Utility class for sending messages to Microsoft Teams using Entra ID for authentication
 */
class TeamsMessenger {
  constructor() {
    this.clientId = process.env.MS_CLIENT_ID;
    this.clientSecret = process.env.MS_CLIENT_SECRET;
    this.tenantId = process.env.MS_TENANT_ID;
    this.chatId = process.env.TEAMS_CHAT_ID;
    
    this.isConfigured = !!(this.clientId && this.clientSecret && 
                          this.tenantId && this.chatId);
  }

  /**
   * Get access token using Microsoft Entra ID authentication
   */
  async getAccessToken() {
    if (!this.isConfigured) {
      throw new Error('Teams API not configured. Please check your environment variables.');
    }
    
    try {
      const app = new msal.ConfidentialClientApplication({
        auth: {
          clientId: this.clientId,
          authority: `https://login.microsoftonline.com/${this.tenantId}`,
          clientSecret: this.clientSecret
        }
      });
      
      // Acquire token for Microsoft Graph API
      const result = await app.acquireTokenByClientCredential({
        scopes: ["https://graph.microsoft.com/.default"]
      });
      
      if (result.accessToken) {
        return result.accessToken;
      } else {
        throw new Error(`Failed to obtain access token: ${result.errorDescription || 'Unknown error'}`);
      }
    } catch (error) {
      throw new Error(`Authentication error: ${error.message}`);
    }
  }
  
  /**
   * Send a message to Teams chat
   */
  async sendMessage(message) {
    if (!this.isConfigured) {
      throw new Error('Teams API not configured. Please check your environment variables.');
    }
    
    try {
      const token = await this.getAccessToken();
      
      // Format message as Teams chat message
      const teamsMessage = {
        body: {
          contentType: "html",
          content: `<pre>${message}</pre>`
        }
      };
      
      // Chat message endpoint
      const endpoint = `https://graph.microsoft.com/v1.0/chats/${this.chatId}/messages`;
      
      const response = await axios.post(endpoint, teamsMessage, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: "Message sent successfully!" };
      } else {
        return { success: false, message: `Failed to send message: ${response.statusText}` };
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      return { success: false, message: `Error sending Teams message: ${errorMessage}` };
    }
  }
}

export default TeamsMessenger;