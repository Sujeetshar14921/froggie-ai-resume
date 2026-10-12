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

/**
 * 3D Holographic Froggie Copilot Mascot Icon
 * Engineered with realistic 3D volumetric glass, specular highlights,
 * emerald metallic extrusion rim, and animated micro-sparkle AI aura.
 */
export const Copilot3DIcon = ({
  size = "md",
  className = "",
  showGlow = true,
  showStatus = true,
  animated = true,
}) => {
  const sizeMap = {
    xs: {
      wrapper: "size-7 rounded-xl",
      inner: "rounded-[10px]",
      icon: 16,
      statusDot: "size-2 -bottom-0.5 -right-0.5",
    },
    sm: {
      wrapper: "size-9 rounded-2xl",
      inner: "rounded-[14px]",
      icon: 21,
      statusDot: "size-2.5 -bottom-0.5 -right-0.5",
    },
    md: {
      wrapper: "size-11 rounded-2xl",
      inner: "rounded-[14px]",
      icon: 26,
      statusDot: "size-3 -bottom-0.5 -right-0.5",
    },
    lg: {
      wrapper: "size-14 rounded-3xl",
      inner: "rounded-[20px]",
      icon: 34,
      statusDot: "size-3.5 -bottom-1 -right-1",
    },
    xl: {
      wrapper: "size-20 rounded-[28px]",
      inner: "rounded-[24px]",
      icon: 48,
      statusDot: "size-4 -bottom-1 -right-1",
    },
  };

  const config = sizeMap[size] || sizeMap.md;

  return (
    <div className={`relative shrink-0 select-none ${config.wrapper} ${className}`}>
      {/* 1. AMBIENT 3D RADIAL GLOW (PULSING AURA) */}
      {showGlow && (
        <span
          className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 opacity-40 blur-md pointer-events-none animate-pulse"
          style={{ animationDuration: "2.5s" }}
        />
      )}

      {/* 2. 3D METALLIC RIM CONTAINER WITH INSET RIM LIGHT */}
      <div
        className={`relative w-full h-full p-[2px] ${config.wrapper} transition-all duration-300 ${
          animated ? "group-hover:scale-105 group-hover:-translate-y-0.5" : ""
        }`}
        style={{
          background:
            "linear-gradient(135deg, #34d399 0%, #10b981 30%, #047857 70%, #064e3b 100%)",
          boxShadow: `
            inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.75),
            inset 0 -1.5px 1.5px 0 rgba(0, 0, 0, 0.6),
            0 4px 14px -2px rgba(16, 185, 129, 0.45),
            0 8px 20px -4px rgba(0, 0, 0, 0.4)
          `,
        }}
      >
        {/* 3. INNER OBSIDIAN GLASS CORE */}
        <div
          className={`relative w-full h-full flex items-center justify-center overflow-hidden ${config.inner}`}
          style={{
            background:
              "radial-gradient(circle at 35% 25%, #1e293b 0%, #09131f 55%, #020617 100%)",
            boxShadow:
              "inset 0 3px 6px -1px rgba(0, 0, 0, 0.85), inset 0 -1px 2px 0 rgba(16, 185, 129, 0.3)",
          }}
        >
          {/* 4. SPECULAR GLASS TOP-SHEEN ARC */}
          <div
            className="absolute top-0 left-0 right-0 h-[55%] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.08) 65%, transparent 100%)",
              borderTopLeftRadius: "inherit",
              borderTopRightRadius: "inherit",
            }}
          />

          {/* 5. 3D FLOATING FROGFACE MASCOT WITH DEPTH SHADOW */}
          <div
            className="relative z-10 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
            style={{
              filter:
                "drop-shadow(0 3px 5px rgba(0, 0, 0, 0.55)) drop-shadow(0 1px 2px rgba(16, 185, 129, 0.35))",
            }}
          >
            <FrogFace size={config.icon} />
          </div>

          {/* 6. CORNER MICRO-SPECULAR FLARE */}
          <div className="absolute top-1 left-1.5 size-1.5 rounded-full bg-white opacity-70 blur-[0.5px] pointer-events-none" />
        </div>
      </div>

      {/* 7. LIVE PULSING AI STATUS BEACON */}
      {showStatus && (
        <span
          className={`absolute ${config.statusDot} rounded-full bg-emerald-400 ring-2 ring-slate-950 shadow-md shadow-emerald-500/50 flex items-center justify-center z-20`}
        >
          <span className="size-1 rounded-full bg-white animate-ping opacity-75" />
        </span>
      )}
    </div>
  );
};

export default FrogFace;
