import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Star,
  Quote,
  CheckCircle2,
  MessageSquarePlus,
  User,
} from "lucide-react";
import { testimonialApi } from "../../api/testimonialApi";
import FeedbackModal from "./FeedbackModal";
import FrogFace from "../FrogLogo";
import { initTestimonialsMarquee } from "../../animations";

const AVATAR_GRADIENTS = [
  "from-emerald-600 to-teal-700",
  "from-slate-900 to-slate-950",
  "from-emerald-500 to-teal-600",
  "from-teal-700 to-emerald-800",
  "from-slate-800 to-slate-900",
];

const FALLBACK_TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    title: "Senior Software Engineer",
    rating: 5,
    feedback:
      "This AI resume builder completely revolutionized my job hunt. The ATS keyword optimization matched my skills with job requirements, and I received 4 interview calls in just 2 weeks!",
  },
  {
    name: "Priya Verma",
    title: "Product Designer",
    rating: 5,
    feedback:
      "The Minimal Image template is gorgeously designed! The AI professional summary generator wrote a punchy, crisp opening hook that impressed hiring managers.",
  },
  {
    name: "Aman Gupta",
    title: "Senior Data Analyst",
    rating: 5,
    feedback:
      "Exporting clean vector PDFs and Word files without messy page breaks or ugly watermarks was a lifesaver. Easily the best resume tool I have ever used.",
  },
  {
    name: "Sneha Patel",
    title: "DevOps Engineer",
    rating: 5,
    feedback:
      "The real-time ATS audit broke down my missing cloud skills in seconds. Froggie helped me land an offer at a top fintech firm with zero paywalls.",
  },
  {
    name: "Vikram Malhotra",
    title: "Engineering Manager",
    rating: 5,
    feedback:
      "Froggie Copilot helped me restructure 12 years of tech leadership experience into high-impact STAR bullet points. Recruiter response rate jumped to 65%.",
  },
];

const TestimonialCard = ({ item, index }) => {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <div className="how-step-card w-[320px] sm:w-[400px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shrink-0 select-none bg-white/95 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-850 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 backdrop-blur-xl group">
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

          <Quote
            size={24}
            className="text-emerald-300 dark:text-emerald-500/40 group-hover:text-emerald-500 transition-colors"
          />
        </div>

        {/* FEEDBACK DESCRIPTION */}
        <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-sm sm:text-base line-clamp-4 font-normal">
          "{item.feedback || item.text}"
        </p>
      </div>

      {/* USER PROFILE */}
      <div className="flex items-center gap-3.5 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-11 h-11 rounded-2xl object-cover border border-emerald-200 dark:border-emerald-500/30 shadow-2xs shrink-0"
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
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
              {item.name}
            </h4>
            <CheckCircle2
              size={14}
              className="text-emerald-600 dark:text-emerald-400 shrink-0"
              title="Verified User"
            />
          </div>

          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold truncate">
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

  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const isInteractingRef = useRef(false);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const pauseTimeoutRef = useRef(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      const data = await testimonialApi.getTestimonials();
      if (data.testimonials && data.testimonials.length > 0) {
        setTestimonials(data.testimonials);
      } else {
        setTestimonials(FALLBACK_TESTIMONIALS);
      }
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      setTestimonials(FALLBACK_TESTIMONIALS);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  useEffect(() => {
    const cleanup = initTestimonialsMarquee(containerRef.current);
    return cleanup;
  }, []);

  const handleFeedbackAdded = (newFeedback) => {
    setTestimonials((prev) => [newFeedback, ...prev]);
  };

  // Base list of testimonials (ensure at least fallback items)
  const items = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;
  // Duplicate 3 times for a completely seamless wrap-around loop in either direction
  const displayItems = [...items, ...items, ...items];

  // Continuous Auto-Scroll Engine with Wrap-Around Loop
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const speed = 0.65; // pixels per frame

    const step = () => {
      if (scroller && !isInteractingRef.current) {
        scroller.scrollLeft += speed;

        const oneThird = scroller.scrollWidth / 3;
        if (scroller.scrollLeft >= oneThird * 2) {
          scroller.scrollLeft -= oneThird;
        } else if (scroller.scrollLeft <= 5) {
          scroller.scrollLeft += oneThird;
        }
      }
      animFrameIdRef.current = requestAnimationFrame(step);
    };

    animFrameIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [displayItems.length]);

  // Touch and Mouse Drag Handlers
  const handleMouseDown = (e) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    isDownRef.current = true;
    isInteractingRef.current = true;
    startXRef.current = e.pageX - scroller.offsetLeft;
    scrollLeftRef.current = scroller.scrollLeft;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  };

  const handleMouseMove = (e) => {
    if (!isDownRef.current) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    e.preventDefault();
    const x = e.pageX - scroller.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scroller.scrollLeft = scrollLeftRef.current - walk;

    // Boundary check during mouse drag
    const oneThird = scroller.scrollWidth / 3;
    if (scroller.scrollLeft >= oneThird * 2) {
      scroller.scrollLeft -= oneThird;
      scrollLeftRef.current -= oneThird;
    } else if (scroller.scrollLeft <= 5) {
      scroller.scrollLeft += oneThird;
      scrollLeftRef.current += oneThird;
    }
  };

  const handleMouseUp = () => {
    if (isDownRef.current) {
      isDownRef.current = false;
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = setTimeout(() => {
        isInteractingRef.current = false;
      }, 2500);
    }
  };

  const handleMouseLeave = () => {
    if (isDownRef.current) {
      isDownRef.current = false;
    }
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 1500);
  };

  const handleMouseEnter = () => {
    isInteractingRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  };

  const handleTouchStart = () => {
    isInteractingRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 2500);
  };

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const oneThird = scroller.scrollWidth / 3;
    if (scroller.scrollLeft >= oneThird * 2) {
      scroller.scrollLeft -= oneThird;
    } else if (scroller.scrollLeft <= 5) {
      scroller.scrollLeft += oneThird;
    }
  };


  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="relative py-20 sm:py-28 overflow-hidden bg-slate-50/70 dark:bg-[#090d16] border-y border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300"
    >
      {/* Radiant ambient glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-100/30 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-teal-100/30 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* SECTION HEADER */}
        <div className="section-header text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-4 shadow-2xs backdrop-blur-sm">
            <FrogFace size={14} />
            Community & User Voice
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-slate-50 tracking-tight">
            What Professionals Say About{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              froggie Resume
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Real feedback and verified outcomes from job seekers building careers on the platform.
          </p>

          {/* SHARE YOUR EXPERIENCE CTA BUTTON */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 hover:bg-emerald-50/70 dark:hover:bg-slate-800 text-emerald-900 dark:text-emerald-300 font-black text-xs sm:text-sm border border-emerald-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <MessageSquarePlus size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>Share Your Feedback</span>
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL CAROUSEL WITH AUTO-SCROLL + TOUCH & DRAG SCROLL */}
      <div className="relative w-full overflow-hidden py-4 group">
        {/* LEFT & RIGHT GRADIENT FADE MASKS (FIXES UGLY WHITE BOX IN DARK MODE) */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-slate-50/90 dark:from-[#090d16] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-slate-50/90 dark:from-[#090d16] to-transparent z-10 pointer-events-none" />


        {/* SCROLLABLE TRACK CONTAINER */}
        <div
          ref={scrollerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={handleMouseEnter}
          onScroll={handleScroll}
          className="flex gap-5 sm:gap-7 px-4 sm:px-8 overflow-x-auto no-scrollbar scrollbar-none cursor-grab active:cursor-grabbing select-none [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] will-change-scroll"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {displayItems.map((item, idx) => (
            <TestimonialCard
              key={`${item._id || idx}-${idx}`}
              item={item}
              index={idx}
            />
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