import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  Search,
  BookOpen,
  ShieldCheck,
  Download,
  Zap,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import { useCopilot } from "../hooks/useCopilot";
import FrogFace from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";

const FAQ_CATEGORIES = [
  { id: "all", label: "All Questions", icon: BookOpen },
  { id: "ats", label: "ATS & Scoring", icon: ShieldCheck },
  { id: "ai", label: "AI & froggie Copilot", icon: Sparkles },
  { id: "exports", label: "Exports & Formatting", icon: Download },
  { id: "account", label: "Privacy & Account", icon: Zap },
];

const ALL_FAQS = [
  {
    category: "ats",
    q: "What makes a froggie resume ATS-friendly?",
    a: "An ATS (Applicant Tracking System) friendly resume uses standard section headings, clean single-column or balanced two-column hierarchies, searchable text without graphic layers, and standard typography. froggie templates are designed strictly according to modern ATS parsing guidelines to achieve 99%+ compatibility with systems like Workday, Greenhouse, and Lever.",
  },
  {
    category: "ats",
    q: "How does the ATS Resume Score Checker calculate scores?",
    a: "Our ATS Score Checker uses a deterministic weighted evaluation across 7 crucial dimensions: Keyword Match (30%), Skills Match (25%), Experience Match (15%), Job Title Match (10%), Education Match (10%), Structure (5%), and Readability (5%). It identifies missing keywords, matched skills, and formatting warnings.",
  },
  {
    category: "ai",
    q: "How does froggie Career Copilot work?",
    a: "froggie Career Copilot is an interactive career mentor that understands your resume context. It helps you coach your resume summaries, evaluate target job descriptions ('Should I Apply?'), practice one-by-one mock interviews with STAR scoring, write tailored cover letters, and generate personalized recruiter outreach messages.",
  },
  {
    category: "ai",
    q: "Can the AI automatically update my resume in the builder?",
    a: "Yes! When the AI suggests an improved summary or rewritten experience bullet, you can click the 'Apply to Resume' button on the suggestion card, and it will immediately update your active resume in the editor.",
  },
  {
    category: "exports",
    q: "Can I download my resume in PDF and Word DOC formats?",
    a: "Yes! You can instantly export your resume in high-resolution, unwatermarked vector PDF or formatted Microsoft Word (.doc) files at any time with a single click from the editor header.",
  },
  {
    category: "exports",
    q: "Can I upload my existing PDF resume to edit it?",
    a: "Absolutely. Simply upload your PDF resume on the Dashboard or in the ATS Checker, and our server-side parser will extract all your contact details, work experience, projects, education, and skills directly into editable fields.",
  },
  {
    category: "exports",
    q: "How does public sharing work?",
    a: "You can toggle your resume visibility to 'Public' inside the editor. This creates a dedicated, responsive web link that you can share on LinkedIn, your portfolio, or directly with hiring managers.",
  },
  {
    category: "account",
    q: "Is my personal information and resume data secure?",
    a: "Yes. Your personal information is encrypted in transit and at rest in MongoDB. We never sell your resume data to third parties, advertising networks, or unverified recruiters.",
  },
  {
    category: "account",
    q: "Is froggie free to use?",
    a: "Yes! You can create, edit, customize colors and templates, run ATS scans, chat with froggie Career Copilot, and export PDF/Word resumes.",
  },
];

const FaqPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { openCopilot } = useCopilot();

  useSEO({
    title: "Frequently Asked Questions (FAQ) | froggie AI Resume Builder",
    description: "Got questions about ATS resume optimization, AI career copilot, PDF/Word exports, or privacy? Browse our comprehensive knowledge base and FAQs.",
    keywords: "froggie FAQ, ATS resume questions, how does ATS work, AI resume maker FAQ, free resume builder questions, ATS score calculation, resume export PDF Word",
    canonical: "https://froggie.site/faq",
    schema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": ALL_FAQS.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a,
        },
      })),
    },
  });

  const handleAskCopilot = () => {
    if (!user) {
      toast.error("Please create a free account or sign in to chat with froggie AI Career Copilot!", {
        icon: "🐸",
        duration: 4000,
      });
      navigate("/login?state=register");
      return;
    }
    openCopilot({ prompt: "I have a question about improving my resume." });
  };

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = useMemo(() => {
    return ALL_FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 selection:bg-emerald-500 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />

        {/* HERO HEADER */}
        <section className="relative py-16 sm:py-24 bg-white border-b border-slate-200/80 overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <FrogFace size={14} />
              Help & Knowledge Base
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Find instant answers to common questions about our froggie ATS Resume Builder, Copilot, Exports, and Job Tools.
            </p>

            {/* SEARCH INPUT */}
            <div className="max-w-xl mx-auto pt-2">
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions (e.g., ATS, export, copilot, pdf)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                />
              </div>
            </div>

            {/* CATEGORY FILTER CHIPS */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
              {FAQ_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setOpenIndex(0);
                    }}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-950 text-white shadow-md border border-emerald-500/30"
                        : "bg-slate-100/90 text-slate-600 hover:bg-slate-200/70"
                    }`}
                  >
                    <Icon size={14} className={isSelected ? "text-emerald-400" : ""} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION LIST */}
        <section className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/90 p-8 space-y-3">
              <HelpCircle size={36} className="mx-auto text-slate-300" />
              <h3 className="text-base font-bold text-slate-800">No matching questions found</h3>
              <p className="text-xs text-slate-500">
                Try searching with different keywords or ask froggie Copilot directly.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-2 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Reset search filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <motion.div
                    key={faq.q}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "bg-white border-emerald-300 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500/10"
                        : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {faq.q}
                      </span>
                      <div
                        className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen
                            ? "bg-emerald-600 text-white rotate-180"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <ChevronDown size={17} />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ASK CAREER COPILOT BANNER */}
          <div className="mt-16 p-8 rounded-3xl bg-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                <FrogFace size={14} />
                Need Personalized Career Help?
              </div>
              <h3 className="text-lg sm:text-xl font-black">Ask froggie Career Copilot</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                Get real-time answers tailored to your resume, career path, and target jobs.
              </p>
            </div>

            <button
              onClick={handleAskCopilot}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Ask froggie Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default FaqPage;
