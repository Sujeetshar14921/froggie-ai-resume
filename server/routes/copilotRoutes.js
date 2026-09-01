import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
  sendMessage,
  getChats,
  getChatById,
  deleteChat,
  clearChatMessages,
} from "../controllers/copilotController.js";

const copilotRouter = express.Router();

// Send message / action to Copilot
copilotRouter.post("/message", protect, sendMessage);

// Get list of past chat sessions
copilotRouter.get("/chats", protect, getChats);

// Get specific chat history
copilotRouter.get("/chat/:chatId", protect, getChatById);

// Delete chat session
copilotRouter.delete("/chat/:chatId", protect, deleteChat);

// Clear messages in chat
copilotRouter.post("/chat/:chatId/clear", protect, clearChatMessages);

export default copilotRouter;
