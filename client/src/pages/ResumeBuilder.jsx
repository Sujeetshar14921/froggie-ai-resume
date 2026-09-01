import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import CertificationForm from "../components/CertificationForm";
import AchievementForm from "../components/AchievementForm";
import { BuilderHeader, BuilderStepper, BuilderToolbar } from "../components/builder";
import { useResume } from "../hooks/useResume";
import { BUILDER_SECTIONS } from "../constants/sections";
import { exportResumeAsPdf, exportResumeAsDoc } from "../utils/exportResume";
import { useCopilot } from "../hooks/useCopilot";
import { useSEO } from "../hooks/useSEO";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
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

    // Direct multi-field updates (e.g. adding skills, new project, title, certs, awards)
    registerDirectUpdateHandler((updates) => {
      if (!updates || typeof updates !== "object") return;

      setResumeData((prev) => {
        const next = { ...prev };

        // 1. Personal Info
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

        // 2. Summary
        if (updates.professional_summary !== undefined) {
          next.professional_summary = updates.professional_summary;
        } else if (updates.summary !== undefined) {
          next.professional_summary = updates.summary;
        }

        // 3. Skills
        if (Array.isArray(updates.skills)) {
          next.skills = updates.skills;
        } else if (typeof updates.skills === "string") {
          const splitSkills = updates.skills.split(/,\s*|\n/).map((s) => s.trim()).filter(Boolean);
          next.skills = Array.from(new Set([...(prev.skills || []), ...splitSkills]));
        } else if (Array.isArray(updates.newSkills)) {
          next.skills = Array.from(new Set([...(prev.skills || []), ...updates.newSkills]));
        }

        // 4. Experience
        if (Array.isArray(updates.experience)) {
          next.experience = updates.experience;
        } else if (updates.experience && typeof updates.experience === "object") {
          next.experience = [...(prev.experience || []), updates.experience];
        } else if (updates.newExperience && typeof updates.newExperience === "object") {
          next.experience = [...(prev.experience || []), updates.newExperience];
        }

        // 5. Projects
        if (Array.isArray(updates.project)) {
          next.project = updates.project;
        } else if (updates.project && typeof updates.project === "object") {
          next.project = [...(prev.project || []), updates.project];
        } else if (updates.newProject && typeof updates.newProject === "object") {
          next.project = [...(prev.project || []), updates.newProject];
        }

        // 6. Education
        if (Array.isArray(updates.education)) {
          next.education = updates.education;
        } else if (updates.education && typeof updates.education === "object") {
          next.education = [...(prev.education || []), updates.education];
        }

        // 7. Certifications
        if (Array.isArray(updates.certifications)) {
          next.certifications = updates.certifications;
        } else if (updates.certifications && typeof updates.certifications === "object") {
          next.certifications = [...(prev.certifications || []), updates.certifications];
        } else if (updates.newCertification && typeof updates.newCertification === "object") {
          next.certifications = [...(prev.certifications || []), updates.newCertification];
        }

        // 8. Achievements
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

  const activeSection = BUILDER_SECTIONS[activeSectionIndex];

  // Handle Export (PDF & Word DOC)
  const handleDownload = async (type = "pdf") => {
    setIsExporting(true);

    try {
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
      />

      {/* MAIN 2-PANEL WORKSPACE */}
      <main className="resume-builder-workspace flex-1 min-h-0 px-3 sm:px-5 lg:px-8 py-3 sm:py-4 overflow-hidden">
        <div className="max-w-8xl mx-auto w-full h-full min-h-0">
          <div className="grid lg:grid-cols-12 gap-4 sm:gap-5 h-full min-h-0">
            
            {/* LEFT PANEL - UI FORM EDITOR */}
            <section className="builder-form-panel no-print lg:col-span-5 h-full flex flex-col min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden relative">
              
              {/* STEP PROGRESS & ICONS */}
              <BuilderStepper
                activeSectionIndex={activeSectionIndex}
                onSelectSection={setActiveSectionIndex}
              />

            {/* SECTION TOOLBAR (TEMPLATES, COLORS, NAV) */}
            <BuilderToolbar
              template={resumeData.template}
              accentColor={resumeData.accent_color}
              activeSectionIndex={activeSectionIndex}
              totalSections={BUILDER_SECTIONS.length}
              onChangeTemplate={(template) => setResumeData((prev) => ({ ...prev, template }))}
              onChangeAccentColor={(accent_color) => setResumeData((prev) => ({ ...prev, accent_color }))}
              onPrevSection={() => setActiveSectionIndex((prev) => Math.max(prev - 1, 0))}
              onNextSection={() =>
                setActiveSectionIndex((prev) => Math.min(prev + 1, BUILDER_SECTIONS.length - 1))
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
                </div>
              )}
            </div>

            {/* FIXED BOTTOM FOOTER OF FORM */}
            <div className="shrink-0 p-3 sm:px-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Step {activeSectionIndex + 1} of {BUILDER_SECTIONS.length}:{" "}
                <strong className="text-slate-800">{activeSection.name}</strong>
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

          {/* RIGHT PANEL - LIVE PREVIEW WORKSPACE */}
          <section className="lg:col-span-7 h-full flex flex-col min-h-0 bg-slate-200/70 rounded-2xl border border-slate-200/90 p-2 sm:p-4 shadow-inner overflow-hidden max-lg:min-h-[600px]">
            <div className="flex-1 min-h-0 overflow-y-auto rounded-xl no-scrollbar hide-scrollbar">
              <ResumePreview
                data={resumeData}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
              />
            </div>
          </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
