import React from "react";

/**
 * Froggie brand frog face SVG component
 * 3D volumetric vector graphics with realistic spherical gradients,
 * high-gloss catchlights, and rosy blush.
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
        {/* 3D Volumetric Spherical Gradient for Frog Head */}
        <radialGradient
          id="froggie_skin_3d"
          cx="38%"
          cy="32%"
          r="68%"
          fx="32%"
          fy="26%"
        >
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="25%" stopColor="#34D399" />
          <stop offset="60%" stopColor="#10B981" />
          <stop offset="85%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </radialGradient>

        {/* 3D Spherical Bulb for Left Eye Socket */}
        <radialGradient
          id="froggie_left_eye_bulb"
          cx="35%"
          cy="30%"
          r="65%"
          fx="30%"
          fy="25%"
        >
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="35%" stopColor="#34D399" />
          <stop offset="75%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </radialGradient>

        {/* 3D Spherical Bulb for Right Eye Socket */}
        <radialGradient
          id="froggie_right_eye_bulb"
          cx="38%"
          cy="30%"
          r="65%"
          fx="32%"
          fy="25%"
        >
          <stop offset="0%" stopColor="#86EFAC" />
          <stop offset="35%" stopColor="#34D399" />
          <stop offset="75%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </radialGradient>

        {/* 3D Eyeball Sclera (White sphere with subtle bottom depth) */}
        <radialGradient
          id="froggie_eyeball"
          cx="38%"
          cy="32%"
          r="65%"
          fx="32%"
          fy="28%"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="75%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </radialGradient>

        {/* 3D Glossy Pupil */}
        <radialGradient
          id="froggie_pupil"
          cx="35%"
          cy="30%"
          r="65%"
          fx="28%"
          fy="25%"
        >
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="50%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>

        {/* Rosy Cheek Blush Glow */}
        <radialGradient
          id="froggie_cheek_glow"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor="#F472B6" stopOpacity="0.85" />
          <stop offset="65%" stopColor="#EC4899" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
        </radialGradient>

        {/* Under-body 3D Ambient Occlusion Shadow */}
        <linearGradient
          id="froggie_body_shadow"
          x1="24"
          y1="34"
          x2="24"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#064E3B" stopOpacity="0" />
          <stop offset="1" stopColor="#022C22" stopOpacity="0.45" />
        </linearGradient>

        {/* Top-Head Specular Light Sheen */}
        <linearGradient
          id="froggie_head_sheen"
          x1="24"
          y1="13"
          x2="24"
          y2="26"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main Frog Head / Volumetric 3D Base */}
      <path
        d="M8 26C8 16.5 15.5 13 24 13C32.5 13 40 16.5 40 26C40 35.5 33 41 24 41C15 41 8 35.5 8 26Z"
        fill="url(#froggie_skin_3d)"
      />

      {/* Chin/Bottom Ambient Occlusion Depth */}
      <path
        d="M9 28C10 36 16 41 24 41C32 41 38 36 39 28C38 38 31 41 24 41C17 41 10 38 9 28Z"
        fill="url(#froggie_body_shadow)"
      />

      {/* Forehead 3D Volumetric Soft Sheen */}
      <path
        d="M13 23C13 16 18 13.5 24 13.5C30 13.5 35 16 35 23C30 20 18 20 13 23Z"
        fill="url(#froggie_head_sheen)"
      />

      {/* Eye Socket Sockets (Volumetric 3D Bulbs) */}
      <circle cx="15" cy="15" r="9" fill="url(#froggie_left_eye_bulb)" />
      <circle cx="33" cy="15" r="9" fill="url(#froggie_right_eye_bulb)" />

      {/* Subtle eye rim highlight */}
      <path
        d="M9 14.5C9.5 10 13 7.5 17 8"
        stroke="#A7F3D0"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M27 8C31 7.5 34.5 10 35 14.5"
        stroke="#A7F3D0"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* 3D Eyeball Sclera (Spherical shading) */}
      <circle cx="15" cy="15" r="6.5" fill="url(#froggie_eyeball)" />
      <circle cx="33" cy="15" r="6.5" fill="url(#froggie_eyeball)" />

      {/* Eyeball Inner Soft Ambient Ring */}
      <circle cx="15" cy="15" r="6.5" stroke="#94A3B8" strokeWidth="0.5" opacity="0.4" />
      <circle cx="33" cy="15" r="6.5" stroke="#94A3B8" strokeWidth="0.5" opacity="0.4" />

      {/* 3D Glossy Pupils */}
      <circle cx="16" cy="15" r="3.7" fill="url(#froggie_pupil)" />
      <circle cx="32" cy="15" r="3.7" fill="url(#froggie_pupil)" />

      {/* Primary Specular Catchlight Flares (Top Right) */}
      <circle cx="17.6" cy="13.4" r="1.5" fill="#FFFFFF" />
      <circle cx="33.6" cy="13.4" r="1.5" fill="#FFFFFF" />

      {/* Secondary Micro Catchlights (Bottom Left) */}
      <circle cx="14.6" cy="16.6" r="0.8" fill="#FFFFFF" opacity="0.9" />
      <circle cx="30.6" cy="16.6" r="0.8" fill="#FFFFFF" opacity="0.9" />

      {/* Cute 3D Nostrils with Depth */}
      <ellipse cx="21.5" cy="24.5" rx="1.2" ry="0.9" fill="#064E3B" />
      <ellipse cx="26.5" cy="24.5" rx="1.2" ry="0.9" fill="#064E3B" />
      <ellipse cx="21.3" cy="24.3" rx="0.4" ry="0.3" fill="#022C22" />
      <ellipse cx="26.3" cy="24.3" rx="0.4" ry="0.3" fill="#022C22" />

      {/* Smiling Mouth with 3D Bevel Smile */}
      <path
        d="M17.5 30C19.5 34 28.5 34 30.5 30"
        stroke="#022C22"
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d="M17.5 29.5C19.5 33.5 28.5 33.5 30.5 29.5"
        stroke="#064E3B"
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      {/* Glowing 3D Cheek Blush */}
      <ellipse cx="12.5" cy="29" rx="3.5" ry="2.2" fill="url(#froggie_cheek_glow)" />
      <ellipse cx="35.5" cy="29" rx="3.5" ry="2.2" fill="url(#froggie_cheek_glow)" />
    </svg>
  );
};

/**
 * 3D Froggie Brand Icon
 * Designed with realistic 3D volumetric glass, specular highlights,
 * emerald metallic extrusion rim, obsidian chamber, and 3D floating mascot.
 */
export const BrandIcon = ({
  size = "md",
  className = "",
  iconClassName = "",
}) => {
  const sizeMap = {
    xs: { box: "size-7 rounded-xl p-[1.5px]", inner: "rounded-[10px]", icon: 16 },
    sm: { box: "size-8.5 rounded-xl p-[2px]", inner: "rounded-[10px]", icon: 20 },
    md: { box: "size-11 rounded-2xl p-[2px]", inner: "rounded-[14px]", icon: 28 },
    lg: { box: "size-13 rounded-2xl p-[2.5px]", inner: "rounded-[14px]", icon: 32 },
    xl: { box: "size-16 rounded-3xl p-[3px]", inner: "rounded-[21px]", icon: 42 },
    "2xl": { box: "size-28 sm:size-36 rounded-[28px] sm:rounded-[36px] p-1", inner: "rounded-[24px] sm:rounded-[32px]", icon: 96 },
  };

  const config = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative shrink-0 select-none group transition-all duration-300 ${config.box} ${className}`}
      style={{
        background:
          "linear-gradient(135deg, #6ee7b7 0%, #10b981 30%, #059669 70%, #047857 100%)",
        boxShadow: `
          inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.75),
          inset 0 -1.5px 1.5px 0 rgba(0, 0, 0, 0.6),
          0 4px 14px -2px rgba(16, 185, 129, 0.45),
          0 8px 22px -4px rgba(0, 0, 0, 0.35)
        `,
      }}
    >
      {/* 3D Glass Obsidian Core */}
      <div
        className={`relative w-full h-full flex items-center justify-center overflow-hidden ${config.inner}`}
        style={{
          background:
            "radial-gradient(circle at 35% 25%, #162f25 0%, #081a14 55%, #020a07 100%)",
          boxShadow:
            "inset 0 2.5px 5px -1px rgba(0, 0, 0, 0.85), inset 0 -1px 2px 0 rgba(16, 185, 129, 0.35)",
        }}
      >
        {/* Specular Glass Sheen Top Arc */}
        <div
          className="absolute top-0 left-0 right-0 h-[52%] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.36) 0%, rgba(255, 255, 255, 0.08) 60%, transparent 100%)",
            borderTopLeftRadius: "inherit",
            borderTopRightRadius: "inherit",
          }}
        />

        {/* 3D Floating Mascot with Depth Drop Shadow */}
        <div
          className={`relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${iconClassName}`}
          style={{
            filter:
              "drop-shadow(0 3px 5px rgba(0, 0, 0, 0.6)) drop-shadow(0 1px 2px rgba(16, 185, 129, 0.35))",
          }}
        >
          <FrogFace size={config.icon} />
        </div>

        {/* Top-Left Micro Specular Light Gleam */}
        <div className="absolute top-1 left-1.5 size-1.5 rounded-full bg-white opacity-80 blur-[0.4px] pointer-events-none" />
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
          boxShadow: showGlow
            ? `
            inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.75),
            inset 0 -1.5px 1.5px 0 rgba(0, 0, 0, 0.6),
            0 4px 14px -2px rgba(16, 185, 129, 0.45),
            0 8px 20px -4px rgba(0, 0, 0, 0.4)
          `
            : `
            inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.75),
            inset 0 -1.5px 1.5px 0 rgba(0, 0, 0, 0.6),
            0 4px 12px -2px rgba(0, 0, 0, 0.5)
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
