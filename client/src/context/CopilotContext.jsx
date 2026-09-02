import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
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

  const currentUserIdRef = useRef(user?._id || null);

  // Clean up all copilot state on logout or when switching accounts
  useEffect(() => {
    if (!token || !user) {
      setActiveResumeId(null);
      setActiveResumeData(null);
      setUserResumes([]);
      setActiveChatId(null);
      setMessages([]);
      setJobContext("");
      setIsTyping(false);
      setIsOpen(false);
      currentUserIdRef.current = null;
      return;
    }

    if (user._id !== currentUserIdRef.current) {
      currentUserIdRef.current = user._id;
      setActiveResumeId(null);
      setActiveResumeData(null);
      setUserResumes([]);
      setActiveChatId(null);
      setMessages([]);
      setJobContext("");
      setIsTyping(false);
    }
  }, [token, user]);

  // Load user resumes on login
  const fetchUserResumes = useCallback(async () => {
    if (!token || !user) return;
    try {
      const data = await resumeApi.getUserResumes(token);
      const list = data.resumes || [];
      setUserResumes(list);
      if (list.length > 0) {
        // If current activeResumeId does not belong to the user, default to first resume
        setActiveResumeId((prev) => {
          if (!prev || !list.some((r) => r._id === prev)) {
            return list[0]._id;
          }
          return prev;
        });
      } else {
        setActiveResumeId(null);
        setActiveResumeData(null);
      }
    } catch (err) {
      console.error("Failed to load resumes for copilot:", err);
    }
  }, [token, user]);

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

      // Always inject authenticated user's name and email if missing
      const finalUpdates = {
        ...updates,
        personal_info: {
          ...updates?.personal_info,
          full_name: updates?.personal_info?.full_name || user?.name || "Candidate Name",
          email: updates?.personal_info?.email || user?.email || "candidate@example.com",
        },
      };

      // 1. Create new resume document in database
      const createRes = await resumeApi.createResume(
        {
          title,
          template: "classic",
          accent_color: "#10B981",
          resumeData: finalUpdates,
        },
        token
      );

      const newId = createRes?.resume?._id;
      if (!newId) throw new Error("Could not retrieve created resume ID");

      // 2. Also ensure all nested fields and arrays are populated
      await resumeApi.updateResume(
        {
          resumeId: newId,
          resumeData: finalUpdates,
        },
        token
      );

      // 3. Update local state and reload list
      setActiveResumeId(newId);
      setActiveResumeData(finalUpdates);
      await fetchUserResumes();
      window.dispatchEvent(new CustomEvent("resumes-updated"));

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
      window.dispatchEvent(new CustomEvent("resumes-updated"));
    } else if (activeResumeId && token) {
      try {
        await resumeApi.updateResume({ resumeId: activeResumeId, resumeData: updates }, token);
        toast.success(`Updated resume in database: ${summary} 🚀`);
        fetchUserResumes();
        window.dispatchEvent(new CustomEvent("resumes-updated"));
      } catch (err) {
        console.error("Failed to update resume:", err);
        toast.error("Failed to update resume directly. Please open Resume Builder.");
      }
    } else {
      return await createNewResumeFromCopilot(updates, options?.title || options?.resumeTitle);
    }
  };

  // Direct action confirmation handler for destructive or one-click actions
  const confirmAction = async (actionType, payload = {}) => {
    if (!token) return;

    setIsTyping(true);
    try {
      const data = await copilotApi.executeAction(
        { actionType, payload: { ...payload, confirmed: true }, chatId: activeChatId },
        token
      );

      // Auto-refresh user resumes and notify pages
      await fetchUserResumes();
      window.dispatchEvent(new CustomEvent("resumes-updated"));

      if (actionType === "delete_resume") {
        if (activeResumeId === payload.resumeId) {
          setActiveResumeId(null);
          setActiveResumeData(null);
        }
        toast.success("Resume deleted successfully 🗑️");
      } else if (actionType === "delete_all_resumes") {
        setActiveResumeId(null);
        setActiveResumeData(null);
        toast.success("All resumes deleted successfully 🗑️");
      } else {
        toast.success("Action completed successfully ✅");
      }

      // Add assistant confirmation message in chat
      if (data?.result) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.result.message || "Action executed successfully.",
            cardType: data.result.cardType || "action_result",
            cardData: data.result.cardData || data.result,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error("Confirm action error:", err);
      toast.error(err?.response?.data?.message || "Failed to execute action");
    } finally {
      setIsTyping(false);
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

        // Auto-refresh resumes if resume was modified or created
        if (
          data.reply.cardType === "action_result" ||
          data.reply.cardType === "file_list" ||
          data.reply.cardType === "direct_resume_update"
        ) {
          fetchUserResumes();
          window.dispatchEvent(new CustomEvent("resumes-updated"));
        }

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
      const isForbidden = err?.response?.status === 403;
      if (isForbidden) {
        setActiveResumeId(null);
        setActiveResumeData(null);
        setActiveChatId(null);
        fetchUserResumes();
      }
      toast.error(err?.response?.data?.message || "Failed to get AI response");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ **Security Alert:** ${err?.response?.data?.message || "Failed to get response"}. Please try again.`,
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
        confirmAction,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};

export default CopilotContext;
