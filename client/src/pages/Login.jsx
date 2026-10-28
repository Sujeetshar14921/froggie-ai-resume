import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login } from "../app/features/authSlice";
import { authApi } from "../api/authApi";
import { resumeApi } from "../api/resumeApi";
import { API_BASE_URL } from "../configs/api";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { BrandIcon } from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";
import {
  AuthHeroAside,
  SocialAuthButtons,
  SignInForm,
  SignUpForm,
  OtpVerificationForm,
  ForgotPasswordForm,
} from "../components/auth";

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

      {/* LEFT SIDE: BRANDING & MASCOT HERO */}
      <AuthHeroAside />

      {/* RIGHT SIDE: AUTHENTICATION FORM */}
      <main className="w-full lg:w-7/12 xl:w-1/2 h-full flex flex-col justify-between p-4 sm:p-6 lg:p-7 xl:p-8 overflow-y-auto">
        {/* TOP NAV BAR */}
        <div className="w-full flex items-center justify-between pb-2 sm:pb-3 max-w-sm sm:max-w-md mx-auto shrink-0">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2 group">
            <BrandIcon size="xs" />
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              froggie<span className="text-emerald-500">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 ml-auto">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </div>
        </div>

        {/* MAIN FORM CONTAINER */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto">
          {state === "forgot" ? (
            <ForgotPasswordForm
              resetStep={resetStep}
              formData={formData}
              handleChange={handleChange}
              resetOtp={resetOtp}
              setResetOtp={setResetOtp}
              showNewPassword={showNewPassword}
              setShowNewPassword={setShowNewPassword}
              showConfirmNewPassword={showConfirmNewPassword}
              setShowConfirmNewPassword={setShowConfirmNewPassword}
              onSendResetOtp={handleSendResetOtp}
              onVerifyResetPassword={handleVerifyResetPassword}
              loading={loading}
              resendCooldown={resendCooldown}
              onBackToSignIn={() => switchMode("login")}
              onChangeEmail={() => setResetStep("email")}
            />
          ) : (
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

              {/* TAB SWITCHER */}
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
                <SocialAuthButtons onSocialLogin={handleSocialLogin} />
              )}

              {/* OTP STEP OR FORM */}
              {state === "register" && signupStep === "otp" ? (
                <OtpVerificationForm
                  otp={signupOtp}
                  setOtp={setSignupOtp}
                  onSubmit={handleVerifySignupOtp}
                  loading={loading}
                  resendCooldown={resendCooldown}
                  onResendOtp={handleResendSignupOtp}
                  onBack={() => setSignupStep("form")}
                  email={formData.email}
                />
              ) : state === "login" ? (
                <SignInForm
                  formData={formData}
                  handleChange={handleChange}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  onSubmit={handleLoginSubmit}
                  loading={loading}
                  onForgotPassword={() => {
                    setState("forgot");
                    setResetStep("email");
                  }}
                />
              ) : (
                <SignUpForm
                  formData={formData}
                  handleChange={handleChange}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  onSubmit={handleSignupSendOtp}
                  loading={loading}
                />
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
