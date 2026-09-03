import { gsap, ScrollTrigger } from "./utils";
import { animationConfig, isReducedMotion } from "./config";

/**
 * Initializes the Bento Grid Features animations
 */
export function initFeaturesAnimation(container) {
  if (!container) return () => {};

  const ctx = gsap.context(() => {
    if (isReducedMotion()) {
      gsap.set([".section-header", ".bento-card"], {
        opacity: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    // Section Header Entrance
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

    // Bento Cards Staggered Reveal
    gsap.fromTo(
      ".bento-card",
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: animationConfig.ease.smooth,
        scrollTrigger: {
          trigger: ".bento-card",
          start: "top 80%",
          once: true,
        },
      }
    );

    // Subtle 3D Mouse Tilt & Hover Micro-Interaction on Desktop
    if (window.innerWidth >= 1024) {
      const cards = container.querySelectorAll(".bento-card");
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -6,
            scale: 1.01,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      });
    }
  }, container);

  return () => ctx.revert();
}
