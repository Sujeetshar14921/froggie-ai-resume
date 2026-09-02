import React from "react";
import { Compass, CheckCircle, AlertCircle, BookOpen, Layers, ArrowRight } from "lucide-react";
import FrogFace from "../../FrogLogo";

const CareerAnalysisCard = ({ data = {} }) => {
  const {
    targetCareer = "Strategic Career Pathways",
    suitableRoles = [],
    skillGaps = [],
    learningRoadmap = [],
    projectRecommendations = [],
  } = data;

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4 text-xs animate-in fade-in duration-200">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 font-extrabold uppercase tracking-wider text-[10px]">
            <Compass size={13} className="text-teal-600" />
            <span>Career Copilot Strategy</span>
          </span>
          <span className="font-extrabold text-slate-800 text-xs truncate">
            {targetCareer}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600">
          <FrogFace size={13} />
          <span>froggie AI</span>
        </div>
      </div>

      {/* SUITABLE ROLES */}
      {suitableRoles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Layers size={13} className="text-emerald-600" />
            <span>Top Matching Roles</span>
          </h4>

          <div className="grid sm:grid-cols-2 gap-2">
            {suitableRoles.map((role, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{role.role}</span>
                  {role.matchPercentage && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                      {role.matchPercentage}% Match
                    </span>
                  )}
                </div>
                {role.whyFit && <p className="text-[11px] text-slate-500 leading-snug">{role.whyFit}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SKILL GAPS */}
      {skillGaps.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <AlertCircle size={13} className="text-amber-500" />
            <span>High-Priority Skill Gaps</span>
          </h4>

          <div className="flex flex-wrap gap-1.5">
            {skillGaps.map((gap, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-semibold text-[11px]"
              >
                + {gap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* LEARNING ROADMAP */}
      {learningRoadmap.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <BookOpen size={13} className="text-emerald-600" />
            <span>Recommended Learning Roadmap</span>
          </h4>

          <div className="space-y-1.5">
            {learningRoadmap.map((phase, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] space-y-1">
                <span className="font-bold text-emerald-800 block text-[10px] uppercase tracking-wider">
                  {phase.phase}
                </span>
                {Array.isArray(phase.topics) && (
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {phase.topics.join(" • ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROJECT IDEAS */}
      {projectRecommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <CheckCircle size={13} className="text-emerald-600" />
            <span>Mastery Project Showcase</span>
          </h4>

          <div className="space-y-1.5">
            {projectRecommendations.map((proj, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-[11px]">
                <strong className="text-emerald-950 block">{proj.title}</strong>
                <p className="text-slate-600 mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default CareerAnalysisCard;
