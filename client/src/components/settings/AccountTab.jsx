import React from "react";
import { Download, LogOut, AlertTriangle, Trash2, Loader2 } from "lucide-react";

const AccountTab = ({
  handleExportData,
  handleLogout,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  deleteConfirmText,
  setDeleteConfirmText,
  isDeletingAccount,
  handleDeleteAccount,
}) => {
  return (
    <div className="space-y-6">
      {/* DATA BACKUP & EXPORT */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-500" />
              <span>Export Account Data</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Download a full JSON archive of your personal preferences, feature flags, and profile details.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* SIGN OUT & SESSION */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LogOut className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Session Management</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sign out of your active browser session on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* DANGER ZONE: DELETE ACCOUNT */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-5 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Delete Account Permanently</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Permanently delete your froggie AI account, all saved resumes, and ATS scanner reports. This action cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900 max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="size-10 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Delete Account Permanently?
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  This action is irreversible.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              All your resumes, ATS scans, uploaded files, and candidate profiles will be erased forever. To proceed, please type <strong className="text-slate-900 dark:text-white font-mono">DELETE</strong> below:
            </p>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmText("");
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText !== "DELETE" || isDeletingAccount}
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isDeletingAccount && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Permanently Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountTab;
