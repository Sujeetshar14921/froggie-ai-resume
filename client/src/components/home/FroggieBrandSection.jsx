import React, { useState, useRef, useCallback } from "react";

/**
 * FroggieBrandSection
 * Clean, grand display brand section positioned right before the footer.
 * Features the iconic "froggie." title with zero letter overlap or collision.
 * Hover effect is strictly localized ONLY to the text itself (no background glow).
 */
const LETTERS = ["f", "r", "o", "g", "g", "i", "e", "."];

const FroggieBrandSection = () => {
  const containerRef = useRef(null);
  const letterRefs = useRef([]);
  const [intensities, setIntensities] = useState(() => Array(LETTERS.length).fill(0));

  const updateIntensities = useCallback((clientX, clientY) => {
    const newIntensities = LETTERS.map((_, idx) => {
      const el = letterRefs.current[idx];
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.hypot(clientX - centerX, clientY - centerY);
      const maxDist = Math.max(70, rect.width * 1.5); // responsive reach per letter

      if (dist >= maxDist) return 0;
      const ratio = 1 - dist / maxDist;
      return Math.pow(ratio, 1.6); // smooth cubic falloff
    });

    setIntensities(newIntensities);
  }, []);

  const handleMouseMove = (e) => {
    updateIntensities(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setIntensities(Array(LETTERS.length).fill(0));
  };

  const handleTouchMove = (e) => {
    if (!e.touches[0]) return;
    updateIntensities(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    setIntensities(Array(LETTERS.length).fill(0));
  };

  return (
    <section
      id="froggie"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden select-none bg-slate-950 py-16 sm:py-24 md:py-28 lg:py-32 flex items-center justify-center border-t border-slate-900 cursor-default"
      aria-label="froggie brand signature"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center text-center">
        {/* SINGLE CLEAN TEXT HEADING - ZERO OVERLAPPING LAYERS, ZERO LETTER COLLISION */}
        <h2
          className="font-black text-center whitespace-nowrap select-none leading-none flex items-center justify-center"
          style={{
            fontSize: "clamp(3.5rem, 15.5vw, 14rem)",
            fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
            letterSpacing: "0.01em",
          }}
        >
          {LETTERS.map((letter, idx) => {
            const intensity = intensities[idx] || 0;
            const isHovered = intensity > 0.04;
            const isDot = letter === ".";

            // Resting colors: sleek dark slate-800
            const restingColor = isDot ? "#064e3b" : "#1e293b";
            // Active hover color: glowing vibrant emerald
            const activeColor = isDot ? "#34d399" : "#34d399";

            return (
              <span
                key={idx}
                ref={(el) => (letterRefs.current[idx] = el)}
                className="inline-block transition-all duration-200 ease-out select-none"
                style={{
                  color: isHovered ? activeColor : restingColor,
                  textShadow: isHovered
                    ? `
                      0 0 ${intensity * 18}px rgba(52, 211, 153, 0.95),
                      0 0 ${intensity * 40}px rgba(16, 185, 129, 0.8),
                      0 0 ${intensity * 75}px rgba(5, 150, 105, 0.6)
                    `
                    : "0 2px 10px rgba(0, 0, 0, 0.5)",
                  filter: isHovered
                    ? `drop-shadow(0 0 ${intensity * 22}px rgba(16, 185, 129, 0.9)) blur(${intensity * 0.4}px)`
                    : "none",
                  transform: isHovered
                    ? `translateY(${-intensity * 5}px) scale(${1 + intensity * 0.03})`
                    : "translateY(0px) scale(1)",
                  paddingLeft: isDot ? "0.02em" : undefined,
                }}
              >
                {letter}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
};

export default FroggieBrandSection;
