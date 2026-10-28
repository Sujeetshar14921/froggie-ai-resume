import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Shield,
  Lock,
  Palette,
  Sliders,
  ArrowLeft,
} from "lucide-react";
import { authApi } from "../api/authApi";
import { logout, updateUser } from "../app/features/authSlice";
import { getSavedTheme, applyTheme } from "../utils/theme";
import toast from "react-hot-toast";
import {
  FeaturesTab,
  ProfileTab,
  SecurityTab,
  AppearanceTab,
  AccountTab,
} from "../components/settings";

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
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB");
      return;
    }

    setImageFile(file);
    setRemoveImage(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
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
      dispatch(updateUser(res.user));
      toast.success("Profile updated successfully!", { icon: "👤" });
      setImageFile(null);
      setRemoveImage(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // ==========================================
  // 3. SECURITY & PASSWORD STATE
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

  const userRequiresCurrentPassword = user?.hasPassword === true;

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

        {/* TAB CONTENTS */}
        {activeTab === "features" && (
          <FeaturesTab
            features={features}
            toggleFeature={toggleFeature}
            onResetFeatures={handleResetFeatures}
            onEnableAll={handleEnableAll}
          />
        )}

        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            profileName={profileName}
            setProfileName={setProfileName}
            profileProfession={profileProfession}
            setProfileProfession={setProfileProfession}
            profilePhone={profilePhone}
            setProfilePhone={setProfilePhone}
            profileLocation={profileLocation}
            setProfileLocation={setProfileLocation}
            profileBio={profileBio}
            setProfileBio={setProfileBio}
            imagePreview={imagePreview}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
            handleRemoveImage={handleRemoveImage}
            handleSaveProfile={handleSaveProfile}
            isSavingProfile={isSavingProfile}
          />
        )}

        {activeTab === "security" && (
          <SecurityTab
            user={user}
            userRequiresCurrentPassword={userRequiresCurrentPassword}
            passwordForm={passwordForm}
            setPasswordForm={setPasswordForm}
            showCurrentPassword={showCurrentPassword}
            setShowCurrentPassword={setShowCurrentPassword}
            showNewPassword={showNewPassword}
            setShowNewPassword={setShowNewPassword}
            showConfirmNewPassword={showConfirmNewPassword}
            setShowConfirmNewPassword={setShowConfirmNewPassword}
            handleChangePassword={handleChangePassword}
            isChangingPassword={isChangingPassword}
          />
        )}

        {activeTab === "appearance" && (
          <AppearanceTab
            currentTheme={currentTheme}
            handleThemeChange={handleThemeChange}
            defaultVisibility={defaultVisibility}
            handleVisibilityChange={handleVisibilityChange}
          />
        )}

        {activeTab === "account" && (
          <AccountTab
            handleExportData={handleExportData}
            handleLogout={handleLogout}
            isDeleteModalOpen={isDeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            deleteConfirmText={deleteConfirmText}
            setDeleteConfirmText={setDeleteConfirmText}
            isDeletingAccount={isDeletingAccount}
            handleDeleteAccount={handleDeleteAccount}
          />
        )}

      </div>
    </div>
  );
};

export default SettingsPage;
