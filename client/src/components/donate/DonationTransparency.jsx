import React from "react";
import { DONATION_CONFIG } from "../../constants/donationConfig";

const DonationTransparency = () => {
  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mb-20 text-left">
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
          Financial Transparency
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
          Where Does Your Donation Go?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-medium">
          We operate with 100% open transparency. Here is the exact breakdown of how community funds sustain Froggie:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DONATION_CONFIG.costBreakdown.map((item, idx) => {
          const gradients = [
            "from-emerald-500/15 via-teal-400/5",
            "from-blue-500/15 via-cyan-400/5",
            "from-purple-500/15 via-pink-400/5",
          ];
          const cornerGradient = gradients[idx % gradients.length];
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl glass-card-elevated bg-white border border-slate-200/90 shadow-2xs space-y-3 relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              {/* Half-circle colorful corner */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${cornerGradient} to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500`}
              />

              <div className="relative z-10 size-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                {item.percentage}
              </div>
              <h3 className="relative z-10 font-black text-base text-slate-950">{item.label}</h3>
              <p className="relative z-10 text-xs text-slate-500 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DonationTransparency;
