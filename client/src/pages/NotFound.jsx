import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  Sparkles,
  Search,
  FileText,
  Compass,
  HelpCircle,
} from "lucide-react";
import { BrandIcon } from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";
import notFoundImage from "../assets/404.png";

const NotFound = () => {
  const navigate = useNavigate();

  useSEO({
    title: "404 — Page Hopped Away | froggie AI",
    description: "The page you are looking for doesn't exist, has been moved, or took a leap into the unknown.",
    canonical: "https://froggie.site/404",
  });

  return (
    <div className="h-screen max-h-screen min-h-[100dvh] w-full flex flex-col justify-between bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 relative overflow-hidden select-none transition-colors duration-200">
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-60 h-60 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP HEADER: MINIMAL & BRANDED */}
      <header className="w-full px-5 py-3.5 sm:px-8 sm:py-4 flex items-center justify-between shrink-0 relative z-20 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md">
        <Link to="/" className="inline-flex items-center gap-2 group focus:outline-none">
          <BrandIcon size="xs" className="group-hover:scale-105 transition-transform" />
          <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
            froggie<span className="text-emerald-500">.</span>
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </header>

      {/* CENTER HERO: SCALES ADAPTIVELY TO FIT 100% IN VIEWPORT WITHOUT SCROLLING */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 sm:py-4 text-center my-auto relative z-10 w-full max-w-2xl mx-auto">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Error 404 • Page Not Found</span>
        </div>

        {/* 404 Mascot Image (Responsive Height tied to viewport) */}
        <div className="relative group my-1 sm:my-2 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-full blur-2xl group-hover:scale-105 transition-transform duration-500 pointer-events-none" />
          <img
            src={notFoundImage}
            alt="404 Page Hopped Away - froggie"
            className="relative max-h-[30vh] sm:max-h-[34vh] md:max-h-[38vh] w-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:scale-103 transition-transform duration-500 ease-out"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Typography */}
        <div className="space-y-1 sm:space-y-1.5 mt-1 sm:mt-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Looks like this page <span className="text-emerald-600 dark:text-emerald-400">hopped away!</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The page you are looking for took a leap. Let&apos;s get you back to building winning resumes.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center justify-center gap-2.5 w-full max-w-sm sm:max-w-md mt-4 sm:mt-5 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>

          <Link
            to="/"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Homepage</span>
          </Link>

          <Link
            to="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Build Resume</span>
          </Link>
        </div>

        {/* Quick Nav Destination Badges */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-4 sm:mt-5 pt-3 border-t border-slate-200/70 dark:border-slate-800/70 w-full max-w-sm sm:max-w-md">
          <Link to="/talent" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Compass className="w-3 h-3" />
            <span>Talent</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link to="/ats-checker" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
            <Search className="w-3 h-3" />
            <span>ATS Checker</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link to="/file-studio" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>File Studio</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link to="/faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>FAQ</span>
          </Link>
        </div>
      </main>

      {/* MINIMAL BOTTOM FOOTER */}
      <footer className="w-full px-4 py-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500 shrink-0 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-950/30 backdrop-blur-xs relative z-20">
        <span>© 2026 froggie • Free AI Resume Studio & ATS Platform</span>
      </footer>
    </div>
  );
};

export default NotFound;
