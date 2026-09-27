/**
 * Froggie Browser & Native Notification Utility
 * Handles Web Audio sound synthesis, Native Web Notification API,
 * and persistent notification history.
 */

const SOUND_STORAGE_KEY = "froggie_sound_enabled";
const HISTORY_STORAGE_KEY = "froggie_notification_history";

/**
 * Check if Native Web Notifications are supported in this browser
 */
export const isNotificationSupported = () => {
  return typeof window !== "undefined" && "Notification" in window;
};

/**
 * Get current Native Notification permission
 * @returns {'granted' | 'denied' | 'default' | 'unsupported'}
 */
export const getNotificationPermission = () => {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
};

/**
 * Request permission from the user for Native OS/Browser Notifications
 */
export const requestNotificationPermission = async () => {
  if (!isNotificationSupported()) return "unsupported";
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn("Could not request notification permission:", err);
    return "denied";
  }
};

/**
 * Check if sound is enabled (defaults to true)
 */
export const isSoundEnabled = () => {
  try {
    const stored = localStorage.getItem(SOUND_STORAGE_KEY);
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
};

/**
 * Toggle sound enabled state
 */
export const setSoundEnabled = (enabled) => {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
  } catch {
    // Storage unavailable
  }
};

/**
 * Synthesize a soft, pleasant notification sound using Web Audio API
 * No external .mp3 audio files required!
 */
export const playNotificationSound = (type = "success") => {
  if (!isSoundEnabled()) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    if (type === "error") {
      // Soft gentle two-tone alert for error
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } else if (type === "ai" || type === "froggie") {
      // Futuristic ascending chime for AI/Copilot
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } else {
      // Crisp, pleasant emerald harmonic chime for success
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch {
    // AudioContext blocked or not allowed by browser autoplay policy
  }
};

/**
 * Send a native browser/OS push notification (shows in Windows/Mac notification center)
 */
export const sendNativeNotification = (title, options = {}) => {
  if (!isNotificationSupported()) return null;
  if (Notification.permission !== "granted") return null;

  try {
    const notification = new Notification(`🐸 ${title}`, {
      body: options.body || "Froggie AI notification",
      icon: options.icon || "/favicon.ico",
      badge: "/favicon-32x32.png",
      tag: options.tag || "froggie-alert",
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      if (options.onClick) options.onClick();
      notification.close();
    };

    return notification;
  } catch (err) {
    console.warn("Native notification could not be shown:", err);
    return null;
  }
};

/**
 * Notification Categories for persistent High-Value alerts
 */
export const NOTIFICATION_CATEGORIES = {
  ALL: "all",
  TRACKER: "tracker", // Interviews, job reminders, status updates
  ATS_AI: "ats_ai", // ATS score milestones, AI deliverables
  MILESTONE: "milestone", // Account milestones, public resume shares
};

// Filter out mundane toast keywords from entering persistent dropdown history
const TRIVIAL_KEYWORDS = [
  "copied to clipboard",
  "copied",
  "saving...",
  "saved",
  "save changes",
  "reordered",
  "logged in",
  "muted",
  "enabled",
  "switched",
  "downloaded",
  "listening...",
  "please enter",
];

/**
 * Add a notification item to persistent local history (Strictly High-Value Only)
 */
export const recordNotification = ({
  title,
  message,
  type = "success",
  category = NOTIFICATION_CATEGORIES.MILESTONE,
  actionLink = null,
  actionLabel = null,
  forceRecord = false,
}) => {
  // Do NOT record errors, warnings, or alerts in the notification dropdown
  if (type === "error" || type === "warning" || type === "alert") {
    return null;
  }

  const msgText = typeof message === "string" ? message.toLowerCase() : "";

  // Unless forceRecord is true, filter out trivial routine actions
  if (!forceRecord) {
    const isTrivial = TRIVIAL_KEYWORDS.some((kw) => msgText.includes(kw));
    if (isTrivial) {
      return null;
    }
  }

  try {
    const existing = getNotificationHistory();
    const item = {
      id: "notif_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      title: title || (category === NOTIFICATION_CATEGORIES.ATS_AI ? "AI & ATS Insight" : "Career Milestone"),
      message: typeof message === "string" ? message : "Notification from Froggie",
      type,
      category,
      actionLink,
      actionLabel,
      timestamp: Date.now(),
      read: false,
    };
    const updated = [item, ...existing].slice(0, 30); // keep last 30 high-value alerts
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event so listeners like NotificationBell can re-render
    window.dispatchEvent(new CustomEvent("froggie_notifications_updated"));
    return item;
  } catch {
    return null;
  }
};

/**
 * Trigger a High-Value Milestone Notification (Saved in Dropdown + Sound + Native OS Notification)
 */
export const sendMilestoneNotification = ({
  title,
  message,
  category = NOTIFICATION_CATEGORIES.MILESTONE,
  actionLink = null,
  actionLabel = null,
}) => {
  playNotificationSound("ai");

  // Save to persistent notification dropdown
  const record = recordNotification({
    title,
    message,
    type: "ai",
    category,
    actionLink,
    actionLabel,
    forceRecord: true,
  });

  // Also send native browser notification if user granted permission
  sendNativeNotification(title, {
    body: message,
    onClick: () => {
      if (actionLink && typeof window !== "undefined") {
        window.location.href = actionLink;
      }
    },
  });

  return record;
};

/**
 * Retrieve notification history from localStorage
 */
export const getNotificationHistory = () => {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter((n) => n.type !== "error" && n.type !== "warning" && n.type !== "alert")
      : [];
  } catch {
    return [];
  }
};

/**
 * Clear notification history
 */
export const clearNotificationHistory = () => {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("froggie_notifications_updated"));
  } catch {
    // Storage unavailable
  }
};


