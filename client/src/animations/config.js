/**
 * Central GSAP Animation Configuration
 * Provides unified tokens for durations, easings, staggers, and accessibility.
 */

export const isReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const animationConfig = {
  duration: {
    micro: 0.15,
    fast: 0.3,
    normal: 0.6,
    slow: 0.9,
    cinematic: 1.2,
    epic: 1.8,
  },

  ease: {
    smooth: "power3.out",
    cinematic: "expo.out",
    soft: "power2.out",
    inOut: "power2.inOut",
    overshoot: "back.out(1.7)",
    softBounce: "back.out(1.2)",
    elastic: "elastic.out(1, 0.5)",
    linear: "none",
  },

  stagger: {
    micro: 0.04,
    small: 0.08,
    normal: 0.12,
    large: 0.2,
  },

  distance: {
    subtle: 15,
    normal: 35,
    large: 65,
  },

  breakpoints: {
    mobile: "(max-width: 767px)",
    tablet: "(min-width: 768px) and (max-width: 1023px)",
    desktop: "(min-width: 1024px)",
  },
};
