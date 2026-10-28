import React from "react";
import { Search, X, Globe, Lock } from "lucide-react";

const MyResumesToolbar = ({
  searchQuery,
  setSearchQuery,
  filterVisibility,
  setFilterVisibility,
  sortBy,
  setSortBy,
  publicCount,
  privateCount,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 bg-white dark:bg-[#0c1424] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
      {/* Search Box */}
      <div className="relative flex-1 min-w-[240px]">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search resumes by title, profession, or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-850 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 outline-none font-medium text-slate-900 dark:text-slate-100"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Visibility Filter Tabs & Sort Dropdown */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Quick Filter Tabs */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setFilterVisibility("all")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterVisibility === "all"
                ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setFilterVisibility("public")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterVisibility === "public"
                ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            <Globe size={12} className={filterVisibility === "public" ? "text-blue-500" : ""} />
            <span>Public</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-700 font-mono">
              {publicCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterVisibility("private")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterVisibility === "private"
                ? "bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-2xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            <Lock size={12} />
            <span>Private</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-700 font-mono">
              {privateCount}
            </span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
          <span className="text-slate-400 dark:text-slate-500 font-normal">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none outline-none cursor-pointer pr-1 font-bold text-slate-800 dark:text-slate-200"
          >
            <option value="date" className="dark:bg-slate-900">Recently Updated</option>
            <option value="title" className="dark:bg-slate-900">Title (A-Z)</option>
            <option value="template" className="dark:bg-slate-900">Template Style</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MyResumesToolbar;
