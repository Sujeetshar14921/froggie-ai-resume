import React from "react";

/**
 * Froggie brand frog face SVG component
 * High-definition vector graphics with vibrant emerald skin and rosy blush
 */
export const FrogFace = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Vibrant emerald/teal gradient for frog skin */}
        <linearGradient
          id="froggie_skin_gradient"
          x1="6"
          y1="4"
          x2="42"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#34D399" />
          <stop offset="0.5" stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>

        {/* Rosy cheek blush gradient */}
        <linearGradient
          id="froggie_cheek_gradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop stopColor="#F472B6" stopOpacity="0.8" />
          <stop offset="1" stopColor="#EC4899" stopOpacity="0.65" />
        </linearGradient>
      </defs>

      {/* Main Frog Head / Body Base */}
      <path
        d="M8 26C8 16.5 15.5 13 24 13C32.5 13 40 16.5 40 26C40 35.5 33 41 24 41C15 41 8 35.5 8 26Z"
        fill="url(#froggie_skin_gradient)"
      />

      {/* Left Eye Bulb */}
      <circle cx="15" cy="15" r="9" fill="url(#froggie_skin_gradient)" />
      {/* Right Eye Bulb */}
      <circle cx="33" cy="15" r="9" fill="url(#froggie_skin_gradient)" />

      {/* Left Eye Outer White */}
      <circle cx="15" cy="15" r="6.5" fill="#FFFFFF" />
      {/* Right Eye Outer White */}
      <circle cx="33" cy="15" r="6.5" fill="#FFFFFF" />

      {/* Left Eye Pupil (Cute dark iris) */}
      <circle cx="16" cy="15" r="3.6" fill="#0F172A" />
      {/* Right Eye Pupil */}
      <circle cx="32" cy="15" r="3.6" fill="#0F172A" />

      {/* Eye Sparkle Highlights (Top Left) */}
      <circle cx="17.5" cy="13.5" r="1.4" fill="#FFFFFF" />
      <circle cx="33.5" cy="13.5" r="1.4" fill="#FFFFFF" />

      {/* Secondary mini sparkle */}
      <circle cx="14.5" cy="16.5" r="0.8" fill="#FFFFFF" />
      <circle cx="30.5" cy="16.5" r="0.8" fill="#FFFFFF" />

      {/* Nostrils */}
      <ellipse cx="21.5" cy="24.5" rx="1.2" ry="0.9" fill="#047857" opacity="0.85" />
      <ellipse cx="26.5" cy="24.5" rx="1.2" ry="0.9" fill="#047857" opacity="0.85" />

      {/* Sweet Smiling Mouth */}
      <path
        d="M17.5 29.5C19.5 33.5 28.5 33.5 30.5 29.5"
        stroke="#064E3B"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Left Rosy Cheek Blush */}
      <ellipse cx="12.5" cy="29" rx="3" ry="1.8" fill="url(#froggie_cheek_gradient)" />
      {/* Right Rosy Cheek Blush */}
      <ellipse cx="35.5" cy="29" rx="3" ry="1.8" fill="url(#froggie_cheek_gradient)" />
    </svg>
  );
};

/**
 * Standardized Froggie Brand Badge Icon
 * Used across Navbar, Footer, Login, Splash Intro, Copilot, etc.
 * Features:
 * - Gradient metallic outer ring (Emerald -> Teal -> Emerald)
 * - Deep slate-950 obsidian inner shield
 * - Crisp scaled FrogFace mascot inside
 */
export const BrandIcon = ({
  size = "md",
  className = "",
  iconClassName = "",
}) => {
  const sizeMap = {
    xs: { box: "size-6 rounded-lg p-[1px]", inner: "rounded-[7px]", icon: 14 },
    sm: { box: "size-8 rounded-xl p-[1.5px]", inner: "rounded-[10px]", icon: 19 },
    md: { box: "size-10 rounded-2xl p-[2px]", inner: "rounded-[14px]", icon: 26 },
    lg: { box: "size-12 rounded-2xl p-[2px]", inner: "rounded-[14px]", icon: 30 },
    xl: { box: "size-16 rounded-3xl p-[2.5px]", inner: "rounded-[22px]", icon: 42 },
    "2xl": { box: "size-28 sm:size-36 rounded-[28px] sm:rounded-[36px] p-1", inner: "rounded-[24px] sm:rounded-[32px]", icon: 96 },
  };

  const config = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`shrink-0 bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 shadow-md shadow-emerald-500/20 ${config.box} ${className}`}
    >
      <div
        className={`w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden ${config.inner}`}
      >
        <FrogFace size={config.icon} className={iconClassName} />
      </div>
    </div>
  );
};

export default FrogFace;
