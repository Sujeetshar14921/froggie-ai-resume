import React, { useEffect, useState, useCallback } from "react";
import { Star, Quote, CheckCircle2, Heart, MessageSquarePlus, User } from "lucide-react";
import { motion } from "framer-motion";
import { testimonialApi } from "../../api/testimonialApi";
import FeedbackModal from "./FeedbackModal";
import FrogFace from "../FrogLogo";

const AVATAR_GRADIENTS = [
  "from-emerald-600 to-teal-700",
  "from-slate-900 to-slate-950",
  "from-emerald-500 to-teal-600",
  "from-teal-700 to-emerald-800",
  "from-slate-800 to-slate-900",
];

const TestimonialCard = ({ item, index }) => {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <div className="w-[340px] sm:w-[400px] bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* STARS & QUOTE */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1">
            {[...Array(item.rating || 5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill="currentColor"
                className="text-amber-400"
              />
            ))}
          </div>

          <Quote size={24} className="text-emerald-200" />
        </div>

        {/* FEEDBACK DESCRIPTION */}
        <p className="text-slate-700 leading-relaxed text-sm sm:text-base line-clamp-4">
          "{item.feedback || item.text}"
        </p>
      </div>

      {/* USER PROFILE */}
      <div className="flex items-center gap-3.5 mt-6 pt-5 border-t border-slate-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-11 h-11 rounded-2xl object-cover border border-emerald-200 shadow-2xs shrink-0"
          />
        ) : (
          <div
            className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${gradient} text-white flex items-center justify-center font-extrabold text-sm shadow-2xs shrink-0`}
          >
            {item.name ? item.name.charAt(0).toUpperCase() : <User size={16} />}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-slate-900 text-sm truncate">
              {item.name}
            </h4>
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" title="Verified User" />
          </div>

          <p className="text-xs text-emerald-700 font-semibold truncate">
            {item.title || item.role || "Verified Professional"}
          </p>
        </div>
      </div>
    </div>
  );
};

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    try {
      const data = await testimonialApi.getTestimonials();
      setTestimonials(data.testimonials || []);
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleFeedbackAdded = (newFeedback) => {
    setTestimonials((prev) => [newFeedback, ...prev]);
  };

  // Duplicate for seamless infinite loop
  const displayItems = testimonials.length > 0 ? [...testimonials, ...testimonials] : [];

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden bg-slate-50/70">
      
      {/* Radiant ambient glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <FrogFace size={14} />
            Loved by 50,000+ Job Seekers
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight"
          >
            Real Stories from People Who{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Landed Dream Jobs
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600"
          >
            See how professionals worldwide accelerated their careers with froggie AI.
          </motion.p>

          {/* SHARE YOUR EXPERIENCE CTA BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex justify-center"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-emerald-50/60 text-emerald-800 font-extrabold text-xs sm:text-sm border border-emerald-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <MessageSquarePlus size={16} className="text-emerald-600" />
              <span>Share Your Feedback</span>
            </button>
          </motion.div>
        </div>

      </div>

      {/* INFINITE HORIZONTAL MARQUEE (RIGHT TO LEFT) */}
      <div className="relative w-full overflow-hidden py-4 group">
        {/* LEFT & RIGHT GRADIENT FADE MASKS */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee-left flex gap-6 sm:gap-8 px-4">
          {displayItems.map((item, idx) => (
            <TestimonialCard key={`${item._id || idx}-${idx}`} item={item} index={idx} />
          ))}
        </div>
      </div>

      {/* FEEDBACK SUBMISSION MODAL */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFeedbackAdded={handleFeedbackAdded}
      />

    </section>
  );
};

export default Testimonial;