import React from "react";

/**
 * Ultra-Smooth Tactile Toggle Switch Component (iOS / Stripe / Linear Physics)
 */
const SmoothToggle = ({ checked, onChange, label, disabled = false }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange?.();
      }}
      className={`group relative inline-flex h-7 w-12 sm:h-7.5 sm:w-13 shrink-0 cursor-pointer items-center rounded-full p-0.5 border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
        checked
          ? "bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-400/40 shadow-[0_0_14px_rgba(16,185,129,0.45)]"
          : "bg-slate-200 dark:bg-slate-800 border-slate-300/80 dark:border-slate-700/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-105 active:scale-95"}`}
      aria-label={label}
    >
      <span
        className={`pointer-events-none flex size-6 items-center justify-center rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:w-7 ${
          checked
            ? "translate-x-5 sm:translate-x-6 bg-gradient-to-b from-white to-slate-50"
            : "translate-x-0 bg-white"
        }`}
      >
        <span
          className={`size-1.5 rounded-full transition-all duration-200 ${
            checked ? "bg-emerald-500 scale-100" : "bg-slate-300 dark:bg-slate-500 scale-75 opacity-50"
          }`}
        />
      </span>
    </button>
  );
};

export default SmoothToggle;
