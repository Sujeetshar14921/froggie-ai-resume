import Resume from "../models/Resume.js";
import CopilotChat from "../models/CopilotChat.js";
import ai from "../configs/ai.js";
import {
  COPILOT_SYSTEM_PROMPT,
  formatResumeContext,
  buildConversationHistory,
  normalizeCopilotResponse,
  generateSmartFallback,
} from "../services/copilot/index.js";

/**
 * POST /api/copilot/message
 * Send message to AI Career Copilot with resume and job context
 */
export const sendMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      chatId,
      message,
      resumeId,
      resumeData,
      jobContext,
      actionType,
      actionPayload,
    } = req.body;

    if (!message && !actionType) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // 1. Find or create Chat Session
    let chat = null;
    if (chatId) {
      chat = await CopilotChat.findOne({ _id: chatId, userId });
    }

    if (!chat) {
      chat = new CopilotChat({
        userId,
        resumeId: resumeId || null,
        title: message ? message.slice(0, 35) + "..." : "Career Chat",
        jobContext: jobContext || "",
        messages: [],
      });
    }

    if (jobContext) {
      chat.jobContext = jobContext;
    }

    // 2. Resolve Active Candidate Resume Context
    let currentResume = resumeData;
    if (!currentResume && (resumeId || chat.resumeId)) {
      currentResume = await Resume.findOne({
        _id: resumeId || chat.resumeId,
        userId,
      });
    }

    const formattedResume = formatResumeContext(currentResume);

    // 3. Build Conversation History Context
    const recentMessages = buildConversationHistory(chat.messages, 8);

    // Formulate User Prompt with optional system actions
    let userPromptContent = message || "";
    if (actionType) {
      userPromptContent = `[SYSTEM ACTION: ${actionType}]
User request: ${message || "Perform " + actionType}
Payload: ${JSON.stringify(actionPayload || {})}
Active Job Context: ${chat.jobContext || "None specified"}`;
    } else if (chat.jobContext) {
      userPromptContent += `\n\n[Active Job Context in conversation: ${chat.jobContext}]`;
    }

    const fullMessages = [
      { role: "system", content: COPILOT_SYSTEM_PROMPT },
      {
        role: "system",
        content: `Active Candidate Resume Context:\n${formattedResume}\n\nActive Target Job Context:\n${
          chat.jobContext || "None yet provided."
        }`,
      },
      ...recentMessages,
      { role: "user", content: userPromptContent },
    ];

    // 4. Call AI Model with Intelligent Fallback
    let aiRawOutput = "";
    let parsedResponse = {};

    try {
      const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gemini-3.5-flash",
        messages: fullMessages,
        response_format: { type: "json_object" },
      });

      aiRawOutput = response.choices[0]?.message?.content?.trim() || "";
      parsedResponse = JSON.parse(aiRawOutput);
    } catch (aiErr) {
      console.warn("AI Model API call failed, generating smart fallback:", aiErr.message);
      parsedResponse = generateSmartFallback(message, currentResume);
    }

    // 5. Run Universal Normalizer with Current Resume context
    const normalized = normalizeCopilotResponse(parsedResponse, aiRawOutput, currentResume);

    // 6. Save message history to database
    chat.messages.push({
      role: "user",
      content: userPromptContent,
      cardType: "none",
      cardData: null,
      timestamp: new Date(),
    });

    chat.messages.push({
      role: "assistant",
      content: normalized.content,
      cardType: normalized.cardType,
      cardData: normalized.cardData,
      timestamp: new Date(),
    });

    await chat.save();

    return res.status(200).json({
      chatId: chat._id,
      reply: {
        role: "assistant",
        content: normalized.content,
        cardType: normalized.cardType,
        cardData: normalized.cardData,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Copilot Message Error:", error);
    return res.status(500).json({ message: error.message || "Failed to process Copilot request" });
  }
};

/**
 * GET /api/copilot/chats
 * List all chat sessions for user
 */
export const getUserChats = async (req, res) => {
  try {
    const userId = req.userId;
    const chats = await CopilotChat.find({ userId })
      .select("title resumeId jobContext createdAt updatedAt messages")
      .sort({ updatedAt: -1 })
      .limit(20);

    const formatted = chats.map((c) => ({
      _id: c._id,
      title: c.title,
      resumeId: c.resumeId,
      jobContext: c.jobContext,
      updatedAt: c.updatedAt,
      messageCount: c.messages?.length || 0,
    }));

    return res.status(200).json({ chats: formatted });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch chat history" });
  }
};

export const getChats = getUserChats;

/**
 * GET /api/copilot/chats/:chatId
 * Load full messages of a specific chat session
 */
export const getChatById = async (req, res) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    const chat = await CopilotChat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    return res.status(200).json({ chat });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load chat session" });
  }
};

/**
 * DELETE /api/copilot/chats/:chatId
 * Delete a chat session
 */
export const deleteChat = async (req, res) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    await CopilotChat.findOneAndDelete({ _id: chatId, userId });
    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to delete chat" });
  }
};

/**
 * POST /api/copilot/chat/:chatId/clear
 * Clear all messages in a chat session
 */
export const clearChatMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    const chat = await CopilotChat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    chat.messages = [];
    await chat.save();

    return res.status(200).json({ message: "Chat messages cleared successfully", chat });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to clear chat messages" });
  }
};

export default {
  sendMessage,
  getUserChats,
  getChats,
  getChatById,
  deleteChat,
  clearChatMessages,
};
