import React, { useEffect } from "react";
import { resolveValue, toast as toastControl } from "react-hot-toast";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  X,
  Info,
} from "lucide-react";
import FrogFace from "../FrogLogo";
import {
  sendNativeNotification,
  recordNotification,
} from "../../utils/browserNotification";

/**
 * Sleek Minimalist Toast Pill (Linear / Sonner Style)
 * - Compact, non-intrusive floating pill pinned at the bottom-right
 * - Never blocks top navigation, user profile, or header controls
 * - Adaptive light/dark glassmorphism
 * - Clean icon + message with smooth dismiss
 */
const FroggieToast = ({ toast }) => {
  const rawMessage = resolveValue(toast.message, toast);
  let messageText = "";
  if (typeof rawMessage === "string") {
    messageText = rawMessage;
  } else if (rawMessage && typeof rawMessage === "object") {
    messageText =
      typeof rawMessage.props?.children === "string"
        ? rawMessage.props.children
        : "Notification from froggie";
  }

  // Detect category
  const isAI =
    messageText.includes("AI") ||
    messageText.includes("🐸") ||
    messageText.includes("Generated") ||
    messageText.includes("Enhanced");

  let type = toast.type;
  if (type === "blank" && isAI) {
    type = "ai";
  }

  // Linear / Sonner Style Themes (Subtle & Elegant)
  const theme = {
    success: {
      iconBg: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 ring-1 ring-emerald-500/25",
      borderAccent: "border-emerald-500/30",
      progressBg: "bg-emerald-500",
      Icon: CheckCircle2,
    },
    error: {
      iconBg: "bg-rose-500/15 text-rose-500 dark:text-rose-400 ring-1 ring-rose-500/25",
      borderAccent: "border-rose-500/30",
      progressBg: "bg-rose-500",
      Icon: XCircle,
    },
    loading: {
      iconBg: "bg-sky-500/15 text-sky-500 dark:text-sky-400 ring-1 ring-sky-500/25",
      borderAccent: "border-sky-500/30",
      progressBg: "bg-sky-500",
      Icon: Loader2,
    },
    ai: {
      iconBg: "bg-teal-500/15 text-teal-500 dark:text-teal-300 ring-1 ring-teal-500/25",
      borderAccent: "border-teal-500/30",
      progressBg: "bg-teal-500",
      Icon: Sparkles,
    },
    blank: {
      iconBg: "bg-slate-500/15 text-slate-600 dark:text-slate-300 ring-1 ring-slate-500/25",
      borderAccent: "border-slate-300 dark:border-slate-700",
      progressBg: "bg-slate-400",
      Icon: Info,
    },
  }[type] || {
    iconBg: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 ring-1 ring-emerald-500/25",
    borderAccent: "border-emerald-500/30",
    progressBg: "bg-emerald-500",
    Icon: CheckCircle2,
  };

  const IconComponent = theme.Icon;
  const durationMs = toast.duration || 3200;

  useEffect(() => {
    // Only record to persistent history if toast is explicitly flagged as persistent/milestone
    if (toast.persistent || toast.record) {
      recordNotification({
        title: "froggie notification",
        message: messageText,
        type,
        forceRecord: true,
      });

      sendNativeNotification("froggie", {
        body: messageText,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id]);

  return (
    <div
      className={`relative w-auto max-w-[340px] sm:max-w-[380px] overflow-hidden rounded-2xl sm:rounded-full bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-xl text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800/90 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_12px_32px_-5px_rgba(0,0,0,0.6)] px-3.5 py-2.5 transition-all duration-300 pointer-events-auto select-none ${
        toast.visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-3 scale-95 pointer-events-none"
      }`}
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div className="flex items-center gap-2.5">
        {/* SLIM ICON BADGE */}
        <div
          className={`size-6 rounded-full flex items-center justify-center shrink-0 ${theme.iconBg}`}
        >
          {type === "ai" ? (
            <FrogFace size={14} className="text-emerald-500" />
          ) : (
            <IconComponent
              size={13}
              className={type === "loading" ? "animate-spin text-sky-500" : ""}
            />
          )}
        </div>

        {/* MESSAGE */}
        <div className="flex-1 min-w-0 pr-1 text-xs sm:text-[13px] font-medium text-slate-800 dark:text-slate-200 leading-snug break-words">
          {rawMessage}
        </div>

        {/* DISMISS BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toastControl.dismiss(toast.id);
          }}
          className="size-5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-center shrink-0 transition-colors cursor-pointer ml-1"
          title="Dismiss"
          aria-label="Dismiss notification"
        >
          <X size={12} />
        </button>
      </div>

      {/* DISCREET MICRO PROGRESS BAR */}
      {toast.type !== "loading" && durationMs && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200/50 dark:bg-slate-800/50 overflow-hidden">
          <div
            className={`h-full ${theme.progressBg} opacity-70 animate-toast-progress`}
            style={{
              animationDuration: `${durationMs}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FroggieToast;
