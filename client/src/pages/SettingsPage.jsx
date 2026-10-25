import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Palette,
  Sparkles,
  Sliders,
  FileText,
  Cloud,
  Globe,
  Bell,
  Volume2,
  Maximize2,
  Sun,
  Moon,
  Laptop,
  Download,
  Trash2,
  LogOut,
  Check,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Camera,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  RefreshCw,
  Zap,
} from "lucide-react";
import { authApi } from "../api/authApi";
import { logout, updateUser } from "../app/features/authSlice";
import { getSavedTheme, applyTheme } from "../utils/theme";
import toast from "react-hot-toast";

// Feature flags storage key
const FEATURE_FLAGS_KEY = "froggie_feature_flags";

const DEFAULT_FEATURES = {
  atsOptimizer: true,
  realTimeScore: true,
  autoSave: true,
  talentDiscovery: false,
  aiBulletEnhancer: true,
  emailNotifications: true,
  soundEffects: false,
  compactWorkspace: false,
};

// Features Metadata Configuration
const FEATURES_CONFIG = [
  {
    key: "atsOptimizer",
    title: "ATS Smart Keyword Matcher",
    description: "Extract industry keywords from target job descriptions and suggest real-time placements in your resume.",
    badge: "RECOMMENDED",
    icon: Sparkles,
    gradient: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    key: "realTimeScore",
    title: "Live ATS Score Meter",
    description: "Display an active floating score dial in the builder that computes compliance with recruiter scanners.",
    badge: "POPULAR",
    icon: FileText,
    gradient: "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    key: "autoSave",
    title: "Auto-Save Drafts to Cloud",
    description: "Continuously back up resume progress every 10 seconds to prevent accidental data loss.",
    badge: "ESSENTIAL",
    icon: Cloud,
    gradient: "from-indigo-500/20 to-violet-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  },
  {
    key: "talentDiscovery",
    title: "Public Talent Directory Discovery",
    description: "Publish your verified candidate profile to froggie's talent pool for recruiters to discover you.",
    badge: "GET HIRED",
    icon: Globe,
    gradient: "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    key: "aiBulletEnhancer",
    title: "AI STAR Bullet Enhancer",
    description: "1-Click rewrite of work experience into quantifiable, action-oriented STAR accomplishment statements.",
    badge: "AI POWERED",
    icon: Zap,
    gradient: "from-teal-500/20 to-emerald-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30",
  },
  {
    key: "emailNotifications",
    title: "Email Status & Interview Alerts",
    description: "Receive timely updates when your public resume is viewed or an employer requests contact.",
    badge: "ALERTS",
    icon: Bell,
    gradient: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    key: "soundEffects",
    title: "UI Sound Feedback & Chimes",
    description: "Play subtle audio cues when exporting PDFs, running AI scans, or completing achievements.",
    badge: "AUDIO",
    icon: Volume2,
    gradient: "from-rose-500/20 to-pink-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30",
  },
  {
    key: "compactWorkspace",
    title: "Compact Resume Workspace",
    description: "Reduce padding across builder inputs to show more content simultaneously on laptop screens.",
    badge: "LAYOUT",
    icon: Maximize2,
    gradient: "from-slate-500/20 to-slate-600/20 text-slate-600 dark:text-slate-300 border-slate-500/30",
  },
];

/**
 * Ultra-Smooth Tactile Toggle Switch Component (iOS / Stripe / Linear Physics)
 * - Elastic spring physics on knob stretch
 * - Radiant active aura
 * - Tactile 3D thumb with center dot indicator
 */
const SmoothToggle = ({ checked, onChange, label, disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange?.();
      }}
      className={`group relative inline-flex h-7 w-12 sm:h-7.5 sm:w-13 shrink-0 cursor-pointer items-center rounded-full p-0.5 border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
        checked
          ? "bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400/40 shadow-[0_0_14px_rgba(16,185,129,0.45)]"
          : "bg-slate-200 dark:bg-slate-800 border-slate-300/80 dark:border-slate-700/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-105 active:scale-95"}`}
      aria-label={label}
    >
      <span
        className={`pointer-events-none flex size-6 items-center justify-center rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:w-7 ${
          checked
            ? "translate-x-5 sm:translate-x-6 bg-gradient-to-b from-white to-slate-50"
            : "translate-x-0 bg-white"
        }`}
      >
        <span
          className={`size-1.5 rounded-full transition-all duration-200 ${
            checked ? "bg-emerald-500 scale-100" : "bg-slate-300 dark:bg-slate-500 scale-75 opacity-50"
          }`}
        />
      </span>
    </button>
  );
};

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  // Active tab: 'features' | 'profile' | 'security' | 'appearance' | 'account'
  const [activeTab, setActiveTab] = useState("features");

  // ==========================================
  // 1. FEATURE TOGGLES STATE
  // ==========================================
  const [features, setFeatures] = useState(() => {
    try {
      const saved = localStorage.getItem(FEATURE_FLAGS_KEY);
      return saved ? { ...DEFAULT_FEATURES, ...JSON.parse(saved) } : DEFAULT_FEATURES;
    } catch {
      return DEFAULT_FEATURES;
    }
  });

  const activeFeaturesCount = useMemo(() => {
    return Object.values(features).filter(Boolean).length;
  }, [features]);

  const toggleFeature = (key, label) => {
    setFeatures((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(FEATURE_FLAGS_KEY, JSON.stringify(next));
      toast.success(
        `${label} ${next[key] ? "activated" : "deactivated"}`,
        { icon: next[key] ? "✅" : "⚪" }
      );
      return next;
    });
  };

  const handleResetFeatures = () => {
    setFeatures(DEFAULT_FEATURES);
    localStorage.setItem(FEATURE_FLAGS_KEY, JSON.stringify(DEFAULT_FEATURES));
    toast.success("Feature toggles reset to recommended defaults", { icon: "✨" });
  };

  const handleEnableAll = () => {
    const allEnabled = Object.keys(DEFAULT_FEATURES).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setFeatures(allEnabled);
    localStorage.setItem(FEATURE_FLAGS_KEY, JSON.stringify(allEnabled));
    toast.success("All features activated!", { icon: "🚀" });
  };

  // ==========================================
  // 2. PROFILE STATE
  // ==========================================
  const fileInputRef = useRef(null);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileProfession, setProfileProfession] = useState(user?.profession || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileLocation, setProfileLocation] = useState(user?.location || "");
  const [profileBio, setProfileBio] = useState(user?.bio || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.image || "");
  const [removeImage, setRemoveImage] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileProfession(user.profession || "");
      setProfilePhone(user.phone || "");
      setProfileLocation(user.location || "");
      setProfileBio(user.bio || "");
      setImagePreview(user.image || "");
      setImageFile(null);
      setRemoveImage(false);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Avatar image size must be under 5MB");
        return;
      }
      setImageFile(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSavingProfile(true);
      const formData = new FormData();
      formData.append("name", profileName.trim());
      formData.append("profession", profileProfession.trim());
      formData.append("phone", profilePhone.trim());
      formData.append("location", profileLocation.trim());
      formData.append("bio", profileBio.trim());

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (removeImage) {
        formData.append("removeImage", "true");
      }

      const res = await authApi.updateProfile(formData, token);
      if (res.user) {
        dispatch(updateUser(res.user));
        toast.success("Profile saved successfully!", { icon: "🎉" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // ==========================================
  // 3. CHANGE PASSWORD STATE
  // ==========================================
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Determine if user has an existing password requiring current password verification
  const userRequiresCurrentPassword = useMemo(() => {
    if (typeof user?.hasPassword === "boolean") {
      return user.hasPassword;
    }
    // Default to true for local auth (or when authProvider is not specified / local)
    if (!user?.authProvider || user.authProvider === "local") {
      return true;
    }
    return false;
  }, [user]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (userRequiresCurrentPassword && !passwordForm.currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await authApi.changePassword(
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        token
      );

      toast.success(res.message || "Password updated successfully!", { icon: "🔒" });
      if (res.user) {
        dispatch(updateUser(res.user));
      } else {
        dispatch(updateUser({ ...user, hasPassword: true }));
      }
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ==========================================
  // 4. APPEARANCE & THEME STATE
  // ==========================================
  const [currentTheme, setCurrentTheme] = useState(() => getSavedTheme());
  const [defaultVisibility, setDefaultVisibility] = useState(() => {
    return localStorage.getItem("froggie_default_visibility") || "private";
  });

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
    toast.success(`Theme switched to ${newTheme}`, { icon: "🎨" });
  };

  const handleVisibilityChange = (visibility) => {
    setDefaultVisibility(visibility);
    localStorage.setItem("froggie_default_visibility", visibility);
    toast.success(
      visibility === "public"
        ? "New resumes will default to Public (Shareable link & Talent Directory)"
        : "New resumes will default to Private",
      { icon: "👁️" }
    );
  };

  // ==========================================
  // 5. ACCOUNT & DANGER ZONE STATE
  // ==========================================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleExportData = () => {
    try {
      const exportObject = {
        exportedAt: new Date().toISOString(),
        user: {
          name: user?.name,
          email: user?.email,
          profession: user?.profession,
          phone: user?.phone,
          location: user?.location,
          bio: user?.bio,
        },
        featureFlags: features,
        theme: currentTheme,
        defaultVisibility,
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `froggie-account-export-${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success("Account data exported as JSON", { icon: "💾" });
    } catch {
      toast.error("Failed to generate export file");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    try {
      setIsDeletingAccount(true);
      await authApi.deleteAccount(token);
      localStorage.removeItem("token");
      dispatch(logout());
      toast.success("Account deleted permanently.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete account");
    } finally {
      setIsDeletingAccount(false);
      setIsDeleteModalOpen(false);
    }
  };

  // Tabs configuration
  const tabs = [
    { id: "features", label: "Features & Tools", icon: Sliders, count: `${activeFeaturesCount}/8` },
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security & Password", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "account", label: "Account", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-4 sm:py-8 space-y-6">

        {/* TOP NAVIGATION / HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                to="/app"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Settings & Preferences
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Configure active AI modules, toggle features, manage profile and security controls.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60 shadow-2xs">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Workspace Active</span>
            </span>
          </div>
        </div>

        {/* QUICK OVERVIEW STATS BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex items-center gap-3">
            <div className="size-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Sliders className="size-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Features</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{activeFeaturesCount} of 8 Active</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex items-center gap-3">
            <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Security</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">High / Encrypted</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex items-center gap-3">
            <div className="size-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Cloud className="size-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cloud Sync</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{features.autoSave ? "Auto-Save ON" : "Manual Save"}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xs flex items-center gap-3">
            <div className="size-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Palette className="size-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Theme</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white capitalize truncate">{currentTheme} Mode</p>
            </div>
          </div>
        </div>

        {/* MODERN SEGMENTED TAB NAVIGATION */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800/80 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400 dark:text-slate-950" : ""}`} />
                <span>{tab.label}</span>
                {tab.count && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive
                        ? "bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950 font-bold"
                        : "bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: FEATURE TOGGLES (ACTIVE / INACTIVE SWITCHES)       */}
        {/* ========================================================= */}
        {activeTab === "features" && (
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-8 space-y-6 shadow-xs">
            {/* Header with Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="size-5 text-emerald-500" />
                  <span>Feature Controls & Automation</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Activate or deactivate platform capabilities, AI copilot assistants, and background sync.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetFeatures}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Restore default flags"
                >
                  <RefreshCw className="size-3" />
                  <span>Defaults</span>
                </button>
                <button
                  type="button"
                  onClick={handleEnableAll}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="size-3" />
                  <span>Enable All</span>
                </button>
              </div>
            </div>

            {/* FEATURE CARDS GRID */}
            <div className="grid grid-cols-1 gap-3.5">
              {FEATURES_CONFIG.map((feat) => {
                const Icon = feat.icon;
                const isEnabled = Boolean(features[feat.key]);

                return (
                  <div
                    key={feat.key}
                    onClick={() => toggleFeature(feat.key, feat.title)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-colors duration-200 cursor-pointer flex items-center justify-between gap-4 group ${
                      isEnabled
                        ? "bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/40"
                        : "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100"
                    }`}
                  >
                    {/* Left Icon & Text */}
                    <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                      <div
                        className={`size-11 sm:size-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-200 bg-gradient-to-br ${feat.gradient}`}
                      >
                        <Icon className="size-5 sm:size-5.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {feat.title}
                          </h3>
                          <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                            {feat.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Toggle & Status Indicator */}
                    <div
                      className="flex items-center gap-3 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none ${
                          isEnabled
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {isEnabled ? (
                          <>
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active</span>
                          </>
                        ) : (
                          <span>Inactive</span>
                        )}
                      </span>

                      <SmoothToggle
                        checked={isEnabled}
                        onChange={() => toggleFeature(feat.key, feat.title)}
                        label={feat.title}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PROFILE SETTINGS                                   */}
        {/* ========================================================= */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <User className="size-5 text-emerald-500" />
                <span>Personal Profile & Identity</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Update your contact details, profession headline, and profile avatar.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* AVATAR ROW */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
                <div className="relative group size-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border-2 border-slate-300 dark:border-slate-700 shadow-xs">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    JPG, PNG or GIF up to 5MB. Photo will appear on supported resume templates.
                  </p>
                </div>
              </div>

              {/* FORM FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="e.g. Sujeet Kumar"
                      required
                      className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full h-11 pl-10 pr-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Headline / Profession
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={profileProfession}
                      onChange={(e) => setProfileProfession(e.target.value)}
                      placeholder="e.g. Senior Full-Stack Engineer"
                      className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Location
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={profileLocation}
                    onChange={(e) => setProfileLocation(e.target.value)}
                    placeholder="e.g. Bangalore, India"
                    className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Bio / Summary
                </label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Brief overview of your career background and core competencies..."
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isSavingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{isSavingProfile ? "Saving Profile..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SECURITY & PASSWORD (CHANGE PASSWORD)              */}
        {/* ========================================================= */}
        {activeTab === "security" && (
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="size-5 text-emerald-500" />
                <span>{userRequiresCurrentPassword ? "Change Password" : "Set Account Password"}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {userRequiresCurrentPassword
                  ? "Enter your current password to set a new password."
                  : "Set a password to enable direct email and password sign-in for your account."}
              </p>
            </div>

            {/* Social User Notice (only if user has no password set) */}
            {!userRequiresCurrentPassword && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-3">
                <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  You logged in via social authentication ({user?.authProvider ? user.authProvider.charAt(0).toUpperCase() + user.authProvider.slice(1) : "Google/GitHub"}). You can set a password below to enable direct email and password sign-in as well.
                </span>
              </div>
            )}

            {/* CHANGE PASSWORD FORM */}
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
              {userRequiresCurrentPassword && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Current Password
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter your current password"
                      required
                      autoComplete="current-password"
                      className="w-full h-11 pl-10 pr-11 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      onMouseDown={(e) => e.preventDefault()}
                      style={{ position: "absolute", right: 0, top: 0, bottom: 0, height: "100%" }}
                      className="px-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200 transition-colors cursor-pointer z-10 focus:outline-none"
                      aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Min 6 characters"
                    required
                    autoComplete="new-password"
                    className="w-full h-11 pl-10 pr-11 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    style={{ position: "absolute", right: 0, top: 0, bottom: 0, height: "100%" }}
                    className="px-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200 transition-colors cursor-pointer z-10 focus:outline-none"
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        confirmNewPassword: e.target.value,
                      }))
                    }
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
                    className="w-full h-11 pl-10 pr-11 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    style={{ position: "absolute", right: 0, top: 0, bottom: 0, height: "100%" }}
                    className="px-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200 transition-colors cursor-pointer z-10 focus:outline-none"
                    aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isChangingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>
                  {isChangingPassword
                    ? "Updating Password..."
                    : userRequiresCurrentPassword
                    ? "Update Password"
                    : "Set Password"}
                </span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: APPEARANCE & THEME PREFERENCES                     */}
        {/* ========================================================= */}
        {activeTab === "appearance" && (
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="size-5 text-emerald-500" />
                <span>Theme & Display Preferences</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Customize light/dark styling and default resume sharing privacy.
              </p>
            </div>

            {/* THEME SELECTOR TILES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "light", label: "Light Mode", icon: Sun, desc: "Clean bright palette" },
                { id: "dark", label: "Dark Mode", icon: Moon, desc: "Low-light obsidian style" },
                { id: "system", label: "System Auto", icon: Laptop, desc: "Matches OS preferences" },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = currentTheme === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleThemeChange(item.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20 shadow-xs"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="size-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <Icon className={`w-4 h-4 ${isSelected ? "text-emerald-500" : "text-slate-500"}`} />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RESUME DEFAULT VISIBILITY */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Default Resume Visibility
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                <button
                  type="button"
                  onClick={() => handleVisibilityChange("private")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    defaultVisibility === "private"
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 font-bold text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/15"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">Private by default</span>
                  </div>
                  {defaultVisibility === "private" && (
                    <Check className="w-4 h-4 text-emerald-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleVisibilityChange("public")}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    defaultVisibility === "public"
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 font-bold text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/15"
                      : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">Public by default</span>
                  </div>
                  {defaultVisibility === "public" && (
                    <Check className="w-4 h-4 text-emerald-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ACCOUNT & DANGER ACTIONS                           */}
        {/* ========================================================= */}
        {activeTab === "account" && (
          <div className="space-y-6">
            {/* DATA BACKUP & EXPORT */}
            <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-500" />
                    <span>Export Account Data</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Download a full JSON archive of your personal preferences, feature flags, and profile details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* SIGN OUT & SESSION */}
            <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span>Session Management</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Sign out of your active browser session on this device.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* DANGER ZONE: DELETE ACCOUNT */}
            <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-5 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Delete Account Permanently</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Permanently delete your froggie AI account, all saved resumes, and ATS scanner reports. This action cannot be undone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CONFIRM DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900 max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="size-10 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delete Account Permanently?
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  This action is irreversible.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              All your resumes, ATS scans, uploaded files, and candidate profiles will be erased forever. To proceed, please type <strong className="text-slate-900 dark:text-white font-mono">DELETE</strong> below:
            </p>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmText("");
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== "DELETE" || isDeletingAccount}
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isDeletingAccount && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
