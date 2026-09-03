import React from "react";
import { Briefcase, Clock, TrendingUp, Award } from "lucide-react";

const TrackerMetrics = ({ metrics = {} }) => {
  const {
    total = 0,
    interviewing = 0,
    responseRate = 0,
    offers = 0,
  } = metrics;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 text-left">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider">Total Tracked</span>
          <Briefcase size={16} className="text-blue-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-950">{total}</div>
        <p className="text-[11px] text-slate-400">Active pipeline roles</p>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 text-left">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider">Interviewing</span>
          <Clock size={16} className="text-amber-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-amber-600">{interviewing}</div>
        <p className="text-[11px] text-slate-400">Rounds in progress</p>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 text-left">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider">Response Rate</span>
          <TrendingUp size={16} className="text-emerald-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-emerald-600">{responseRate}%</div>
        <p className="text-[11px] text-slate-400">Interview conversion</p>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 text-left">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider">Offers Received</span>
          <Award size={16} className="text-purple-500" />
        </div>
        <div className="text-2xl sm:text-3xl font-black text-purple-600">{offers}</div>
        <p className="text-[11px] text-slate-400">Successful targets</p>
      </div>
    </div>
  );
};

export default TrackerMetrics;
