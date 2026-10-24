import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Loader2,
  FileCheck,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import CertificationForm from "../components/CertificationForm";
import AchievementForm from "../components/AchievementForm";
import LanguagesForm from "../components/LanguagesForm";
import PersonalDetailsForm from "../components/PersonalDetailsForm";
import DeclarationForm from "../components/DeclarationForm";
import CustomSectionsForm from "../components/CustomSectionsForm";
import { BuilderHeader, BuilderStepper, BuilderToolbar } from "../components/builder";
import { UploadResumeModal } from "../components/dashboard";
import { VersionHistoryModal } from "../components/resumes";
import { useResume } from "../hooks/useResume";
import { BUILDER_SECTIONS } from "../constants/sections";
import { exportResumeAsPdf, exportResumeAsDoc } from "../utils/exportResume";
import { resumeApi } from "../api/resumeApi";
import { useSEO } from "../hooks/useSEO";
import { aiApi } from "../api/aiApi";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const {
    resumeData,
    setResumeData,
    isLoading,
    isSaving,
    removeBackground,
    setRemoveBackground,
    saveResume,
    toggleVisibility,
    shareResume,
  } = useResume(resumeId);

  useSEO({
    title: resumeData?.title ? `${resumeData.title} | froggie Resume Editor` : "AI Resume Editor & Builder | froggie",
    description: "Design, enhance, and optimize your resume with froggie AI Resume Studio. Includes ATS keyword tailoring, real-time live preview, and multi-format export.",
  });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [autoFitSinglePage, setAutoFitSinglePage] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle in-builder resume file import (PDF / DOC / DOCX)
  const handleImportResume = async ({ file, title }, onSuccess) => {
    try {
      setIsUploading(true);
      const data = await aiApi.uploadResumePdf({ file, title, resumeId }, token);
      if (data && data.resume) {
        setResumeData(data.resume);
        toast.success("Resume parsed! All details loaded into live visual preview.");
      }
      setShowUploadModal(false);
      onSuccess?.();
    } catch (error) {
      console.error("Import resume error:", error);
      toast.error(error?.response?.data?.message || "Failed to parse resume document");
    } finally {
      setIsUploading(false);
    }
  };



  // Derive active builder section tabs
  const orderedBuilderSections = React.useMemo(() => {
    const customSecList = Array.isArray(resumeData?.custom_sections) ? resumeData.custom_sections : [];

    const dynamicCustomSections =
      customSecList.length > 1
        ? customSecList.map((sec, idx) => ({
            id: `custom_${idx}`,
            customIndex: idx,
            name: sec.title || `Custom #${idx + 1}`,
            icon: Layers,
          }))
        : [
            {
              id: "custom_sections",
              customIndex: 0,
              name: customSecList[0]?.title || "Custom Sections",
              icon: Layers,
            },
          ];

    const sectionMap = Object.fromEntries([
      ...BUILDER_SECTIONS.map((s) => [s.id, s]),
      ...dynamicCustomSections.map((s) => [s.id, s]),
    ]);

    const userOrder = Array.isArray(resumeData?.section_order) && resumeData.section_order.length > 0
      ? resumeData.section_order
      : [];

    const baseOrder = userOrder.includes("personal") ? userOrder : ["personal", ...userOrder];

    let expandedOrder = [];
    baseOrder.forEach((id) => {
      if (id === "custom_sections" && dynamicCustomSections.length > 1) {
        expandedOrder.push(...dynamicCustomSections.map((s) => s.id));
      } else {
        expandedOrder.push(id);
      }
    });

    const defaultIds = [
      ...BUILDER_SECTIONS.filter((s) => s.id !== "custom_sections").map((s) => s.id),
      ...dynamicCustomSections.map((s) => s.id),
    ];

    const fullOrder = [...new Set([...expandedOrder, ...defaultIds])];

    return fullOrder.map((id) => sectionMap[id]).filter(Boolean);
  }, [resumeData?.section_order, resumeData?.custom_sections]);

  const activeSection = orderedBuilderSections[activeSectionIndex] || orderedBuilderSections[0] || BUILDER_SECTIONS[0];

  const handleReorderSections = (newSections) => {
    const currentActiveId = activeSection?.id;
    const newSectionIds = newSections.map((s) => s.id);

    const newActiveIndex = newSectionIds.indexOf(currentActiveId);
    if (newActiveIndex !== -1) {
      setActiveSectionIndex(newActiveIndex);
    }

    const updatedOrder = newSectionIds
      .filter((id) => id !== "personal")
      .map((id) => (id.startsWith("custom_") ? "custom_sections" : id));

    const deduplicatedOrder = [...new Set(updatedOrder)];

    setResumeData((prev) => ({
      ...prev,
      section_order: deduplicatedOrder,
    }));
    toast.success("Section reordered! Live preview updated.", { id: "sec-reorder", duration: 1200 });
  };

  // Handle Export (PDF, DOCX, & Legacy DOC)
  const handleDownload = async (type = "pdf") => {
    setIsExporting(true);

    try {
      if (type === "docx") {
        toast.loading("Generating ATS-clean Word (.docx)...", { id: "docx-toast" });
        await resumeApi.exportDocx(resumeId, `${resumeData?.title || "Resume"}.docx`);
        toast.success("Word (.docx) downloaded successfully! 📄", { id: "docx-toast" });
        return;
      }

      if (type === "doc") {
        exportResumeAsDoc(resumeData);
        toast.success("Word (.doc) file downloaded successfully");
        return;
      }

      // PDF Export
      const previewNode =
        document.getElementById("resume-preview") ||
        document.getElementById("resume-export-content") ||
        document.getElementById("resume-pages-container");

      if (!previewNode) {
        toast.error("Preview is not ready yet. Please wait a moment.");
        return;
      }

      await exportResumeAsPdf(previewNode, resumeData);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error(error.message || "Download failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="lg:h-screen lg:max-h-screen flex flex-col bg-slate-100/80 dark:bg-[#070b14] overflow-x-hidden">
      {/* TOP COMPACT NAVBAR */}
      <BuilderHeader
        title={resumeData.title}
        isPublic={resumeData.public}
        isLoading={isLoading}
        isSaving={isSaving}
        isExporting={isExporting}
        onSave={saveResume}
        onToggleVisibility={toggleVisibility}
        onShare={shareResume}
        onDownload={handleDownload}
        onOpenHistory={() => setShowHistoryModal(true)}
        resumeId={resumeId}
      />

      {/* MAIN 2-PANEL WORKSPACE */}
      <main className="resume-builder-workspace flex-1 min-h-0 px-3 sm:px-6 lg:px-10 xl:px-12 py-3 sm:py-4 overflow-hidden">
        <div className="w-full h-full min-h-0">
          <div className="grid lg:grid-cols-12 gap-4 sm:gap-5 h-full min-h-0">
            
            {/* LEFT PANEL - UI FORM EDITOR */}
            <section className="builder-form-panel no-print lg:col-span-5 h-full flex flex-col min-h-0 bg-white dark:bg-[#0c1424] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden relative">
              
              {/* STEP PROGRESS & ICONS WITH DRAG-AND-DROP REORDERING */}
              <BuilderStepper
                sections={orderedBuilderSections}
                activeSectionIndex={activeSectionIndex}
                onSelectSection={setActiveSectionIndex}
                onReorderSections={handleReorderSections}
              />

            {/* SECTION TOOLBAR (TEMPLATES, COLORS, NAV) */}
            <BuilderToolbar
              template={resumeData.template}
              accentColor={resumeData.accent_color}
              activeSectionIndex={activeSectionIndex}
              totalSections={orderedBuilderSections.length}
              onChangeTemplate={(template) => setResumeData((prev) => ({ ...prev, template }))}
              onChangeAccentColor={(accent_color) => setResumeData((prev) => ({ ...prev, accent_color }))}
              onPrevSection={() => setActiveSectionIndex((prev) => Math.max(prev - 1, 0))}
              onNextSection={() =>
                setActiveSectionIndex((prev) => Math.min(prev + 1, orderedBuilderSections.length - 1))
              }
            />

            {/* SCROLLABLE FORM CONTENT */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 no-scrollbar hide-scrollbar">
              {isLoading ? (
                <div className="space-y-4 animate-pulse pt-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-10 bg-slate-100 rounded-xl" />
                  <div className="h-10 bg-slate-100 rounded-xl" />
                  <div className="h-24 bg-slate-100 rounded-xl" />
                </div>
              ) : (
                <div className="space-y-6">
                  {activeSection.id === "personal" && (
                    <PersonalInfoForm
                      data={resumeData.personal_info}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, personal_info: data }))}
                      removeBackground={removeBackground}
                      setRemoveBackground={setRemoveBackground}
                    />
                  )}

                  {activeSection.id === "summary" && (
                    <ProfessionalSummaryForm
                      data={resumeData.professional_summary}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, professional_summary: data }))}
                      setResumeData={setResumeData}
                    />
                  )}

                  {activeSection.id === "experience" && (
                    <ExperienceForm
                      data={resumeData.experience}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))}
                    />
                  )}

                  {activeSection.id === "education" && (
                    <EducationForm
                      data={resumeData.education}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, education: data }))}
                    />
                  )}

                  {activeSection.id === "projects" && (
                    <ProjectForm
                      data={resumeData.project}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, project: data }))}
                    />
                  )}

                  {activeSection.id === "skills" && (
                    <SkillsForm
                      data={resumeData.skills}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, skills: data }))}
                    />
                  )}

                  {activeSection.id === "certifications" && (
                    <CertificationForm
                      data={resumeData.certifications || []}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, certifications: data }))}
                    />
                  )}

                  {activeSection.id === "achievements" && (
                    <AchievementForm
                      data={resumeData.achievements || []}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, achievements: data }))}
                    />
                  )}

                  {activeSection.id === "languages" && (
                    <LanguagesForm
                      data={resumeData.languages || []}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, languages: data }))}
                    />
                  )}

                  {activeSection.id === "personal_details" && (
                    <PersonalDetailsForm
                      data={resumeData.personal_details || {}}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, personal_details: data }))}
                    />
                  )}

                  {activeSection.id === "declaration" && (
                    <DeclarationForm
                      data={resumeData.declaration || {}}
                      candidateName={resumeData?.personal_info?.full_name}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, declaration: data }))}
                    />
                  )}

                  {(activeSection.id === "custom_sections" || (activeSection.id && activeSection.id.startsWith("custom_"))) && (
                    <CustomSectionsForm
                      data={resumeData.custom_sections || []}
                      activeCustomIndex={activeSection.customIndex ?? 0}
                      onChange={(data) => setResumeData((prev) => ({ ...prev, custom_sections: data }))}
                    />
                  )}
                </div>
              )}
            </div>

            {/* FIXED BOTTOM FOOTER OF FORM */}
            <div className="shrink-0 p-3 sm:px-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <button
                  type="button"
                  onClick={() => setActiveSectionIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={activeSectionIndex === 0}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Previous Section"
                >
                  <ChevronLeft className="size-3.5" />
                  <span className="hidden sm:inline">Prev</span>
                </button>

                <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px] truncate">
                  {activeSectionIndex + 1}/{orderedBuilderSections.length}:{" "}
                  <strong className="text-slate-800 dark:text-slate-200">{activeSection?.name}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeSectionIndex < orderedBuilderSections.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveSectionIndex((prev) => Math.min(prev + 1, orderedBuilderSections.length - 1))}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800 transition-all cursor-pointer"
                    title="Next Section"
                  >
                    <span>Next</span>
                    <ChevronRight className="size-3.5" />
                  </button>
                )}

                <button
                  onClick={saveResume}
                  disabled={isSaving || isLoading}
                  className="shimmer-button flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold px-3.5 sm:px-4 py-1.5 rounded-lg transition-all shadow-xs disabled:opacity-60 cursor-pointer hover:scale-102 active:scale-98"
                >
                  {isSaving && <Loader2 className="size-3.5 animate-spin" />}
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT PANEL - LIVE VISUAL PREVIEW STUDIO */}
          <section className="lg:col-span-7 h-full flex flex-col min-h-0 bg-slate-100/90 dark:bg-[#0b1120] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 p-2.5 sm:p-4 shadow-xs overflow-hidden max-lg:min-h-[600px] relative">
            {/* STUDIO TOP TOOLBAR */}
            <div className="flex items-center justify-between pb-3 px-1 shrink-0 select-none gap-2 flex-wrap">
              {/* REAL-TIME SYNC BADGE */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Live Visual Preview</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">• Real-time Sync</span>
              </div>

              {/* CONTROLS: ZOOM & AUTO-FIT 1-PAGE */}
              <div className="flex items-center gap-2">
                {/* ZOOM CONTROLS */}
                <div className="flex items-center bg-white/95 dark:bg-slate-800/90 rounded-xl border border-slate-200/90 dark:border-slate-700/80 p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPreviewZoom((z) => Math.max(Number((z - 0.1).toFixed(1)), 0.6))}
                    disabled={previewZoom <= 0.6}
                    title="Zoom Out"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom(1)}
                    title="Reset to 100%"
                    className="px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {Math.round(previewZoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewZoom((z) => Math.min(Number((z + 0.1).toFixed(1)), 1.4))}
                    disabled={previewZoom >= 1.4}
                    title="Zoom In"
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ZoomIn size={13} />
                  </button>
                </div>

                {/* AUTO-FIT 1-PAGE TOGGLE BUTTON */}
                <button
                  type="button"
                  onClick={() => setAutoFitSinglePage((prev) => !prev)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                    autoFitSinglePage
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                      : "bg-white/95 dark:bg-slate-800/90 hover:bg-white text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700 hover:border-emerald-300"
                  }`}
                  title="Automatically compress vertical spacing to guarantee everything fits on exactly 1 page"
                >
                  <FileCheck size={13} className={autoFitSinglePage ? "text-white" : "text-emerald-600 dark:text-emerald-400"} />
                  <span>Auto-Fit 1-Page</span>
                  {autoFitSinglePage && (
                    <span className="size-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              </div>
            </div>

            {/* MAIN PREVIEW CANVAS VIEWPORT */}
            <div className="flex-1 min-h-0 overflow-y-auto rounded-xl sm:rounded-2xl no-scrollbar hide-scrollbar">
              <ResumePreview
                data={resumeData}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
                autoFitSinglePage={autoFitSinglePage}
                zoom={previewZoom}
                hideHeaderBadge={true}
              />
            </div>
          </section>
          </div>
        </div>
      </main>

      {/* UPLOAD / IMPORT RESUME MODAL */}
      <UploadResumeModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleImportResume}
        isLoading={isUploading}
      />

      {/* VERSION HISTORY & SNAPSHOT ROLLBACK MODAL */}
      <VersionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        resumeId={resumeId}
        token={token}
        onRestored={(restoredResume) => {
          setResumeData(restoredResume);
        }}
      />
    </div>
  );
};

export default ResumeBuilder;
