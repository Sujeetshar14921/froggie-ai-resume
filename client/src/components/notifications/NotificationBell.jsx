import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  CheckCheck,
  Briefcase,
  ShieldCheck,
  Trophy,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import FrogFace, { BrandIcon } from "../FrogLogo";
import {
  isSoundEnabled,
  setSoundEnabled,
  getNotificationHistory,
  clearNotificationHistory,
  NOTIFICATION_CATEGORIES,
} from "../../utils/browserNotification";

/**
 * Modern High-Value Notification Center
 * Displays only critical career alerts:
 * 1. Application Tracker interview reminders & status updates
 * 2. ATS Score milestones & Deep AI insights
 * 3. Career deliverables & Platform milestones
 */
export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [soundOn, setSoundOn] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Auto-close on route navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.search]);

  // Close when clicking outside, Escape key, or scroll
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  const handleToggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    setSoundEnabled(nextState);
    toast.success(`Notification sounds ${nextState ? "enabled" : "muted"}`);
  };

  const handleClearHistory = () => {
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
        // Storage unavailable
      }
    }
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "just now";
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 60) return "just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  };

  // Filter notifications by category
  const filteredNotifications = notifications.filter((n) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "tracker") return n.category === NOTIFICATION_CATEGORIES.TRACKER;
    if (activeCategory === "ats_ai") return n.category === NOTIFICATION_CATEGORIES.ATS_AI || n.type === "ai";
    if (activeCategory === "milestone") return n.category === NOTIFICATION_CATEGORIES.MILESTONE;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getCategoryIcon = (category, type) => {
    if (category === NOTIFICATION_CATEGORIES.TRACKER) return <Briefcase size={13} className="text-blue-600" />;
    if (category === NOTIFICATION_CATEGORIES.ATS_AI || type === "ai") return <ShieldCheck size={13} className="text-emerald-600" />;
    return <Trophy size={13} className="text-amber-600" />;
  };

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
        title="Career Alerts & Milestones"
        aria-label="View notifications"
        aria-expanded={isOpen}
      >
        <Bell
          size={18}
          className={`transition-transform duration-300 group-hover:rotate-12 ${
            unreadCount > 0 ? "animate-pulse" : ""
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
        <div className="absolute right-0 top-12 mt-2 w-[340px] sm:w-[410px] bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-2xl shadow-slate-900/15 z-50 overflow-hidden py-3 animate-in fade-in zoom-in-95 duration-150">
          
          {/* HEADER */}
          <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                <Bell size={14} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-950 leading-tight">
                  Career Alerts & Milestones
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">
                  Interviews, ATS audits & key updates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* SOUND TOGGLE BUTTON */}
              <button
                onClick={handleToggleSound}
                className="size-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                title={soundOn ? "Mute alert sounds" : "Enable alert sounds"}
              >
                {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} className="text-rose-400" />}
              </button>

              {/* ALL CLEAR BUTTON */}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-2 py-0.5 text-[10px] font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="Clear notification list"
                >
                  <CheckCheck size={12} className="text-emerald-600" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* CATEGORY FILTER PILLS */}
          <div className="px-4 py-2 border-b border-slate-100/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All" },
              { id: "tracker", label: "Interviews" },
              { id: "ats_ai", label: "ATS & AI" },
              { id: "milestone", label: "Milestones" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* NOTIFICATION FEED */}
          <div className="max-h-[300px] overflow-y-auto px-3 space-y-1 mt-1 no-scrollbar">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => {
                const icon = getCategoryIcon(n.category, n.type);
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.actionLink) {
                        setIsOpen(false);
                        navigate(n.actionLink);
                      }
                    }}
                    className={`group p-2.5 rounded-2xl transition-all border border-transparent ${
                      n.actionLink ? "hover:bg-emerald-50/50 hover:border-emerald-200 cursor-pointer" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="size-7 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/70">
                        {icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-bold text-slate-900 truncate">
                            {n.title}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono shrink-0 ml-2">
                            {formatRelativeTime(n.timestamp)}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                          {n.message}
                        </p>

                        {/* ACTION LINK */}
                        {n.actionLink && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700 group-hover:underline">
                            <span>{n.actionLabel || "View Details"}</span>
                            <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center flex flex-col items-center px-4">
                <BrandIcon size="md" className="mb-2" />
                <p className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                  <CheckCheck size={14} className="text-emerald-600" />
                  <span>All Caught Up!</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-1 max-w-xs text-center leading-relaxed">
                  Interview reminders, high ATS score alerts, and AI recommendations will appear here.
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
