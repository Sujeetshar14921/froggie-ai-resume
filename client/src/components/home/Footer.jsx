import React, { useState } from "react";
import {
  Linkedin,
  Github,
  Twitter,
  Mail,
  ArrowUp,
  Sparkles,
  Heart,
  MessageSquareHeart,
  Star,
  ShieldCheck,
  Zap,
  Bot,
  Coffee,
  Globe,
  FileCheck2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import FeedbackModal from "./FeedbackModal";
import { BrandIcon } from "../FrogLogo";
import { TEMPLATES } from "../../constants/templates";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnchorNav = (e, anchorId) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${anchorId}`);
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 relative overflow-hidden text-left font-sans select-none">
      {/* Radiant ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-36 bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute -top-24 right-10 size-72 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 sm:pt-16 sm:pb-12 relative z-10">
        
        {/* MAIN 4-COLUMN GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">

          {/* COL 1: BRAND IDENTITY & TRUST (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <BrandIcon
                size="md"
                className="group-hover:scale-105 transition-transform"
                iconClassName="group-hover:rotate-6 transition-transform duration-300"
              />
              <div className="leading-tight">
                <span className="text-2xl font-black text-white tracking-tight flex items-center gap-0.5">
                  froggie<span className="text-emerald-400">.</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400/90 tracking-widest uppercase block">
                  AI Resume Studio
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Next-generation AI-powered resume builder engineered to beat applicant tracking systems and accelerate your career discovery.
            </p>

            {/* TRUST BADGE */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-2xs">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-white">froggie v3.0</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1 text-[11px]">
                <ShieldCheck size={13} /> 100% ATS Optimized
              </span>
            </div>

            {/* SOCIAL LINKS */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="size-8.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-850 transition-all cursor-pointer shadow-2xs"
                aria-label="LinkedIn"
              >
                <Linkedin size={15} />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="size-8.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-850 transition-all cursor-pointer shadow-2xs"
                aria-label="GitHub"
              >
                <Github size={15} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="size-8.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-850 transition-all cursor-pointer shadow-2xs"
                aria-label="Twitter"
              >
                <Twitter size={15} />
              </a>

              <a
                href="mailto:support@froggie.ai"
                className="size-8.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-850 transition-all cursor-pointer shadow-2xs"
                aria-label="Email Support"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* COL 2: STUDIO & AI TOOLS (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Studio & AI Tools</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => navigate("/app")}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer group"
                >
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  <span>AI Resume Builder</span>
                </button>
              </li>
              <li>
                <Link
                  to="/app/ats-checker"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group"
                >
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  <span>ATS Score Scanner</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/talent"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group text-emerald-300 font-semibold"
                >
                  <ChevronRight size={12} className="text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                  <span>Public Talent Directory</span>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    NEW
                  </span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => navigate("/app/applications")}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer group"
                >
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  <span>Application Tracker</span>
                </button>
              </li>
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleAnchorNav(e, "features")}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group"
                >
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  <span>Gemini AI Enhancer</span>
                </a>
              </li>
            </ul>
          </div>

          {/* COL 3: ATS TEMPLATES (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={14} className="text-emerald-400" />
              <span>ATS Templates</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {TEMPLATES.slice(0, 5).map((tpl) => (
                <li key={tpl.id}>
                  <a
                    href="#templates"
                    onClick={(e) => handleAnchorNav(e, "templates")}
                    className="hover:text-emerald-400 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate">{tpl.name}</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-900 text-emerald-400 border border-emerald-500/20 shrink-0 ml-1">
                      {tpl.atsScore}
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#templates"
                  onClick={(e) => handleAnchorNav(e, "templates")}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1 pt-0.5"
                >
                  <span>View All Templates</span>
                  <ChevronRight size={11} />
                </a>
              </li>
            </ul>
          </div>

          {/* COL 4: COMMUNITY & QUICK ACTIONS (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Heart size={14} className="text-emerald-400" />
              <span>Community & Support</span>
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Help make froggie the best free resume platform by sharing your feedback.
            </p>

            <div className="space-y-2 pt-0.5">
              {/* SUPPORT / DONATE CTA */}
              <Link
                to="/donate"
                className="w-full px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-xs font-bold rounded-xl border border-amber-500/30 transition-all flex items-center justify-center gap-2 shadow-2xs group"
              >
                <Coffee size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Support & Donate ☕</span>
              </Link>

              {/* FEEDBACK BUTTON */}
              <button
                type="button"
                onClick={() => setIsFeedbackOpen(true)}
                className="w-full px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-emerald-300 hover:text-white text-xs font-bold rounded-xl border border-emerald-500/30 hover:border-emerald-500 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquareHeart size={14} className="text-emerald-400" />
                <span>Leave a Review ⭐</span>
              </button>

              {/* LAUNCH BUILDER */}
              <button
                type="button"
                onClick={() => navigate("/app")}
                className="w-full px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98"
              >
                <Sparkles size={13} />
                <span>Launch Free Studio</span>
              </button>
            </div>
          </div>

        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500 flex items-center gap-1.5 flex-wrap justify-center md:justify-start">
            <span>© {new Date().getFullYear()} froggie AI. Crafted with</span>
            <Heart size={12} className="text-emerald-500 fill-emerald-500 inline" />
            <span>for job seekers worldwide.</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-400">
            <Link to="/talent" className="hover:text-emerald-400 transition-colors">
              Talent Directory
            </Link>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <Link to="/faq" className="hover:text-white transition-colors">
              FAQ & Help
            </Link>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <Link to="/donate" className="hover:text-amber-300 transition-colors flex items-center gap-1 text-amber-400/90">
              <Coffee size={12} />
              <span>Donate</span>
            </Link>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 hover:text-white transition-colors group cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform text-emerald-400" />
            </button>
          </div>
        </div>

      </div>

      {/* FEEDBACK SUBMISSION MODAL */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onFeedbackAdded={() => {
          const el = document.getElementById("testimonials");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </footer>
  );
};

export default Footer;
