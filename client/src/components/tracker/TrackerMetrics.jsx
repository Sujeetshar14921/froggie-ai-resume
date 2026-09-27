import React from "react";
import { Briefcase, Clock, TrendingUp, Award, Layers, Sparkles } from "lucide-react";
import { TRACKER_STAGES } from "../../constants/trackerConfig";

const TrackerMetrics = ({ metrics = {}, applications = [] }) => {
  const {
    total = 0,
    interviewing = 0,
    responseRate = 0,
    offers = 0,
    applied = 0,
    wishlist = 0,
  } = metrics;

  // Calculate estimated total pipeline salary
  const totalPipelineVal = applications.reduce((acc, app) => {
    if (!app.salary) return acc;
    // Extract first number in salary
    const match = app.salary.match(/(\d+)/g);
    if (match && match.length > 0) {
      const val = parseInt(match[match.length - 1], 10);
      return acc + (val > 1000 ? val / 1000 : val);
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-4 text-left">
      {/* 4 MODERN KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Tracked */}
        <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 via-blue-500/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Tracked
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Briefcase size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {total}
            </span>
            <span className="text-[11px] font-bold text-slate-400">roles</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {totalPipelineVal > 0 ? `~$${Math.round(totalPipelineVal)}k pipeline est.` : "Active pipeline"}
          </p>
        </div>

        {/* Interviewing */}
        <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 via-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Interviewing
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Clock size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
              {interviewing}
            </span>
            <span className="text-[11px] font-bold text-amber-500/80">in progress</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Rounds & screens active
          </p>
        </div>

        {/* Response Rate */}
        <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 via-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Response Rate
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              {responseRate}%
            </span>
            <span className="text-[11px] font-bold text-emerald-500/80">
              {responseRate >= 20 ? "🔥 Strong" : "Targeting"}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, responseRate)}%` }}
            />
          </div>
        </div>

        {/* Offers Received */}
        <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Offers Received
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <Award size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 tracking-tight">
              {offers}
            </span>
            <span className="text-[11px] font-bold text-purple-500/80">
              {offers > 0 ? "🎉 Win!" : "In pipeline"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Target compensation reached
          </p>
        </div>
      </div>

      {/* PIPELINE CONVERSION FUNNEL BAR */}
      {total > 0 && (
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Sparkles size={14} />
            </div>
            <span className="text-xs font-black text-slate-800 tracking-tight">
              Pipeline Funnel Flow
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
              Wishlist: <b className="text-slate-900">{wishlist}</b>
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              Applied: <b className="text-slate-900">{applied}</b>
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Interviewing: <b className="text-slate-900">{interviewing}</b>
            </span>
            <span className="text-slate-300">→</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Offers: <b className="text-slate-900">{offers}</b>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackerMetrics;
