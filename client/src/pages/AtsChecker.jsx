import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Sparkles,
  History,
  RotateCcw,
  FileCheck,
  LayoutDashboard,
  ShieldCheck,
  Share2,
  Download,
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
} from "../components/ats";
import { resumeApi } from "../api/resumeApi";
import { atsApi } from "../api/atsApi";
import toast from "react-hot-toast";
import { useSEO } from "../hooks/useSEO";

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

  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

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
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-all"
            >
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </Link>

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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Re-Analyze</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* LOADING STATE */}
        {isLoading && (
          <div className="py-8">
            <AtsLoadingState />
          </div>
        )}

        {/* INPUT MODE (WHEN NO ACTIVE REPORT OR EDITING) */}
        {!isLoading && !report && (
          <div className="space-y-8">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
                Live ATS Compatibility Audit
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Benchmark Your Resume Against Any Job
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Discover exact keyword gaps, missed technical skills, and ATS formatting flags before applying.
              </p>
            </div>

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

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setReport(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
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
