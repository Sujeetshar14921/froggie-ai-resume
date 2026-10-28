import React from "react";
import { KeyRound, Shield, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const SecurityTab = ({
  user,
  userRequiresCurrentPassword,
  passwordForm,
  setPasswordForm,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmNewPassword,
  setShowConfirmNewPassword,
  handleChangePassword,
  isChangingPassword,
}) => {
  return (
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

      {/* Social User Notice */}
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
              {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
  );
};

export default SecurityTab;
