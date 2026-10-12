import React from "react";

const BRANDS = [
  {
    name: "Google",
    icon: (
      <svg className="h-6 sm:h-7 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
      </svg>
    ),
    label: "Google",
  },
  {
    name: "Microsoft",
    icon: (
      <svg className="h-6 sm:h-7 w-auto" viewBox="0 0 23 23">
        <path fill="#f35325" d="M1 1h10v10H1z" />
        <path fill="#81bc06" d="M12 1h10v10H12z" />
        <path fill="#05a6f0" d="M1 12h10v10H1z" />
        <path fill="#ffba08" d="M12 12h10v10H12z" />
      </svg>
    ),
    label: "Microsoft",
  },
  {
    name: "Amazon",
    icon: (
      <svg className="h-6 sm:h-7 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M13.62 13.91c-.26-.14-.54-.22-.84-.22-.96 0-1.45.69-1.45 1.74 0 .93.44 1.48 1.25 1.48.51 0 .9-.25 1.04-.54v-2.46zm3.32 4.41c-.22.18-.54.19-.77.05-.72-.44-1.39-.94-1.74-1.36-.84.97-1.87 1.54-3.23 1.54-2.12 0-3.66-1.52-3.66-3.83 0-2.06 1.34-3.5 3.39-3.84l1.9-.31v-.64c0-.79-.5-1.25-1.55-1.25-.86 0-1.63.34-2.22.75-.24.16-.54.11-.7-.11l-.81-1.07c-.15-.2-.1-.48.11-.64.91-.72 2.21-1.2 3.86-1.2 2.65 0 4.09 1.32 4.09 3.65v4.54c0 .87.35 1.25.68 1.73.19.27.18.59-.04.78l-1.07.96zM1.97 19.34c3.48 2.2 7.79 3.51 12.35 3.51 5.09 0 9.87-1.64 13.69-4.42.34-.25.07-.63-.33-.46-3.63 1.52-7.85 2.4-12.28 2.4-4.22 0-8.24-.87-11.69-2.4-.44-.2-.79.2-.18.51l-1.56.86zm21.46-1.28c-.43-.55-2.82-.26-3.9-.13-.33.04-.38-.26-.08-.47 1.94-1.38 4.29-.98 4.75-.41.45.58-.12 2.97-1.95 4.51-.28.24-.55.11-.42-.2.43-1.02 2.03-2.75 1.6-3.3z" />
      </svg>
    ),
    label: "Amazon",
  },
  {
    name: "Meta",
    icon: (
      <svg className="h-6 sm:h-7 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M23.998 12c0-3.264-1.31-5.744-3.235-7.142C18.91 3.5 16.643 3 14.156 3c-2.035 0-3.693.364-4.992 1.096A9.71 9.71 0 0 0 6.002 7.21C4.453 9.066 3.618 11.233 3.618 13.447c0 3.01 1.272 5.342 3.167 6.697 1.792 1.283 4.037 1.856 6.371 1.856 2.083 0 3.847-.411 5.244-1.222a10.45 10.45 0 0 0 3.385-3.381c1.47-2.046 2.213-4.148 2.213-5.397zm-3.955.13c0 1.23-.55 2.68-1.547 4.084-.962 1.354-2.227 2.378-3.659 2.96-1.36.554-2.843.766-4.408.63-1.631-.141-3.085-.688-4.208-1.583-1.191-.95-1.855-2.28-1.855-3.72 0-1.46.666-2.83 1.874-3.86 1.155-.986 2.668-1.584 4.372-1.73 1.637-.14 3.19.1 4.492.695 1.37.625 2.58 1.696 3.495 3.097.94 1.44 1.444 2.87 1.444 4.04z" />
      </svg>
    ),
    label: "Meta",
  },
  {
    name: "Apple",
    icon: (
      <svg className="h-6 sm:h-7 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.93.04-2.02.63-2.66 1.4-.56.66-.99 1.76-.86 2.81 1.04.08 2.05-.53 2.58-1.28z" />
      </svg>
    ),
    label: "Apple",
  },
  {
    name: "Netflix",
    icon: (
      <svg className="h-6 sm:h-7 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M4 0h3.5v19.5L16.5 0H20v24h-3.5V4.5L7.5 24H4V0z" fill="#E50914" />
      </svg>
    ),
    label: "Netflix",
  },
  {
    name: "Spotify",
    icon: (
      <svg className="h-6 sm:h-7 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" fill="#1ED760" />
      </svg>
    ),
    label: "Spotify",
  },
  {
    name: "Uber",
    icon: (
      <svg className="h-6 sm:h-7 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 3.75c4.556 0 8.25 3.694 8.25 8.25s-3.694 8.25-8.25 8.25-8.25-3.694-8.25-8.25S7.444 3.75 12 3.75zM7.5 9v6h3v-3h3v3h3V9h-9z" />
      </svg>
    ),
    label: "Uber",
  },
  {
    name: "Airbnb",
    icon: (
      <svg className="h-6 sm:h-7 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M12 0C6.67 0 5.03 3.44 5.03 6.8c0 3.97 3.32 8.7 6.97 14.2 3.65-5.5 6.97-10.23 6.97-14.2C18.97 3.44 17.33 0 12 0zm0 18.27C9.33 13.9 7.23 10 7.23 6.8c0-2.3 1.08-4.6 4.77-4.6s4.77 2.3 4.77 4.6c0 3.2-2.1 7.1-4.77 11.47zM12 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="#FF5A5F" />
      </svg>
    ),
    label: "Airbnb",
  },
  {
    name: "Stripe",
    icon: (
      <svg className="h-6 sm:h-7 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-4.32C17.702 1.867 15.426 1.3 12.693 1.3 7.02 1.3 3.518 4.29 3.518 8.65c0 4.148 2.68 5.753 6.84 7.214 2.502.879 3.36 1.547 3.36 2.553 0 1.01-.84 1.52-2.19 1.52-2.03 0-4.99-.958-6.91-2.09l-.91 4.39c1.94 1.07 4.76 1.763 7.78 1.763 5.92 0 9.77-2.91 9.77-7.44 0-4.04-2.52-5.63-7.282-7.39z" fill="#635BFF" />
      </svg>
    ),
    label: "Stripe",
  },
  {
    name: "Adobe",
    icon: (
      <svg className="h-6 sm:h-7 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M14.647 0h9.353v24l-9.353-24zm-5.294 0h-9.353v24l9.353-24zm2.647 10.824l4.235 10.353h-3.412l-1.412-3.529h-3.412l3.412-6.824h.589z" fill="#FF0000" />
      </svg>
    ),
    label: "Adobe",
  },
  {
    name: "Salesforce",
    icon: (
      <svg className="h-6 sm:h-7 w-auto fill-current" viewBox="0 0 24 24">
        <path d="M10.15 4.52a6.37 6.37 0 0 1 5.34-2.88c2.93 0 5.43 1.95 6.2 4.67a5.57 5.57 0 0 1 2.31 4.45c0 3.09-2.51 5.6-5.6 5.6H5.6A5.6 5.6 0 0 1 0 10.76a5.58 5.58 0 0 1 4.56-5.48c.55-1.92 2.3-3.32 4.4-3.32.4 0 .79.05 1.19.16z" fill="#00A1E0" />
      </svg>
    ),
    label: "Salesforce",
  },
];

const BrandScroller = () => {
  // Duplicate array 3 times for a completely seamless, stutter-free continuous infinite scroll loop
  const duplicatedBrands = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section className="relative w-full py-10 sm:py-14 bg-gradient-to-b from-white via-slate-50/70 to-white border-y border-slate-200/80 overflow-hidden select-none">
      {/* Background technical accent glow */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mx-auto relative z-10 text-center space-y-6">
        
        {/* KICKER HEADER */}
        <div className="space-y-1.5">
          <p className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-slate-400 flex items-center justify-center gap-2">
            <span className="w-6 h-[1.5px] bg-emerald-500 rounded-full inline-block" />
            <span>Trusted By Candidates Shortlisted At Top Global Companies</span>
            <span className="w-6 h-[1.5px] bg-emerald-500 rounded-full inline-block" />
          </p>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
            Our ATS-optimized resumes pass screening at world-class hiring teams
          </h2>
        </div>

        {/* INFINITE HORIZONTAL MARQUEE WRAPPER */}
        <div className="relative w-full overflow-hidden py-3">
          {/* Gradient Edge Masks (Fade In & Fade Out) */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Marquee Track */}
          <div className="flex items-center gap-4 sm:gap-6 animate-marquee-left">
            {duplicatedBrands.map((brand, idx) => (
              <div
                key={`${brand.name}-${idx}`}
                className="group flex items-center gap-3 px-5 sm:px-6 py-3 rounded-2xl bg-white/95 hover:bg-white border border-slate-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 shrink-0 cursor-default"
              >
                <div className="transition-transform duration-300 group-hover:scale-110 shrink-0">
                  {brand.icon}
                </div>
                <span className="text-xs sm:text-sm font-black tracking-tight text-slate-700 group-hover:text-slate-950 transition-colors">
                  {brand.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SUBTLE TELEMETRY FOOTNOTE */}
        <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-500 flex-wrap pt-1">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            99.2% Parser Success
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span>Workday, Taleo, Greenhouse, Lever, & SAP SuccessFactors Compliant</span>
        </div>

      </div>
    </section>
  );
};

export default BrandScroller;
