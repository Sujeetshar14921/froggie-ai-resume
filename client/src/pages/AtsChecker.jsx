import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Sparkles,
  History,
  RotateCcw,
  FileCheck,
  ShieldCheck,
  Share2,
  Download,
  Target,
  ArrowRight,
} from "lucide-react";
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

const AtsChecker = () => {
  useSEO({
    title: "AI ATS Resume Checker & Compatibility Score | froggie",
    description: "Scan your resume against any job description with froggie AI. Get a real-time ATS compatibility score, keyword density analysis, and actionable optimization suggestions.",
    keywords: "ATS score checker, resume ATS scanner, resume keyword match, free ATS score check, check resume against job description, ATS friendly score, ATS resume test",
    canonical: "https://froggie.site/app/ats-checker",
    ogImage: "https://froggie.site/og-image.png",
  });

  const { token } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const initialResumeId = searchParams.get("resumeId") || "";

  const [userResumes, setUserResumes] = useState([]);
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

  // Load detailed resume data for the selected resume
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

  // Apply All Optimizations directly to selected resume and re-run ATS benchmark
  const handleApplyOptimizations = async ({ tailoredSummary, skillsToAdd, targetRole }) => {
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
          actionLink: `/app/ats-checker?resumeId=${selectedResumeId || ""}`,
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

  // Load user resumes on mount
  useEffect(() => {
    let isMounted = true;

    const fetchResumes = async () => {
      if (!token) return;
      try {
        const data = await resumeApi.getUserResumes(token);
        if (!isMounted) return;

        setUserResumes(data.resumes || []);

        if (!initialResumeId && data.resumes && data.resumes.length > 0) {
          setSelectedResumeId(data.resumes[0]._id);
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

  // Load history
  const loadHistory = async () => {
    if (!token) return;
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

  // Run ATS Analysis
  const handleAnalyze = async () => {
    if (!token) {
      toast.error("Please log in to use the ATS Checker");
      return;
    }

    if (!selectedResumeId && !uploadedFile) {
      toast.error("Please select or upload a resume to analyze");
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 30) {
      toast.error("Please provide at least 30 characters of job description");
      return;
    }

    try {
      setIsLoading(true);
      setIsOptimizedApplied(false);

      let payload;
      if (uploadedFile) {
        payload = {
          file: uploadedFile,
          jobDescription: jobDescription.trim(),
          customJobTitle: customJobTitle.trim() || undefined,
        };
      } else {
        payload = {
          resumeId: selectedResumeId,
          jobDescription: jobDescription.trim(),
          customJobTitle: customJobTitle.trim() || undefined,
        };
      }

      const res = await atsApi.analyzeResume(payload, token);
      setReport(res.report);
      toast.success("ATS Analysis completed successfully!");

      const score = res.report?.overallScore || 0;
      if (score >= 70) {
        sendMilestoneNotification({
          title: `ATS Score: ${score}% Match! 🎯`,
          message: `Your resume scored ${score}% compatibility against ${res.report?.targetJobTitle || "job description"}.`,
          category: NOTIFICATION_CATEGORIES.ATS_AI,
          actionLink: `/app/ats-checker?resumeId=${selectedResumeId || ""}`,
          actionLabel: "View Report",
        });
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("ATS Analysis error:", err);
      toast.error(err?.response?.data?.message || err.message || "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Open past report from history
  const handleSelectHistoryReport = async (reportId) => {
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
    try {
      await atsApi.deleteReport(reportId, token);
      setHistory((prev) => prev.filter((item) => item._id !== reportId));
      toast.success("Report deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete report");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      
      {/* TOP HERO / HEADER BAR */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="size-5 sm:size-6 text-emerald-600" />
                froggie ATS Resume Checker
              </h1>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                AI semantic keyword, competency, and formatting compatibility auditor
              </p>
            </div>
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsHistoryOpen(true);
                loadHistory();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer hover:scale-102"
            >
              <History size={14} className="text-emerald-600" />
              <span>Scan History</span>
            </button>

            {report && (
              <button
                onClick={() => {
                  setReport(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer hover:scale-102"
              >
                <RotateCcw size={14} />
                <span>Re-Analyze</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        
        {/* TOP COMMAND HERO CARD */}
        <div className="relative overflow-hidden bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs group text-left">
          {/* Half-circle colorful environment auras */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/15 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-blue-500/10 via-indigo-400/5 to-transparent rounded-tr-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <Sparkles size={13} className="text-emerald-600" />
              <span>Live ATS Compatibility Auditor</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Benchmark Your Resume Against Any Job
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Discover exact keyword gaps, missing technical skills, recruiter score predictions, and 1-click ATS formatting fixes before applying.
            </p>
          </div>
        </div>

        {/* 4 MINI TELEMETRY STAT CARDS WITH COLORFUL HALF CIRCLES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left">
          {/* Card 1: Parser Accuracy */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/15 via-emerald-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Parser Standard
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <ShieldCheck size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-slate-950">
                99.8%
              </span>
              <span className="text-[10px] font-bold text-slate-400">read rate</span>
            </div>
            <p className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Standard ATS compliant
            </p>
          </div>

          {/* Card 2: Semantic Match */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/15 via-blue-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Keyword Matching
              </span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                <Target size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-blue-600">
                Real-time
              </span>
              <span className="text-[10px] font-bold text-blue-400">JD gap check</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Hard & soft skills scan
            </p>
          </div>

          {/* Card 3: Formatting Health */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/15 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Formatting Audit
              </span>
              <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                <FileCheck size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-purple-600">
                0 Traps
              </span>
              <span className="text-[10px] font-bold text-purple-400">safe layout</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              No table / header glitches
            </p>
          </div>

          {/* Card 4: 1-Click AI Fix */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/15 via-amber-500/5 to-transparent rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            <div className="flex items-center justify-between text-slate-500 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Auto-Optimize
              </span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                <Sparkles size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-amber-600">
                1-Click
              </span>
              <span className="text-[10px] font-bold text-amber-400">JD sync</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Direct resume upgrade
            </p>
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="py-8">
            <AtsLoadingState />
          </div>
        )}

        {/* INPUT MODE (WHEN NO ACTIVE REPORT OR EDITING) */}
        {!isLoading && !report && (
          <div className="space-y-6">
            <AtsInputSection
              userResumes={userResumes}
              selectedResumeId={selectedResumeId}
              onSelectResumeId={setSelectedResumeId}
              uploadedFile={uploadedFile}
              onSetUploadedFile={setUploadedFile}
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
            
            {/* AUTOMATED JD TAILORING & 1-CLICK OPTIMIZATION SUITE */}
            <AtsOptimizeSection
              report={report}
              resumeData={selectedResumeData}
              resumeId={selectedResumeId}
              jobDescription={jobDescription}
              targetRole={customJobTitle || report.jobTitle}
              onApplyOptimizations={handleApplyOptimizations}
              isApplying={isApplyingOptimizations}
              isApplied={isOptimizedApplied}
            />

            {/* 1. OVERALL SCORE GAUGE CARD */}
            <AtsScoreGauge
              score={report.overallScore}
              summary={report.summary}
            />

            {/* 2. CATEGORY BREAKDOWN BARS */}
            <AtsScoreBreakdown scores={report.scores} />

            {/* 3. SKILLS ALIGNMENT & MATCHED VS MISSING */}
            <AtsSkillsMatch skills={report.skills} />

            {/* 4. ATS KEYWORD COVERAGE */}
            <AtsKeywordsCard keywords={report.keywords} />

            {/* 5. EXPERIENCE & ROLE ALIGNMENT */}
            <AtsExperienceCard
              experience={report.experience}
              jobTitle={report.jobTitle}
              resumeTitle={report.resumeTitle}
            />

            {/* 6. STRENGTHS, IMPROVEMENTS & ATS FORMATTING ISSUES */}
            <AtsInsightsCard
              strengths={report.strengths}
              improvements={report.improvements}
              atsIssues={report.atsIssues}
              recommendations={report.recommendations}
            />

            {/* BOTTOM RE-ANALYZE BAR */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h4 className="text-base font-bold">Want to test adjustments?</h4>
                <p className="text-xs text-slate-400">
                  Update your resume in the editor or modify the target Job Description to benchmark your score again.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {selectedResumeData && (
                  <Link
                    to={`/app/builder/${selectedResumeId}`}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Open in Resume Builder</span>
                    <ArrowRight size={13} />
                  </Link>
                )}

                <button
                  onClick={() => {
                    setReport(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw size={14} />
                  <span>Modify & Re-Analyze</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* HISTORY DRAWER */}
      <AtsHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectReport={handleSelectHistoryReport}
        onDeleteReport={handleDeleteHistoryReport}
        isLoading={isHistoryLoading}
      />
    </div>
  );
};

export default AtsChecker;
