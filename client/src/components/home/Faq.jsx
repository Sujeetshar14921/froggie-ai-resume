import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import FrogFace from "../FrogLogo";
import { initSectionHeaderReveal, animateAccordion } from "../../animations";

const faqs = [
  {
    q: "What makes froggie resumes ATS-friendly?",
    a: "An ATS (Applicant Tracking System) friendly resume uses standard headings, clean single-column or balanced two-column hierarchies, searchable text without embedded graphic text, and standard font styles. froggie templates are designed strictly according to modern ATS parsing guidelines to achieve 99%+ compatibility.",
  },
  {
    q: "How does the froggie AI enhancement work?",
    a: "Our froggie AI engine analyzes your job descriptions, achievements, and professional summary. It re-phrases your sentences with active impact verbs, highlights quantifiable results, and ensures industry-relevant keywords are highlighted for recruiters.",
  },
  {
    q: "Can I download my resume in PDF and Word DOC formats?",
    a: "Yes! You can instantly export your resume in high-resolution, unwatermarked vector PDF or formatted Microsoft Word DOC files at any time with a single click.",
  },
  {
    q: "Can I upload my existing resume to edit it?",
    a: "Absolutely. Simply upload your PDF resume on the Dashboard, and our intelligent AI parser will extract all your contact details, work experience, projects, education, and skills directly into our builder.",
  },
  {
    q: "How does public sharing work?",
    a: "You can toggle your resume visibility to 'Public' inside the editor. This creates a dedicated, responsive web link that you can share on LinkedIn, your portfolio, or directly with hiring managers.",
  },
  {
    q: "Is my personal information secure?",
    a: "Yes. Your personal information is encrypted in transit and at rest. We never sell your resume data to third parties or recruiters without your explicit permission.",
  },
];

const FaqItem = ({ faq, isOpen, onToggle }) => {
  const contentRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    animateAccordion(contentRef.current, isOpen);
  }, [isOpen]);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isOpen
          ? "bg-slate-50/90 border-emerald-300 shadow-sm"
          : "bg-white border-slate-200/90 hover:border-slate-300"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-bold text-slate-900 text-base sm:text-lg">
          {faq.q}
        </span>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
            isOpen
              ? "bg-emerald-600 text-white rotate-180"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          <ChevronDown size={18} />
        </div>
      </button>

      <div
        ref={contentRef}
        style={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
        }}
      >
        <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/60 mt-1">
          {faq.a}
        </div>
      </div>
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const cleanup = initSectionHeaderReveal(containerRef.current);
    return cleanup;
  }, []);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" ref={containerRef} className="py-28 bg-white relative overflow-hidden">
      {/* Radiant ambient glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <div className="section-header text-center mb-16">
          <span className="section-badge inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
            <FrogFace size={15} />
            Frequently Asked Questions
          </span>

          <h2 className="section-title text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Got Questions?{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              We Have Answers
            </span>
          </h2>

          <p className="section-subtitle mt-4 text-base sm:text-lg text-slate-600">
            Everything you need to know about our froggie AI resume builder, ATS compatibility, and exports.
          </p>
        </div>

        {/* ACCORDION */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.q}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => toggleFaq(index)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Faq;
