import { gsap } from "./utils";
import { animationConfig, isReducedMotion } from "./config";

/**
 * Clean page entrance animation
 */
export function initPageEntrance(pageContainer) {
  if (!pageContainer || isReducedMotion()) return () => {};

  const ctx = gsap.context(() => {
    gsap.fromTo(
      pageContainer,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: animationConfig.ease.smooth,
      }
    );
  }, pageContainer);

  return () => ctx.revert();
}
