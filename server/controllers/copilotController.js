import Resume from "../models/Resume.js";
import User from "../models/User.js";
import CopilotChat from "../models/CopilotChat.js";
import ai from "../configs/ai.js";
import {
  COPILOT_SYSTEM_PROMPT,
  formatUserAndResumeContext,
  buildConversationHistory,
  normalizeCopilotResponse,
  generateSmartFallback,
  getGeminiToolsDeclaration,
  executeCopilotTool,
} from "../services/copilot/index.js";

/**
 * POST /api/copilot/message
 * Send message to AI Career Copilot with verified user isolation, tool calling, and resume context
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

    // 1. Authenticate and retrieve user profile from DB (never trust body user_id)
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authenticated user not found. Please log in again." });
    }

    // 2. Fetch summary of user's own resumes from DB (ensures cross-user isolation)
    const userResumesList = await Resume.find({ userId })
      .select("title _id createdAt updatedAt personal_info.full_name personal_info.profession skills")
      .sort({ updatedAt: -1 })
      .lean();

    // 3. Find or create Chat Session strictly scoped to userId
    let chat = null;
    if (chatId) {
      chat = await CopilotChat.findOne({ _id: chatId, userId });
      if (!chat) {
        return res.status(403).json({
          message:
            "Access denied. Chat session not found or does not belong to your account.",
        });
      }
    }

    if (!chat) {
      chat = new CopilotChat({
        userId,
        resumeId: null,
        title: message ? message.slice(0, 35) + "..." : "Career Chat",
        jobContext: jobContext || "",
        messages: [],
      });
    }

    if (jobContext) {
      chat.jobContext = jobContext;
    }

    // 4. Resolve Active Resume Context with STRICT ownership verification
    let currentResume = null;

    if (resumeId) {
      const verifiedResume = await Resume.findOne({ _id: resumeId, userId });
      if (!verifiedResume) {
        return res.status(403).json({
          message:
            "Access denied. The specified resume does not exist or does not belong to your account.",
        });
      }
      chat.resumeId = verifiedResume._id;

      if (resumeData) {
        currentResume = {
          ...verifiedResume.toObject(),
          ...resumeData,
          _id: verifiedResume._id,
          userId: user._id,
        };
      } else {
        currentResume = verifiedResume;
      }
    } else if (chat.resumeId) {
      const chatResume = await Resume.findOne({ _id: chat.resumeId, userId });
      if (chatResume) {
        currentResume = chatResume;
      }
    }

    if (!currentResume && userResumesList.length > 0) {
      const latestResume = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
      if (latestResume) {
        currentResume = latestResume;
        chat.resumeId = latestResume._id;
      }
    }

    // 5. Build Structured AI Context clearly distinguishing Account Holder vs Resume Document
    const formattedContext = formatUserAndResumeContext({
      user,
      resume: currentResume,
      resumesCount: userResumesList.length,
      userResumesList,
    });

    // 6. Build Conversation History Context
    const recentMessages = buildConversationHistory(chat.messages, 8);

    let userPromptContent = message || "";
    let directToolExecution = null;

    // If this request is an explicit confirmation of a previous action
    if (actionType === "confirm_action" || (actionPayload && actionPayload.confirmed)) {
      const targetTool = actionPayload?.actionType || actionType;
      directToolExecution = await executeCopilotTool({
        toolName: targetTool,
        args: actionPayload || {},
        userId,
        user,
        activeResumeId: currentResume?._id,
        currentResume,
        aiClient: ai,
      });
    } else if (actionType) {
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
        content: `${formattedContext}\n\nActive Target Job Context:\n${
          chat.jobContext || "None yet provided."
        }`,
      },
      ...recentMessages,
      { role: "user", content: userPromptContent },
    ];

    let aiRawOutput = "";
    let normalized = null;

    if (directToolExecution) {
      normalized = {
        content: directToolExecution.message || "Action executed successfully.",
        cardType: directToolExecution.cardType || "action_result",
        cardData: directToolExecution.cardData || directToolExecution,
      };
    } else {
      try {
        // First turn: Call Gemini with all available backend tool definitions
        const response = await ai.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
          messages: fullMessages,
          tools: getGeminiToolsDeclaration(),
        });

        const choice = response.choices[0]?.message;
        const funcCall =
          choice?.functionCall ||
          (choice?.tool_calls?.[0]?.function
            ? {
                name: choice.tool_calls[0].function.name,
                args: JSON.parse(choice.tool_calls[0].function.arguments || "{}"),
              }
            : null);

        if (funcCall) {
          // Autonomous backend tool execution with strict authorization
          const toolResult = await executeCopilotTool({
            toolName: funcCall.name,
            args: funcCall.args || {},
            userId,
            user,
            activeResumeId: currentResume?._id,
            currentResume,
            aiClient: ai,
          });

          // Second turn: Return function result to Gemini to formulate bilingual conversational reply
          const turn2Messages = [
            ...fullMessages,
            {
              role: "assistant",
              content: "",
              functionCall: funcCall,
            },
            {
              role: "user",
              functionResponse: {
                name: funcCall.name,
                response: toolResult,
              },
            },
          ];

          let conversationalReply = "";
          try {
            const turn2Response = await ai.chat.completions.create({
              model: process.env.OPENAI_MODEL || "gemini-2.5-flash",
              messages: turn2Messages,
            });
            conversationalReply = turn2Response.choices[0]?.message?.content?.trim() || "";
          } catch (turn2Err) {
            console.warn("Turn 2 Gemini response error:", turn2Err.message);
            conversationalReply = toolResult.message || "Operation completed successfully.";
          }

          normalized = {
            content: conversationalReply || toolResult.message || "Action completed.",
            cardType: toolResult.cardType || (toolResult.requiresConfirmation ? "confirm_action" : "none"),
            cardData: toolResult.cardData || (toolResult.requiresConfirmation ? toolResult : null),
          };
        } else {
          aiRawOutput = choice?.content?.trim() || "";
          let parsedResponse = {};
          try {
            parsedResponse = JSON.parse(aiRawOutput);
          } catch {
            parsedResponse = { content: aiRawOutput };
          }
          normalized = normalizeCopilotResponse(parsedResponse, aiRawOutput, currentResume);
        }
      } catch (aiErr) {
        console.warn("AI Model API call failed, generating smart fallback:", aiErr.message);
        const fallback = generateSmartFallback(message, currentResume, user);
        normalized = normalizeCopilotResponse(fallback, "", currentResume);
      }
    }

    // 7. Save message history to database
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
 * POST /api/copilot/action
 * Direct execution of confirmed user actions (e.g. Delete Resume, Apply Updates)
 */
export const executeAction = async (req, res) => {
  try {
    const userId = req.userId;
    const { actionType, payload = {}, chatId } = req.body;

    if (!actionType) {
      return res.status(400).json({ message: "Action type is required" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const result = await executeCopilotTool({
      toolName: actionType,
      args: payload,
      userId,
      user,
      activeResumeId: payload.resumeId,
      aiClient: ai,
    });

    if (chatId) {
      const chat = await CopilotChat.findOne({ _id: chatId, userId });
      if (chat && result.success) {
        chat.messages.push({
          role: "assistant",
          content: result.message || `Action ${actionType} completed successfully.`,
          cardType: result.cardType || "action_result",
          cardData: result.cardData || result,
          timestamp: new Date(),
        });
        await chat.save();
      }
    }

    return res.status(200).json({
      success: result.success,
      result,
    });
  } catch (error) {
    console.error("Execute action error:", error);
    return res.status(500).json({ message: error.message || "Action execution failed" });
  }
};


/**
 * GET /api/copilot/chats
 * List all chat sessions strictly belonging to the authenticated user
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
 * Load full messages of a specific chat session with ownership verification
 */
export const getChatById = async (req, res) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    const chat = await CopilotChat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(403).json({
        message: "Access denied. Chat session not found or does not belong to your account.",
      });
    }

    return res.status(200).json({ chat });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load chat session" });
  }
};

/**
 * DELETE /api/copilot/chats/:chatId
 * Delete a chat session with ownership verification
 */
export const deleteChat = async (req, res) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    const deleted = await CopilotChat.findOneAndDelete({ _id: chatId, userId });
    if (!deleted) {
      return res.status(403).json({
        message: "Access denied. Chat session not found or does not belong to your account.",
      });
    }

    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to delete chat" });
  }
};

/**
 * POST /api/copilot/chat/:chatId/clear
 * Clear all messages in a chat session with ownership verification
 */
export const clearChatMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    const chat = await CopilotChat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(403).json({
        message: "Access denied. Chat session not found or does not belong to your account.",
      });
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
  executeAction,
  getUserChats,
  getChats,
  getChatById,
  deleteChat,
  clearChatMessages,
};
