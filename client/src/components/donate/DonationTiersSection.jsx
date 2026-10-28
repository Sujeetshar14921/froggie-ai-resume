import React from "react";
import { Coffee, Check, Sparkles } from "lucide-react";
import { DONATION_CONFIG } from "../../constants/donationConfig";

const DonationTiersSection = ({
  selectedTier,
  setSelectedTier,
  customAmount,
  setCustomAmount,
  supporterName,
  setSupporterName,
  supporterNote,
  setSupporterNote,
  impactDescription,
}) => {
  return (
    <div className="relative z-10 p-4 sm:p-8 lg:col-span-7 space-y-4 sm:space-y-6">
      <div>
        <div className="flex items-center gap-2 text-slate-950">
          <Coffee size={18} className="text-emerald-600 sm:w-5 sm:h-5" />
          <h2 className="text-lg sm:text-2xl font-black tracking-tight">
            Choose Your Contribution
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Every rupee directly covers AI tokens and cloud database bandwidth.
        </p>
      </div>

      {/* TIER CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DONATION_CONFIG.tiers.map((tier) => {
          const isSelected = selectedTier?.id === tier.id && !customAmount;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => {
                setSelectedTier(tier);
                setCustomAmount("");
              }}
              className={`relative overflow-hidden p-4 rounded-2xl text-left transition-all border-2 cursor-pointer flex flex-col justify-between group/tier ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50/70 shadow-md shadow-emerald-500/10 scale-101"
                  : "border-slate-200/90 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              {/* Corner half-circle aura */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-500/20 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none group-hover/tier:scale-125 transition-transform duration-500" />

              {tier.popular && (
                <span className="relative z-10 self-end -mt-1 mb-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                  {tier.badge}
                </span>
              )}

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{tier.emoji}</span>
                  <div>
                    <p className="font-black text-sm text-slate-900 group-hover/tier:text-emerald-700 transition-colors">
                      {tier.title}
                    </p>
                    <span className="text-emerald-600 font-black text-base">
                      ₹{tier.amount}
                    </span>
                  </div>
                </div>

                <div
                  className={`size-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>
              </div>

              <p className="relative z-10 text-[11px] text-slate-500 mt-2 leading-snug font-medium">
                {tier.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* CUSTOM AMOUNT & QUICK INCREMENTS */}
      <div className="space-y-2 pt-1">
        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Or Enter Custom Amount (₹)
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-base">
              ₹
            </span>
            <input
              type="number"
              min="10"
              placeholder="e.g. 150, 300, 1500"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-bold text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm bg-slate-50 focus:bg-white transition-all"
            />
          </div>

          {/* QUICK INCREMENT PILLS */}
          <div className="flex items-center gap-1.5">
            {[150, 300, 750].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setCustomAmount(String(amt))}
                className="px-2.5 py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition-all border border-slate-200/80 cursor-pointer"
              >
                +₹{amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* OPTIONAL SUPPORTER MESSAGE */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Your Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Rahul S."
              value={supporterName}
              onChange={(e) => setSupporterName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium bg-slate-50 focus:bg-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">A Short Note / Cheerful Message</label>
            <input
              type="text"
              placeholder="e.g. Keep up the awesome work!"
              value={supporterNote}
              onChange={(e) => setSupporterNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium bg-slate-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* REAL-TIME IMPACT CALLOUT */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
        <Sparkles size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-950 space-y-0.5">
          <p className="font-extrabold text-emerald-900">Your Community Impact</p>
          <p className="text-emerald-700 leading-relaxed font-medium">
            {impactDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationTiersSection;
