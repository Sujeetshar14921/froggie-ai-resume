import React, { useEffect, useState, useCallback } from "react";
import { X, MessageSquare, Trash2, ArrowRight, Clock, Plus } from "lucide-react";
import { useCopilot } from "../../hooks/useCopilot";
import { copilotApi } from "../../api/copilotApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const CopilotHistoryDrawer = ({ isOpen, onClose }) => {
  const { token } = useSelector((state) => state.auth);
  const { loadChat, startNewChat, activeChatId } = useCopilot();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChats = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const data = await copilotApi.getChats(token);
      setChats(data.chats || []);
    } catch {
      console.warn("Could not fetch copilot chats");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen && token) {
      fetchChats();
    }
  }, [isOpen, token, fetchChats]);

  const handleDelete = async (chatId, e) => {
    e.stopPropagation();
    try {
      await copilotApi.deleteChat(chatId, token);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete chat");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-emerald-600" />
          <h4 className="font-bold text-sm text-slate-900">Career Chat History</h4>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* NEW CHAT PROMPT BUTTON */}
      <div className="p-3 border-b border-slate-100">
        <button
          onClick={() => {
            startNewChat();
            onClose();
          }}
          className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200/80"
        >
          <Plus size={14} />
          <span>Start New Conversation</span>
        </button>
      </div>

      {/* CHAT SESSIONS LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading ? (
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl" />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <MessageSquare size={24} className="mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No past conversations</p>
          </div>
        ) : (
          chats.map((c) => {
            const isActive = c._id === activeChatId;

            return (
              <div
                key={c._id}
                onClick={() => {
                  loadChat(c._id);
                  onClose();
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                  isActive
                    ? "border-emerald-600 bg-emerald-50/50 shadow-2xs"
                    : "border-slate-200/80 hover:border-emerald-300 hover:bg-slate-50"
                }`}
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {c.title || "Career Chat"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(c.updatedAt || c.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    • {c.messageCount} messages
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDelete(c._id, e)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Delete Chat"
                  >
                    <Trash2 size={13} />
                  </button>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-600" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CopilotHistoryDrawer;
