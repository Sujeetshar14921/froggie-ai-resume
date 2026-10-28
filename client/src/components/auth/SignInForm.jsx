import React from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from "lucide-react";

const SignInForm = ({
  formData,
  handleChange,
  showPassword,
  setShowPassword,
  onSubmit,
  loading,
  onForgotPassword,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-2.5">
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
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Forgot password?
          </button>
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
            autoComplete="current-password"
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
        <span>{loading ? "Signing in..." : "Sign In"}</span>
        {!loading && <ArrowRight className="w-3.5 h-3.5" />}
      </button>
    </form>
  );
};

export default SignInForm;
