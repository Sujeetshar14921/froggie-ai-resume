import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  DollarSign,
  FileText,
  Edit2,
  Trash2,
  Calendar,
  ExternalLink,
  Target,
  Flame,
  Star,
  Clock,
  ArrowRight,
} from "lucide-react";
import { TRACKER_STAGES, PRIORITY_LEVELS } from "../../constants/trackerConfig";

const AVATAR_GRADIENTS = [
  "from-blue-600 to-indigo-600",
  "from-emerald-600 to-teal-600",
  "from-violet-600 to-purple-600",
  "from-rose-600 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-600 to-blue-600",
];

const getCompanyGradient = (company = "") => {
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

const TrackerListView = ({
  applications = [],
  onEdit,
  onDelete,
  onStageChange,
}) => {
  if (applications.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
          🔍
        </div>
        <h3 className="text-sm font-black text-slate-800">No applications match your filter</h3>
        <p className="text-xs text-slate-500">Try changing your search query or stage filters above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Role & Company</th>
              <th className="py-3 px-3">Pipeline Stage</th>
              <th className="py-3 px-3">Priority</th>
              <th className="py-3 px-3">Compensation</th>
              <th className="py-3 px-3">Location</th>
              <th className="py-3 px-3">Target Dates</th>
              <th className="py-3 px-3">Tailored Resume</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => {
              const currentStage =
                TRACKER_STAGES.find((s) => s.id === app.stage) || TRACKER_STAGES[0];
              const priorityCfg =
                PRIORITY_LEVELS.find((p) => p.id === app.priority) || PRIORITY_LEVELS[2];
              const initial = (app.company || "J").trim().charAt(0).toUpperCase();

              return (
                <tr
                  key={app.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* ROLE & COMPANY */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5 min-w-[200px]">
                      <div
                        className={`w-7 h-7 rounded-lg bg-gradient-to-br ${getCompanyGradient(
                          app.company
                        )} text-white flex items-center justify-center font-black text-[11px] shrink-0 shadow-2xs`}
                      >
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-950 truncate max-w-[220px]">
                          {app.position}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <span>{app.company}</span>
                          {app.jobUrl && (
                            <a
                              href={app.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-emerald-600 inline-block"
                              title="Job link"
                            >
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* STAGE SELECTOR */}
                  <td className="py-3 px-3">
                    <select
                      value={app.stage}
                      onChange={(e) => onStageChange(app.id, e.target.value)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border border-slate-200 outline-none cursor-pointer ${currentStage.badgeColor}`}
                    >
                      {TRACKER_STAGES.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.icon} {st.title}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* PRIORITY */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${priorityCfg.badge}`}
                    >
                      <span>{priorityCfg.icon}</span>
                      <span>{priorityCfg.label}</span>
                    </span>
                  </td>

                  {/* COMPENSATION */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {app.salary ? (
                      <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-lg text-[11px]">
                        {app.salary}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>

                  {/* LOCATION */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {app.location ? (
                      <span className="text-slate-600 font-medium text-[11px] flex items-center gap-1">
                        <MapPin size={11} className="text-slate-400" />
                        <span className="truncate max-w-[130px]">{app.location}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>

                  {/* DATES */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="space-y-0.5 text-[11px]">
                      {app.interviewDate ? (
                        <div className="font-bold text-amber-700 flex items-center gap-1">
                          <Clock size={11} /> {app.interviewDate}
                        </div>
                      ) : app.appliedDate ? (
                        <div className="text-slate-500 flex items-center gap-1">
                          <Calendar size={11} /> {app.appliedDate}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>
                  </td>

                  {/* TAILORED RESUME */}
                  <td className="py-3 px-3">
                    {app.tailoredResume ? (
                      <div className="flex items-center gap-1.5 max-w-[160px]">
                        <span className="truncate text-[11px] font-medium text-slate-700">
                          {app.tailoredResume}
                        </span>
                        <Link
                          to={`/app/ats-checker?targetRole=${encodeURIComponent(
                            app.position || ""
                          )}`}
                          className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 shrink-0"
                          title="Run ATS Scanner"
                        >
                          <Target size={10} />
                        </Link>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Not tailored</span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(app)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Application"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(app.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={13} />
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

export default TrackerListView;
