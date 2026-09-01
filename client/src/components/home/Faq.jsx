import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import FrogFace from "../FrogLogo";

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

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-28 bg-white relative overflow-hidden">
      {/* Radiant ambient glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <FrogFace size={15} />
            Frequently Asked Questions
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight"
          >
            Got Questions?{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              We Have Answers
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600"
          >
            Everything you need to know about our froggie AI resume builder, ATS compatibility, and exports.
          </motion.p>
        </div>

        {/* ACCORDION */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-slate-50/90 border-emerald-300 shadow-sm"
                    : "bg-white border-slate-200/90 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
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

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/60 mt-1">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Faq;
