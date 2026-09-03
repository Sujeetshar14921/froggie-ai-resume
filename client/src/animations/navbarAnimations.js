import { gsap } from "./utils";
import { animationConfig, isReducedMotion } from "./config";

/**
 * Advanced Cinematic Navbar Animation System
 * Features:
 * - Staggered choreography (Brand logo -> Nav pill -> Nav links -> Action buttons)
 * - Dynamic scroll behavior (Smart directional hide on fast scroll down, instant reveal on scroll up)
 * - Fluid height & backdrop blur transitions
 */
export function initNavbarAnimation(header) {
  if (!header) return () => {};

  const ctx = gsap.context(() => {
    if (isReducedMotion()) {
      gsap.set(header, { opacity: 1, y: 0 });
      return;
    }

    // 1. Cinematic Entrance Choreography
    const entranceTl = gsap.timeline({
      defaults: { ease: animationConfig.ease.smooth },
    });

    entranceTl
      // Header shell drops down
      .fromTo(
        header,
        { y: -35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        }
      )
      // Brand Logo pops in with spring
      .fromTo(
        ".nav-brand",
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.8)",
        },
        "-=0.5"
      )
      // Nav center pill expands
      .fromTo(
        ".nav-links-pill",
        { scaleX: 0.85, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.55,
          ease: "power2.out",
        },
        "-=0.4"
      )
      // Nav link items cascade
      .fromTo(
        ".nav-link-item",
        { y: -10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.05,
          ease: "power2.out",
        },
        "-=0.35"
      )
      // Right actions (bell, profile / CTA) slide in
      .fromTo(
        ".nav-actions",
        { x: 15, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        },
        "-=0.4"
      );

    // 2. Smart Directional Scroll (Hide on scroll down, Reveal on scroll up)
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollY;

          if (currentScrollY > 120 && diff > 8) {
            // Scrolling down fast -> hide smoothly
            gsap.to(header, {
              yPercent: -100,
              duration: 0.32,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else if (diff < -5 || currentScrollY <= 80) {
            // Scrolling up -> reveal smoothly
            gsap.to(header, {
              yPercent: 0,
              duration: 0.28,
              ease: "power2.out",
              overwrite: "auto",
            });
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, header);

  return () => ctx.revert();
}

/**
 * Animates the mobile drawer menu opening/closing with staggered links
 */
export function animateMobileMenu(menuElement, isOpen) {
  if (!menuElement) return;

  if (isReducedMotion()) {
    menuElement.style.display = isOpen ? "block" : "none";
    menuElement.style.opacity = isOpen ? "1" : "0";
    return;
  }

  if (isOpen) {
    gsap.fromTo(
      menuElement,
      { height: 0, opacity: 0 },
      {
        height: "auto",
        opacity: 1,
        duration: 0.35,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      menuElement.querySelectorAll(".mobile-nav-link"),
      { x: -18, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.08,
      }
    );
  } else {
    gsap.to(menuElement, {
      height: 0,
      opacity: 0,
      duration: 0.25,
      ease: "power2.inOut",
    });
  }
}
