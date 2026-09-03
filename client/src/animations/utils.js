import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animationConfig, isReducedMotion } from "./config";

// Register ScrollTrigger plugin once globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Reusable fade up animation
 */
export const fadeUp = (element, options = {}) => {
  if (!element) return null;
  if (isReducedMotion()) {
    return gsap.set(element, { opacity: 1, y: 0 });
  }

  const {
    y = animationConfig.distance.normal,
    opacity = 0,
    duration = animationConfig.duration.normal,
    ease = animationConfig.ease.smooth,
    delay = 0,
    ...rest
  } = options;

  return gsap.from(element, {
    y,
    opacity,
    duration,
    ease,
    delay,
    ...rest,
  });
};

/**
 * Reusable fade in animation
 */
export const fadeIn = (element, options = {}) => {
  if (!element) return null;
  if (isReducedMotion()) {
    return gsap.set(element, { opacity: 1 });
  }

  const {
    opacity = 0,
    duration = animationConfig.duration.normal,
    ease = animationConfig.ease.smooth,
    delay = 0,
    ...rest
  } = options;

  return gsap.from(element, {
    opacity,
    duration,
    ease,
    delay,
    ...rest,
  });
};

/**
 * Reusable fade down animation
 */
export const fadeDown = (element, options = {}) => {
  if (!element) return null;
  if (isReducedMotion()) {
    return gsap.set(element, { opacity: 1, y: 0 });
  }

  const {
    y = -animationConfig.distance.normal,
    opacity = 0,
    duration = animationConfig.duration.normal,
    ease = animationConfig.ease.smooth,
    delay = 0,
    ...rest
  } = options;

  return gsap.from(element, {
    y,
    opacity,
    duration,
    ease,
    delay,
    ...rest,
  });
};

/**
 * Reusable scale in animation
 */
export const scaleIn = (element, options = {}) => {
  if (!element) return null;
  if (isReducedMotion()) {
    return gsap.set(element, { opacity: 1, scale: 1 });
  }

  const {
    scale = 0.92,
    opacity = 0,
    duration = animationConfig.duration.normal,
    ease = animationConfig.ease.overshoot,
    delay = 0,
    ...rest
  } = options;

  return gsap.from(element, {
    scale,
    opacity,
    duration,
    ease,
    delay,
    ...rest,
  });
};

/**
 * Staggered fade up for multiple elements
 */
export const staggerFadeUp = (elements, options = {}) => {
  if (!elements || elements.length === 0) return null;
  if (isReducedMotion()) {
    return gsap.set(elements, { opacity: 1, y: 0 });
  }

  const {
    y = animationConfig.distance.normal,
    opacity = 0,
    duration = animationConfig.duration.normal,
    ease = animationConfig.ease.smooth,
    stagger = animationConfig.stagger.small,
    delay = 0,
    ...rest
  } = options;

  return gsap.from(elements, {
    y,
    opacity,
    duration,
    ease,
    stagger,
    delay,
    ...rest,
  });
};

/**
 * Safe React GSAP context runner with automatic cleanup
 */
export const createAnimationContext = (scope, callback) => {
  const ctx = gsap.context(callback, scope);
  return () => ctx.revert();
};
