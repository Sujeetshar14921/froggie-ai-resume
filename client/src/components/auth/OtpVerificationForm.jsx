import React from "react";
import { KeyRound, ShieldCheck, Loader2, ArrowLeft, RefreshCw } from "lucide-react";

const OtpVerificationForm = ({
  otp,
  setOtp,
  onSubmit,
  loading,
  resendCooldown,
  onResendOtp,
  onBack,
  email,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3 animate-in fade-in duration-200">
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
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            required
            autoFocus
            className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono tracking-widest text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
          />
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          Code was sent via SMTP to {email || "your email"}. Check spam folder if not received.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || otp.trim().length !== 6}
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
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer flex items-center gap-1 text-[11px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back / Edit Info</span>
        </button>

        <button
          type="button"
          disabled={resendCooldown > 0 || loading}
          onClick={onResendOtp}
          className="text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50 cursor-pointer flex items-center gap-1 text-[11px]"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          <span>
            {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
          </span>
        </button>
      </div>
    </form>
  );
};

export default OtpVerificationForm;
