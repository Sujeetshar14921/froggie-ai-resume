import React, { useState } from "react";
import { HelpCircle, Send, Sparkles, Lightbulb } from "lucide-react";
import { useCopilot } from "../../../hooks/useCopilot";
import toast from "react-hot-toast";
import FrogFace from "../../FrogLogo";

const MockInterviewCard = ({ data = {} }) => {
  const { sendMessage, isTyping } = useCopilot();
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);

  const {
    questionNumber = 1,
    totalQuestions = 5,
    questionType = "Technical",
    question,
    contextFromResume,
    hint,
  } = data;

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      toast.error("Please enter your response before submitting");
      return;
    }

    const payloadText = `[MOCK INTERVIEW ANSWER to Question #${questionNumber} (${questionType})]:\n"${question}"\n\nCandidate Answer:\n"${answer.trim()}"`;
    sendMessage(payloadText, "EVALUATE_MOCK_ANSWER", { question, answer: answer.trim(), questionNumber });
    setAnswer("");
  };

  return (
    <div className="rounded-2xl bg-white border border-emerald-200 shadow-sm p-4 sm:p-5 space-y-4 text-xs">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-extrabold uppercase tracking-wider text-[10px] border border-emerald-200">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
            {questionType}
          </span>
        </div>

        {hint && (
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Lightbulb size={12} />
            <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
          </button>
        )}
      </div>

      {/* QUESTION PROMPT */}
      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
        <p className="font-extrabold text-sm text-emerald-950 leading-relaxed">
          "{question}"
        </p>

        {contextFromResume && (
          <p className="text-[11px] text-emerald-800 italic">
            📌 Why asked: {contextFromResume}
          </p>
        )}
      </div>

      {/* HINT POPUP */}
      {showHint && hint && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] flex items-start gap-2">
          <Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong>Interviewer Tip: </strong> {hint}
          </span>
        </div>
      )}

      {/* ANSWER FORM */}
      <form onSubmit={handleSubmitAnswer} className="space-y-2 pt-1">
        <label className="block text-[11px] font-bold text-slate-700">
          Your Answer (Use the STAR method: Situation, Task, Action, Result):
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={4}
          placeholder="Type how you would answer this question in an interview..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none leading-relaxed"
          disabled={isTyping}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isTyping || !answer.trim()}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-emerald-500/30"
          >
            <Send size={12} className="text-emerald-400" />
            <span>Submit Answer for froggie Evaluation</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MockInterviewCard;
