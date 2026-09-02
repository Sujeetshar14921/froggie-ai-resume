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
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import FeedbackModal from "./FeedbackModal";
import FrogFace from "../FrogLogo";
import { TEMPLATES } from "../../constants/templates";

const Footer = () => {
  const navigate = useNavigate();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/90 relative overflow-hidden">
      {/* Radiant emerald ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-36 bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -top-24 right-10 size-72 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* BRAND COLUMN (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 p-[2px] shadow-lg shadow-emerald-950/50">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <FrogFace size={26} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight flex items-center gap-1">
                  froggie<span className="text-emerald-400">.</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block -mt-1">
                  AI Resume & Career Suite
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The intelligent AI-powered resume builder engineered to help developers, designers, and professionals beat applicant tracking systems and secure top job offers.
            </p>

            {/* STATUS BADGE */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-white">froggie v2.0</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck size={13} /> 100% ATS Ready
              </span>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="size-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-xs"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="size-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-xs"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="size-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-xs"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>

              <a
                href="mailto:support@froggie.ai"
                className="size-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-slate-850 transition-all cursor-pointer shadow-xs"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* PRODUCT & AI FEATURES (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-400" />
              AI Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors">
                  AI Resume Generator
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors">
                  ATS Score Optimizer
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigate("/app")}
                  className="hover:text-emerald-400 transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <Bot size={13} className="text-emerald-400" />
                  <span>froggie Career Copilot</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/app")}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Mock Interview Coach
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/app")}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Job Match & Fit Analysis
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/app")}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Cover Letter Generator
                </button>
              </li>
            </ul>
          </div>

          {/* TEMPLATES (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={14} className="text-emerald-400" />
              ATS Templates
            </h3>
            <ul className="space-y-2 text-sm">
              {TEMPLATES.slice(0, 6).map((tpl) => (
                <li key={tpl.id}>
                  <a
                    href="#templates"
                    className="hover:text-emerald-400 transition-colors flex items-center justify-between group"
                  >
                    <span>{tpl.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-emerald-400 font-mono opacity-80 group-hover:opacity-100">
                      {tpl.atsScore}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COMMUNITY, FEEDBACK & QUICK ACTION (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Feedback & Reviews
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Help make froggie better! Share your experience or request new features.
            </p>

            {/* SUPPORT / DONATE BUTTON */}
            <Link
              to="/donate"
              className="w-full px-4 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 text-xs font-bold rounded-xl border border-amber-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Coffee size={15} className="text-amber-400" />
              <span>Support & Donate ☕</span>
            </Link>

            {/* FEEDBACK CTA BUTTON */}
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-emerald-300 hover:text-white text-xs font-bold rounded-xl border border-emerald-500/30 hover:border-emerald-500 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquareHeart size={15} className="text-emerald-400" />
              <span>Give Feedback</span>
            </button>

            {/* LAUNCH BUILDER BUTTON */}
            <button
              onClick={() => navigate("/app")}
              className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles size={14} />
              <span>Launch froggie Builder</span>
            </button>
          </div>

        </div>

        {/* BOTTOM ROW */}
        <div className="border-t border-slate-800/90 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500 flex items-center gap-1.5">
            © {new Date().getFullYear()} froggie. Built with <Heart size={12} className="text-emerald-500 fill-emerald-500" /> for ambitious job seekers worldwide.
          </p>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Star size={12} className="fill-emerald-400" />
              <span>Leave a Review</span>
            </button>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <Link to="/faq" className="hover:text-white text-slate-400 transition-colors">
              FAQ & Help Center
            </Link>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <Link to="/donate" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1">
              <Coffee size={12} />
              <span>Donate</span>
            </Link>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform text-emerald-400" />
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
