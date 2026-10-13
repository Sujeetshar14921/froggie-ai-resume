import { gsap } from "./utils";
import { animationConfig, isReducedMotion } from "./config";

/**
 * Initializes the testimonials section header reveal
 * @param {HTMLElement} container - The testimonial section container
 * @returns {Function} Cleanup function
 */
export function initTestimonialsMarquee(container) {
  if (!container) return () => {};

  const ctx = gsap.context(() => {
    // Header Reveal with ScrollTrigger
    if (!isReducedMotion()) {
      gsap.fromTo(
        ".section-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: animationConfig.ease.smooth,
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            once: true,
          },
        }
      );
    }
  }, container);

  return () => ctx.revert();
}
