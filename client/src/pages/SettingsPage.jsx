import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Shield,
  Trash2,
  AlertTriangle,
  Check,
  Download,
  Eye,
  ArrowRight,
  HelpCircle,
  FileText,
  Lock,
  Mail,
  Briefcase,
  MapPin,
  Phone,
  Camera,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
  Palette,
  CheckCircle2,
  Cookie,
  BarChart3,
  Loader2,
  Upload,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { authApi } from "../api/authApi";
import { login, logout, updateUser } from "../app/features/authSlice";
import { getSavedTheme, applyTheme } from "../utils/theme";
import {
  getCookiePreferences,
  saveCookiePreferences,
  resetCookieConsent,
} from "../utils/cookieConsent";
import toast from "react-hot-toast";

const DEPARTURE_REASONS = [
  {
    id: "found_job",
    title: "I found a job / got hired! 🎉",
    desc: "I secured an employment offer and no longer need resume optimization.",
  },
  {
    id: "missing_features",
    title: "Missing features or tools I need",
    desc: "Needed specific ATS formatting, cover letter builder, or custom exports.",
  },
  {
    id: "ats_templates",
    title: "Templates didn't fit my specific industry",
    desc: "Looking for niche styles (academia, federal, or creative portfolios).",
  },
  {
    id: "privacy",
    title: "Privacy or data retention concerns",
    desc: "Prefer to purge personal resume data, phone, and profile history.",
  },
  {
    id: "technical",
    title: "Technical issues or difficulty using builder",
    desc: "Encountered formatting bugs or difficulty navigating the application.",
  },
  {
    id: "other",
    title: "Other / Personal preference",
    desc: "Temporary cleanup or personal reasons.",
  },
];

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  // Active Tab: 'profile' | 'appearance' | 'privacy' | 'danger'
  const [activeTab, setActiveTab] = useState("profile");

  // Appearance / Theme
  const [currentTheme, setCurrentTheme] = useState("light");

  // Profile Credentials Form
  const fileInputRef = useRef(null);
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileProfession, setProfileProfession] = useState(user?.profession || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileLocation, setProfileLocation] = useState(user?.location || "");
  const [profileBio, setProfileBio] = useState(user?.bio || "");
  const [defaultVisibility, setDefaultVisibility] = useState("private");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.image || "");
  const [removeImage, setRemoveImage] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Cookie & Privacy Preferences
  const [cookiePrefs, setCookiePrefs] = useState(getCookiePreferences());

  // Danger Questionnaire States
  const [dangerActionType, setDangerActionType] = useState(null); // 'deactivate' | 'delete'
  const [surveyStep, setSurveyStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState("");
  const [feedbackOptions, setFeedbackOptions] = useState([]);
  const [partedAdvice, setPartedAdvice] = useState("");
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isSubmittingDanger, setIsSubmittingDanger] = useState(false);

  // Load Settings on Mount
  useEffect(() => {
    setCurrentTheme(getSavedTheme());
    setDefaultVisibility(localStorage.getItem("froggie-default-visibility") || "private");
    setCookiePrefs(getCookiePreferences());

    const handleCookieSync = (e) => {
      if (e.detail) {
        setCookiePrefs(e.detail);
      } else {
        setCookiePrefs(getCookiePreferences());
      }
    };

    window.addEventListener("froggie:cookie-consent-changed", handleCookieSync);
    return () => window.removeEventListener("froggie:cookie-consent-changed", handleCookieSync);
  }, []);

  // Sync Profile Form with Redux User
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

  // Handle Photo Changes
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Profile photo must be smaller than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
      toast.success("Photo selected. Click 'Save Profile' to apply.", { icon: "📸" });
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Photo cleared. Click 'Save Profile' to confirm.");
  };

  // Handle Theme Switching
  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
    toast.success(`Theme switched to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode`);
  };

  // Handle Visibility Toggle
  const handleVisibilityChange = (val) => {
    setDefaultVisibility(val);
    localStorage.setItem("froggie-default-visibility", val);
    toast.success(`New resumes will default to ${val.toUpperCase()}`);
  };

  // Handle Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim()) {
      toast.error("Full Name is required");
      return;
    }

    setIsSavingProfile(true);

    try {
      const formData = new FormData();
      formData.append("name", profileName.trim());
      formData.append("profession", profileProfession.trim());
      formData.append("phone", profilePhone.trim());
      formData.append("location", profileLocation.trim());
      formData.append("bio", profileBio.trim());

      if (removeImage) {
        formData.append("removeImage", "true");
      } else if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await authApi.updateProfile(formData, token);
      if (res?.user) {
        dispatch(updateUser(res.user));
        dispatch(login({ token, user: res.user }));
        setImagePreview(res.user.image || "");
        setImageFile(null);
        setRemoveImage(false);
        toast.success(res.message || "Profile credentials updated successfully!");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Cookie Handlers
  const handleSaveCookiePrefs = () => {
    saveCookiePreferences(cookiePrefs);
    toast.success("Cookie preferences saved successfully!");
  };

  const handleOpenCookieBanner = () => {
    window.dispatchEvent(new CustomEvent("froggie:open-cookie-banner"));
  };

  const handleResetCookies = () => {
    resetCookieConsent();
    setCookiePrefs(getCookiePreferences());
    toast.success("Cookie preferences reset to initial defaults");
  };

  // Data Export Handler
  const handleExportAllData = () => {
    const backupData = {
      froggieWorkspaceExport: {
        version: "3.0.0",
        exportDate: new Date().toISOString(),
        user: {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          profession: user?.profession,
          phone: user?.phone,
          location: user?.location,
          bio: user?.bio,
        },
        preferences: {
          theme: currentTheme,
          defaultVisibility,
          cookieConsent: cookiePrefs,
        },
        notice: "Personal Froggie Workspace Archive",
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `froggie-data-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Workspace archive downloaded!");
  };

  // Danger Questionnaire Logic
  const startDangerFlow = (actionType) => {
    setDangerActionType(actionType);
    setSurveyStep(1);
    setSelectedReason("");
    setFeedbackOptions([]);
    setPartedAdvice("");
    setConfirmationPhrase("");
    setIsAcknowledged(false);
  };

  const cancelDangerFlow = () => {
    setDangerActionType(null);
    setSurveyStep(1);
    setSelectedReason("");
  };

  const toggleFeedbackOption = (opt) => {
    setFeedbackOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const handleExecuteDangerAction = async () => {
    const expectedPhrase = dangerActionType === "delete" ? "DELETE MY ACCOUNT" : "DEACTIVATE";
    if (confirmationPhrase.trim() !== expectedPhrase) {
      toast.error(`Please type "${expectedPhrase}" exactly to confirm.`);
      return;
    }

    if (!isAcknowledged) {
      toast.error("Please check the acknowledgement checkbox.");
      return;
    }

    setIsSubmittingDanger(true);
    const feedbackPayload = {
      reason: selectedReason,
      feedback: feedbackOptions,
      partedAdvice,
      confirmation: confirmationPhrase,
    };

    try {
      if (dangerActionType === "delete") {
        await authApi.deleteAccount(feedbackPayload, token);
        toast.success("Your account and resumes have been permanently deleted.");
      } else {
        await authApi.deactivateAccount(feedbackPayload, token);
        toast.success("Account deactivated. Public resumes are now private.");
      }

      dispatch(logout());
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Action failed.");
    } finally {
      setIsSubmittingDanger(false);
    }
  };

  // 4 Core, Essential Settings Categories
  const navTabs = [
    {
      id: "profile",
      label: "Profile Credentials",
      sub: "Photo, name, title & contact",
      icon: User,
    },
    {
      id: "appearance",
      label: "Appearance",
      sub: "Theme & dark mode",
      icon: Palette,
    },
    {
      id: "privacy",
      label: "Privacy & Cookies",
      sub: "Cookie consent & data export",
      icon: ShieldCheck,
    },
    {
      id: "danger",
      label: "Account & Danger Zone",
      sub: "Deactivate or delete account",
      icon: AlertTriangle,
      isDanger: true,
    },
  ];

  return (
    <div className="min-h-screen py-4 sm:py-8 px-3.5 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans pb-20 lg:pb-8">
      {/* CLEAN BREADCRUMB */}
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link
            to="/app"
            className="inline-flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Dashboard</span>
          </Link>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-800 font-bold">Settings</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Account Active
          </span>
        </div>
      </div>

      {/* PAGE HEADER */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
          Manage your personal profile, display preferences, privacy controls, and account status.
        </p>
      </div>

      {/* MOBILE SEGMENTED BAR (<1024px) */}
      <div className="flex lg:hidden overflow-x-auto gap-2 p-1 mb-4 sm:mb-6 border-b border-slate-200 pb-2.5 sm:pb-3 no-scrollbar">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && !dangerActionType;

          return (
            <button
              key={tab.id}
              onClick={() => {
                cancelDangerFlow();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs whitespace-nowrap font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : tab.isDanger
                  ? "text-rose-600 hover:bg-rose-50"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={14} className={isActive ? "text-emerald-400" : ""} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2-COLUMN SETTINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR NAVIGATION (lg:col-span-4 xl:col-span-3) */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs space-y-1 sticky top-24">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Categories
          </div>

          <div className="space-y-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id && !dangerActionType;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    cancelDangerFlow();
                    setActiveTab(tab.id);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs transition-all cursor-pointer text-left ${
                    isActive
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : tab.isDanger
                      ? "text-rose-600 hover:bg-rose-50 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      size={16}
                      className={
                        isActive
                          ? "text-emerald-400 shrink-0"
                          : tab.isDanger
                          ? "text-rose-500 shrink-0"
                          : "text-slate-400 shrink-0"
                      }
                    />
                    <div className="min-w-0">
                      <p className="leading-tight truncate">{tab.label}</p>
                      <p
                        className={`text-[10px] truncate mt-0.5 ${
                          isActive ? "text-slate-400" : "text-slate-400"
                        }`}
                      >
                        {tab.sub}
                      </p>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />
                  ) : (
                    <ChevronRight size={13} className="text-slate-300 opacity-60 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT CONTENT WORKSPACE (lg:col-span-8 xl:col-span-9) */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* ==============================================================
              DANGER QUESTIONNAIRE FLOW (IF USER TRIGGERED ACTION)
              ============================================================== */}
          {dangerActionType ? (
            <div className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150">
              <div className="flex items-start gap-3.5 pb-4 border-b border-rose-100">
                <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-rose-950">
                    {dangerActionType === "delete"
                      ? "Confirm Account Deletion"
                      : "Confirm Account Deactivation"}
                  </h3>
                  <p className="text-xs text-rose-700 font-medium mt-0.5">
                    Step {surveyStep} of 3 • Please provide your feedback before continuing.
                  </p>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="grid grid-cols-3 gap-2">
                <div
                  className={`h-1 rounded-full ${
                    surveyStep >= 1 ? "bg-rose-500" : "bg-slate-200"
                  }`}
                />
                <div
                  className={`h-1 rounded-full ${
                    surveyStep >= 2 ? "bg-rose-500" : "bg-slate-200"
                  }`}
                />
                <div
                  className={`h-1 rounded-full ${
                    surveyStep >= 3 ? "bg-rose-500" : "bg-slate-200"
                  }`}
                />
              </div>

              {/* STEP 1: DEPARTURE REASON */}
              {surveyStep === 1 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Question 1: Why are you leaving Froggie?
                  </h4>

                  <div className="grid gap-2.5">
                    {DEPARTURE_REASONS.map((r) => {
                      const isSelected = selectedReason === r.id;
                      return (
                        <div
                          key={r.id}
                          onClick={() => setSelectedReason(r.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? "bg-rose-50/60 border-rose-300 ring-1 ring-rose-300"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div>
                            <p
                              className={`text-xs font-bold ${
                                isSelected ? "text-rose-950" : "text-slate-900"
                              }`}
                            >
                              {r.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{r.desc}</p>
                          </div>
                          <div
                            className={`size-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? "border-rose-600 bg-rose-600 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check size={10} strokeWidth={3} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={cancelDangerFlow}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Cancel & Keep Account
                    </button>
                    <button
                      type="button"
                      disabled={!selectedReason}
                      onClick={() => setSurveyStep(2)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <span>Next Question</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: FEEDBACK DETAILS */}
              {surveyStep === 2 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Question 2: What could we improve in the product?
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-2.5">
                    {[
                      "More modern resume templates",
                      "Faster AI bullet-point generator",
                      "Free unbranded PDF downloads",
                      "Better mobile editing experience",
                      "Integrated cover letter writer",
                      "Job board application tracker sync",
                    ].map((opt) => {
                      const isChecked = feedbackOptions.includes(opt);
                      return (
                        <label
                          key={opt}
                          onClick={() => toggleFeedbackOption(opt)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                            isChecked
                              ? "bg-slate-100 border-slate-400 text-slate-950"
                              : "border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 size-4"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold text-slate-700">
                      Additional feedback for our team (Optional):
                    </label>
                    <textarea
                      rows={3}
                      value={partedAdvice}
                      onChange={(e) => setPartedAdvice(e.target.value)}
                      placeholder="Tell us what worked well or what felt lacking..."
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none resize-none font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSurveyStep(1)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setSurveyStep(3)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span>Proceed to Final Confirmation</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: FINAL PHRASE SECURITY CONFIRMATION */}
              {surveyStep === 3 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                    Final Safeguard: Security Confirmation
                  </h4>

                  {/* BACKUP EXPORT REMINDER */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">Download your workspace archive first</p>
                      <p className="text-[11px] text-slate-500">Save a JSON backup of your resume records.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportAllData}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer shadow-2xs"
                    >
                      Download Archive
                    </button>
                  </div>

                  {/* ACKNOWLEDGEMENT CHECKBOX */}
                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAcknowledged}
                      onChange={(e) => setIsAcknowledged(e.target.checked)}
                      className="mt-0.5 rounded border-rose-300 text-rose-600 focus:ring-rose-500 size-4 shrink-0"
                    />
                    <span className="text-xs text-rose-950 font-semibold leading-relaxed">
                      {dangerActionType === "delete"
                        ? "I understand that deleting my account permanently deletes all resumes, ATS data, and application history with NO recovery possible."
                        : "I understand that deactivating will unpublish my public resumes until I sign back in."}
                    </span>
                  </label>

                  {/* TYPED PHRASE INPUT */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Type{" "}
                      <span className="font-bold text-rose-600 font-mono">
                        {dangerActionType === "delete" ? "DELETE MY ACCOUNT" : "DEACTIVATE"}
                      </span>{" "}
                      below to confirm:
                    </label>
                    <input
                      type="text"
                      value={confirmationPhrase}
                      onChange={(e) => setConfirmationPhrase(e.target.value)}
                      placeholder={dangerActionType === "delete" ? "DELETE MY ACCOUNT" : "DEACTIVATE"}
                      className="w-full px-3.5 py-2 text-xs font-bold rounded-xl border border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none uppercase font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSurveyStep(2)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      disabled={
                        !isAcknowledged ||
                        confirmationPhrase.trim() !==
                          (dangerActionType === "delete" ? "DELETE MY ACCOUNT" : "DEACTIVATE") ||
                        isSubmittingDanger
                      }
                      onClick={handleExecuteDangerAction}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      {isSubmittingDanger ? (
                        <span>Processing...</span>
                      ) : dangerActionType === "delete" ? (
                        <span>Permanently Delete My Account</span>
                      ) : (
                        <span>Deactivate My Account</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* ==============================================================
                  TAB 1: PROFILE CREDENTIALS
                  ============================================================== */}
              {activeTab === "profile" && (
                <form
                  onSubmit={handleSaveProfile}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150"
                >
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <User size={18} className="text-emerald-600" />
                      <span>Profile Credentials & Identity</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Update your candidate information, profile photo, and default resume visibility.
                    </p>
                  </div>

                  {/* HIDDEN FILE INPUT */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {/* AVATAR & PHOTO MANAGEMENT */}
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="relative shrink-0 self-center sm:self-auto">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt={user?.name || "Candidate Avatar"}
                          className="size-16 sm:size-20 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-xs"
                        />
                      ) : (
                        <div className="size-16 sm:size-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 size-7 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xs cursor-pointer ring-2 ring-white"
                        title="Upload new photo"
                      >
                        <Camera size={13} />
                      </button>
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-900">Profile Photo</p>
                        {imageFile && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                            Unsaved selection
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Square format recommended (JPG, PNG, WebP up to 5MB). Photo updates your navbar and resume headers.
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs"
                        >
                          <Upload size={13} />
                          <span>{imagePreview ? "Change Photo" : "Upload Photo"}</span>
                        </button>

                        {imagePreview && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                          >
                            <Trash2 size={13} />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* FORM FIELDS */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="e.g. Sujeet Sharma"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none font-medium"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Professional Title</label>
                      <input
                        type="text"
                        value={profileProfession}
                        onChange={(e) => setProfileProfession(e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Account Email</label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
                        title="Linked to authentication"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Contact Phone</label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none font-medium"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Location / City</label>
                      <input
                        type="text"
                        value={profileLocation}
                        onChange={(e) => setProfileLocation(e.target.value)}
                        placeholder="e.g. San Francisco, CA / Remote"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none font-medium"
                      />
                    </div>

                    {/* DEFAULT RESUME VISIBILITY */}
                    <div className="sm:col-span-2 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Default Resume Visibility</p>
                        <p className="text-[11px] text-slate-500">
                          Initial privacy mode assigned whenever you create a new resume draft.
                        </p>
                      </div>

                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleVisibilityChange("private")}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                            defaultVisibility === "private"
                              ? "bg-slate-900 text-white shadow-2xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Private (Default)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVisibilityChange("public")}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                            defaultVisibility === "public"
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          Public Link
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700">
                          Professional Summary / Career Bio
                        </label>
                        <span className="text-[10px] text-slate-400">
                          {profileBio.length}/350 characters
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        maxLength={350}
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        placeholder="Brief summary of your professional experience and key technical skills..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 outline-none font-medium resize-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} />
                          <span>Save Profile Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ==============================================================
                  TAB 2: APPEARANCE (SERIOUS THEME CARDS)
                  ============================================================== */}
              {activeTab === "appearance" && (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Palette size={18} className="text-emerald-600" />
                      <span>Appearance & Theme</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Choose your preferred interface theme. Selected theme applies across your entire workspace.
                    </p>
                  </div>

                  {/* CLEAN THEME CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* LIGHT THEME */}
                    <div
                      onClick={() => handleThemeChange("light")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                        currentTheme === "light"
                          ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                      }`}
                    >
                      {/* MINI LIGHT CANVAS */}
                      <div className="h-24 rounded-lg border border-slate-200 bg-slate-50 p-2.5 flex flex-col justify-between overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                          <div className="h-2 w-12 rounded bg-slate-300" />
                          <Sun size={12} className="text-amber-500" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 w-full rounded bg-slate-200" />
                          <div className="h-1.5 w-3/4 rounded bg-slate-200" />
                        </div>
                        <div className="h-2 w-8 rounded bg-emerald-500" />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Light Mode</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">High-contrast daylight theme</p>
                        </div>
                        {currentTheme === "light" && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DARK THEME */}
                    <div
                      onClick={() => handleThemeChange("dark")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                        currentTheme === "dark"
                          ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                      }`}
                    >
                      {/* MINI DARK CANVAS */}
                      <div className="h-24 rounded-lg border border-slate-800 bg-slate-900 p-2.5 flex flex-col justify-between overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <div className="h-2 w-12 rounded bg-slate-700" />
                          <Moon size={12} className="text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 w-full rounded bg-slate-800" />
                          <div className="h-1.5 w-3/4 rounded bg-slate-800" />
                        </div>
                        <div className="h-2 w-8 rounded bg-emerald-500" />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Dark Mode</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Deep obsidian dark theme</p>
                        </div>
                        {currentTheme === "dark" && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* SYSTEM DEFAULT */}
                    <div
                      onClick={() => handleThemeChange("system")}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                        currentTheme === "system"
                          ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                      }`}
                    >
                      {/* MINI SPLIT CANVAS */}
                      <div className="h-24 rounded-lg border border-slate-200 bg-gradient-to-r from-slate-100 to-slate-900 p-2.5 flex flex-col justify-between overflow-hidden">
                        <div className="flex items-center justify-between pb-1.5">
                          <div className="h-2 w-12 rounded bg-slate-400" />
                          <Laptop size={12} className="text-blue-500" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 w-full rounded bg-slate-400/50" />
                          <div className="h-1.5 w-3/4 rounded bg-slate-400/50" />
                        </div>
                        <div className="h-2 w-8 rounded bg-slate-700" />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-xs font-bold text-slate-900">System Sync</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Follows OS lighting preference</p>
                        </div>
                        {currentTheme === "system" && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB 3: PRIVACY & COOKIES
                  ============================================================== */}
              {activeTab === "privacy" && (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-emerald-600" />
                      <span>Privacy, Cookies & Data Export</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Configure your cookie consent permissions and download a full backup archive of your account.
                    </p>
                  </div>

                  {/* COOKIE CONSENT PERMISSIONS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Cookie Preferences (GDPR Compliant)
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenCookieBanner}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                      >
                        Open Notice Banner 🍪
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {/* STRICTLY ESSENTIAL */}
                      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Lock size={15} className="text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <span>Strictly Essential Cookies</span>
                              <span className="text-[9px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.2 rounded">
                                Always Active
                              </span>
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Required for authentication tokens, session security, and theme persistence.
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Enforced
                        </span>
                      </div>

                      {/* ANALYTICS */}
                      <label className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <BarChart3 size={15} className="text-blue-600 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">ATS Analytics & Performance</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Anonymous parsing telemetry used to improve scanner speed and keyword accuracy.
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={cookiePrefs.analytics}
                          onChange={(e) =>
                            setCookiePrefs({ ...cookiePrefs, analytics: e.target.checked })
                          }
                          className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </label>

                      {/* AI PERSONALIZATION */}
                      <label className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText size={15} className="text-purple-600 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">AI Enhancement Cache</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Stores generated suggestions temporarily for instant builder reloads.
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={cookiePrefs.personalization}
                          onChange={(e) =>
                            setCookiePrefs({ ...cookiePrefs, personalization: e.target.checked })
                          }
                          className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={handleSaveCookiePrefs}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Save Cookie Preferences
                      </button>

                      <button
                        type="button"
                        onClick={handleResetCookies}
                        className="text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        Reset Defaults
                      </button>
                    </div>
                  </div>

                  {/* DATA EXPORT & PORTABILITY */}
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Data Portability
                    </p>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-900">Export Complete Account Archive</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Download all your resumes, ATS logs, and profile records in a structured JSON file.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleExportAllData}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer shadow-2xs shrink-0"
                      >
                        <Download size={13} />
                        <span>Download Archive (.json)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==============================================================
                  TAB 4: ACCOUNT STATUS & DANGER ZONE
                  ============================================================== */}
              {activeTab === "danger" && (
                <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle size={18} className="text-rose-600" />
                      <span>Account Lifecycle & Danger Zone</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Manage account freeze, temporary deactivation, or permanent data erasure.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* TEMPORARY DEACTIVATION */}
                    <div className="p-4 sm:p-5 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-amber-500" />
                          <span>Temporarily Deactivate Account</span>
                        </p>
                        <p className="text-[11px] text-amber-800 mt-1">
                          Pauses your account and hides all public resume links. You can safely reactivate anytime simply by logging back in.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => startDangerFlow("deactivate")}
                        className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
                      >
                        Deactivate Account
                      </button>
                    </div>

                    {/* PERMANENT DELETION */}
                    <div className="p-4 sm:p-5 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                          <Trash2 size={14} className="text-rose-600" />
                          <span>Permanently Delete Account & Resumes</span>
                        </p>
                        <p className="text-[11px] text-rose-800 mt-1">
                          Irrevocably erases all your tailored resumes, ATS scores, audit reports, and personal profile information. This action cannot be reversed.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => startDangerFlow("delete")}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
