import React from "react";
import {
  MapPin,
  Bookmark,
  Sparkles,
  GraduationCap,
  Share2,
} from "lucide-react";

const TalentCandidateCard = ({
  candidate,
  isShortlisted,
  onToggleShortlist,
  onQuickPreview,
  onShare,
  onNavigateView,
}) => {
  const fullName = candidate.personal_info?.full_name || "Candidate";
  const profession = candidate.personal_info?.profession || candidate.title || "Professional";
  const location = candidate.personal_info?.location;
  const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
  const expCount = Array.isArray(candidate.experience) ? candidate.experience.length : 0;
  const projCount = Array.isArray(candidate.project) ? candidate.project.length : 0;
  const accentColor = candidate.accent_color || "#10B981";
  const degree = candidate.education?.[0]?.degree;
  const candidateImage = candidate.personal_info?.image || candidate.userId?.image;

  return (
    <div
      onClick={() => onQuickPreview(candidate)}
      className="group relative overflow-hidden bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between text-left space-y-3"
    >
      {/* Subtle Top Accent */}
      <div
        className="absolute top-0 left-4 right-4 h-0.5 rounded-b-full transition-all group-hover:h-1"
        style={{ backgroundColor: accentColor }}
      />

      {/* HEADER: AVATAR, STATUS & BOOKMARK */}
      <div className="space-y-2.5 pt-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="relative shrink-0">
            {candidateImage ? (
              <img
                src={candidateImage}
                alt={fullName}
                className="size-11 rounded-xl object-cover ring-2 ring-emerald-500/30 shadow-xs group-hover:scale-105 transition-transform"
              />
            ) : (
              <div
                className="size-11 rounded-xl flex items-center justify-center font-black text-base text-white shadow-xs group-hover:scale-105 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, #0f172a)`,
                }}
              >
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <span
              className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-1 ring-white"
              title="Open to Work"
            />
          </div>

          {/* BADGES & SHORTLIST STAR BUTTON */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => onToggleShortlist(e, candidate._id)}
              title={isShortlisted ? "Remove from Shortlist" : "Bookmark Candidate"}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isShortlisted
                  ? "bg-amber-50 border-amber-300 text-amber-500"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400"
              }`}
            >
              <Bookmark size={13} className={isShortlisted ? "fill-amber-500" : ""} />
            </button>

            {candidate.matchScore != null && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950 border border-emerald-400 shadow-2xs">
                <Sparkles size={10} />
                {candidate.matchScore}% Match
              </span>
            )}

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/70 shrink-0">
              <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
              Available
            </span>
          </div>
        </div>

        {/* NAME & ROLE */}
        <div>
          <h3 className="text-sm font-black text-slate-950 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {fullName}
          </h3>
          <p className="text-[11px] font-bold text-slate-600 truncate">
            {profession}
          </p>
          {location && (
            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5 truncate">
              <MapPin size={10} className="shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          )}
        </div>

        {/* SKILLS CHIPS */}
        {skills.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {skills.slice(0, 3).map((sk, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold border border-slate-200/70 truncate max-w-[100px]"
              >
                {sk}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[9px] font-bold border border-emerald-200/60">
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* DEGREE OR EXPERIENCE METADATA */}
        <div className="text-[10px] text-slate-500 font-semibold space-y-0.5 pt-0.5 border-t border-slate-100">
          {degree && (
            <p className="truncate flex items-center gap-1 text-slate-600">
              <GraduationCap size={11} className="shrink-0 text-slate-400" />
              <span className="truncate">{degree}</span>
            </p>
          )}
          <div className="flex items-center gap-2 pt-0.5">
            {expCount > 0 && <span>💼 {expCount} {expCount === 1 ? "Role" : "Roles"}</span>}
            {projCount > 0 && <span>🚀 {projCount} {projCount === 1 ? "Proj" : "Projs"}</span>}
          </div>
        </div>
      </div>

      {/* CARD BOTTOM ACTIONS */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={(e) => onShare(e, candidate._id, fullName)}
            title="Copy Share Link"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Share2 size={13} />
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigateView(candidate._id);
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-[11px] transition-all shadow-2xs cursor-pointer border border-emerald-500/30"
        >
          View Resume
        </button>
      </div>
    </div>
  );
};

export default TalentCandidateCard;
