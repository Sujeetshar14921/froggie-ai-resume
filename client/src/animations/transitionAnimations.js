import { gsap } from "./utils";
import { animationConfig, isReducedMotion } from "./config";

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