import React from "react";
import { Sparkles } from "lucide-react";

const COMPANIES = [
  {
    name: "Google",
    icon: (
      <svg className="size-4 shrink-0" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
      </svg>
    ),
  },
  {
    name: "Microsoft",
    icon: (
      <svg className="size-4 shrink-0" viewBox="0 0 24 24">
        <rect x="1" y="1" width="10" height="10" fill="#F25022" rx="1" />
        <rect x="13" y="1" width="10" height="10" fill="#7FBA00" rx="1" />
        <rect x="1" y="13" width="10" height="10" fill="#00A4EF" rx="1" />
        <rect x="13" y="13" width="10" height="10" fill="#FFB900" rx="1" />
      </svg>
    ),
  },
  {
    name: "Amazon",
    icon: (
      <svg className="size-4.5 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M1.5 17c4.7 3.6 11.8 3.6 16.8.6.3-.2.3-.6 0-.8-.2-.2-.6-.2-.8 0-4.6 2.7-11.2 2.7-15.6-.6-.3-.2-.6-.2-.8 0-.2.2-.2.6.4.8z" fill="#FF9900"/>
        <path d="M18.8 16.2c-.3-.4-1.8-.2-2.5-.1-.2 0-.3.2-.2.4.1.2.3.2.5.2.6-.1 1.5-.1 1.7.2.2.3-.2 1.1-.5 1.5-.1.2 0 .3.2.4.2 0 .3 0 .4-.2.4-.6.7-2 .4-2.4z" fill="#FF9900"/>
        <path d="M11 5a4.5 4.5 0 0 0-4.5 4.5c0 1.2.5 2.3 1.3 3 .8.7 1.9 1 3.2 1 1.8 0 3-.7 3.5-1.5v1.2h2V9.5C16.5 6.8 14.5 5 11 5zm.2 6.5c-1.4 0-2.2-.7-2.2-1.8 0-1.1.8-1.7 2.2-1.7 1.2 0 2 .5 2.3 1.2-.2 1.4-1.1 2.3-2.3 2.3z" fill="#111827"/>
      </svg>
    ),
  },
  {
    name: "Meta",
    icon: (
      <svg className="size-4.5 shrink-0" viewBox="0 0 24 24" fill="none">
        <path d="M16.7 5C14.7 5 13 6.1 12 7.7 11 6.1 9.3 5 7.3 5 3.8 5 1 7.9 1 11.5c0 3.8 3.1 7.5 7 9.5 2.4-1.7 4.4-3.7 5.7-5.9 1.3 2.2 3.3 4.2 5.7 5.9 3.9-2 7-5.7 7-9.5C23 7.9 20.2 5 16.7 5zm-9.4 12c-2.4-1.6-4.3-4.2-4.3-6.5 0-2.5 1.9-4.5 4.3-4.5 1.6 0 3 1 3.7 2.5-.7 1.4-1.8 2.8-3.7 4v4.5zm9.4 0v-4.5c-1.9-1.2-3-2.6-3.7-4 .7-1.5 2.1-2.5 3.7-2.5 2.4 0 4.3 2 4.3 4.5 0 2.3-1.9 4.9-4.3 6.5z" fill="#0668E1"/>
      </svg>
    ),
  },
  {
    name: "Apple",
    icon: (
      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="#0F172A">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.38-.58.67-1.09 1.76-.95 2.82 1.02.08 2.05-.51 2.68-1.27z"/>
      </svg>
    ),
  },
  {
    name: "Netflix",
    icon: (
      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="#E50914">
        <path d="M4 0v24l4.5-1.5V0zm11.5 0l-7 19.5V24l7-1.5V0zM15.5 0v22.5l4.5 1.5V0z"/>
      </svg>
    ),
  },
  {
    name: "Spotify",
    icon: (
      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="#1ED760">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.4-.7.5-1.1.3-3-1.8-6.8-2.2-11.3-1.2-.5.1-.9-.2-1-.7-.1-.5.2-.9.7-1 4.9-1.1 9.1-.7 12.4 1.3.4.3.5.8.3 1.3zm1.5-3.3c-.3.4-.8.6-1.3.3-3.4-2.1-8.6-2.7-12.7-1.5-.5.2-1.1-.1-1.3-.6-.2-.5.1-1.1.6-1.3 4.6-1.4 10.3-.7 14.3 1.7.4.3.6.9.4 1.4zm.1-3.5C15 8.2 8.4 8 4.6 9.2c-.6.2-1.3-.1-1.5-.7-.2-.6.1-1.3.7-1.5C8.2 5.6 15.6 5.8 20 8.5c.6.3.8 1.1.4 1.7-.3.5-1.1.7-1.3.3z"/>
      </svg>
    ),
  },
  {
    name: "Stripe",
    icon: (
      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="#635BFF">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C17.756.885 15.42.333 12.709.333 6.942.333 3.09 3.42 3.09 8.286c0 5.093 3.535 6.136 7.02 7.424 2.453.907 3.328 1.624 3.328 2.656 0 1.059-.974 1.547-2.366 1.547-2.535 0-5.467-1.189-7.39-2.235L2.8 23.364C4.846 24.383 7.828 25 10.748 25c6.046 0 10.162-2.923 10.162-8.082 0-4.996-3.486-6.19-6.934-7.768z"/>
      </svg>
    ),
  },
  {
    name: "Airbnb",
    icon: (
      <svg className="size-4.5 shrink-0" viewBox="0 0 24 24" fill="#FF5A5F">
        <path d="M12 2C8.7 2 6 4.7 6 8c0 3.2 2.2 7.1 6 12 3.8-4.9 6-8.8 6-12 0-3.3-2.7-6-6-6zm0 9c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
      </svg>
    ),
  },
  {
    name: "Uber",
    icon: (
      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="#000000">
        <circle cx="12" cy="12" r="11" />
        <rect x="9" y="9" width="6" height="6" fill="#FFFFFF" rx="1" />
      </svg>
    ),
  },
  {
    name: "NVIDIA",
    icon: (
      <svg className="size-4.5 shrink-0" viewBox="0 0 24 24" fill="#76B900">
        <path d="M8.6 7.3c1.7-1 3.5-1.5 5.5-1.5 4.3 0 7.8 2.3 9.4 5.9-1.8 4.2-6 7-10.7 7-2 0-3.9-.5-5.6-1.5l1.6-1.9c1.2.7 2.6 1.1 4 1.1 3.4 0 6.4-2.1 7.7-5.2-1.3-3-4.1-5-7.4-5-1.5 0-2.9.4-4.1 1.1l-.5-2zm.3 4.8c0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1z"/>
      </svg>
    ),
  },
  {
    name: "Salesforce",
    icon: (
      <svg className="size-4.5 shrink-0" viewBox="0 0 24 24" fill="#00A1E0">
        <path d="M10 5.5a4.5 4.5 0 0 1 7.5-1.5 4 4 0 0 1 4.5 4 4.5 4.5 0 0 1-1.5 8.5H5a4.5 4.5 0 0 1-1-8.9 4 4 0 0 1 6-2.1z"/>
      </svg>
    ),
  },
];

const HeroCompanyLogos = () => {
  return (
    <div className="hero-companies-section mt-24 pt-12 border-t border-slate-200/80 w-full mx-auto text-center">
      {/* SECTION PILL BADGE */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider mb-3">
        <Sparkles size={12} className="text-emerald-600 animate-pulse" />
        <span>Proven Hiring Acceleration</span>
      </div>

      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-2">
        Candidates build ATS-winning resumes and get hired at world-class teams
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8 font-medium">
        Over 15,000+ job seekers landed interviews and offers at leading tech companies.
      </p>

      {/* INFINITE MARQUEE SHOWCASE WITH EDGE GRADIENT FADES */}
      <div className="relative w-full overflow-hidden py-2 select-none">
        {/* LEFT GRADIENT MASK */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50/90 via-slate-50/60 to-transparent z-10 pointer-events-none" />

        {/* RIGHT GRADIENT MASK */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50/90 via-slate-50/60 to-transparent z-10 pointer-events-none" />

        {/* CONTINUOUS RUNNING TRACK (DUPLICATED 2X FOR SEAMLESS 100% LOOP) */}
        <div className="flex items-center gap-3 sm:gap-4 w-max animate-hero-marquee hover:[animation-play-state:paused]">
          {[...COMPANIES, ...COMPANIES].map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="px-4 py-2.5 rounded-2xl bg-white/95 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 hover:scale-105 transition-all duration-200 flex items-center gap-2.5 shrink-0 cursor-default group"
            >
              <div className="transition-transform duration-200 group-hover:scale-115 shrink-0">
                {company.icon}
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* METRIC TRUST HIGHLIGHTS */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 pt-6 border-t border-slate-100 text-[11px] sm:text-xs font-bold text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            <strong className="text-slate-900 font-black">99.4%</strong> First-Round ATS Pass Rate
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            <strong className="text-slate-900 font-black">15,000+</strong> Offers Landed
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            <strong className="text-slate-900 font-black">3.4x</strong> More Recruiter Callbacks
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroCompanyLogos;
