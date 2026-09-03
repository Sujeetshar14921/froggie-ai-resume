import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../app/features/authSlice";
import { authApi } from "../api/authApi";
import { resumeApi } from "../api/resumeApi";
import toast from "react-hot-toast";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from "lucide-react";
import FrogFace, { BrandIcon } from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";

/* BRAND ICONS */
const GoogleIcon = ({ className = "size-4" }) => (
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

const LinkedInIcon = ({ className = "size-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
  </svg>
);

const GitHubIcon = ({ className = "size-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const FacebookIcon = ({ className = "size-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const Login = () => {
  useSEO({
    title: "Sign In or Create Account | froggie AI Resume Builder",
    description: "Sign in or create a free account on froggie with Google, LinkedIn, GitHub, or Facebook to build ATS-compliant resumes with AI coaching.",
    keywords: "froggie login, google login resume, linkedin login resume, github login resume, free resume account, ATS resume sign in",
    canonical: "https://froggie.site/login",
    ogImage: "https://froggie.site/og-image.png",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");

  const [state, setState] = useState(urlState === "register" ? "register" : "login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const searchParams = new URLSearchParams(window.location.search);
  const tokenInUrl = searchParams.get("token");
  const currentUser = useSelector((state) => state.auth?.user);

  // If user is already authenticated and no incoming OAuth token, navigate to landing page
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

    if (error) {
      if (error === "not_configured") {
        toast.error(`${provider ? provider.toUpperCase() : "Social"} login credentials are not yet configured in server .env.`, {
          duration: 5000,
        });
      } else if (error === "access_denied" || error === "cancelled") {
        toast.error("Social login was cancelled.", { icon: "ℹ️" });
      } else {
        toast.error(`Login with ${provider || "social account"} failed. Please try again or use email/password.`);
      }
      // Clean query params from address bar
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (token) {
      // SECURITY: Immediately scrub token from address bar to prevent token leakage
      window.history.replaceState({}, document.title, window.location.pathname);

      const processOAuthLogin = async () => {
        try {
          setLoading(true);
          localStorage.setItem("token", token);
          const data = await authApi.getUserData(token);
          if (data?.user) {
            dispatch(login({ token, user: data.user }));
          }

          // Check pending template creation
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

          // Fast & direct redirect to landing page ('/') or requested target
          if (redirectParam === "app" || redirectParam === "dashboard") {
            navigate("/app");
          } else if (redirectParam && redirectParam !== "/" && redirectParam !== "landing" && redirectParam !== "hero") {
            navigate(redirectParam);
          } else {
            // Default: Landing Page
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
    const baseUrl = import.meta.env.VITE_BASE_URL || "";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data =
        state === "login"
          ? await authApi.login({ email: formData.email, password: formData.password })
          : await authApi.register(formData);

      dispatch(login(data));
      localStorage.setItem("token", data.token);

      // Check if user had pre-selected a template on landing page
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

      toast.success(
        data.message || (state === "login" ? "Logged in successfully!" : "Account created successfully!")
      );

      const targetRedirect = query.get("redirect");
      if (targetRedirect === "app" || targetRedirect === "dashboard") {
        navigate("/app");
      } else if (targetRedirect && targetRedirect !== "/" && targetRedirect !== "landing" && targetRedirect !== "hero") {
        navigate(targetRedirect);
      } else {
        // Default: Landing Page ('/')
        navigate("/");
      }
    } catch (error) {
      const serverMsg = error?.response?.data?.message || error.message;
      if (typeof serverMsg === "string" && serverMsg.toLowerCase().includes("already exists")) {
        toast.error("Account already exists with this email! Switched to Sign In.", {
          duration: 4000,
          icon: "ℹ️",
        });
        setState("login");
      } else {
        toast.error(serverMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* SECURE HIGH-SPEED AUTHENTICATION OVERLAY */}
      {loading && tokenInUrl && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[9999] flex flex-col items-center justify-center space-y-3.5 select-none animate-in fade-in duration-200">
          <BrandIcon size="md" />
          <div className="size-9 rounded-full border-3 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <div className="text-center space-y-1">
            <h3 className="text-base font-black text-white tracking-tight">Authenticating Securely...</h3>
            <p className="text-xs text-slate-400 font-medium">Redirecting you to froggie landing page...</p>
          </div>
        </div>
      )}

      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-300/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-300/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* LOGO & BRAND */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-3 group">
            <BrandIcon
              size="lg"
              className="group-hover:scale-105 transition-transform"
              iconClassName="group-hover:rotate-6 transition-transform"
            />
            <div className="leading-tight text-left">
              <span className="text-2xl font-black tracking-tight text-slate-900">
                froggie<span className="text-emerald-500">.</span>
              </span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ATS Smart Studio</p>
            </div>
          </Link>
          <p className="text-slate-500 text-sm mt-1">
            The AI platform for ATS-optimized resumes
          </p>
        </div>

        {/* AUTH CARD */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/90 p-8 sm:p-10">

          {/* TAB SWITCHER */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setState("login")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                state === "login"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setState("register")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                state === "register"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* SOCIAL LOGIN BUTTONS */}
          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-2.5">
              {/* GOOGLE */}
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer"
                title="Sign in with Google"
              >
                <GoogleIcon className="size-4 shrink-0" />
                <span>Google</span>
              </button>

              {/* LINKEDIN */}
              <button
                type="button"
                onClick={() => handleSocialLogin("linkedin")}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#0077b5]/5 hover:bg-[#0077b5]/10 border border-[#0077b5]/20 rounded-xl text-xs font-bold text-[#0077b5] shadow-2xs hover:shadow-xs hover:border-[#0077b5]/40 transition-all cursor-pointer"
                title="Sign in with LinkedIn"
              >
                <LinkedInIcon className="size-4 shrink-0" />
                <span>LinkedIn</span>
              </button>

              {/* GITHUB */}
              <button
                type="button"
                onClick={() => handleSocialLogin("github")}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-white shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                title="Sign in with GitHub"
              >
                <GitHubIcon className="size-4 shrink-0" />
                <span>GitHub</span>
              </button>

              {/* FACEBOOK */}
              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1877f2]/5 hover:bg-[#1877f2]/10 border border-[#1877f2]/20 rounded-xl text-xs font-bold text-[#1877f2] shadow-2xs hover:shadow-xs hover:border-[#1877f2]/40 transition-all cursor-pointer"
                title="Sign in with Facebook"
              >
                <FacebookIcon className="size-4 shrink-0" />
                <span>Facebook</span>
              </button>
            </div>

            {/* DIVIDER */}
            <div className="relative flex items-center justify-center pt-2">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 relative z-10">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {state === "register" && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Sujeet Kumar"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              <span>
                {loading
                  ? state === "login"
                    ? "Signing In..."
                    : "Creating Account..."
                  : state === "login"
                  ? "Sign In"
                  : "Get Started Free"}
              </span>
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          {/* FOOTER SWITCH */}
          <p className="text-center text-xs text-slate-500 mt-6">
            {state === "login" ? "Don't have an account yet?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setState(state === "login" ? "register" : "login")}
              className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              {state === "login" ? "Create one free" : "Sign in here"}
            </button>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;