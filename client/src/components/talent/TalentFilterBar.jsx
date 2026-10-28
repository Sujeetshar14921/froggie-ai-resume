import React from "react";
import {
  LayoutGrid,
  List,
  X,
  Briefcase,
  MapPin,
  Award,
  GraduationCap,
  Calendar,
  Layers,
} from "lucide-react";
import {
  ROLE_OPTIONS,
  LOCATION_OPTIONS,
  EXPERIENCE_OPTIONS,
  DEGREE_OPTIONS,
  AGE_OPTIONS,
} from "./talentConstants";

const TalentFilterBar = ({
  displayedCount,
  totalCount,
  activeFilterCount,
  viewMode,
  setViewMode,
  pageSize,
  setPageSize,
  sortBy,
  setSortBy,
  handleClearFilters,
  selectedRole,
  setSelectedRole,
  selectedLocation,
  setSelectedLocation,
  selectedExperience,
  setSelectedExperience,
  selectedDegree,
  setSelectedDegree,
  selectedAge,
  setSelectedAge,
  selectedTemplate,
  setSelectedTemplate,
  hasProjectsOnly,
  setHasProjectsOnly,
  hasCertsOnly,
  setHasCertsOnly,
  onlyShortlisted,
  setOnlyShortlisted,
}) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
      {/* TOP ROW: VIEW TOGGLE, SORT, CLEAR & RESULTS COUNT */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-900">
            {displayedCount} of {totalCount} Candidates
          </span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {activeFilterCount} Active Filters
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* VIEW SWITCHER: GRID OR LIST */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              title="Grid View (4 columns)"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-slate-950 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              title="Compact List View"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-slate-950 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <List size={15} />
            </button>
          </div>

          {/* PAGE SIZE SELECTOR */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-transparent border-none outline-none cursor-pointer font-bold"
            >
              <option value={12}>12 / page</option>
              <option value={24}>24 / page</option>
              <option value={48}>48 / page</option>
            </select>
          </div>

          {/* SORT DROPDOWN */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer pr-1 font-bold"
            >
              <option value="newest">Recently Active</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Candidate Name (A-Z)</option>
            </select>
          </div>

          {/* RESET BUTTON */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X size={13} />
              <span>Reset All</span>
            </button>
          )}
        </div>
      </div>

      {/* MULTI-CRITERIA SELECTORS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
        {/* 1. JOB ROLE */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Briefcase size={11} /> Job Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-2 rounded-xl outline-none cursor-pointer truncate"
          >
            <option value="All">All Roles</option>
            {ROLE_OPTIONS.filter((r) => r !== "All").map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* 2. LOCATION */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <MapPin size={11} /> Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-2 rounded-xl outline-none cursor-pointer truncate"
          >
            <option value="All">All Locations</option>
            {LOCATION_OPTIONS.filter((l) => l !== "All").map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* 3. EXPERIENCE */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Award size={11} /> Experience
          </label>
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-2 rounded-xl outline-none cursor-pointer truncate"
          >
            {EXPERIENCE_OPTIONS.map((exp) => (
              <option key={exp.value} value={exp.value}>
                {exp.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. DEGREE */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <GraduationCap size={11} /> Degree
          </label>
          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-2 rounded-xl outline-none cursor-pointer truncate"
          >
            {DEGREE_OPTIONS.map((deg) => (
              <option key={deg} value={deg}>
                {deg === "All" ? "All Degrees" : deg}
              </option>
            ))}
          </select>
        </div>

        {/* 5. AGE GROUP */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Calendar size={11} /> Age Group
          </label>
          <select
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-2 rounded-xl outline-none cursor-pointer truncate"
          >
            {AGE_OPTIONS.map((age) => (
              <option key={age.value} value={age.value}>
                {age.label}
              </option>
            ))}
          </select>
        </div>

        {/* 6. TEMPLATE FORMAT */}
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Layers size={11} /> Format
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-2 rounded-xl outline-none cursor-pointer truncate"
          >
            <option value="All">All Formats</option>
            <option value="classic">Classic ATS</option>
            <option value="modern">Modern Tech</option>
            <option value="minimal">Minimal Clean</option>
            <option value="executive">Executive</option>
            <option value="creative">Creative</option>
            <option value="technical">Technical</option>
          </select>
        </div>
      </div>

      {/* TOGGLE CHECKBOXES */}
      <div className="flex items-center gap-4 pt-1 flex-wrap text-xs font-bold text-slate-700">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasProjectsOnly}
            onChange={(e) => setHasProjectsOnly(e.target.checked)}
            className="size-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span>Has Verified Projects 🚀</span>
        </label>

        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasCertsOnly}
            onChange={(e) => setHasCertsOnly(e.target.checked)}
            className="size-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span>Has Certifications 📜</span>
        </label>

        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyShortlisted}
            onChange={(e) => setOnlyShortlisted(e.target.checked)}
            className="size-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
          />
          <span className="text-amber-700">Show Starred Candidates Only ⭐</span>
        </label>
      </div>
    </div>
  );
};

export default TalentFilterBar;
