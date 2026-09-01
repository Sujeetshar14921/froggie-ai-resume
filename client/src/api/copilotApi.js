import api from "../configs/api";

/**
 * AI Career Copilot API Service
 */
export const copilotApi = {
  /**
   * Send a prompt or action to Career Copilot
   * @param {Object} payload - { chatId, message, resumeId, resumeData, jobContext, actionType, actionPayload }
   * @param {string} token
   */
  sendMessage: async (payload, token) => {
    const { data } = await api.post("/api/copilot/message", payload, {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Get list of user's past Copilot conversation sessions
   * @param {string} token
   */
  getChats: async (token) => {
    const { data } = await api.get("/api/copilot/chats", {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Get full message history for a chat
   * @param {string} chatId
   * @param {string} token
   */
  getChatById: async (chatId, token) => {
    const { data } = await api.get(`/api/copilot/chat/${chatId}`, {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Delete a chat session
   * @param {string} chatId
   * @param {string} token
   */
  deleteChat: async (chatId, token) => {
    const { data } = await api.delete(`/api/copilot/chat/${chatId}`, {
      headers: { Authorization: token },
    });
    return data;
  },

  /**
   * Clear messages in a chat
   * @param {string} chatId
   * @param {string} token
   */
  clearChat: async (chatId, token) => {
    const { data } = await api.post(
      `/api/copilot/chat/${chatId}/clear`,
      {},
      { headers: { Authorization: token } }
    );
    return data;
  },
};

export default copilotApi;
