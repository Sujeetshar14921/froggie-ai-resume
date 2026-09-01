import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../app/features/authSlice";
import { authApi } from "../api/authApi";
import { resumeApi } from "../api/resumeApi";
import toast from "react-hot-toast";
import { Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from "lucide-react";
import FrogFace from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";

const Login = () => {
  useSEO({
    title: "Sign In / Register | froggie AI Resume Builder",
    description: "Sign in to froggie to create, manage, and download ATS-optimized resumes and unlock AI career coaching.",
    canonical: "https://froggie-resume.com/login",
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
              accent_color: accent_color || "#3B82F6",
            },
            data.token
          );

          toast.success("Welcome! Opening your resume editor...");
          navigate(`/app/builder/${createRes.resume._id}`);
          return;
        } catch (autoErr) {
          console.error("Auto create error:", autoErr);
        }
      }

      toast.success(
        data.message || (state === "login" ? "Logged in successfully!" : "Account created successfully!")
      );
      navigate("/app");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">

        {/* LOGO & BRAND */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-3 group">
            <div className="size-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-600 to-emerald-400 p-[2px] shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <FrogFace size={30} className="group-hover:rotate-6 transition-transform" />
              </div>
            </div>
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
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setState("login")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                state === "login"
                  ? "bg-white text-slate-900 shadow-xs"
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
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
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
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
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
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
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
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
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
              className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
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
              className="font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
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