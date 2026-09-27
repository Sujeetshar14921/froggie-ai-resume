import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2, Eye, Terminal, ShieldCheck, FileCheck, Layers } from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import AtsXRayScanner from "../components/ats/AtsXRayScanner";
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
import { useCopilot } from "../hooks/useCopilot";
import { useSEO } from "../hooks/useSEO";
import { aiApi } from "../api/aiApi";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const {
    setActiveResumeId,
    setActiveResumeData,
    registerApplyHandler,
    registerDirectUpdateHandler,
  } = useCopilot();

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
  const [previewMode, setPreviewMode] = useState("visual"); // "visual" | "xray"
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
        setActiveResumeData(data.resume);
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

  // Sync active resume with Career Copilot
  React.useEffect(() => {
    if (resumeId) setActiveResumeId(resumeId);
  }, [resumeId, setActiveResumeId]);

  React.useEffect(() => {
    if (resumeData) setActiveResumeData(resumeData);
  }, [resumeData, setActiveResumeData]);

  // Handle Apply to Resume from AI Copilot suggestions
  React.useEffect(() => {
    registerApplyHandler((section, text, index) => {
      setResumeData((prev) => {
        const next = { ...prev };
        const sec = (section || "").toLowerCase();

        if (sec.includes("summary")) {
          next.professional_summary = typeof text === "string" ? text : String(text || "");
        } else if (sec.includes("skill")) {
          const newSkills = Array.isArray(text)
            ? text
            : typeof text === "string"
            ? text.split(/,\s*|\n/).map((s) => s.trim()).filter(Boolean)
            : [];
          next.skills = Array.from(new Set([...(prev.skills || []), ...newSkills]));
        } else if (sec.includes("exp")) {
          const expCopy = [...(prev.experience || [])];
          if (typeof text === "object" && text !== null && !Array.isArray(text)) {
            if (index >= 0 && index < expCopy.length) {
              expCopy[index] = { ...expCopy[index], ...text };
            } else {
              expCopy.push(text);
            }
          } else if (index >= 0 && index < expCopy.length) {
            expCopy[index] = { ...expCopy[index], description: text };
          } else if (expCopy.length > 0) {
            expCopy[0] = { ...expCopy[0], description: text };
          } else {
            expCopy.push({ position: "Role", company: "Company", description: text, is_current: true });
          }
          next.experience = expCopy;
        } else if (sec.includes("proj")) {
          const projCopy = [...(prev.project || [])];
          if (typeof text === "object" && text !== null && !Array.isArray(text)) {
            if (index >= 0 && index < projCopy.length) {
              projCopy[index] = { ...projCopy[index], ...text };
            } else {
              projCopy.push(text);
            }
          } else if (index >= 0 && index < projCopy.length) {
            projCopy[index] = { ...projCopy[index], description: text };
          } else if (projCopy.length > 0) {
            projCopy[0] = { ...projCopy[0], description: text };
          } else {
            projCopy.push({ name: "New Project", description: text, type: "Full Stack" });
          }
          next.project = projCopy;
        } else if (sec.includes("cert")) {
          const certCopy = [...(prev.certifications || [])];
          if (typeof text === "object" && text !== null) {
            certCopy.push(text);
          } else if (typeof text === "string") {
            certCopy.push({ name: text, issuer: "Certified Authority", date: new Date().toISOString().slice(0, 7) });
          }
          next.certifications = certCopy;
        } else if (sec.includes("achieve")) {
          const achCopy = [...(prev.achievements || [])];
          if (typeof text === "object" && text !== null) {
            achCopy.push(text);
          } else if (typeof text === "string") {
            achCopy.push({ title: text, description: text, date: new Date().toISOString().slice(0, 7) });
          }
          next.achievements = achCopy;
        }

        setActiveResumeData(next);
        return next;
      });
    });

    // Direct multi-field updates
    registerDirectUpdateHandler((updates) => {
      if (!updates || typeof updates !== "object") return;

      setResumeData((prev) => {
        const next = { ...prev };

        if (updates.personal_info && typeof updates.personal_info === "object") {
          next.personal_info = { ...next.personal_info, ...updates.personal_info };
        }
        if (updates.profession) {
          next.personal_info = { ...next.personal_info, profession: updates.profession };
        }
        if (updates.full_name) {
          next.personal_info = { ...next.personal_info, full_name: updates.full_name };
        }
        if (updates.email) {
          next.personal_info = { ...next.personal_info, email: updates.email };
        }
        if (updates.phone) {
          next.personal_info = { ...next.personal_info, phone: updates.phone };
        }
        if (updates.location) {
          next.personal_info = { ...next.personal_info, location: updates.location };
        }
        if (updates.github) {
          next.personal_info = { ...next.personal_info, github: updates.github };
        }
        if (updates.linkedin) {
          next.personal_info = { ...next.personal_info, linkedin: updates.linkedin };
        }
        if (updates.website) {
          next.personal_info = { ...next.personal_info, website: updates.website };
        }

        if (updates.professional_summary !== undefined) {
          next.professional_summary = updates.professional_summary;
        } else if (updates.summary !== undefined) {
          next.professional_summary = updates.summary;
        }

        if (Array.isArray(updates.skills)) {
          next.skills = updates.skills;
        } else if (typeof updates.skills === "string") {
          const splitSkills = updates.skills.split(/,\s*|\n/).map((s) => s.trim()).filter(Boolean);
          next.skills = Array.from(new Set([...(prev.skills || []), ...splitSkills]));
        } else if (Array.isArray(updates.newSkills)) {
          next.skills = Array.from(new Set([...(prev.skills || []), ...updates.newSkills]));
        }

        if (Array.isArray(updates.experience)) {
          next.experience = updates.experience;
        } else if (updates.experience && typeof updates.experience === "object") {
          next.experience = [...(prev.experience || []), updates.experience];
        } else if (updates.newExperience && typeof updates.newExperience === "object") {
          next.experience = [...(prev.experience || []), updates.newExperience];
        }

        if (Array.isArray(updates.project)) {
          next.project = updates.project;
        } else if (updates.project && typeof updates.project === "object") {
          next.project = [...(prev.project || []), updates.project];
        } else if (updates.newProject && typeof updates.newProject === "object") {
          next.project = [...(prev.project || []), updates.newProject];
        }

        if (Array.isArray(updates.education)) {
          next.education = updates.education;
        } else if (updates.education && typeof updates.education === "object") {
          next.education = [...(prev.education || []), updates.education];
        }

        if (Array.isArray(updates.certifications)) {
          next.certifications = updates.certifications;
        } else if (updates.certifications && typeof updates.certifications === "object") {
          next.certifications = [...(prev.certifications || []), updates.certifications];
        } else if (updates.newCertification && typeof updates.newCertification === "object") {
          next.certifications = [...(prev.certifications || []), updates.newCertification];
        }

        if (Array.isArray(updates.achievements)) {
          next.achievements = updates.achievements;
        } else if (updates.achievements && typeof updates.achievements === "object") {
          next.achievements = [...(prev.achievements || []), updates.achievements];
        } else if (updates.newAchievement && typeof updates.newAchievement === "object") {
          next.achievements = [...(prev.achievements || []), updates.newAchievement];
        }

        setActiveResumeData(next);
        return next;
      });
    });
  }, [registerApplyHandler, registerDirectUpdateHandler, setResumeData, setActiveResumeData]);

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
    <div className="lg:h-screen lg:max-h-screen flex flex-col bg-slate-100/80 overflow-x-hidden">
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
      <main className="resume-builder-workspace flex-1 min-h-0 px-3 sm:px-5 lg:px-8 py-3 sm:py-4 overflow-hidden">
        <div className="max-w-8xl mx-auto w-full h-full min-h-0">
          <div className="grid lg:grid-cols-12 gap-4 sm:gap-5 h-full min-h-0">
            
            {/* LEFT PANEL - UI FORM EDITOR */}
            <section className="builder-form-panel no-print lg:col-span-5 h-full flex flex-col min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden relative">
              
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
            <div className="shrink-0 p-3 sm:px-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Step {activeSectionIndex + 1} of {orderedBuilderSections.length}:{" "}
                <strong className="text-slate-800">{activeSection?.name}</strong>
              </span>

              <button
                onClick={saveResume}
                disabled={isSaving || isLoading}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-1.5 rounded-lg transition-all shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {isSaving && <Loader2 className="size-3.5 animate-spin" />}
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </section>

          {/* RIGHT PANEL - LIVE PREVIEW & ATS X-RAY WORKSPACE */}
          <section className="lg:col-span-7 h-full flex flex-col min-h-0 bg-slate-200/70 rounded-2xl border border-slate-200/90 p-2 sm:p-4 shadow-inner overflow-hidden max-lg:min-h-[600px]">
            {/* WORKSPACE SWITCHER BAR */}
            <div className="flex items-center justify-between pb-2.5 px-1 shrink-0 select-none gap-2 flex-wrap">
              <div className="flex items-center bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-300/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setPreviewMode("visual")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewMode === "visual"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Eye size={13} />
                  <span>Visual Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMode("xray")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    previewMode === "xray"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-emerald-700"
                  }`}
                >
                  <Terminal size={13} />
                  <span>ATS X-Ray Scanner</span>
                </button>
              </div>

              {/* AUTO-FIT 1-PAGE TOGGLE BUTTON */}
              <button
                type="button"
                onClick={() => setAutoFitSinglePage((prev) => !prev)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  autoFitSinglePage
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                    : "bg-white/95 hover:bg-white text-slate-700 border-slate-300/80 hover:border-emerald-300"
                }`}
                title="Automatically compress vertical spacing to guarantee everything fits on exactly 1 page"
              >
                <FileCheck size={13} className={autoFitSinglePage ? "text-white" : "text-emerald-600"} />
                <span>Auto-Fit 1-Page</span>
                {autoFitSinglePage && (
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            </div>

            {/* MAIN PREVIEW / SCANNER VIEWPORT */}
            <div className="flex-1 min-h-0 overflow-y-auto rounded-xl no-scrollbar hide-scrollbar">
              {previewMode === "visual" ? (
                <ResumePreview
                  data={resumeData}
                  template={resumeData.template}
                  accentColor={resumeData.accent_color}
                  autoFitSinglePage={autoFitSinglePage}
                />
              ) : (
                <AtsXRayScanner data={resumeData} />
              )}
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
          setActiveResumeData(restoredResume);
        }}
      />
    </div>
  );
};

export default ResumeBuilder;
