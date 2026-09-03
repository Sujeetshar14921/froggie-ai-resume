import { gsap } from "./utils";
import { animationConfig, isReducedMotion } from "./config";

/**
 * Split and reveal text with smooth masked translate or clip path
 * Pure GSAP implementation without requiring external split libraries.
 */
export const revealHeadline = (element, options = {}) => {
  if (!element) return null;
  if (isReducedMotion()) {
    return gsap.set(element, { opacity: 1, y: 0 });
  }

  const {
    duration = animationConfig.duration.slow,
    ease = animationConfig.ease.cinematic,
    delay = 0.1,
    y = 35,
  } = options;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y,
      filter: "blur(4px)",
    },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration,
      ease,
      delay,
    }
  );
};

/**
 * Text shimmer / gradient highlight animation
 */
export const animateGradientText = (element, options = {}) => {
  if (!element || isReducedMotion()) return null;

  return gsap.to(element, {
    backgroundPosition: "200% center",
    duration: 6,
    repeat: -1,
    ease: "linear",
    ...options,
  });
};
