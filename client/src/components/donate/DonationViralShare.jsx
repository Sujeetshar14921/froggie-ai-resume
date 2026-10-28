import React from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Share2, Globe, ArrowRight } from "lucide-react";

const DonationViralShare = ({ handleShare }) => {
  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mb-20">
      <div className="relative overflow-hidden glass-card-elevated bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-2xs group text-center space-y-6">
        {/* Half-circle colorful environment auras */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-500/15 via-teal-400/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 via-purple-400/5 to-transparent rounded-tr-full pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200/80">
            <Heart size={13} className="text-emerald-600 fill-emerald-600" />
            <span>Spread the Word</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Can't donate right now? That's totally okay!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto font-medium">
            You can support us just as much by sharing Froggie with your college friends, WhatsApp groups, and LinkedIn network!
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => handleShare("whatsapp")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <MessageSquare size={15} />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={() => handleShare("linkedin")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Share2 size={15} />
            <span>Share on LinkedIn</span>
          </button>

          <button
            onClick={() => handleShare("twitter")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Globe size={15} />
            <span>Post on X (Twitter)</span>
          </button>
        </div>

        <div className="relative z-10 pt-2">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>Or continue building your free ATS resume</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DonationViralShare;
