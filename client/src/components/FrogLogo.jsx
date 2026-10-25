import React from "react";

/**
 * Official Froggie Brand Mascot & Logo Component
 * Renders the official /froggie_logo.png
 */
export const FrogFace = ({ size = 24, className = "" }) => {
  return (
    <img
      src="/froggie_logo.png"
      alt="froggie"
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`shrink-0 object-contain select-none inline-block ${className}`}
      loading="eager"
      decoding="async"
    />
  );
};

/**
 * Froggie Brand Icon
 * Renders /froggie_logo.png across responsive sizes with hover micro-interaction
 */
export const BrandIcon = ({
  size = "md",
  className = "",
  iconClassName = "",
}) => {
  const sizeMap = {
    xs: { box: "size-6.5", img: "size-6.5" },
    sm: { box: "size-8.5", img: "size-8.5" },
    md: { box: "size-10", img: "size-10" },
    lg: { box: "size-12", img: "size-12" },
    xl: { box: "size-16", img: "size-16" },
    "2xl": { box: "size-28 sm:size-36", img: "size-28 sm:size-36" },
  };

  const config = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative shrink-0 select-none flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${config.box} ${className}`}
    >
      <img
        src="/froggie_logo.png"
        alt="froggie AI"
        className={`w-full h-full object-contain rounded-xl select-none drop-shadow-xs transition-transform duration-300 ${iconClassName}`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

export const Copilot3DIcon = BrandIcon;

export default BrandIcon;
