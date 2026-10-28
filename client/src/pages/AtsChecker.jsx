import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Sparkles,
  History,
  RotateCcw,
  FileCheck,
  ShieldCheck,
  Target,
  ArrowRight,
  Lock,
  X,
  LogIn,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import FrogFace from "../components/FrogLogo";
import {
  AtsScoreGauge,
  AtsScoreBreakdown,
  AtsSkillsMatch,
  AtsKeywordsCard,
  AtsExperienceCard,
  AtsInsightsCard,
  AtsInputSection,
  AtsHistoryDrawer,
  AtsLoadingState,
  AtsOptimizeSection,
} from "../components/ats";
import { resumeApi } from "../api/resumeApi";
import { atsApi } from "../api/atsApi";
import toast from "react-hot-toast";
import { useSEO } from "../hooks/useSEO";
import {
  sendMilestoneNotification,
  NOTIFICATION_CATEGORIES,
} from "../utils/browserNotification";
import TelemetryCard from "../components/common/TelemetryCard";

const AtsChecker = () => {
  useSEO({
    title: "Free AI ATS Resume Checker & Compatibility Score | froggie AI",
    description: "Scan your resume against any job description for free with froggie AI. Get instant ATS compatibility score, semantic keyword density audit, formatting analysis, and AI suggestions.",
    keywords: "ATS score checker, free ATS resume score, ATS resume scanner, check resume against job description, ATS friendly score, ATS resume test, froggie ATS, resume job match",
    canonical: "https://froggie.site/ats-checker",
    ogImage: "https://froggie.site/froggie_banner.jpg",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "froggie AI ATS Resume Score Checker",
      "url": "https://froggie.site/ats-checker",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Free AI ATS resume scanner & job match benchmark tool. Real-time ATS compatibility scoring, keyword gap analysis, and tailored optimization recommendations.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
      },
      "featureList": [
        "Free Real-time ATS Compatibility Scoring (0-100%)",
        "Job Description Semantic Gap Analysis",
        "Hard & Soft Keyword Density Audit",
        "Formatting & Parser Health Check",
        "1-Click JD Tailored Resume Optimization"
      ],
    },
  });

  const { token, user } = useSelector((state) => state.auth || {});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialResumeId = searchParams.get("resumeId") || "";

  const [userResumes, setUserResumes] = useState([]);
  const [inputTab, setInputTab] = useState(initialResumeId ? "saved" : "upload");
  const [selectedResumeId, setSelectedResumeId] = useState(initialResumeId);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [customJobTitle, setCustomJobTitle] = useState("");

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedResumeData, setSelectedResumeData] = useState(null);
  const [isApplyingOptimizations, setIsApplyingOptimizations] = useState(false);
  const [isOptimizedApplied, setIsOptimizedApplied] = useState(false);

  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load detailed resume data for the selected resume (authenticated only)
  useEffect(() => {
    if (!selectedResumeId || !token) {
      setSelectedResumeData(null);
      return;
    }
    const loadResumeDetails = async () => {
      try {
        const data = await resumeApi.getResumeById(selectedResumeId, token);
        setSelectedResumeData(data.resume);
      } catch (err) {
        console.error("Failed to load selected resume details:", err);
      }
    };
    loadResumeDetails();
  }, [selectedResumeId, token]);

  // Load user resumes on mount (authenticated only)
  useEffect(() => {
    let isMounted = true;

    const fetchResumes = async () => {
      if (!token) {
        setInputTab("upload");
        return;
      }
      try {
        const data = await resumeApi.getUserResumes(token);
        if (!isMounted) return;

        const resumes = data.resumes || [];
        setUserResumes(resumes);

        if (initialResumeId) {
          setSelectedResumeId(initialResumeId);
          setInputTab("saved");
        } else if (resumes.length > 0) {
          setSelectedResumeId((prev) => prev || resumes[0]._id);
          setInputTab((prev) => prev || "saved");
        } else {
          setInputTab("upload");
        }
      } catch (err) {
        console.error("Failed to load user resumes:", err);
      }
    };

    fetchResumes();

    return () => {
      isMounted = false;
    };
  }, [token, initialResumeId]);

  // Apply All Optimizations directly to selected resume and re-run ATS benchmark
  const handleApplyOptimizations = async ({ tailoredSummary, skillsToAdd, targetRole }) => {
    if (!token || !user) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedResumeId || !selectedResumeData) {
      toast.error("Please select a valid resume to apply optimizations.");
      return;
    }

    try {
      setIsApplyingOptimizations(true);
      const updatedResume = { ...selectedResumeData };
      if (tailoredSummary) {
        updatedResume.professional_summary = tailoredSummary;
      }
      if (Array.isArray(skillsToAdd) && skillsToAdd.length > 0) {
        updatedResume.skills = Array.from(new Set([...(updatedResume.skills || []), ...skillsToAdd]));
      }
      if (targetRole) {
        updatedResume.personal_info = {
          ...(updatedResume.personal_info || {}),
          profession: targetRole,
        };
      }

      const formData = new FormData();
      formData.append("resumeId", selectedResumeId);
      formData.append("resumeData", JSON.stringify(updatedResume));
      await resumeApi.updateResume(formData, token);

      setSelectedResumeData(updatedResume);
      setIsOptimizedApplied(true);
      toast.success("Resume strengthened with JD optimizations! Re-benchmarking ATS score...");

      // Automatically re-benchmark with the strengthened resume
      if (jobDescription && jobDescription.trim().length >= 30) {
        const payload = {
          resumeId: selectedResumeId,
          jobDescription: jobDescription.trim(),
          customJobTitle: targetRole || customJobTitle.trim() || undefined,
        };
        const res = await atsApi.analyzeResume(payload, token);
        setReport(res.report);
        toast.success("ATS Compatibility Score upgraded!");

        const upgradedScore = res.report?.overallScore || 0;
        sendMilestoneNotification({
          title: `ATS Optimized: ${upgradedScore}% 🚀`,
          message: `Your resume was upgraded with keywords and tailored content!`,
          category: NOTIFICATION_CATEGORIES.ATS_AI,
          actionLink: `/ats-checker?resumeId=${selectedResumeId || ""}`,
          actionLabel: "View Report",
        });
      }
    } catch (err) {
      console.error("Failed to apply optimizations:", err);
      toast.error("Could not save optimizations to resume.");
    } finally {
      setIsApplyingOptimizations(false);
    }
  };

  // Load history (authenticated only)
  const loadHistory = async () => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    try {
      setIsHistoryLoading(true);
      const data = await atsApi.getHistory(token);
      setHistory(data.history || []);
    } catch (err) {
      console.error("Failed to load ATS history:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Run ATS Analysis (Publicly accessible to everyone - guests and logged-in users)
  const handleAnalyze = async () => {
    if (!jobDescription || jobDescription.trim().length < 30) {
      toast.error("Please provide at least 30 characters of job description");
      return;
    }

    let payload;
    if (inputTab === "upload") {
      if (!uploadedFile) {
        toast.error("Please upload a PDF, Word DOC, or TXT resume to analyze");
        return;
      }
      payload = {
        file: uploadedFile,
        jobDescription: jobDescription.trim(),
        customJobTitle: customJobTitle.trim() || undefined,
      };
    } else {
      if (!token) {
        toast.error("Please log in to use saved resumes, or upload a resume file directly");
        setInputTab("upload");
        return;
      }
      if (!selectedResumeId) {
        toast.error("Please select a saved resume to analyze");
        return;
      }
      payload = {
        resumeId: selectedResumeId,
        jobDescription: jobDescription.trim(),
        customJobTitle: customJobTitle.trim() || undefined,
      };
    }

    try {
      setIsLoading(true);
      setIsOptimizedApplied(false);

      const res = await atsApi.analyzeResume(payload, token);
      setReport(res.report);
      toast.success("ATS Analysis completed successfully!");

      const score = res.report?.overallScore || 0;
      if (score >= 70) {
        sendMilestoneNotification({
          title: `ATS Score: ${score}% Match! 🎯`,
          message: `Your resume scored ${score}% compatibility against ${res.report?.jobTitle || "job description"}.`,
          category: NOTIFICATION_CATEGORIES.ATS_AI,
          actionLink: `/ats-checker?resumeId=${selectedResumeId || ""}`,
          actionLabel: "View Report",
        });
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("ATS Analysis error details:", err?.response?.data || err);
      toast.error(err?.response?.data?.message || err.message || "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Open past report from history
  const handleSelectHistoryReport = async (reportId) => {
    if (!token) return;
    try {
      setIsLoading(true);
      const data = await atsApi.getReportById(reportId, token);
      setReport(data.report);
      toast.success("Loaded previous ATS report");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load report");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete past report
  const handleDeleteHistoryReport = async (reportId) => {
    if (!token) return;
    try {
      await atsApi.deleteReport(reportId, token);
      setHistory((prev) => prev.filter((item) => item._id !== reportId));
      toast.success("Report deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete report");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-16 lg:pb-0 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* SUB HEADER / PAGE TITLE BAR */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="w-full px-3.5 sm:px-8 lg:px-12 xl:px-16 h-14 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-1.5 sm:gap-2">
                    <ShieldCheck className="size-4.5 sm:size-6 text-emerald-600 dark:text-emerald-400" />
                    <span>froggie ATS Resume Checker</span>
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-lg uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-500/30">
                    Free Public Audit
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Semantic keyword gap audit, ATS parser validation, and 1-click tailored suggestions
                </p>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!token) {
                    setShowAuthModal(true);
                  } else {
                    setIsHistoryOpen(true);
                    loadHistory();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer hover:scale-102 active:scale-98 border border-slate-200/60 dark:border-slate-700"
              >
                <History size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span>History</span>
              </button>

              {report && (
                <button
                  type="button"
                  onClick={() => {
                    setReport(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-700 rounded-xl transition-all cursor-pointer hover:scale-102 active:scale-98"
                >
                  <RotateCcw size={13} />
                  <span>Re-Analyze</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* MAIN AUDIT CONTAINER */}
        <main className="w-full px-3.5 sm:px-8 lg:px-12 xl:px-16 pt-4 sm:pt-8 space-y-4 sm:space-y-6">
          {/* 4 MINI TELEMETRY STAT CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-left">
            <TelemetryCard
              label="Parser Standard"
              value="99.8%"
              badge="read rate"
              icon={ShieldCheck}
              color="emerald"
              subtext="Standard ATS compliant"
            />

            <TelemetryCard
              label="Keyword Matching"
              value="Real-time"
              badge="JD gap check"
              icon={Target}
              color="blue"
              subtext="Hard & soft skills scan"
            />

            <TelemetryCard
              label="Formatting Audit"
              value="0 Traps"
              badge="safe layout"
              icon={FileCheck}
              color="purple"
              subtext="No table / header glitches"
            />

            <TelemetryCard
              label="Auto-Optimize"
              value="1-Click"
              badge="JD sync"
              icon={Sparkles}
              color="amber"
              subtext="Direct resume upgrade"
              pulseDot={true}
            />
          </div>

          {/* LOADING STATE */}
          {isLoading && (
            <div className="py-8">
              <AtsLoadingState />
            </div>
          )}

          {/* INPUT MODE */}
          {!isLoading && !report && (
            <div className="space-y-6">
              <AtsInputSection
                userResumes={userResumes}
                selectedResumeId={selectedResumeId}
                onSelectResumeId={setSelectedResumeId}
                uploadedFile={uploadedFile}
                onSetUploadedFile={setUploadedFile}
                inputTab={inputTab}
                setInputTab={(tab) => {
                  if (tab === "saved" && (!token || !user)) {
                    toast("Sign in to select from your saved resumes", { icon: "🔒" });
                    setShowAuthModal(true);
                    return;
                  }
                  setInputTab(tab);
                }}
                jobDescription={jobDescription}
                onChangeJobDescription={setJobDescription}
                customJobTitle={customJobTitle}
                onChangeCustomJobTitle={setCustomJobTitle}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* RESULTS DASHBOARD MODE */}
          {!isLoading && report && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* 1-CLICK OPTIMIZATION SUITE */}
              <AtsOptimizeSection
                report={report}
                resumeData={selectedResumeData}
                resumeId={selectedResumeId}
                jobDescription={jobDescription}
                targetRole={customJobTitle || report.jobTitle}
                onApplyOptimizations={handleApplyOptimizations}
                onPromptLogin={() => setShowAuthModal(true)}
                isGuest={!token || !user}
                isApplying={isApplyingOptimizations}
                isApplied={isOptimizedApplied}
              />

              {/* OVERALL SCORE GAUGE */}
              <AtsScoreGauge
                score={report.overallScore}
                summary={report.summary}
              />

              {/* CATEGORY BREAKDOWN BARS */}
              <AtsScoreBreakdown scores={report.scores} />

              {/* SKILLS ALIGNMENT */}
              <AtsSkillsMatch skills={report.skills} />

              {/* ATS KEYWORD COVERAGE */}
              <AtsKeywordsCard keywords={report.keywords} />

              {/* EXPERIENCE & ROLE ALIGNMENT */}
              <AtsExperienceCard
                experience={report.experience}
                jobTitle={report.jobTitle}
                resumeTitle={report.resumeTitle}
              />

              {/* STRENGTHS, IMPROVEMENTS & FORMATTING ISSUES */}
              <AtsInsightsCard
                strengths={report.strengths}
                improvements={report.improvements}
                atsIssues={report.atsIssues}
                recommendations={report.recommendations}
              />

              {/* BOTTOM RE-ANALYZE BAR */}
              <div className="p-6 sm:p-8 rounded-3xl glass-dark-elevated text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10 space-y-1 text-left">
                  <h4 className="text-base sm:text-lg font-black tracking-tight text-white">Want to test adjustments?</h4>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Update your resume or modify the target Job Description to benchmark your score again with our AI auditor.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap relative z-10 shrink-0">
                  {selectedResumeData && (
                    <Link
                      to={`/app/builder/${selectedResumeId}`}
                      className="shimmer-button px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-102 active:scale-98"
                    >
                      <span>Open in Resume Builder</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}

                  {!user && (
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(true)}
                      className="shimmer-button px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-102 active:scale-98"
                    >
                      <Sparkles size={14} />
                      <span>Create Free Account to Save</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setReport(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-2 hover:scale-102 active:scale-98"
                  >
                    <RotateCcw size={14} />
                    <span>Modify & Re-Analyze</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* AUTHENTICATION PROMPT MODAL FOR GUESTS */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="mx-auto size-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <FrogFace size={30} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Unlock 1-Click AI Resume Optimization
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Sign in or create a free froggie account to automatically inject missing keywords, strengthen your summary, and export ATS-tailored resumes with zero paywalls.
                </p>
              </div>

              <div className="space-y-2.5 text-left text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  <span>Auto-inject missing high-match keywords into your resume</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  <span>STAR-format AI professional summary rewrite</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  <span>Export high-resolution ATS PDF & Word DOCX anytime</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    navigate("/signup?redirect=/ats-checker");
                  }}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-102 active:scale-98"
                >
                  <UserPlus size={16} />
                  <span>Create Free Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    navigate("/login?redirect=/ats-checker");
                  }}
                  className="w-full py-3 px-5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Continue Viewing Free Audit
              </button>
            </div>
          </div>
        )}

        {/* HISTORY DRAWER (AUTHENTICATED ONLY) */}
        <AtsHistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onSelectReport={handleSelectHistoryReport}
          onDeleteReport={handleDeleteHistoryReport}
          isLoading={isHistoryLoading}
        />
      </div>

      <Footer />
    </div>
  );
};

export default AtsChecker;
