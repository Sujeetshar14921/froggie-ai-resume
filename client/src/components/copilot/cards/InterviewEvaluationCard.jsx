import React from "react";
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight, Award, Trophy } from "lucide-react";
import { useCopilot } from "../../../hooks/useCopilot";
import FrogFace from "../../FrogLogo";

const InterviewEvaluationCard = ({ data = {} }) => {
  const { sendMessage } = useCopilot();
  const {
    overallScore = 80,
    technicalAccuracy = 80,
    communication = 80,
    structure = 80,
    whatYouDidWell = [],
    whatToImprove = [],
    betterAnswer,
    nextQuestion,
  } = data;

  const handleNextQuestion = () => {
    if (nextQuestion && nextQuestion.question) {
      sendMessage(
        `Let's proceed to question #${nextQuestion.questionNumber || 2} (${nextQuestion.questionType || "Technical"}): "${nextQuestion.question}"`,
        "START_MOCK_QUESTION",
        nextQuestion
      );
    } else {
      sendMessage("Give me the next mock interview question.");
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-emerald-200 shadow-sm p-4 sm:p-5 space-y-4 text-xs">
      
      {/* HEADER WITH SCORE */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Trophy size={16} />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">Answer Evaluation</h4>
            <span className="text-[10px] text-slate-400 font-medium">froggie Mock Interview Scoring</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-black text-emerald-700">{overallScore}</span>
          <span className="text-[10px] font-bold text-slate-400">/100</span>
        </div>
      </div>

      {/* DETAILED METRICS BARS */}
      <div className="grid grid-cols-3 gap-2 text-center pt-1">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Accuracy</span>
          <span className="font-black text-xs text-emerald-700">{technicalAccuracy}%</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Communication</span>
          <span className="font-black text-xs text-teal-700">{communication}%</span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Structure</span>
          <span className="font-black text-xs text-slate-900">{structure}%</span>
        </div>
      </div>

      {/* WHAT YOU DID WELL & WHAT TO IMPROVE */}
      <div className="space-y-2 pt-1">
        {whatYouDidWell.length > 0 && (
          <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-emerald-950 space-y-1">
            <span className="font-bold flex items-center gap-1 text-[11px] text-emerald-800">
              <CheckCircle2 size={13} className="text-emerald-600" /> What You Did Well:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1 text-[11px]">
              {whatYouDidWell.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {whatToImprove.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-amber-950 space-y-1">
            <span className="font-bold flex items-center gap-1 text-[11px] text-amber-800">
              <AlertCircle size={13} className="text-amber-600" /> What to Improve:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1 text-[11px]">
              {whatToImprove.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* BETTER ANSWER MODEL */}
      {betterAnswer && (
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-emerald-950 space-y-1">
          <span className="font-bold flex items-center gap-1 text-[11px] text-emerald-900">
            <FrogFace size={13} /> Model STAR Answer:
          </span>
          <p className="font-medium leading-relaxed text-slate-800 text-[11px]">{betterAnswer}</p>
        </div>
      )}

      {/* NEXT QUESTION BUTTON */}
      <div className="pt-2 border-t border-slate-100 flex justify-end">
        <button
          onClick={handleNextQuestion}
          className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-500/30"
        >
          <span>Practice Next Question</span>
          <ArrowRight size={13} className="text-emerald-400" />
        </button>
      </div>
    </div>
  );
};

export default InterviewEvaluationCard;
