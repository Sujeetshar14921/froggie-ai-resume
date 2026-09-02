import React, { createContext, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { copilotApi } from "../api/copilotApi";
import { resumeApi } from "../api/resumeApi";
import toast from "react-hot-toast";

const CopilotContext = createContext(null);

export const CopilotProvider = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeResumeId, setActiveResumeId] = useState(null);
  const [activeResumeData, setActiveResumeData] = useState(null);
  const [userResumes, setUserResumes] = useState([]);

  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [jobContext, setJobContext] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [applyCallback, setApplyCallback] = useState(null);
  const [directUpdateCallback, setDirectUpdateCallback] = useState(null);

  // Load user resumes on login
  const fetchUserResumes = useCallback(async () => {
    if (!token) return;
    try {
      const data = await resumeApi.getUserResumes(token);
      setUserResumes(data.resumes || []);
      if (!activeResumeId && data.resumes && data.resumes.length > 0) {
        setActiveResumeId(data.resumes[0]._id);
      }
    } catch (err) {
      console.error("Failed to load resumes for copilot:", err);
    }
  }, [token, activeResumeId]);

  useEffect(() => {
    fetchUserResumes();
  }, [fetchUserResumes]);

  // Open Copilot with optional pre-filled prompt or action
  const openCopilot = (options = {}) => {
    if (options.resumeId) setActiveResumeId(options.resumeId);
    if (options.resumeData) setActiveResumeData(options.resumeData);
    if (options.jobContext) setJobContext(options.jobContext);

    setIsOpen(true);

    if (options.prompt || options.actionType) {
      setTimeout(() => {
        handleSendMessage(options.prompt || "", options.actionType, options.actionPayload);
      }, 150);
    }
  };

  const closeCopilot = () => {
    setIsOpen(false);
  };

  // Register single section "Apply to Resume" callback (e.g. from ResumeBuilder)
  const registerApplyHandler = useCallback((fn) => {
    setApplyCallback(() => fn);
  }, []);

  // Register multi-field direct resume modifier callback (e.g. from ResumeBuilder)
  const registerDirectUpdateHandler = useCallback((fn) => {
    setDirectUpdateCallback(() => fn);
  }, []);

  const applyToResume = (section, text, index = -1) => {
    if (typeof applyCallback === "function") {
      applyCallback(section, text, index);
      toast.success("Applied changes to your resume in the editor! 🎉");
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copied improved text to clipboard! (Paste into your resume editor)");
    }
  };

  // Create a completely new resume directly from Copilot
  const createNewResumeFromCopilot = async (updates = {}, customTitle = null) => {
    if (!token) {
      toast.error("Please log in to save your resume");
      return;
    }

    try {
      const role =
        updates?.personal_info?.profession ||
        customTitle ||
        "Full Stack Developer";
      const title = customTitle || `${role} ATS Resume`;

      // 1. Create new resume document in database
      const createRes = await resumeApi.createResume(
        {
          title,
          template: "classic",
          accent_color: "#10B981",
          resumeData: updates,
        },
        token
      );

      const newId = createRes?.resume?._id;
      if (!newId) throw new Error("Could not retrieve created resume ID");

      // 2. Also ensure all nested fields and arrays are populated
      await resumeApi.updateResume(
        {
          resumeId: newId,
          resumeData: updates,
        },
        token
      );

      // 3. Update local state and reload list
      setActiveResumeId(newId);
      setActiveResumeData(updates);
      await fetchUserResumes();

      toast.success(`✨ "${title}" created successfully in My Resumes!`, {
        duration: 4000,
        icon: "🐸",
      });

      // 4. Navigate directly to resume builder
      navigate(`/app/builder/${newId}`);
      return newId;
    } catch (err) {
      console.error("Failed to create new resume from copilot:", err);
      const errMsg = err?.response?.data?.message || err.message || "Failed to save resume";
      toast.error("Could not create resume: " + errMsg);
      return null;
    }
  };

  // Apply complete or multi-section direct updates to resume
  const applyDirectResumeUpdate = async (updates, summary = "Updates applied", options = {}) => {
    const isExplicitNew = options?.createNew || options?.isNewResume;
    const hasNoActiveResume = !activeResumeId && typeof directUpdateCallback !== "function";

    // If it's a new resume request or there is no open resume, create a brand new resume in My Resumes!
    if (isExplicitNew || hasNoActiveResume) {
      return await createNewResumeFromCopilot(updates, options?.title || options?.resumeTitle);
    }

    if (typeof directUpdateCallback === "function") {
      directUpdateCallback(updates);
      toast.success(`Applied changes: ${summary} 🚀`);
    } else if (activeResumeId && token) {
      try {
        await resumeApi.updateResume({ resumeId: activeResumeId, resumeData: updates }, token);
        toast.success(`Updated resume in database: ${summary} 🚀`);
        fetchUserResumes();
      } catch (err) {
        console.error("Failed to update resume:", err);
        toast.error("Failed to update resume directly. Please open Resume Builder.");
      }
    } else {
      return await createNewResumeFromCopilot(updates, options?.title || options?.resumeTitle);
    }
  };

  // Send message to Copilot
  const handleSendMessage = async (text, actionType = null, actionPayload = null) => {
    if (!token) {
      toast.error("Please log in to use AI Career Copilot");
      return;
    }

    if (!text && !actionType) return;

    // Optimistic user message
    const tempUserMsg = {
      role: "user",
      content: text || actionType,
      cardType: "none",
      cardData: null,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsTyping(true);

    try {
      const payload = {
        chatId: activeChatId,
        message: text,
        resumeId: activeResumeId,
        resumeData: activeResumeData,
        jobContext,
        actionType,
        actionPayload,
      };

      const data = await copilotApi.sendMessage(payload, token);

      if (data.chatId && !activeChatId) {
        setActiveChatId(data.chatId);
      }

      if (data.reply) {
        setMessages((prev) => [...prev, data.reply]);

        // Auto-apply direct resume updates if inside active editor
        if (
          data.reply.cardType === "direct_resume_update" &&
          data.reply.cardData?.updates
        ) {
          applyDirectResumeUpdate(
            data.reply.cardData.updates,
            data.reply.cardData.summaryOfChanges || "Updates applied"
          );
        }
      }
    } catch (err) {
      console.error("Copilot error:", err);
      toast.error(err?.response?.data?.message || "Failed to get AI response");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ **Error:** ${err?.response?.data?.message || "Failed to get response"}. Please try again.`,
          cardType: "none",
          cardData: null,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Start fresh conversation
  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setJobContext("");
    toast.success("Started a new Career Copilot session");
  };

  // Load existing chat
  const loadChat = async (chatId) => {
    if (!token || !chatId) return;
    try {
      setIsTyping(true);
      const data = await copilotApi.getChatById(chatId, token);
      if (data.chat) {
        setActiveChatId(data.chat._id);
        setMessages(data.chat.messages || []);
        if (data.chat.jobContext) setJobContext(data.chat.jobContext);
        if (data.chat.resumeId) setActiveResumeId(data.chat.resumeId);
      }
    } catch {
      toast.error("Failed to load chat history");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <CopilotContext.Provider
      value={{
        isOpen,
        openCopilot,
        closeCopilot,
        user,
        userResumes,
        activeResumeId,
        setActiveResumeId,
        activeResumeData,
        setActiveResumeData,
        activeChatId,
        messages,
        jobContext,
        setJobContext,
        isTyping,
        sendMessage: handleSendMessage,
        startNewChat,
        loadChat,
        registerApplyHandler,
        applyToResume,
        registerDirectUpdateHandler,
        applyDirectResumeUpdate,
        createNewResumeFromCopilot,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};

export default CopilotContext;
