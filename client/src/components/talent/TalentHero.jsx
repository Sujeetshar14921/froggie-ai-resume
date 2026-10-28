import React from "react";
import { Sparkles, FileSearch, Bookmark, Search, X, Code2 } from "lucide-react";
import { POPULAR_SKILL_TAGS } from "./talentConstants";

const TalentHero = ({
  searchQuery,
  setSearchQuery,
  selectedSkill,
  setSelectedSkill,
  onSearch,
  onOpenJdMatcher,
  onlyShortlisted,
  setOnlyShortlisted,
  shortlistedCount,
}) => {
  return (
    <section className="relative overflow-hidden pt-7 pb-8 bg-white dark:bg-[#0d1424] border-b border-slate-200/80 dark:border-slate-800">
      {/* Colorful half-circle ambient auras */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/15 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none blur-2xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/15 via-indigo-400/10 to-transparent rounded-tr-full pointer-events-none blur-2xl" />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-black shadow-2xs">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <Sparkles size={13} className="text-emerald-600" />
                <span>Verified Public Talent Showcase</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                Open Directory
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
              Public Talent Discovery & <span className="text-gradient-emerald">Resume Showcase</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl leading-relaxed">
              Explore candidate profiles by exact skill stacks, roles, verified experience, degrees & age group.
            </p>
          </div>

          {/* ACTION BUTTONS & JD MATCHER */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={onOpenJdMatcher}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 text-emerald-900 border border-emerald-300 font-extrabold text-xs shadow-2xs transition-all cursor-pointer hover:scale-102 active:scale-98"
            >
              <FileSearch size={15} className="text-emerald-700" />
              <span>AI Job Description Matcher</span>
            </button>

            <button
              type="button"
              onClick={() => setOnlyShortlisted((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98 ${
                onlyShortlisted
                  ? "bg-amber-50 text-amber-900 border-amber-300 shadow-xs"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              <Bookmark size={14} className={onlyShortlisted ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
              <span>Shortlist ({shortlistedCount})</span>
            </button>
          </div>
        </div>

        {/* MAIN OMNI-SEARCH INPUT */}
        <div className="relative flex items-center bg-white rounded-2xl border-2 border-slate-200/90 shadow-md hover:border-emerald-500 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all p-1.5">
          <div className="pl-3.5 pr-2 text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by skill (React, AWS), role (Full Stack), name, college/degree, or keyword..."
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-semibold text-slate-950 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg mr-1 cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
          <button
            type="button"
            onClick={onSearch}
            className="shimmer-button px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs sm:text-sm transition-all shadow-md shrink-0 cursor-pointer border border-emerald-500/30 hover:scale-102 active:scale-98"
          >
            Search Candidates
          </button>
        </div>

        {/* POPULAR SKILLS CAROUSEL PILLS */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Code2 size={12} className="text-emerald-600" />
            Skill Chips:
          </span>
          {["All", ...POPULAR_SKILL_TAGS].map((sk) => {
            const isSelected = selectedSkill.toLowerCase() === sk.toLowerCase();
            return (
              <button
                key={sk}
                onClick={() => setSelectedSkill(sk)}
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-slate-950 text-white border-slate-950 shadow-xs scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                }`}
              >
                {sk}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TalentHero;
