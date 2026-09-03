import { gsap } from "./utils";
import { animationConfig, isReducedMotion } from "./config";

/**
 * Initializes the cinematic Hero entrance & interactive 3D showcase sequence
 * @param {HTMLElement} container - The Hero section DOM element
 * @returns {Function} Cleanup function reverting the GSAP context
 */
export function initHeroAnimation(container) {
  if (!container) return () => {};

  const ctx = gsap.context(() => {
    if (isReducedMotion()) {
      gsap.set(
        [
          ".hero-ambient-glow",
          ".hero-status-pill",
          ".hero-headline",
          ".hero-subtitle",
          ".hero-chips-container",
          ".hero-cta-group",
          ".hero-trust-item",
          ".hero-showcase-container",
          ".hero-showcase-badge",
          ".hero-companies-section",
        ],
        { opacity: 1, y: 0, scale: 1, filter: "none", rotation: 0, rotateX: 0, rotateY: 0 }
      );
      return;
    }

    // Master Entrance Timeline
    const tl = gsap.timeline({
      defaults: {
        ease: animationConfig.ease.smooth,
      },
    });

    // 1. Ambient Background Glow Reveal & Gentle Pulse
    tl.fromTo(
      ".hero-ambient-glow",
      { opacity: 0, scale: 0.75 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: animationConfig.ease.cinematic,
      }
    )
      // 2. Status Pill drops smoothly with slight overshoot
      .fromTo(
        ".hero-status-pill",
        { opacity: 0, y: -20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: animationConfig.ease.overshoot,
        },
        "-=1.0"
      )
      // 3. Main Headline reveals with blur-to-clear & slide up
      .fromTo(
        ".hero-headline",
        { opacity: 0, y: 35, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.0,
          ease: animationConfig.ease.cinematic,
        },
        "-=0.5"
      )
      // 4. Supporting Subtitle slides in
      .fromTo(
        ".hero-subtitle",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: animationConfig.ease.smooth,
        },
        "-=0.6"
      )
      // 5. Role Selection Chips stagger in
      .fromTo(
        ".hero-chip",
        { opacity: 0, y: 15, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: animationConfig.stagger.micro,
          ease: animationConfig.ease.softBounce,
        },
        "-=0.5"
      )
      // 6. Action CTA Buttons appear with scale
      .fromTo(
        ".hero-cta-btn",
        { opacity: 0, y: 20, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: animationConfig.ease.overshoot,
        },
        "-=0.4"
      )
      // 7. Trust Badge Row items stagger in
      .fromTo(
        ".hero-trust-item",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: animationConfig.ease.soft,
        },
        "-=0.3"
      )
      // 8. 3D Showcase Mockup Rises Up into View
      .fromTo(
        ".hero-showcase-container",
        {
          opacity: 0,
          y: 70,
          scale: 0.92,
          rotateX: 12,
          transformPerspective: 1200,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.1,
          ease: "power3.out",
        },
        "-=0.4"
      )
      // 9. Floating Telemetry Badges Pop Out
      .fromTo(
        ".hero-showcase-badge",
        { opacity: 0, scale: 0.5, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(2)",
        },
        "-=0.5"
      )
      // 10. Hiring company logos reveal
      .fromTo(
        ".hero-companies-section",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: animationConfig.ease.smooth,
        },
        "-=0.3"
      );

    // Continuous Subtle Ambient Float for 3D Card
    gsap.to(".hero-showcase-card", {
      y: -10,
      rotateX: 2,
      rotateY: -2,
      duration: 4.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Independent Float for Floating Badge 1 (ATS Score)
    gsap.to(".hero-badge-float-1", {
      y: -8,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Independent Float for Floating Badge 2 (AI Copilot)
    gsap.to(".hero-badge-float-2", {
      y: 8,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Interactive 3D Cursor Tilt
    const showcaseContainer = container.querySelector(".hero-showcase-container");
    if (showcaseContainer) {
      const handleMouseMove = (e) => {
        const rect = showcaseContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        gsap.to(".hero-showcase-card", {
          rotateY: x * 8,
          rotateX: -y * 8,
          duration: 0.5,
          ease: "power1.out",
          overwrite: "auto",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(".hero-showcase-card", {
          rotateY: -2,
          rotateX: 2,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      showcaseContainer.addEventListener("mousemove", handleMouseMove);
      showcaseContainer.addEventListener("mouseleave", handleMouseLeave);
    }
  }, container);

  return () => ctx.revert();
}
