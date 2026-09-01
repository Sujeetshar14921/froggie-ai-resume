import React from "react";

/**
 * Froggie brand frog face SVG component
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
        {/* Soft emerald/teal gradient for the frog skin */}
        <linearGradient id="frogSkinGradient" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#34D399" />
          <stop offset="0.6" stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>

        {/* Soft belly/cheek blush gradient */}
        <linearGradient id="frogCheekGradient" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F472B6" stopOpacity="0.75" />
          <stop offset="1" stopColor="#EC4899" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Main Frog Head / Body Base */}
      <path
        d="M8 26C8 16.5 15.5 13 24 13C32.5 13 40 16.5 40 26C40 35.5 33 41 24 41C15 41 8 35.5 8 26Z"
        fill="url(#frogSkinGradient)"
      />

      {/* Left Eye Bulb */}
      <circle cx="15" cy="15" r="9" fill="url(#frogSkinGradient)" />
      {/* Right Eye Bulb */}
      <circle cx="33" cy="15" r="9" fill="url(#frogSkinGradient)" />

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
      <ellipse cx="12.5" cy="29" rx="3" ry="1.8" fill="url(#frogCheekGradient)" />
      {/* Right Rosy Cheek Blush */}
      <ellipse cx="35.5" cy="29" rx="3" ry="1.8" fill="url(#frogCheekGradient)" />
    </svg>
  );
};

export default FrogFace;
