import React from "react";
import { Bookmark, Share2, Mail } from "lucide-react";

const TalentCandidateTable = ({
  candidates,
  shortlistedIds,
  onToggleShortlist,
  onQuickPreview,
  onShare,
  onOpenContact,
  onNavigateView,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Candidate</th>
              <th className="py-3 px-4">Target Role</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Skills</th>
              <th className="py-3 px-4">Experience / Degree</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {candidates.map((candidate) => {
              const fullName = candidate.personal_info?.full_name || "Candidate";
              const profession = candidate.personal_info?.profession || candidate.title || "Professional";
              const location = candidate.personal_info?.location || "Remote";
              const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
              const degree = candidate.education?.[0]?.degree;
              const expCount = Array.isArray(candidate.experience) ? candidate.experience.length : 0;
              const isShortlisted = shortlistedIds.includes(candidate._id);
              const candidateImage = candidate.personal_info?.image || candidate.userId?.image;

              return (
                <tr
                  key={candidate._id}
                  onClick={() => onQuickPreview(candidate)}
                  className="hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => onToggleShortlist(e, candidate._id)}
                        className="p-1 text-slate-400 hover:text-amber-500 cursor-pointer"
                      >
                        <Bookmark size={13} className={isShortlisted ? "fill-amber-500 text-amber-500" : ""} />
                      </button>

                      {candidateImage ? (
                        <img
                          src={candidateImage}
                          alt={fullName}
                          className="size-8 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="size-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                          {fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-950 group-hover:text-emerald-700 transition-colors">
                            {fullName}
                          </p>
                          {candidate.matchScore != null && (
                            <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black bg-emerald-500 text-slate-950">
                              {candidate.matchScore}% Match
                            </span>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700">
                          <span className="size-1 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-bold text-slate-700">
                    {profession}
                  </td>

                  <td className="py-3 px-4 text-slate-500">
                    {location}
                  </td>

                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex items-center gap-1 flex-wrap">
                      {skills.slice(0, 3).map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-[9px] font-bold text-slate-700"
                        >
                          {sk}
                        </span>
                      ))}
                      {skills.length > 3 && (
                        <span className="text-[9px] font-bold text-slate-400">
                          +{skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-500">
                    <div>
                      <span className="font-bold text-slate-700">{expCount} {expCount === 1 ? "Role" : "Roles"}</span>
                      {degree && <span className="text-[10px] block text-slate-400 truncate max-w-[140px]">{degree}</span>}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => onShare(e, candidate._id, fullName)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                        title="Share Link"
                      >
                        <Share2 size={13} />
                      </button>
                      {candidate.personal_info?.email && (
                        <button
                          type="button"
                          onClick={(e) => onOpenContact(e, candidate)}
                          className="p-1 text-slate-400 hover:text-emerald-700 rounded cursor-pointer"
                          title="Contact"
                        >
                          <Mail size={13} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateView(candidate._id);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 text-white font-bold text-[10px] hover:bg-slate-900 cursor-pointer"
                      >
                        Resume
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TalentCandidateTable;
