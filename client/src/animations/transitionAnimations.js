import { gsap } from "./utils";
import { animationConfig, isReducedMotion } from "./config";

/**
 * Advanced Cinematic GSAP sequence for FrogSplashIntro
 * Sequence order:
 * 1. Center quantum core spark & flare
 * 2. Logo expands from its zone's center with camera proximity
 * 3. Snaps into position with back overshoot + kinetic camera shake
 * 4. Concentric 360-degree shockwaves bursting from the logo's center
 * 5. Logo holds briefly, then SLIDES UP out of the way
 * 6. Slogan/telemetry reveals in its own zone (no overlap with the logo)
 * 7. Hyperspace portal zoom exit — slogan fades out fully BEFORE the logo zooms,
 *    so nothing overlaps on the way out either.
 */
export function initSplashAnimation(container, { onComplete }) {
  if (!container) return { kill: () => {}, exit: () => {} };

  if (isReducedMotion()) {
    if (onComplete) onComplete();
    return { kill: () => {}, exit: () => {} };
  }

  const masterTl = gsap.timeline();

  // 1. Initial State Setup
  gsap.set(".splash-overlay", { opacity: 1 });
  gsap.set(".splash-mascot-wrapper", {
    y: 0,
    transformOrigin: "center center",
  });
  gsap.set(".splash-mascot", {
    scale: 0,
    opacity: 0,
    rotationX: 35,
    rotationY: -45,
    rotationZ: -15,
    transformPerspective: 1200,
    transformOrigin: "center center",
  });
  gsap.set(".splash-center-core", {
    scale: 0,
    opacity: 0,
    transformOrigin: "center center",
  });
  gsap.set(".splash-shockwave-1, .splash-shockwave-2, .splash-shockwave-3", {
    scale: 0.1,
    opacity: 0,
    transformOrigin: "center center",
  });
  gsap.set(".splash-slogan-box", { opacity: 0, y: 20, scale: 0.96, filter: "blur(10px)" });
  gsap.set(".splash-chip", { opacity: 0, scale: 0.85, y: 15 });
  gsap.set(".splash-progress-fill", { width: "0%" });
  gsap.set(".splash-flash", { opacity: 0 });

  const percentObj = { value: 0 };
  const percentEl = container.querySelector(".splash-status-percent");
  const statusEl = container.querySelector(".splash-status-text");

  // 2. Center Core Ignition & Energy Flare (0s - 0.4s)
  masterTl
    .fromTo(
      ".splash-center-core",
      { scale: 0, opacity: 0 },
      { scale: 2.2, opacity: 1, duration: 0.35, ease: "power2.out" },
      0
    )
    .to(
      ".splash-center-core",
      { scale: 3.5, opacity: 0, duration: 0.45, ease: "power2.in" },
      0.25
    )

    // 3. Logo Emerges and Expands (0.15s - 0.7s)
    .to(
      ".splash-mascot",
      {
        opacity: 1,
        scale: 1.5,
        rotationX: -10,
        rotationY: 15,
        rotationZ: 8,
        duration: 0.55,
        ease: "power2.out",
      },
      0.15
    )

    // 4. Snaps into Position with High-Energy Overshoot (0.7s - 1.25s)
    .to(
      ".splash-mascot",
      {
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        duration: 0.55,
        ease: "back.out(2.4)",
      },
      0.7
    )

    // Camera Shake on Impact (at 0.72s)
    .to(
      ".splash-shake-wrapper",
      {
        keyframes: [
          { y: -6, x: 4, duration: 0.04 },
          { y: 5, x: -4, duration: 0.04 },
          { y: -4, x: 2, duration: 0.04 },
          { y: 2, x: -1, duration: 0.04 },
          { y: 0, x: 0, duration: 0.04 },
        ],
        ease: "none",
      },
      0.72
    )

    // Concentric Shockwaves Blast 360° (at 0.72s)
    .fromTo(
      ".splash-shockwave-1",
      { scale: 0.2, opacity: 1 },
      { scale: 3.8, opacity: 0, duration: 1.2, ease: "power3.out" },
      0.72
    )
    .fromTo(
      ".splash-shockwave-2",
      { scale: 0.15, opacity: 0.85 },
      { scale: 3.0, opacity: 0, duration: 1.4, ease: "power2.out" },
      0.78
    )
    .fromTo(
      ".splash-shockwave-3",
      { scale: 0.1, opacity: 0.7 },
      { scale: 2.4, opacity: 0, duration: 1.6, ease: "power2.out" },
      0.85
    )

    // Orbiting Sparkles Emerge
    .fromTo(
      ".splash-sparkle",
      { scale: 0, opacity: 0, rotate: -60 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.5, stagger: 0.1, ease: "back.out(2.5)" },
      0.85
    )

    // 5. HOLD — let the frog sit fully visible at its spot for a beat
    // (nothing scheduled here on purpose — this is the "look at the logo" pause: 0.85s -> 1.5s)

    // 6. FROG SLIDES UP, fully clearing the slogan zone (starts 1.5s)
    .to(
      ".splash-mascot-wrapper",
      {
        y: -90,
        scale: 0.78,
        duration: 0.6,
        ease: "power3.inOut",
      },
      1.5
    )
    .to(
      ".splash-sparkle",
      {
        opacity: 0,
        duration: 0.3,
        ease: "power1.in",
      },
      1.5
    )

    // 7. Slogan reveal — starts only AFTER the frog's slide has fully finished (2.15s)
    .to(
      ".splash-slogan-box",
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
      },
      2.15
    )

    // Feature Badges Pop In
    .to(
      ".splash-chip",
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "back.out(1.7)",
      },
      2.35
    )

    // 8. HUD Telemetry & Progress Fill (2.3s - 4.4s)
    .to(
      ".splash-progress-fill",
      {
        width: "100%",
        duration: 2.1,
        ease: "power1.inOut",
      },
      2.3
    )
    .to(
      percentObj,
      {
        value: 100,
        duration: 2.1,
        ease: "power1.inOut",
        onUpdate: () => {
          if (percentEl) {
            percentEl.textContent = `${Math.round(percentObj.value)}%`;
          }
          if (statusEl) {
            const v = percentObj.value;
            if (v < 30) statusEl.textContent = "INITIALIZING AI ATS ENGINE...";
            else if (v < 65) statusEl.textContent = "CALIBRATING 99.4% ATS SCORING...";
            else if (v < 90) statusEl.textContent = "PREPARING PRO RESUME FORMATS...";
            else statusEl.textContent = "READY TO LEAP! 🚀";
          }
        },
      },
      2.3
    );

  // Subtle idle drift for mascot once it's parked in its slid-up spot
  const floatTween = gsap.to(".splash-mascot-wrapper", {
    y: "-=8",
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 2.5,
  });

  // End of sequence -> trigger exit
  masterTl.add(() => {
    exitTransition();
  }, "+=0.3");

  function exitTransition() {
    masterTl.pause();
    floatTween.kill();

    const exitTl = gsap.timeline({
      onComplete: () => {
        if (typeof onComplete === "function") {
          onComplete();
        }
      },
    });

    // 1. Slogan fades/shrinks out FIRST and completely (0s - 0.3s)
    exitTl
      .to(
        ".splash-slogan-box",
        {
          opacity: 0,
          scale: 0.9,
          filter: "blur(12px)",
          duration: 0.3,
          ease: "power2.in",
        },
        0
      )

      // 2. Flash starts once slogan is basically gone (0.25s)
      .to(
        ".splash-flash",
        {
          opacity: 0.5,
          duration: 0.18,
          ease: "power2.in",
        },
        0.25
      )

      // 3. ONLY NOW does the frog zoom/portal out — slogan is already invisible
      .to(
        ".splash-mascot-wrapper",
        {
          scale: 4.5,
          opacity: 0,
          filter: "blur(20px)",
          duration: 0.55,
          ease: "power3.in",
        },
        0.3
      )

      // 4. Whole overlay fades last
      .to(
        ".splash-overlay",
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        0.5
      );
  }

  return {
    kill: () => {
      masterTl.kill();
      floatTween.kill();
    },
    exit: exitTransition,
  };
}

/**
 * FAQ Accordion smooth expand/collapse transition
 */
export function animateAccordion(element, isOpen, onToggleComplete) {
  if (!element) return;

  if (isReducedMotion()) {
    element.style.height = isOpen ? "auto" : "0px";
    element.style.opacity = isOpen ? "1" : "0";
    if (onToggleComplete) onToggleComplete();
    return;
  }

  if (isOpen) {
    gsap.fromTo(
      element,
      { height: 0, opacity: 0 },
      {
        height: "auto",
        opacity: 1,
        duration: 0.32,
        ease: "power2.out",
        onComplete: onToggleComplete,
      }
    );
  } else {
    gsap.to(element, {
      height: 0,
      opacity: 0,
      duration: 0.24,
      ease: "power2.inOut",
      onComplete: onToggleComplete,
    });
  }
}

/**
 * Template Showcase preview sheet crossfade/scale animation
 */
export function animateTemplateSwitch(previewElement) {
  if (!previewElement || isReducedMotion()) return;

  gsap.fromTo(
    previewElement,
    { opacity: 0.6, scale: 0.97 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      ease: animationConfig.ease.smooth,
    }
  );
}