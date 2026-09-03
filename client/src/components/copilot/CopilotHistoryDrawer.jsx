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
    <div className="absolute inset-0 z-20 bg-white/98 backdrop-blur-2xl flex flex-col animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/70">
            <Clock size={14} />
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">Conversation History</h4>
            <p className="text-[10px] text-slate-400 font-medium">Your past chats with froggie Copilot</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {/* NEW CHAT BUTTON */}
      <div className="p-3 border-b border-slate-100 bg-white">
        <button
          onClick={() => {
            startNewChat();
            onClose();
          }}
          className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-950/20 border border-emerald-500/30 hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus size={14} className="text-emerald-400" />
          <span>Start New Conversation</span>
        </button>
      </div>

      {/* CHAT SESSIONS LIST */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
        {isLoading ? (
          <div className="space-y-2.5 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-slate-100/90 rounded-2xl border border-slate-200/60" />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-3">
            <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <MessageSquare size={22} />
            </div>
            <h5 className="text-xs font-bold text-slate-700">No past conversations yet</h5>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Start chatting with froggie Copilot to get tailored resume recommendations and interview practice.
            </p>
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
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isActive
                    ? "border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500/20"
                    : "border-slate-200/80 hover:border-emerald-300 hover:bg-slate-50/80 bg-white"
                }`}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5">
                    {isActive && <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />}
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {c.title || "Career Chat"}
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {new Date(c.updatedAt || c.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    • {c.messageCount || 0} messages
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDelete(c._id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Delete Chat"
                  >
                    <Trash2 size={13} />
                  </button>
                  <ArrowRight size={13} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
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
