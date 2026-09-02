import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCheck,
} from "lucide-react";
import FrogFace from "../FrogLogo";
import {
  isSoundEnabled,
  setSoundEnabled,
  getNotificationHistory,
  clearNotificationHistory,
} from "../../utils/browserNotification";

/**
 * Modern Notification Bell & Center
 * Displays positive updates, AI insights, and resume milestones.
 * Errors, warnings, and browser permission banners are excluded from the dropdown.
 */
export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [soundOn, setSoundOn] = useState(true);
  const dropdownRef = useRef(null);

  const loadState = () => {
    setNotifications(getNotificationHistory());
    setSoundOn(isSoundEnabled());
  };

  useEffect(() => {
    loadState();

    const handleUpdate = () => {
      setNotifications(getNotificationHistory());
    };

    window.addEventListener("froggie_notifications_updated", handleUpdate);
    return () => window.removeEventListener("froggie_notifications_updated", handleUpdate);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    toast.success(`Notification sounds ${nextState ? "enabled" : "muted"}`);
  };

  const handleClearHistory = () => {
    // Immediately dismiss all active on-screen toast notifications
    toast.dismiss();
    // Clear stored notification history
    clearNotificationHistory();
    setNotifications([]);
  };

  const handleToggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && notifications.some((n) => !n.read)) {
      const updated = notifications.map((n) => ({ ...n, read: true }));
      setNotifications(updated);
      try {
        localStorage.setItem("froggie_notification_history", JSON.stringify(updated));
      } catch {
        // Storage quota exceeded or disabled
      }
    }
  };

  const filteredNotifications = notifications.filter(
    (n) => n.type !== "error" && n.type !== "warning" && n.type !== "alert"
  );
  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* BELL BUTTON */}
      <button
        onClick={handleToggleOpen}
        className={`relative size-10 rounded-2xl flex items-center justify-center border transition-all cursor-pointer group ${
          isOpen
            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 shadow-md shadow-emerald-500/10"
            : "bg-white/90 hover:bg-slate-50 border-slate-200/90 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 shadow-xs"
        }`}
        title="Notifications & Updates"
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell
          size={18}
          className={`transition-transform duration-300 group-hover:rotate-12 ${
            unreadCount > 0 ? "animate-pulse-subtle" : ""
          }`}
        />

        {/* UNREAD BADGE */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-3.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* NOTIFICATION CENTER DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 top-12 mt-2 w-[340px] sm:w-[390px] bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-3xl shadow-2xl shadow-slate-900/15 z-50 overflow-hidden py-3 animate-in fade-in zoom-in-95 duration-150">
          
          {/* HEADER */}
          <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                <Bell size={15} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  Notification Center
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">
                  Recent activities & updates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* SOUND TOGGLE BUTTON */}
              <button
                onClick={handleToggleSound}
                className="size-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                title={soundOn ? "Mute alert chime" : "Unmute alert chime"}
              >
                {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} className="text-rose-400" />}
              </button>

              {/* ALL CLEAR BUTTON */}
              {filteredNotifications.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-emerald-700 bg-slate-100/90 hover:bg-emerald-50 border border-slate-200/90 hover:border-emerald-300 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Clear all notifications"
                >
                  <CheckCheck size={13} className="text-emerald-600" />
                  <span>All Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* NOTIFICATION FEED */}
          <div className="max-h-[260px] overflow-y-auto px-3 space-y-1.5 divide-y divide-slate-100/60 mt-1">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => {
                  const isAi = n.type === "ai";
                  return (
                    <div
                      key={n.id}
                      className="pt-2 first:pt-0 flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50/80 transition-colors"
                    >
                      <div
                        className={`size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isAi
                            ? "bg-teal-500/15 text-teal-600"
                            : "bg-emerald-500/15 text-emerald-600"
                        }`}
                      >
                        {isAi ? <Sparkles size={13} /> : <CheckCircle2 size={13} />}
                      </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[11px] font-bold text-slate-900 truncate">
                          {n.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(n.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-7 text-center">
                <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                  <FrogFace size={24} />
                </div>
                <p className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                  <CheckCheck size={14} className="text-emerald-600" />
                  <span>All Clear!</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  No unread alerts or notifications
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationBell;
