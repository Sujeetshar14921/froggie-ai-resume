import { gsap, ScrollTrigger } from "./utils";
import { animationConfig, isReducedMotion } from "./config";

/**
 * Initializes the testimonials section header reveal and seamless horizontal marquee
 * @param {HTMLElement} container - The testimonial section container
 * @param {HTMLElement} track - The horizontal scrolling track
 * @returns {Function} Cleanup function
 */
export function initTestimonialsMarquee(container, track) {
  if (!container) return () => {};

  const ctx = gsap.context(() => {
    // 1. Header Reveal with ScrollTrigger
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

    // 2. Seamless Continuous Horizontal Marquee Loop
    if (!track) return;

    if (isReducedMotion()) {
      gsap.set(track, { x: 0 });
      return;
    }

    // Track is duplicated with 2x items. Animating xPercent: -50 seamlessly loops without jump or overlap.
    const marqueeTween = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 35,
      repeat: -1,
    });

    // Pause on hover for comfortable readability
    const handleMouseEnter = () => marqueeTween.pause();
    const handleMouseLeave = () => marqueeTween.play();

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
  }, container);

  return () => ctx.revert();
}
