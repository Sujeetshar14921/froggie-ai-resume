import React from "react";
import {
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const ForgotPasswordForm = ({
  resetStep,
  formData,
  handleChange,
  resetOtp,
  setResetOtp,
  showNewPassword,
  setShowNewPassword,
  showConfirmNewPassword,
  setShowConfirmNewPassword,
  onSendResetOtp,
  onVerifyResetPassword,
  loading,
  resendCooldown,
  onBackToSignIn,
  onChangeEmail,
}) => {
  return (
    <div className="animate-in fade-in duration-200">
      <div className="mb-3 sm:mb-4">
        <button
          type="button"
          onClick={onBackToSignIn}
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
        <form onSubmit={onSendResetOtp} className="space-y-3">
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
        <form onSubmit={onVerifyResetPassword} className="space-y-3">
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
              onClick={onChangeEmail}
              className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Change Email</span>
            </button>

            <button
              type="button"
              disabled={resendCooldown > 0 || loading}
              onClick={onSendResetOtp}
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
  );
};

export default ForgotPasswordForm;
