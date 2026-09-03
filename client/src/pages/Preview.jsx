import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ResumePreview from "../components/ResumePreview";
import Loader from "../components/Loader";
import {
  Download,
  Printer,
  FileText,
  Loader2,
  QrCode,
  Share2,
  CheckCircle2,
  ExternalLink,
  Eye,
} from "lucide-react";
import { resumeApi } from "../api/resumeApi";
import { exportResumeAsPdf, exportResumeAsDoc } from "../utils/exportResume";
import toast from "react-hot-toast";
import FrogFace, { BrandIcon } from "../components/FrogLogo";
import QrCodeModal from "../components/resumes/QrCodeModal";
import { useSEO } from "../hooks/useSEO";

const Preview = () => {
  const { resumeId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useSEO({
    title: resumeData?.title
      ? `${resumeData.title} | Public Resume Portfolio`
      : "Resume Portfolio | froggie",
    description: resumeData?.professional_summary
      ? resumeData.professional_summary.slice(0, 160)
      : "View and export this professional ATS-optimized resume created with froggie AI Resume Studio.",
  });

  const loadResume = useCallback(async () => {
    try {
      const data = await resumeApi.getPublicResumeById(resumeId);
      setResumeData(data.resume);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  const handleDownloadPdf = async () => {
    if (!resumeData) return;
    setIsExporting(true);
    try {
      const previewNode =
        document.getElementById("resume-preview") ||
        document.getElementById("resume-export-content") ||
        document.getElementById("resume-pages-container");

      if (!previewNode) {
        toast.error("Resume preview is not ready.");
        return;
      }

      await exportResumeAsPdf(previewNode, resumeData);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error(error.message || "Failed to download PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadDoc = () => {
    if (!resumeData) return;
    try {
      exportResumeAsDoc(resumeData);
      toast.success("Word (.doc) downloaded successfully!");
    } catch (error) {
      console.error("DOC download error:", error);
      toast.error(error.message || "Failed to download Word document.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return resumeData ? (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* PUBLIC PREVIEW TOP BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 shadow-2xs no-print select-none">
        
        {/* BRAND IDENTITY */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-slate-950 transition-all group"
          >
            <BrandIcon size="xs" className="group-hover:scale-105 transition-transform" />
            <span className="font-black text-sm tracking-tight text-slate-900">
              froggie<span className="text-emerald-500">.</span>
            </span>
          </Link>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold">
            <Eye size={11} className="text-emerald-600" />
            <span>Recruiter Portfolio View</span>
          </span>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* QR CODE & SHARE SUITE BUTTON */}
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 text-xs font-bold transition-all border border-emerald-400/40 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            title="Generate QR Code & Share"
          >
            <QrCode size={14} className="text-emerald-600" />
            <span className="hidden sm:inline">QR Code & Share</span>
            <span className="sm:hidden">Share</span>
          </button>

          <button
            onClick={handleDownloadDoc}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
            title="Download as Word DOC"
          >
            <FileText size={14} />
            <span className="hidden md:inline">Word DOC</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer size={14} />
            <span className="hidden md:inline">Print</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer border border-emerald-500/30"
          >
            {isExporting ? (
              <Loader2 size={14} className="animate-spin text-emerald-400" />
            ) : (
              <Download size={14} className="text-emerald-400" />
            )}
            <span>{isExporting ? "Exporting..." : "Download PDF"}</span>
          </button>
        </div>
      </header>

      {/* PREVIEW CONTAINER */}
      <main className="flex-1 py-6 px-2 sm:px-6 flex justify-center">
        <div className="w-full max-w-[210mm]">
          <ResumePreview
            data={resumeData}
            template={resumeData.template}
            accentColor={resumeData.accent_color}
          />
        </div>
      </main>

      {/* QR CODE & MULTI-CHANNEL SHARE MODAL */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        resumeTitle={resumeData.title || "Candidate Resume"}
        candidateName={resumeData.personal_info?.full_name || "Candidate"}
        shareUrl={window.location.href}
      />
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <BrandIcon size="xl" className="mb-2" />
          <p className="text-2xl font-black text-slate-800">Resume Not Found or Private</p>
          <p className="text-xs text-slate-500 max-w-sm">
            This resume may have been set to private by its author or the link has expired.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl px-5 py-2.5 shadow-md transition-all text-xs border border-emerald-500/30"
          >
            <span>Back to froggie Home</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Preview;
