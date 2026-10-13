import { gsap, ScrollTrigger } from "./utils";
import { animationConfig, isReducedMotion } from "./config";

/**
 * Replaces Framer Motion useScroll + useSpring progress bar with GSAP ScrollTrigger
 * @param {HTMLElement} progressBar - The fixed top progress bar element
 * @returns {Function} Cleanup function
 */
export function initScrollProgressBar(progressBar) {
  if (!progressBar) return () => {};

  if (isReducedMotion()) {
    gsap.set(progressBar, { display: "none" });
    return () => {};
  }

  gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" });

  const tween = gsap.to(progressBar, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.2, // Smooth interpolation (spring-like feel)
    },
  });

  return () => {
    if (tween.scrollTrigger) tween.scrollTrigger.kill();
    tween.kill();
  };
}

/**
 * Initializes section header entrance with ScrollTrigger
 */
export function initSectionHeaderReveal(container) {
  if (!container) return () => {};

  const ctx = gsap.context(() => {
    if (isReducedMotion()) {
      gsap.set([".section-badge", ".section-title", ".section-subtitle"], {
        opacity: 1,
        y: 0,
      });
      return;
    }

    gsap.fromTo(
      [".section-badge", ".section-title", ".section-subtitle"],
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: animationConfig.ease.smooth,
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          once: true,
        },
      }
    );
  }, container);

  return () => ctx.revert();
}

/**
 * Initializes HowItWorks step sequence with ScrollTrigger
 */
export function initHowItWorksAnimation(container) {
  if (!container) return () => {};

  const ctx = gsap.context(() => {
    if (isReducedMotion()) {
      gsap.set([".section-header", ".how-step-card", ".how-cta"], {
        opacity: 1,
        y: 0,
      });
      return;
    }

    // Header reveal
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
          start: "top 82%",
          once: true,
        },
      }
    );

    // Connecting line draw-in
    gsap.fromTo(
      ".how-connecting-line",
      { scaleX: 0, transformOrigin: "left center" },
      {
        scaleX: 1,
        duration: 1.0,
        ease: animationConfig.ease.smooth,
        scrollTrigger: {
          trigger: ".how-step-card",
          start: "top 80%",
          once: true,
        },
      }
    );

    // Staggered Step Cards
    gsap.fromTo(
      ".how-step-card",
      { opacity: 0, y: 45, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.18,
        ease: animationConfig.ease.smooth,
        scrollTrigger: {
          trigger: ".how-step-card",
          start: "top 80%",
          once: true,
        },
      }
    );

    // Bottom CTA
    gsap.fromTo(
      ".how-cta",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: animationConfig.ease.smooth,
        scrollTrigger: {
          trigger: ".how-cta",
          start: "top 90%",
          once: true,
        },
      }
    );
  }, container);

  return () => ctx.revert();
}

