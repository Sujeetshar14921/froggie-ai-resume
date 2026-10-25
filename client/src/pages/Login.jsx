import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login } from "../app/features/authSlice";
import { authApi } from "../api/authApi";
import { resumeApi } from "../api/resumeApi";
import { API_BASE_URL } from "../configs/api";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { BrandIcon } from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";
import { applyTheme, isDarkEffective } from "../utils/theme";

/* BRAND ICONS */
const GoogleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const GitHubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const Login = ({ initialMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const urlState = query.get("state");
  const isRegister = initialMode === "register" || location.pathname === "/signup" || urlState === "register";

  // State: 'login' | 'register' | 'forgot'
  const [state, setState] = useState(isRegister ? "register" : "login");

  // Multi-step signup: 'form' | 'otp'
  const [signupStep, setSignupStep] = useState("form");

  // Multi-step reset password: 'email' | 'verify'
  const [resetStep, setResetStep] = useState("email");

  const [isDark, setIsDark] = useState(() => isDarkEffective());
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // OTP and cooldown
  const [signupOtp, setSignupOtp] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const searchParams = new URLSearchParams(window.location.search);
  const tokenInUrl = searchParams.get("token");
  const currentUser = useSelector((state) => state.auth?.user);

  // Cooldown countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Sync state with path changes
  useEffect(() => {
    if (location.pathname === "/signup" || urlState === "register") {
      setState("register");
      setSignupStep("form");
    } else if (location.pathname === "/login" && urlState !== "register") {
      setState("login");
    }
  }, [location.pathname, urlState]);

  // Sync dark mode listener
  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail && typeof e.detail.isDark === "boolean") {
        setIsDark(e.detail.isDark);
      }
    };
    window.addEventListener("froggie-theme-change", handleThemeChange);
    return () => window.removeEventListener("froggie-theme-change", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    applyTheme(nextTheme);
    setIsDark(!isDark);
  };

  const switchMode = (newMode) => {
    setState(newMode);
    setSignupStep("form");
    setResetStep("email");
    setSignupOtp("");
    setResetOtp("");
    const targetPath = newMode === "register" ? "/signup" : "/login";
    if (location.pathname !== targetPath && newMode !== "forgot") {
      navigate(targetPath, { replace: true });
    }
  };

  useSEO({
    title:
      state === "register"
        ? "Sign Up | froggie AI"
        : state === "forgot"
        ? "Reset Password | froggie AI"
        : "Log In | froggie AI",
    description:
      state === "register"
        ? "Create your free froggie AI account to build ATS-compliant resumes, find talent, and optimize files with AI."
        : "Sign in to your froggie AI account to access your resumes, ATS checker, and file studio.",
    keywords:
      state === "register"
        ? "signup, froggie signup, create account, free resume maker signup, froggie AI"
        : "login, froggie login, sign in, resume builder login, froggie AI",
    canonical: state === "register" ? "https://froggie.site/signup" : "https://froggie.site/login",
    ogImage: "https://froggie.site/froggie_banner.jpg",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (currentUser && !tokenInUrl && !loading) {
      navigate("/");
    }
  }, [currentUser, navigate, tokenInUrl, loading]);

  // Handle OAuth Redirect / Callback
  useEffect(() => {
    const token = searchParams.get("token");
    const provider = searchParams.get("provider");
    const redirectParam = searchParams.get("redirect");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      if (error === "not_configured") {
        toast.error(
          `${provider ? provider.toUpperCase() : "Social"} login credentials are not yet configured in server .env.`,
          { duration: 5000 }
        );
      } else if (error === "access_denied" || error === "cancelled") {
        toast.error(errorDescription || "Google login was cancelled or access denied.", { icon: "ℹ️" });
      } else {
        toast.error(
          errorDescription
            ? `Google login failed: ${errorDescription}`
            : `Login with ${provider || "social account"} failed. Please try again or use email/password.`,
          { duration: 6000 }
        );
      }
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token) {
      window.history.replaceState({}, document.title, window.location.pathname);

      const processOAuthLogin = async () => {
        try {
          setLoading(true);
          localStorage.setItem("token", token);
          const data = await authApi.getUserData(token);
          if (data?.user) {
            dispatch(login({ token, user: data.user }));
          }

          const pendingCreate = sessionStorage.getItem("pending_resume_create");
          if (pendingCreate) {
            try {
              const { template, accent_color } = JSON.parse(pendingCreate);
              sessionStorage.removeItem("pending_resume_create");
              const resumeTitle = data?.user?.name ? `${data.user.name}'s Resume` : "My Resume";
              const createRes = await resumeApi.createResume(
                {
                  title: resumeTitle,
                  template: template || "classic",
                  accent_color: accent_color || "#10B981",
                },
                token
              );
              toast.success(`Welcome ${data?.user?.name || ""}! Opening your resume editor...`, { icon: "🐸" });
              navigate(`/app/builder/${createRes.resume._id}`);
              return;
            } catch (autoErr) {
              console.error("Auto create error:", autoErr);
            }
          }

          toast.success(
            `Welcome, ${data?.user?.name || "Candidate"}! Logged in with ${
              provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : "Social Account"
            }.`,
            { icon: "🐸" }
          );

          if (redirectParam === "app" || redirectParam === "dashboard") {
            navigate("/app");
          } else if (redirectParam && redirectParam !== "/" && redirectParam !== "landing" && redirectParam !== "hero") {
            navigate(redirectParam);
          } else {
            navigate("/");
          }
        } catch {
          toast.error("Failed to complete social login. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      processOAuthLogin();
    }
  }, [dispatch, navigate]);

  const handleSocialLogin = (provider) => {
    const baseUrl = API_BASE_URL || window.location.origin;
    const currentRedirect = query.get("redirect") || "/";
    const clientHost = window.location.origin;
    window.location.href = `${baseUrl}/api/users/auth/${provider}?redirect=${encodeURIComponent(
      currentRedirect
    )}&client_host=${encodeURIComponent(clientHost)}`;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePostAuthSuccess = async (data, successMessage) => {
    dispatch(login(data));
    localStorage.setItem("token", data.token);

    const pendingCreate = sessionStorage.getItem("pending_resume_create");
    if (pendingCreate) {
      try {
        const { template, accent_color } = JSON.parse(pendingCreate);
        sessionStorage.removeItem("pending_resume_create");

        const resumeTitle = data.user?.name ? `${data.user.name}'s Resume` : "My Resume";
        const createRes = await resumeApi.createResume(
          {
            title: resumeTitle,
            template: template || "classic",
            accent_color: accent_color || "#10B981",
          },
          data.token
        );

        toast.success("Welcome! Opening your resume editor...", { icon: "🐸" });
        navigate(`/app/builder/${createRes.resume._id}`);
        return;
      } catch (autoErr) {
        console.error("Auto create error:", autoErr);
      }
    }

    toast.success(successMessage || data.message || "Logged in successfully!");

    const targetRedirect = query.get("redirect");
    if (targetRedirect === "app" || targetRedirect === "dashboard") {
      navigate("/app");
    } else if (targetRedirect && targetRedirect !== "/" && targetRedirect !== "landing" && targetRedirect !== "hero") {
      navigate(targetRedirect);
    } else {
      navigate("/");
    }
  };

  // 1. SIGN IN SUBMISSION
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await authApi.login({
        email: formData.email,
        password: formData.password,
      });
      await handlePostAuthSuccess(data, "Signed in successfully!");
    } catch (error) {
      const serverMsg = error?.response?.data?.message || error.message;
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  // 2. SIGNUP STEP 1: SEND OTP VIA SMTP
  const handleSignupSendOtp = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.sendSignupOtp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success(res.message || "Verification code sent to your email!");
      setSignupStep("otp");
      setResendCooldown(60);
    } catch (error) {
      const serverMsg = error?.response?.data?.message || error.message;
      if (typeof serverMsg === "string" && serverMsg.toLowerCase().includes("already exists")) {
        toast.error("Account already exists with this email! Switched to Sign In.", {
          duration: 4000,
          icon: "ℹ️",
        });
        switchMode("login");
      } else {
        toast.error(serverMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. SIGNUP STEP 2: VERIFY OTP AND COMPLETE REGISTRATION
  const handleVerifySignupOtp = async (e) => {
    e.preventDefault();

    if (signupOtp.trim().length !== 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.verifySignupOtp({
        email: formData.email,
        otp: signupOtp.trim(),
      });

      await handlePostAuthSuccess(data, "Account created and verified successfully!");
    } catch (error) {
      const serverMsg = error?.response?.data?.message || error.message;
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  // Resend Signup OTP
  const handleResendSignupOtp = async () => {
    if (resendCooldown > 0) return;
    try {
      setLoading(true);
      const res = await authApi.sendSignupOtp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast.success(res.message || "A new 6-digit code has been sent!");
      setResendCooldown(60);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. RESET PASSWORD STEP 1: SEND RESET OTP
  const handleSendResetOtp = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("Please enter your registered email address");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.sendResetOtp({ email: formData.email });
      toast.success(res.message || "Password reset code sent to your email!");
      setResetStep("verify");
      setResendCooldown(60);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. RESET PASSWORD STEP 2: VERIFY OTP & SET NEW PASSWORD
  const handleVerifyResetPassword = async (e) => {
    e.preventDefault();

    if (resetOtp.trim().length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.resetPassword({
        email: formData.email,
        otp: resetOtp.trim(),
        newPassword: formData.newPassword,
      });

      await handlePostAuthSuccess(data, "Password reset successfully! You are now logged in.");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen min-h-[100dvh] w-full bg-white dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row overflow-hidden transition-colors duration-200">
      {/* SECURE AUTHENTICATION OVERLAY */}
      {loading && tokenInUrl && (
        <div className="fixed inset-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center space-y-3.5 select-none animate-in fade-in duration-200">
          <BrandIcon size="md" />
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <div className="text-center space-y-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Authenticating Securely...</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Redirecting you to froggie...</p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LEFT SIDE: BRANDING & TRANSPARENT MASCOT HERO             */}
      {/* ========================================================= */}
      <aside className="hidden lg:flex lg:w-5/12 xl:w-1/2 h-full flex-col justify-between p-6 xl:p-8 bg-gradient-to-br from-[#060a12] via-[#091222] to-[#040810] text-white relative overflow-hidden border-r border-slate-800/80 select-none">
        {/* Subtle background ambient glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-emerald-500/15 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-1/4 -left-16 w-64 h-64 bg-teal-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* TOP: Brand Header */}
        <div className="relative z-10 shrink-0">
          <Link to="/" className="inline-flex items-center gap-2.5 group focus:outline-none">
            <BrandIcon
              size="sm"
              className="group-hover:scale-105 transition-transform"
              iconClassName="group-hover:rotate-6 transition-transform"
            />
            <div className="leading-tight">
              <span className="text-xl font-black tracking-tight text-white">
                froggie<span className="text-emerald-400">.</span>
              </span>
              <p className="text-[9px] text-emerald-400/90 font-bold uppercase tracking-wider">
                ATS Smart Resume Studio
              </p>
            </div>
          </Link>
        </div>

        {/* CENTER: Full Mascot Image & Clean Copy */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2 text-center max-w-sm xl:max-w-md mx-auto w-full">
          {/* Hero Transparent Character */}
          <div className="relative group mb-3 flex items-center justify-center">
            {/* Soft backdrop glow directly behind mascot */}
            <div className="absolute -inset-3 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-400/25 transition-all duration-500 pointer-events-none" />

            <img
              src="/froggie_logo.png"
              alt="froggie AI Mascot"
              className="relative max-h-[24vh] xl:max-h-[30vh] w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500 ease-out select-none"
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Minimalist, Clean Text */}
          <div className="space-y-1.5">
            <h2 className="text-xl xl:text-2xl font-black text-white tracking-tight leading-tight">
              Build resumes that <span className="text-emerald-400">stand out</span>.
            </h2>
            <p className="text-xs text-slate-300 max-w-xs xl:max-w-sm mx-auto leading-relaxed">
              100% ATS compliant, AI powered, and engineered to pass recruiter screenings.
            </p>

            {/* Quick Feature Badges */}
            <div className="flex items-center justify-center gap-1.5 pt-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] xl:text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                100% ATS Pass
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] xl:text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
                AI Bullet Enhancer
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] xl:text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
                Free Forever
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM: Minimal Proof */}
        <div className="relative z-10 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Trusted by 15,000+ candidates</span>
          <span className="text-emerald-400/90 font-medium">Free & Open Studio</span>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* RIGHT SIDE: AUTHENTICATION FORM (UNBOXED CANVAS, NO CARD) */}
      {/* ========================================================= */}
      <main className="w-full lg:w-7/12 xl:w-1/2 h-full flex flex-col justify-between p-4 sm:p-6 lg:p-7 xl:p-8 overflow-y-auto">
        {/* TOP NAV BAR */}
        <div className="w-full flex items-center justify-between pb-2 sm:pb-3 max-w-sm sm:max-w-md mx-auto shrink-0">
          {/* Mobile brand (hidden on desktop because left side has logo) */}
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 group">
            <BrandIcon size="xs" />
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              froggie<span className="text-emerald-500">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 ml-auto">
            {/* Back to Home link */}
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </div>
        </div>

        {/* MAIN FORM CONTAINER (CARDLESS CANVAS) */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto">
          {/* VIEW: FORGOT / RESET PASSWORD */}
          {state === "forgot" ? (
            <div className="animate-in fade-in duration-200">
              <div className="mb-3 sm:mb-4">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {resetStep === "email" ? "Reset your password" : "Enter verification code"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {resetStep === "email"
                    ? "Enter your registered email address and we'll send a 6-digit OTP code to reset your password."
                    : `Enter the 6-digit code sent to ${formData.email} and create your new password.`}
                </p>
              </div>

              {resetStep === "email" ? (
                <form onSubmit={handleSendResetOtp} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        autoFocus
                        autoComplete="email"
                        className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                    <span>{loading ? "Sending Code..." : "Send Reset Code"}</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyResetPassword} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      6-Digit OTP Code
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        required
                        autoFocus
                        className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono tracking-widest text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      New Password
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                        className="w-full h-10 pl-10 pr-11 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
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

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Confirm New Password
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmNewPassword ? "text" : "password"}
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
                        className="w-full h-10 pl-10 pr-11 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
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
                        {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>{loading ? "Resetting Password..." : "Set New Password"}</span>
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1.5">
                    <button
                      type="button"
                      onClick={() => setResetStep("email")}
                      className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer flex items-center gap-1 text-[11px]"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Change Email</span>
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || loading}
                      onClick={handleSendResetOtp}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50 cursor-pointer flex items-center gap-1 text-[11px]"
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                      <span>
                        {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* VIEW: SIGN IN OR SIGN UP */
            <div>
              {/* TITLE & SUBTITLE */}
              <div className="mb-3 sm:mb-4">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {state === "login"
                    ? "Welcome back"
                    : signupStep === "otp"
                    ? "Verify your email"
                    : "Create an account"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {state === "login"
                    ? "Enter your credentials to access your ATS optimization tools."
                    : signupStep === "otp"
                    ? `We sent a 6-digit verification code to ${formData.email}`
                    : "Get started for free. Craft ATS-compliant resumes with AI."}
                </p>
              </div>

              {/* TAB SWITCHER: Minimalist underline tabs */}
              {signupStep !== "otp" && (
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-3 pb-1.5">
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className={`pb-2 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                      state === "login"
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    }`}
                  >
                    Sign In
                    {state === "login" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className={`ml-6 pb-2 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
                      state === "register"
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    }`}
                  >
                    Create Account
                    {state === "register" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                </div>
              )}

              {/* SOCIAL LOGIN BUTTONS */}
              {signupStep !== "otp" && (
                <>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("google")}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
                    >
                      <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin("github")}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
                    >
                      <GitHubIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>GitHub</span>
                    </button>
                  </div>

                  {/* DIVIDER */}
                  <div className="relative flex items-center justify-center mb-3">
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                    <span className="bg-white dark:bg-[#090d16] px-2.5 text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 relative transition-colors duration-200">
                      Or continue with email
                    </span>
                  </div>
                </>
              )}

              {/* SIGNUP STEP 2: OTP VERIFICATION VIEW */}
              {state === "register" && signupStep === "otp" ? (
                <form onSubmit={handleVerifySignupOtp} className="space-y-3 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      6-Digit Verification Code
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={signupOtp}
                        onChange={(e) => setSignupOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        required
                        autoFocus
                        className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono tracking-widest text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      Code was sent via SMTP to your email. Check spam folder if not received.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || signupOtp.trim().length !== 6}
                    className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>{loading ? "Verifying..." : "Verify & Complete Signup"}</span>
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1.5">
                    <button
                      type="button"
                      onClick={() => setSignupStep("form")}
                      className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer flex items-center gap-1 text-[11px]"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Back / Edit Info</span>
                    </button>

                    <button
                      type="button"
                      disabled={resendCooldown > 0 || loading}
                      onClick={handleResendSignupOtp}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50 cursor-pointer flex items-center gap-1 text-[11px]"
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                      <span>
                        {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
                      </span>
                    </button>
                  </div>
                </form>
              ) : (
                /* MAIN FORM: LOGIN OR SIGNUP STEP 1 */
                <form
                  onSubmit={state === "login" ? handleLoginSubmit : handleSignupSendOtp}
                  className="space-y-2.5"
                >
                  {state === "register" && (
                    <div className="space-y-1 animate-in fade-in duration-200">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Full Name
                      </label>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Sujeet Kumar"
                          required
                          autoComplete="name"
                          className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      {state === "login" && (
                        <button
                          type="button"
                          onClick={() => {
                            setState("forgot");
                            setResetStep("email");
                          }}
                          className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        autoComplete={state === "login" ? "current-password" : "new-password"}
                        className="w-full h-10 pl-10 pr-11 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        style={{ position: "absolute", right: 0, top: 0, bottom: 0, height: "100%" }}
                        className="px-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200 transition-colors cursor-pointer z-10 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD FOR SIGNUP */}
                  {state === "register" && (
                    <div className="space-y-1 animate-in fade-in duration-200">
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Confirm Password
                      </label>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          required
                          autoComplete="new-password"
                          className="w-full h-10 pl-10 pr-11 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          onMouseDown={(e) => e.preventDefault()}
                          style={{ position: "absolute", right: 0, top: 0, bottom: 0, height: "100%" }}
                          className="px-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200 transition-colors cursor-pointer z-10 focus:outline-none"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ACTION BUTTON */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>
                      {loading
                        ? state === "login"
                          ? "Signing in..."
                          : "Sending OTP..."
                        : state === "login"
                        ? "Sign In"
                        : "Verify Email & Sign Up"}
                    </span>
                    {!loading && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </form>
              )}

              {/* BOTTOM HELPER */}
              {signupStep !== "otp" && (
                <div className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                  {state === "login" ? "Don't have an account yet?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => switchMode(state === "login" ? "register" : "login")}
                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer ml-0.5"
                  >
                    {state === "login" ? "Create one free" : "Sign in here"}
                  </button>
                </div>
              )}

              {/* LEGAL NOTICE */}
              <p className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                By continuing, you agree to froggie's{" "}
                <Link to="/faq" className="underline hover:text-slate-600 dark:hover:text-slate-400">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/faq" className="underline hover:text-slate-600 dark:hover:text-slate-400">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Login;
