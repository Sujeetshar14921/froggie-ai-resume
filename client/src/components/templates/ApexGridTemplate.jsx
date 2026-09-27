import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink, Calendar, Award, Briefcase, GraduationCap, FolderGit2, Sparkles, Languages, Check, ArrowUpRight } from "lucide-react";

/**
 * Apex Minimalist Grid / Silicon Valley High-Density Template
 * 100% ATS Optimized, Linear/Stripe design aesthetic with structured micro-cards and pill metadata.
 */
const ApexGridTemplate = ({ data, accentColor = "#0F766E", pageContent = null }) => {
  if (!data) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.toLowerCase() === "present") return "Present";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 2) {
        const date = new Date(parts[0], parts[1] - 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const showHeader = pageContent ? pageContent.showHeader : true;
  const showSummary = pageContent ? pageContent.showSummary : true;

  const showExperience = pageContent
    ? pageContent.experienceIndices && pageContent.experienceIndices.length > 0
    : Boolean(data?.experience && data.experience.length > 0);
  const visibleExpIndices = pageContent?.experienceIndices ?? (data?.experience || []).map((_, i) => i);
  const showExpTitle = pageContent
    ? pageContent.showExperienceTitle || pageContent.showExperienceContinuationTitle
    : true;
  const isExpContinuation = pageContent ? pageContent.showExperienceContinuationTitle : false;

  const showProjects = pageContent
    ? pageContent.projectIndices && pageContent.projectIndices.length > 0
    : Boolean(data?.project && data.project.length > 0);
  const visibleProjIndices = pageContent?.projectIndices ?? (data?.project || []).map((_, i) => i);
  const showProjTitle = pageContent ? pageContent.showProjectsTitle : true;

  const showEducation = pageContent
    ? pageContent.educationIndices && pageContent.educationIndices.length > 0
    : Boolean(data?.education && data.education.length > 0);
  const visibleEduIndices = pageContent?.educationIndices ?? (data?.education || []).map((_, i) => i);
  const showEduTitle = pageContent
    ? pageContent.showEducationTitle || pageContent.showEducationContinuationTitle
    : true;
  const isEduContinuation = pageContent ? pageContent.showEducationContinuationTitle : false;

  const showCertifications = pageContent
    ? pageContent.certificationIndices && pageContent.certificationIndices.length > 0
    : Boolean(data?.certifications && data.certifications.length > 0);
  const visibleCertIndices = pageContent?.certificationIndices ?? (data?.certifications || []).map((_, i) => i);
  const showCertTitle = pageContent ? pageContent.showCertificationsTitle : true;

  const showAchievements = pageContent
    ? pageContent.achievementIndices && pageContent.achievementIndices.length > 0
    : Boolean(data?.achievements && data.achievements.length > 0);
  const visibleAchieveIndices = pageContent?.achievementIndices ?? (data?.achievements || []).map((_, i) => i);
  const showAchieveTitle = pageContent ? pageContent.showAchievementsTitle : true;

  const showSkills = pageContent ? pageContent.showSkills : Boolean(data?.skills && data.skills.length > 0);
  const showLanguages = pageContent ? pageContent.showLanguages ?? true : Boolean(data?.languages && data.languages.length > 0);
  const showCustomSections = pageContent ? pageContent.showCustomSections ?? true : Boolean(data?.custom_sections && data.custom_sections.length > 0);

  const defaultSectionOrder = [
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "achievements",
    "languages",
    "personal_details",
    "declaration",
    "custom_sections",
  ];
  const userOrder = Array.isArray(data?.section_order) && data.section_order.length > 0 ? data.section_order : [];
  const orderedSections = [...new Set([...userOrder, ...defaultSectionOrder])];

  const SectionTitle = ({ children, continuation = false }) => (
    <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
      <span
        className="w-1.5 h-3.5 rounded-full shrink-0"
        style={{ backgroundColor: accentColor || "#0F766E" }}
      />
      <h2
        className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-900"
      >
        {children} {continuation && <span className="text-[10px] text-slate-400 font-normal">(Continued)</span>}
      </h2>
    </div>
  );

  const renderSection = (sectionKey) => {
    switch (sectionKey) {
      case "summary":
        return showSummary && data?.professional_summary ? (
          <section key="summary" data-resume-section="summary" className="mb-4 break-inside-avoid">
            <SectionTitle>Executive Summary</SectionTitle>
            <p className="text-slate-700 leading-relaxed text-xs sm:text-[13px] text-justify pl-0.5">
              {data.professional_summary}
            </p>
          </section>
        ) : null;

      case "skills":
        return showSkills && data?.skills && data.skills.length > 0 ? (
          <section key="skills" data-resume-section="skills" className="mb-4 break-inside-avoid">
            <SectionTitle>Technical Competencies</SectionTitle>
            <div className="flex flex-wrap gap-1.5 pl-0.5">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ) : null;

      case "experience":
        return showExperience ? (
          <section key="experience" className="mb-4">
            {showExpTitle && (
              <div data-resume-section="experience-title">
                <SectionTitle continuation={isExpContinuation}>Work Experience</SectionTitle>
              </div>
            )}
            <div className="space-y-3.5 pl-0.5">
              {visibleExpIndices.map((origIdx) => {
                const exp = data?.experience?.[origIdx];
                if (!exp) return null;
                const bulletPoints = (exp.description || "")
                  .split("\n")
                  .map((b) => b.trim())
                  .filter(Boolean);

                return (
                  <div
                    key={origIdx}
                    data-resume-item="experience-item"
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs break-inside-avoid space-y-1.5"
                  >
                    <div className="flex justify-between items-baseline gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-950 text-xs sm:text-sm">{exp.position}</h3>
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-slate-700 text-xs">{exp.company}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                        {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>

                    {bulletPoints.length > 0 && (
                      <ul className="space-y-1 text-slate-700 text-xs leading-relaxed pl-3.5 list-disc mt-1">
                        {bulletPoints.map((point, bIdx) => (
                          <li key={bIdx}>{point.replace(/^[•\-\*]\s*/, "")}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null;

      case "projects":
        return showProjects ? (
          <section key="projects" className="mb-4">
            {showProjTitle && (
              <div data-resume-section="projects-title">
                <SectionTitle>Key Projects & Architecture</SectionTitle>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3 pl-0.5">
              {visibleProjIndices.map((origIdx) => {
                const proj = data?.project?.[origIdx];
                if (!proj) return null;
                return (
                  <div
                    key={origIdx}
                    data-resume-item="project-item"
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 break-inside-avoid space-y-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{proj.name}</h4>
                        {proj.type && (
                          <span className="text-[10px] font-semibold text-slate-500">{proj.type}</span>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                          {proj.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null;

      case "education":
        return showEducation ? (
          <section key="education" className="mb-4">
            {showEduTitle && (
              <div data-resume-section="education-title">
                <SectionTitle continuation={isEduContinuation}>Education</SectionTitle>
              </div>
            )}
            <div className="space-y-2.5 pl-0.5">
              {visibleEduIndices.map((origIdx) => {
                const edu = data?.education?.[origIdx];
                if (!edu) return null;
                return (
                  <div key={origIdx} data-resume-item="education-item" className="flex justify-between items-baseline text-xs break-inside-avoid flex-wrap gap-1 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                    <div>
                      <span className="font-bold text-slate-900">{edu.institution}</span>
                      <span className="text-slate-400 mx-1.5">•</span>
                      <span className="text-slate-700">{edu.degree} {edu.field ? `in ${edu.field}` : ""}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {edu.gpa && <span className="text-[11px] font-semibold text-slate-600">GPA: {edu.gpa}</span>}
                      {edu.graduation_date && (
                        <span className="text-[11px] font-bold text-slate-500">{formatDate(edu.graduation_date)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null;

      case "certifications":
        return showCertifications ? (
          <section key="certifications" className="mb-4">
            {showCertTitle && (
              <div data-resume-section="certifications-title">
                <SectionTitle>Certifications</SectionTitle>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-2 pl-0.5">
              {visibleCertIndices.map((origIdx) => {
                const cert = data?.certifications?.[origIdx];
                if (!cert) return null;
                return (
                  <div key={origIdx} data-resume-item="certification-item" className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs break-inside-avoid flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{cert.name}</p>
                      {cert.issuer && <p className="text-[10px] text-slate-500 mt-0.5">{cert.issuer}</p>}
                    </div>
                    {cert.date && <span className="text-[10px] font-bold text-slate-400 shrink-0 ml-2">{formatDate(cert.date)}</span>}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null;

      case "achievements":
        return showAchievements ? (
          <section key="achievements" className="mb-4">
            {showAchieveTitle && (
              <div data-resume-section="achievements-title">
                <SectionTitle>Achievements & Honors</SectionTitle>
              </div>
            )}
            <div className="space-y-2 pl-0.5">
              {visibleAchieveIndices.map((origIdx) => {
                const ach = data?.achievements?.[origIdx];
                if (!ach) return null;
                return (
                  <div key={origIdx} data-resume-item="achievement-item" className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 text-xs break-inside-avoid">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="font-bold text-slate-900">{ach.title}</h4>
                      {ach.date && <span className="text-[10px] font-bold text-slate-500">{formatDate(ach.date)}</span>}
                    </div>
                    {ach.description && <p className="text-slate-600 mt-0.5 leading-relaxed">{ach.description}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null;

      case "languages":
        return showLanguages && data?.languages && data.languages.length > 0 ? (
          <section key="languages" data-resume-section="languages" className="mb-4 break-inside-avoid">
            <SectionTitle>Languages</SectionTitle>
            <div className="flex flex-wrap gap-2 pl-0.5">
              {data.languages.map((lang, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 border border-slate-200 text-slate-800 flex items-center gap-1.5"
                >
                  <span className="font-bold">{lang.language}</span>
                  {lang.proficiency && <span className="text-slate-500 text-[10px]">({lang.proficiency})</span>}
                </span>
              ))}
            </div>
          </section>
        ) : null;

      case "personal_details": {
        const pd = data?.personal_details;
        const hasDetails = pd && (pd.date_of_birth || pd.gender || pd.nationality || pd.marital_status || pd.passport_no || pd.address);
        if (!hasDetails) return null;
        return (
          <section key="personal_details" data-resume-section="personal_details" className="mb-4 break-inside-avoid">
            <SectionTitle>Personal Details</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700 pl-0.5">
              {pd.date_of_birth && <div className="p-2 rounded bg-slate-50 border border-slate-200/60"><span className="font-bold text-slate-900">DOB:</span> {formatDate(pd.date_of_birth)}</div>}
              {pd.gender && <div className="p-2 rounded bg-slate-50 border border-slate-200/60"><span className="font-bold text-slate-900">Gender:</span> {pd.gender}</div>}
              {pd.nationality && <div className="p-2 rounded bg-slate-50 border border-slate-200/60"><span className="font-bold text-slate-900">Nationality:</span> {pd.nationality}</div>}
              {pd.marital_status && <div className="p-2 rounded bg-slate-50 border border-slate-200/60"><span className="font-bold text-slate-900">Marital:</span> {pd.marital_status}</div>}
              {pd.passport_no && <div className="p-2 rounded bg-slate-50 border border-slate-200/60"><span className="font-bold text-slate-900">Passport:</span> {pd.passport_no}</div>}
              {pd.address && <div className="col-span-2 sm:col-span-3 p-2 rounded bg-slate-50 border border-slate-200/60"><span className="font-bold text-slate-900">Address:</span> {pd.address}</div>}
            </div>
          </section>
        );
      }

      case "declaration": {
        const dec = data?.declaration;
        const hasDec = dec && (dec.statement || dec.place || dec.date || dec.name);
        if (!hasDec) return null;
        return (
          <section key="declaration" data-resume-section="declaration" className="mb-4 break-inside-avoid">
            <SectionTitle>Declaration</SectionTitle>
            {dec.statement && <p className="text-slate-700 leading-relaxed text-xs text-justify mb-2 pl-0.5">{dec.statement}</p>}
            <div className="flex justify-between items-end text-xs text-slate-600 pt-1 pl-0.5">
              <div className="space-y-0.5">
                {dec.place && <div><span className="font-bold text-slate-900">Place:</span> {dec.place}</div>}
                {dec.date && <div><span className="font-bold text-slate-900">Date:</span> {formatDate(dec.date)}</div>}
              </div>
              <div className="text-right font-bold text-slate-900 text-xs sm:text-sm">
                {dec.name || data?.personal_info?.full_name || ""}
              </div>
            </div>
          </section>
        );
      }

      case "custom_sections":
        return showCustomSections && data?.custom_sections && data.custom_sections.length > 0 ? (
          <React.Fragment key="custom_sections">
            {data.custom_sections.map((sec, sIdx) => {
              if (!sec.title && (!sec.items || sec.items.length === 0)) return null;
              return (
                <section key={sIdx} className="mb-4 break-inside-avoid">
                  <SectionTitle>{sec.title || "Custom Section"}</SectionTitle>
                  <div className="space-y-2.5 pl-0.5">
                    {(sec.items || []).map((item, iIdx) => (
                      <div key={iIdx} data-resume-item="custom-item" className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 break-inside-avoid">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h4>
                          {item.date && <span className="text-[11px] font-bold text-slate-500">{item.date}</span>}
                        </div>
                        {item.subtitle && <p className="text-xs text-slate-600 italic">{item.subtitle}</p>}
                        {item.description && <p className="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-line">{item.description}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </React.Fragment>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 font-sans leading-normal">
      {/* MODERN LINEAR METADATA HEADER */}
      {showHeader && (
        <header data-resume-section="header" className="mb-5 pb-4 border-b-2 border-slate-950">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 leading-none">
                {data?.personal_info?.full_name || "Your Name"}
              </h1>
              {data?.personal_info?.profession && (
                <p
                  className="text-xs sm:text-sm font-bold uppercase tracking-wider mt-1"
                  style={{ color: accentColor || "#0F766E" }}
                >
                  {data.personal_info.profession}
                </p>
              )}
            </div>

            {data?.personal_info?.location && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                <MapPin className="size-3 text-slate-400" />
                <span>{data.personal_info.location}</span>
              </span>
            )}
          </div>

          {/* CONTACT BADGE PILLS */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-700">
            {data?.personal_info?.email && (
              <a
                href={`mailto:${data.personal_info.email}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 font-medium text-slate-800 transition-colors"
              >
                <Mail className="size-3 text-slate-500" />
                <span>{data.personal_info.email}</span>
              </a>
            )}
            {data?.personal_info?.phone && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/80 font-medium text-slate-800">
                <Phone className="size-3 text-slate-500" />
                <span>{data.personal_info.phone}</span>
              </span>
            )}
            {data?.personal_info?.linkedin && (
              <a
                href={data.personal_info.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 font-medium text-slate-800 transition-colors"
              >
                <Linkedin className="size-3 text-slate-500" />
                <span>{data.personal_info.linkedin_label || "LinkedIn"}</span>
                <ArrowUpRight className="size-2.5 text-slate-400" />
              </a>
            )}
            {data?.personal_info?.github && (
              <a
                href={data.personal_info.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 font-medium text-slate-800 transition-colors"
              >
                <Github className="size-3 text-slate-500" />
                <span>{data.personal_info.github_label || "GitHub"}</span>
                <ArrowUpRight className="size-2.5 text-slate-400" />
              </a>
            )}
            {data?.personal_info?.website && (
              <a
                href={data.personal_info.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200/70 border border-slate-200/80 font-medium text-slate-800 transition-colors"
              >
                <Globe className="size-3 text-slate-500" />
                <span>{data.personal_info.website_label || "Portfolio"}</span>
                <ArrowUpRight className="size-2.5 text-slate-400" />
              </a>
            )}
          </div>
        </header>
      )}

      {/* DYNAMIC ORDERED CONTENT */}
      <main className="space-y-4">
        {orderedSections.map((secKey) => renderSection(secKey))}
      </main>
    </div>
  );
};

export default ApexGridTemplate;
