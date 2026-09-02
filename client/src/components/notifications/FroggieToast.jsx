import React, { useEffect } from "react";
import { resolveValue, toast as toastControl } from "react-hot-toast";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Sparkles,
  X,
  Info,
} from "lucide-react";
import FrogFace from "../FrogLogo";
import {
  playNotificationSound,
  sendNativeNotification,
  recordNotification,
} from "../../utils/browserNotification";

/**
 * Modern Frosted Glass Toast Card for Froggie
 * Features:
 * - Glassmorphism dark slate finish with glowing borders
 * - Dynamic color tokens (Emerald for success, Rose for error, Sky for loading, Violet for AI)
 * - Auto-dismiss animated countdown bar
 * - Web Audio soft chime on trigger
 * - Background tab native OS notification sync
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
        : "Notification from Froggie";
  }

  // Detect category from toast type or content
  const isAI =
    messageText.includes("AI") ||
    messageText.includes("Copilot") ||
    messageText.includes("🐸") ||
    messageText.includes("Generated") ||
    messageText.includes("Enhanced");

  let type = toast.type;
  if (type === "blank" && isAI) {
    type = "ai";
  }

  // Determine theme tokens
  const theme = {
    success: {
      label: "FROGGIE • SUCCESS",
      border: "border-emerald-500/40 ring-1 ring-emerald-500/20",
      glow: "shadow-[0_12px_36px_-6px_rgba(16,185,129,0.35)]",
      badgeBg: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
      iconBg: "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30",
      progressBg: "from-emerald-400 via-teal-300 to-emerald-500",
      Icon: CheckCircle2,
    },
    error: {
      label: "FROGGIE • ALERT",
      border: "border-rose-500/40 ring-1 ring-rose-500/20",
      glow: "shadow-[0_12px_36px_-6px_rgba(244,63,94,0.35)]",
      badgeBg: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
      iconBg: "bg-rose-500/20 text-rose-400 ring-2 ring-rose-500/30",
      progressBg: "from-rose-500 via-red-400 to-pink-500",
      Icon: XCircle,
    },
    loading: {
      label: "FROGGIE • WORKING",
      border: "border-sky-500/40 ring-1 ring-sky-500/20",
      glow: "shadow-[0_12px_36px_-6px_rgba(14,165,233,0.35)]",
      badgeBg: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
      iconBg: "bg-sky-500/20 text-sky-400 ring-2 ring-sky-500/30",
      progressBg: "from-sky-400 via-cyan-300 to-indigo-500",
      Icon: Loader2,
    },
    ai: {
      label: "FROGGIE • AI STUDIO",
      border: "border-teal-500/40 ring-1 ring-teal-500/20",
      glow: "shadow-[0_12px_36px_-6px_rgba(20,184,166,0.35)]",
      badgeBg: "bg-teal-500/15 text-teal-300 border border-teal-500/30",
      iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white ring-2 ring-teal-400/40",
      progressBg: "from-teal-400 via-emerald-400 to-cyan-400",
      Icon: Sparkles,
    },
    blank: {
      label: "FROGGIE • NOTICE",
      border: "border-slate-700/80 ring-1 ring-slate-700/40",
      glow: "shadow-[0_12px_36px_-6px_rgba(15,23,42,0.6)]",
      badgeBg: "bg-slate-800 text-slate-300 border border-slate-700",
      iconBg: "bg-slate-800 text-slate-300 ring-2 ring-slate-700",
      progressBg: "from-slate-400 via-emerald-400 to-slate-400",
      Icon: Info,
    },
  }[type] || {
    label: "FROGGIE • NOTIFICATION",
    border: "border-emerald-500/30 ring-1 ring-emerald-500/20",
    glow: "shadow-2xl shadow-emerald-950/40",
    badgeBg: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    iconBg: "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30",
    progressBg: "from-emerald-400 via-teal-300 to-emerald-500",
    Icon: CheckCircle2,
  };

  const IconComponent = theme.Icon;
  const durationMs = toast.duration || 4000;

  // Play sound & record to notification center once on mount
  useEffect(() => {
    if (toast.type === "loading") return;

    playNotificationSound(type);

    if (messageText) {
      recordNotification({
        title: theme.label.replace("FROGGIE • ", ""),
        message: messageText,
        type,
      });

      // Send native browser notification if user granted permission
      sendNativeNotification(theme.label.replace("FROGGIE • ", ""), {
        body: messageText,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id]);

  return (
    <div
      className={`relative w-full max-w-[360px] sm:max-w-[420px] overflow-hidden rounded-2xl bg-slate-950/95 backdrop-blur-2xl text-slate-100 border p-3.5 sm:p-4 transition-all duration-300 pointer-events-auto group ${
        theme.border
      } ${theme.glow} ${
        toast.visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-2 scale-95 pointer-events-none"
      }`}
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="absolute -top-10 -left-10 size-28 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 size-28 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex items-start gap-3">
        {/* ICON CONTAINER */}
        <div
          className={`size-9 sm:size-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${theme.iconBg}`}
        >
          {type === "ai" ? (
            <FrogFace size={20} className="text-white" />
          ) : (
            <IconComponent
              size={18}
              className={type === "loading" ? "animate-spin text-sky-400" : ""}
            />
          )}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${theme.badgeBg}`}
            >
              {theme.label}
            </span>
            <span className="text-[10px] text-slate-500 font-mono ml-auto">
              just now
            </span>
          </div>

          <div className="text-xs sm:text-[13px] font-medium text-slate-200 leading-relaxed break-words">
            {rawMessage}
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toastControl.dismiss(toast.id);
          }}
          className="size-6 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          title="Dismiss"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>

      {/* AUTO-DISMISS COUNTDOWN PROGRESS BAR */}
      {toast.type !== "loading" && durationMs && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-800/80 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${theme.progressBg} animate-toast-progress`}
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
