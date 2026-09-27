import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink, Calendar, CheckCircle2, User, Award, BookOpen, Layers } from "lucide-react";

/**
 * Nova Sidebar Two-Column Layout Template
 * High-impact modern two-column design with structured left sidebar and expansive main column.
 */
const NovaSidebarTemplate = ({ data, accentColor = "#0284C7", pageContent = null }) => {
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

  const defaultMainSectionOrder = [
    "summary",
    "experience",
    "projects",
    "education",
    "achievements",
    "declaration",
    "custom_sections",
  ];
  const userOrder = Array.isArray(data?.section_order) && data.section_order.length > 0 ? data.section_order : [];
  const orderedMainSections = [...new Set([...userOrder.filter((s) => !["skills", "languages", "certifications", "personal_details"].includes(s)), ...defaultMainSectionOrder])];

  const SidebarSectionTitle = ({ children }) => (
    <h3
      className="text-xs font-black uppercase tracking-wider pb-1 mb-2.5 border-b flex items-center gap-1.5"
      style={{ color: accentColor || "#0284C7", borderColor: `${accentColor}30` }}
    >
      <span>{children}</span>
    </h3>
  );

  const MainSectionTitle = ({ children, continuation = false }) => (
    <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
      <div className="size-2 rounded-full" style={{ backgroundColor: accentColor || "#0284C7" }} />
      <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
        {children} {continuation && <span className="text-[10px] text-slate-400 font-normal">(Continued)</span>}
      </h2>
    </div>
  );

  const renderMainSection = (sectionKey) => {
    switch (sectionKey) {
      case "summary":
        return showSummary && data?.professional_summary ? (
          <section key="summary" data-resume-section="summary" className="mb-4 break-inside-avoid">
            <MainSectionTitle>Professional Summary</MainSectionTitle>
            <p className="text-slate-700 leading-relaxed text-xs sm:text-[13px] text-justify pl-1">
              {data.professional_summary}
            </p>
          </section>
        ) : null;

      case "experience":
        return showExperience ? (
          <section key="experience" className="mb-4">
            {showExpTitle && (
              <div data-resume-section="experience-title">
                <MainSectionTitle continuation={isExpContinuation}>Work Experience</MainSectionTitle>
              </div>
            )}
            <div className="space-y-3.5 pl-1">
              {visibleExpIndices.map((origIdx) => {
                const exp = data?.experience?.[origIdx];
                if (!exp) return null;
                const bulletPoints = (exp.description || "")
                  .split("\n")
                  .map((b) => b.trim())
                  .filter(Boolean);

                return (
                  <div key={origIdx} data-resume-item="experience-item" className="break-inside-avoid relative pl-3 border-l-2 border-slate-200">
                    <div
                      className="absolute -left-[5px] top-1 size-2 rounded-full bg-white border-2"
                      style={{ borderColor: accentColor || "#0284C7" }}
                    />
                    <div className="flex justify-between items-baseline gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{exp.position}</h4>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">{exp.company}</p>

                    {bulletPoints.length > 0 && (
                      <ul className="mt-1.5 space-y-1 text-slate-700 text-xs leading-relaxed pl-3 list-disc">
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
                <MainSectionTitle>Featured Projects</MainSectionTitle>
              </div>
            )}
            <div className="space-y-3 pl-1">
              {visibleProjIndices.map((origIdx) => {
                const proj = data?.project?.[origIdx];
                if (!proj) return null;
                return (
                  <div key={origIdx} data-resume-item="project-item" className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 break-inside-avoid">
                    <div className="flex justify-between items-baseline gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{proj.name}</h4>
                      {proj.type && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {proj.type}
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-line">
                        {proj.description}
                      </p>
                    )}
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
                <MainSectionTitle continuation={isEduContinuation}>Education</MainSectionTitle>
              </div>
            )}
            <div className="space-y-2.5 pl-1">
              {visibleEduIndices.map((origIdx) => {
                const edu = data?.education?.[origIdx];
                if (!edu) return null;
                return (
                  <div key={origIdx} data-resume-item="education-item" className="break-inside-avoid">
                    <div className="flex justify-between items-baseline gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-xs">{edu.institution}</h4>
                      {edu.graduation_date && (
                        <span className="text-[11px] font-semibold text-slate-500">
                          {formatDate(edu.graduation_date)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span>{edu.degree} {edu.field ? `in ${edu.field}` : ""}</span>
                      {edu.gpa && <span className="text-[11px] font-semibold text-slate-500">GPA: {edu.gpa}</span>}
                    </div>
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
                <MainSectionTitle>Key Achievements</MainSectionTitle>
              </div>
            )}
            <div className="space-y-2 pl-1">
              {visibleAchieveIndices.map((origIdx) => {
                const ach = data?.achievements?.[origIdx];
                if (!ach) return null;
                return (
                  <div key={origIdx} data-resume-item="achievement-item" className="break-inside-avoid text-xs">
                    <div className="flex justify-between items-baseline gap-2">
                      <h5 className="font-bold text-slate-900">{ach.title}</h5>
                      {ach.date && <span className="text-[10px] text-slate-500 font-semibold">{formatDate(ach.date)}</span>}
                    </div>
                    {ach.description && <p className="text-slate-600 mt-0.5">{ach.description}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null;

      case "declaration": {
        const dec = data?.declaration;
        const hasDec = dec && (dec.statement || dec.place || dec.date || dec.name);
        if (!hasDec) return null;
        return (
          <section key="declaration" data-resume-section="declaration" className="mb-4 break-inside-avoid">
            <MainSectionTitle>Declaration</MainSectionTitle>
            {dec.statement && <p className="text-slate-700 leading-relaxed text-xs text-justify mb-2">{dec.statement}</p>}
            <div className="flex justify-between items-end text-xs text-slate-600 pt-1">
              <div className="space-y-0.5">
                {dec.place && <div><span className="font-semibold text-slate-900">Place:</span> {dec.place}</div>}
                {dec.date && <div><span className="font-semibold text-slate-900">Date:</span> {formatDate(dec.date)}</div>}
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
                  <MainSectionTitle>{sec.title || "Custom Section"}</MainSectionTitle>
                  <div className="space-y-2.5 pl-1">
                    {(sec.items || []).map((item, iIdx) => (
                      <div key={iIdx} data-resume-item="custom-item" className="break-inside-avoid">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h4>
                          {item.date && <span className="text-[11px] font-semibold text-slate-500">{item.date}</span>}
                        </div>
                        {item.subtitle && <p className="text-xs text-slate-600 italic">{item.subtitle}</p>}
                        {item.description && <p className="text-xs text-slate-700 mt-0.5 leading-relaxed whitespace-pre-line">{item.description}</p>}
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

  const pd = data?.personal_details;
  const hasDetails = pd && (pd.date_of_birth || pd.gender || pd.nationality || pd.marital_status || pd.passport_no || pd.address);

  return (
    <div className="w-full bg-white text-slate-900 font-sans leading-normal">
      <div className="grid grid-cols-12 min-h-full">
        
        {/* LEFT SIDEBAR (34%) */}
        <aside className="col-span-4 bg-slate-50 p-4 sm:p-5 border-r border-slate-200/80 space-y-5">
          {/* AVATAR OR INITIALS */}
          {data?.personal_info?.image ? (
            <div className="flex justify-center">
              <img
                src={data.personal_info.image}
                alt={data?.personal_info?.full_name}
                className="size-20 sm:size-24 rounded-2xl object-cover border-2 shadow-xs"
                style={{ borderColor: accentColor || "#0284C7" }}
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className="size-16 sm:size-20 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-xs"
                style={{ backgroundColor: accentColor || "#0284C7" }}
              >
                {data?.personal_info?.full_name?.charAt(0)?.toUpperCase() || "F"}
              </div>
            </div>
          )}

          {/* CONTACT DETAILS */}
          <div className="space-y-2.5">
            <SidebarSectionTitle>Contact Info</SidebarSectionTitle>
            <div className="space-y-2 text-xs text-slate-700 break-words">
              {data?.personal_info?.email && (
                <a href={`mailto:${data.personal_info.email}`} className="flex items-start gap-2 hover:text-slate-900">
                  <Mail className="size-3.5 shrink-0 mt-0.5 text-slate-400" />
                  <span className="truncate">{data.personal_info.email}</span>
                </a>
              )}
              {data?.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="size-3.5 shrink-0 text-slate-400" />
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data?.personal_info?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 shrink-0 text-slate-400" />
                  <span>{data.personal_info.location}</span>
                </div>
              )}
              {data?.personal_info?.linkedin && (
                <a href={data.personal_info.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-slate-900">
                  <Linkedin className="size-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{data.personal_info.linkedin_label || "LinkedIn"}</span>
                </a>
              )}
              {data?.personal_info?.github && (
                <a href={data.personal_info.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-slate-900">
                  <Github className="size-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{data.personal_info.github_label || "GitHub"}</span>
                </a>
              )}
              {data?.personal_info?.website && (
                <a href={data.personal_info.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-slate-900">
                  <Globe className="size-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{data.personal_info.website_label || "Portfolio"}</span>
                </a>
              )}
            </div>
          </div>

          {/* SKILLS */}
          {showSkills && data?.skills && data.skills.length > 0 && (
            <div className="space-y-2">
              <SidebarSectionTitle>Skills & Tech</SidebarSectionTitle>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-slate-200 text-slate-800 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* LANGUAGES */}
          {showLanguages && data?.languages && data.languages.length > 0 && (
            <div className="space-y-2">
              <SidebarSectionTitle>Languages</SidebarSectionTitle>
              <div className="space-y-1 text-xs">
                {data.languages.map((lang, lIdx) => (
                  <div key={lIdx} className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800">{lang.language}</span>
                    {lang.proficiency && (
                      <span className="text-[10px] text-slate-500 font-medium">{lang.proficiency}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {showCertifications && data?.certifications && data.certifications.length > 0 && (
            <div className="space-y-2">
              <SidebarSectionTitle>Certifications</SidebarSectionTitle>
              <div className="space-y-2 text-xs">
                {data.certifications.map((cert, cIdx) => (
                  <div key={cIdx} className="space-y-0.5">
                    <p className="font-bold text-slate-900 leading-tight">{cert.name}</p>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>{cert.issuer}</span>
                      {cert.date && <span>{formatDate(cert.date)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PERSONAL DETAILS IN SIDEBAR */}
          {hasDetails && (
            <div className="space-y-2">
              <SidebarSectionTitle>Personal Details</SidebarSectionTitle>
              <div className="space-y-1 text-[11px] text-slate-700">
                {pd.date_of_birth && <div><span className="font-semibold text-slate-900">DOB:</span> {formatDate(pd.date_of_birth)}</div>}
                {pd.gender && <div><span className="font-semibold text-slate-900">Gender:</span> {pd.gender}</div>}
                {pd.nationality && <div><span className="font-semibold text-slate-900">Nationality:</span> {pd.nationality}</div>}
                {pd.marital_status && <div><span className="font-semibold text-slate-900">Marital:</span> {pd.marital_status}</div>}
                {pd.passport_no && <div><span className="font-semibold text-slate-900">Passport:</span> {pd.passport_no}</div>}
                {pd.address && <div><span className="font-semibold text-slate-900">Address:</span> {pd.address}</div>}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT MAIN CONTENT (66%) */}
        <main className="col-span-8 p-5 sm:p-6 space-y-4">
          {/* HEADER */}
          {showHeader && (
            <header data-resume-section="header" className="mb-5 pb-3 border-b-2 border-slate-900">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-none">
                {data?.personal_info?.full_name || "Your Name"}
              </h1>
              {data?.personal_info?.profession && (
                <p
                  className="text-xs sm:text-sm font-bold uppercase tracking-wider mt-1"
                  style={{ color: accentColor || "#0284C7" }}
                >
                  {data.personal_info.profession}
                </p>
              )}
            </header>
          )}

          {/* MAIN DYNAMIC SECTIONS */}
          {orderedMainSections.map((secKey) => renderMainSection(secKey))}
        </main>

      </div>
    </div>
  );
};

export default NovaSidebarTemplate;
