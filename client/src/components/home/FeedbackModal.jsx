import React, { useState } from "react";
import { X, Star, Sparkles, CheckCircle2, MessageSquareHeart, Loader2, User } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { testimonialApi } from "../../api/testimonialApi";
import toast from "react-hot-toast";
import FrogFace from "../FrogLogo";

const FeedbackModal = ({ isOpen, onClose, onFeedbackAdded }) => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(user?.profession || "");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please log in to submit your feedback!");
      navigate("/login");
      return;
    }

    if (!feedback.trim() || feedback.trim().length < 5) {
      toast.error("Please write a brief feedback description (min 5 characters).");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await testimonialApi.addTestimonial(
        {
          feedback: feedback.trim(),
          rating,
          title: title.trim() || user?.profession || "Verified Professional",
        },
        token
      );

      toast.success(res.message || "Thank you! Your review is now live!");
      if (typeof onFeedbackAdded === "function" && res.testimonial) {
        onFeedbackAdded(res.testimonial);
      }
      setFeedback("");
      onClose();
    } catch (err) {
      console.error("Feedback submit error:", err);
      toast.error(err?.response?.data?.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FrogFace size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white leading-tight">
                Share Your Experience
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Your review will appear in our live community testimonials!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* USER ACCOUNT BADGE */}
          {user ? (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="size-11 rounded-2xl object-cover border border-emerald-200 shadow-2xs shrink-0"
                />
              ) : (
                <div className="size-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-2xs shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User size={18} />}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{user.name}</h4>
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs text-emerald-700 font-semibold truncate">
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-between gap-3 text-xs text-amber-900 font-medium">
              <span>Please log in to submit your verified review.</span>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg shadow-2xs hover:bg-amber-700 transition-colors"
              >
                Log In
              </button>
            </div>
          )}

          {/* PROFESSION / TITLE INPUT */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Your Professional Role / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Developer, Product Designer"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* STAR RATING PICKER */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Your Rating ({rating} / 5 Stars)
            </label>
            <div className="flex items-center gap-1.5 pt-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                >
                  <Star
                    size={26}
                    fill="currentColor"
                    className={`${
                      (hoverRating || rating) >= star
                        ? "text-amber-400 fill-amber-400 drop-shadow-xs"
                        : "text-slate-200 fill-slate-100"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* FEEDBACK DESCRIPTION */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-700">
                Your Feedback Description
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {feedback.length}/600
              </span>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value.slice(0, 600))}
              rows={4}
              placeholder="How did froggie help your resume, job hunt, or interview process?"
              required
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all placeholder:text-slate-400 leading-relaxed resize-none"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !feedback.trim()}
              className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-emerald-500/30"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin text-emerald-400" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FrogFace size={14} />
                  <span>Submit Testimonial</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
