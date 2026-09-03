import React, { useEffect, useRef, useState } from "react";
import { Sparkles, User, Loader2, Copy, Check } from "lucide-react";
import FrogFace, { BrandIcon } from "../FrogLogo";
import { useCopilot } from "../../hooks/useCopilot";
import CopilotQuickActions from "./CopilotQuickActions";
import ResumeSuggestionCard from "./cards/ResumeSuggestionCard";
import JobAnalysisCard from "./cards/JobAnalysisCard";
import ShouldIApplyCard from "./cards/ShouldIApplyCard";
import MockInterviewCard from "./cards/MockInterviewCard";
import InterviewEvaluationCard from "./cards/InterviewEvaluationCard";
import CoverLetterCard from "./cards/CoverLetterCard";
import RecruiterMessageCard from "./cards/RecruiterMessageCard";
import CredibilityCard from "./cards/CredibilityCard";
import DirectResumeUpdateCard from "./cards/DirectResumeUpdateCard";
import InChatAtsCard from "./cards/InChatAtsCard";
import ActionResultCard from "./cards/ActionResultCard";
import ConfirmationCard from "./cards/ConfirmationCard";
import FileListCard from "./cards/FileListCard";
import CareerAnalysisCard from "./cards/CareerAnalysisCard";
import LinkedInProfileCard from "./cards/LinkedInProfileCard";
import toast from "react-hot-toast";

/**
 * Format markdown-like text (bold, list items, paragraphs, headers) cleanly
 */
const FormattedMessageText = ({ text = "" }) => {
  if (!text) return null;

  let cleanText = typeof text === "string" ? text.trim() : "";

  // 1. If text is a stringified JSON object, parse and extract human readable content
  if (cleanText.startsWith("{") || cleanText.startsWith("[")) {
    try {
      const parsed = JSON.parse(cleanText);
      cleanText =
        parsed.content ||
        parsed.message ||
        parsed.summary ||
        parsed.summaryOfChanges ||
        parsed.explanation ||
        "I have prepared your updates below.";
    } catch {
      cleanText = cleanText.replace(/```(?:json)?[\s\S]*?```/gi, "").trim();
    }
  } else {
    cleanText = cleanText.replace(/```(?:json)?[\s\S]*?```/gi, "").trim();
  }

  const lines = cleanText.split("\n");

  return (
    <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-slate-800 font-normal">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1.5" />;

        // Skip raw JSON property lines
        if (
          trimmed.startsWith('{"') ||
          trimmed.startsWith('"{') ||
          trimmed === "}" ||
          trimmed === "}," ||
          trimmed.startsWith('"updates":') ||
          trimmed.startsWith('"skills":') ||
          trimmed.startsWith('"personal_info":')
        ) {
          return null;
        }

        // Header ###
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-extrabold text-xs sm:text-sm text-slate-900 pt-2 pb-1 border-b border-slate-100 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>{trimmed.replace("### ", "")}</span>
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="font-black text-sm sm:text-base text-slate-950 pt-2.5 pb-1">
              {trimmed.replace("## ", "")}
            </h3>
          );
        }

        // Bullet point
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const bulletContent = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 text-slate-700">
              <span className="size-1.5 rounded-full bg-emerald-600 mt-2 shrink-0 shadow-xs" />
              <span className="flex-1 leading-relaxed">{renderBoldSpans(bulletContent)}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 text-slate-700">
              <span className="size-5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                {numMatch[1]}
              </span>
              <span className="flex-1 leading-relaxed">{renderBoldSpans(numMatch[2])}</span>
            </div>
          );
        }

        // Regular paragraph
        return <p key={idx} className="text-slate-700 leading-relaxed">{renderBoldSpans(trimmed)}</p>;
      })}
    </div>
  );
};

// Helper to convert **text** to <strong>
const renderBoldSpans = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-slate-950">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

const CopilotMessageList = () => {
  const { messages = [], isTyping, user } = useCopilot();
  const bottomRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderStructuredCard = (cardType, cardData) => {
    if (!cardData || cardType === "none") return null;

    switch (cardType) {
      case "resume_suggestion":
        return <ResumeSuggestionCard data={cardData} />;
      case "job_analysis":
        return <JobAnalysisCard data={cardData} />;
      case "should_i_apply":
        return <ShouldIApplyCard data={cardData} />;
      case "mock_interview":
        return <MockInterviewCard data={cardData} />;
      case "interview_evaluation":
        return <InterviewEvaluationCard data={cardData} />;
      case "cover_letter":
        return <CoverLetterCard data={cardData} />;
      case "recruiter_message":
        return <RecruiterMessageCard data={cardData} />;
      case "credibility_check":
        return <CredibilityCard data={cardData} />;
      case "direct_resume_update":
        return <DirectResumeUpdateCard data={cardData} />;
      case "in_chat_ats_score":
        return <InChatAtsCard data={cardData} />;
      case "action_result":
        return <ActionResultCard data={cardData} />;
      case "confirm_action":
        return <ConfirmationCard data={cardData} />;
      case "file_list":
        return <FileListCard data={cardData} />;
      case "career_analysis":
        return <CareerAnalysisCard data={cardData} />;
      case "linkedin_profile":
        return <LinkedInProfileCard data={cardData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar hide-scrollbar bg-gradient-to-b from-slate-50/60 via-slate-50/30 to-white">
      {/* ZERO STATE: SHOW QUICK ACTIONS */}
      {messages.length === 0 && (
        <div className="animate-in fade-in duration-300">
          <CopilotQuickActions />
        </div>
      )}

      {/* MESSAGE STREAM */}
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";

        return (
          <div
            key={index}
            className={`flex items-start gap-3 group ${
              isUser ? "flex-row-reverse" : "flex-row"
            } animate-in fade-in duration-200`}
          >
            {/* AVATAR */}
            {isUser ? (
              <div className="size-8 rounded-2xl bg-slate-950 text-white flex items-center justify-center shrink-0 text-xs font-black shadow-md shadow-slate-950/20 border border-slate-800 ring-2 ring-white">
                {user?.name?.charAt(0)?.toUpperCase() || <User size={14} />}
              </div>
            ) : (
              <div className="relative shrink-0">
                <BrandIcon size="sm" />
              </div>
            )}

            {/* CONTENT BUBBLE & CARDS */}
            <div
              className={`max-w-[88%] sm:max-w-[85%] space-y-2.5 ${
                isUser ? "text-right" : "text-left"
              }`}
            >
              {/* TEXT CONTENT */}
              {msg.content && (
                <div className="relative group/bubble">
                  <div
                    className={`p-4 sm:p-5 rounded-3xl ${
                      isUser
                        ? "bg-slate-950 text-white font-medium rounded-tr-xs shadow-md shadow-slate-950/20 text-left border border-slate-800/90"
                        : "bg-white text-slate-800 border border-slate-200/90 shadow-xs hover:shadow-sm transition-shadow rounded-tl-xs"
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-line text-xs sm:text-sm leading-relaxed">{msg.content}</p>
                    ) : (
                      <FormattedMessageText text={msg.content} />
                    )}
                  </div>

                  {/* HOVER COPY BUTTON ON ASSISTANT RESPONSES */}
                  {!isUser && (
                    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(msg.content, index)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-slate-700 bg-white border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
                        title="Copy text"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check size={11} className="text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* DYNAMIC STRUCTURED CARD */}
              {!isUser && msg.cardType && msg.cardType !== "none" && (
                <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {renderStructuredCard(msg.cardType, msg.cardData)}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* AI TYPING INDICATOR */}
      {isTyping && (
        <div className="flex items-start gap-3 animate-in fade-in duration-150">
          <div className="relative shrink-0">
            <BrandIcon size="sm" />
          </div>

          <div className="p-3.5 sm:p-4 rounded-3xl bg-white border border-emerald-200/80 shadow-xs rounded-tl-xs flex items-center gap-3 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="size-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="size-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-slate-600 font-medium">froggie is analyzing & generating recommendation...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default CopilotMessageList;
