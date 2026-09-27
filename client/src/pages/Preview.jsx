import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  ArrowLeft,
  Users,
  ShieldCheck,
  Send,
  X,
  Sparkles,
  Copy,
} from "lucide-react";
import { resumeApi } from "../api/resumeApi";
import { exportResumeAsPdf, exportResumeAsDoc } from "../utils/exportResume";
import toast from "react-hot-toast";
import FrogFace, { BrandIcon } from "../components/FrogLogo";
import QrCodeModal from "../components/resumes/QrCodeModal";
import { useSEO } from "../hooks/useSEO";

const Preview = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const candidateName = resumeData?.personal_info?.full_name || resumeData?.title || "Candidate";
  const candidateProfession = resumeData?.personal_info?.profession || "Professional";

  const candidateSchema = React.useMemo(() => {
    if (!resumeData) return null;
    return {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "@id": `https://froggie.site/view/${resumeId}#webpage`,
      "name": `${candidateName} — ${candidateProfession}`,
      "url": `https://froggie.site/view/${resumeId}`,
      "mainEntity": {
        "@type": "Person",
        "name": candidateName,
        "jobTitle": candidateProfession,
        "description": resumeData.professional_summary || `${candidateName}'s verified resume profile on froggie`,
        "image": resumeData.personal_info?.image || resumeData.userId?.image || "https://froggie.site/og-image.png",
        "knowsAbout": resumeData.skills || [],
      },
    };
  }, [resumeData, resumeId, candidateName, candidateProfession]);

  useSEO({
    title: `${candidateName} — ${candidateProfession} | Verified Resume on froggie`,
    description: resumeData?.professional_summary
      ? `${candidateName} (${candidateProfession}): ${resumeData.professional_summary.slice(0, 150)}...`
      : `View ${candidateName}'s verified ATS-compliant resume and portfolio on froggie AI Resume Studio.`,
    keywords: `${candidateName}, ${candidateProfession}, ${Array.isArray(resumeData?.skills) ? resumeData.skills.join(", ") : ""}, verified resume, froggie portfolio`,
    canonical: `https://froggie.site/view/${resumeId}`,
    ogImage: resumeData?.personal_info?.image || resumeData?.userId?.image || "https://froggie.site/og-image.png",
    schema: candidateSchema,
  });

  const loadResume = useCallback(async () => {
    try {
      setIsLoading(true);
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

  const handleDownloadDoc = async () => {
    if (!resumeData) return;
    try {
      toast.loading("Generating ATS-clean Word (.docx)...", { id: "docx-prev-toast" });
      await resumeApi.exportDocx(resumeId, `${candidateName || "Resume"}.docx`);
      toast.success("Word (.docx) downloaded successfully! 📄", { id: "docx-prev-toast" });
    } catch (error) {
      console.error("DOCX download error:", error);
      exportResumeAsDoc(resumeData);
      toast.success("Word (.doc) downloaded successfully!", { id: "docx-prev-toast" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPublicLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Shareable resume link copied! 🔗");
    }
  };

  return resumeData ? (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* PUBLIC PREVIEW TOP BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 shadow-2xs no-print select-none">
        
        {/* BRAND IDENTITY & TALENT POOL BACK BUTTON */}
        <div className="flex items-center gap-3">
          <Link
            to="/talent"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Talent Pool</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-slate-950 transition-all group"
          >
            <BrandIcon size="xs" className="group-hover:scale-105 transition-transform" />
            <span className="font-black text-sm tracking-tight text-slate-900">
              froggie<span className="text-emerald-500">.</span>
            </span>
          </Link>

          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>Verified Public Resume</span>
          </span>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* QR CODE & SHARE SUITE BUTTON */}
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            title="Generate QR Code & Share"
          >
            <QrCode size={14} className="text-slate-700" />
            <span className="hidden sm:inline">Share</span>
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

      {/* CANDIDATE PROFILE SUMMARY BANNER (NO-PRINT) */}
      <section className="no-print max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2 text-left">
        <div className="relative overflow-hidden bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5 group">
          {/* Half circles */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-500/15 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-tr-full pointer-events-none" />

          {/* Left: Avatar & Details */}
          <div className="relative z-10 flex items-center gap-4">
            <div className="relative shrink-0">
              {resumeData.personal_info?.image || resumeData.userId?.image ? (
                <img
                  src={resumeData.personal_info?.image || resumeData.userId?.image}
                  alt={candidateName}
                  className="size-16 sm:size-20 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-xs"
                />
              ) : (
                <div
                  className="size-16 sm:size-20 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-xs"
                  style={{
                    background: `linear-gradient(135deg, ${resumeData.accent_color || "#10B981"}, #0f172a)`,
                  }}
                >
                  {candidateName.charAt(0).toUpperCase()}
                </div>
              )}
              <span
                className="absolute -bottom-1 -right-1 size-4 rounded-full bg-emerald-500 ring-2 ring-white"
                title="Open to Work"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-950">
                  {candidateName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Open to Opportunities
                </span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-600">
                {candidateProfession}
              </p>

              {/* CONTACT METADATA CHIPS */}
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap pt-0.5">
                {resumeData.personal_info?.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    {resumeData.personal_info.location}
                  </span>
                )}
                {resumeData.personal_info?.email && (
                  <a
                    href={`mailto:${resumeData.personal_info.email}`}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-semibold"
                  >
                    <Mail size={13} className="text-slate-400" />
                    {resumeData.personal_info.email}
                  </a>
                )}
                {resumeData.personal_info?.phone && (
                  <a
                    href={`tel:${resumeData.personal_info.phone}`}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-semibold"
                  >
                    <Phone size={13} className="text-slate-400" />
                    {resumeData.personal_info.phone}
                  </a>
                )}
                {resumeData.personal_info?.linkedin && (
                  <a
                    href={
                      resumeData.personal_info.linkedin.startsWith("http")
                        ? resumeData.personal_info.linkedin
                        : `https://${resumeData.personal_info.linkedin}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                  >
                    <Linkedin size={13} />
                    <span>LinkedIn</span>
                  </a>
                )}
                {resumeData.personal_info?.github && (
                  <a
                    href={
                      resumeData.personal_info.github.startsWith("http")
                        ? resumeData.personal_info.github
                        : `https://${resumeData.personal_info.github}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-slate-800 hover:text-slate-950 font-semibold"
                  >
                    <Github size={13} />
                    <span>GitHub</span>
                  </a>
                )}
                {resumeData.personal_info?.website && (
                  <a
                    href={
                      resumeData.personal_info.website.startsWith("http")
                        ? resumeData.personal_info.website
                        : `https://${resumeData.personal_info.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 hover:underline font-semibold"
                  >
                    <Globe size={13} />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Share / Copy Link Button */}
          <div className="relative z-10 flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={handleCopyPublicLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm border border-emerald-500/30 shadow-md transition-all cursor-pointer hover:scale-102"
            >
              <Copy size={15} className="text-emerald-400" />
              <span>Copy Share Link</span>
            </button>
          </div>
        </div>
      </section>

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
        candidateName={candidateName}
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
          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/talent"
              className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl px-5 py-2.5 shadow-md transition-all text-xs border border-emerald-500/30"
            >
              <Users size={14} className="text-emerald-400" />
              <span>Browse Public Talent</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl px-4 py-2.5 transition-all text-xs"
            >
              <span>Home</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
