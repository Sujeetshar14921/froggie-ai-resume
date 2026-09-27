import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink, Calendar, Award } from "lucide-react";

/**
 * Ivy League Academic & Global Corporate Standard Template
 * 100% ATS Optimized, Harvard/Stanford inspired prestigious typography and clean dual hairline dividers.
 */
const IvyLeagueTemplate = ({ data, accentColor = "#1E3A8A", pageContent = null }) => {
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
    "education",
    "experience",
    "projects",
    "skills",
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
    <div className="mb-2.5 pb-1 border-b-[1.5px] border-slate-900 flex items-center justify-between">
      <h2
        className="font-serif text-xs sm:text-sm font-bold tracking-widest uppercase text-slate-900"
        style={{ color: accentColor || "#1E3A8A" }}
      >
        {children} {continuation && <span className="text-[10px] text-slate-500 font-normal font-sans">(Cont.)</span>}
      </h2>
    </div>
  );

  const renderSection = (sectionKey) => {
    switch (sectionKey) {
      case "summary":
        return showSummary && data?.professional_summary ? (
          <section key="summary" data-resume-section="summary" className="mb-4 break-inside-avoid">
            <SectionTitle>Executive Profile</SectionTitle>
            <p className="text-slate-800 leading-relaxed text-xs sm:text-[13px] text-justify font-sans">
              {data.professional_summary}
            </p>
          </section>
        ) : null;

      case "education":
        return showEducation ? (
          <section key="education" className="mb-4">
            {showEduTitle && (
              <div data-resume-section="education-title">
                <SectionTitle continuation={isEduContinuation}>Education & Academics</SectionTitle>
              </div>
            )}
            <div className="space-y-3">
              {visibleEduIndices.map((origIdx) => {
                const edu = data?.education?.[origIdx];
                if (!edu) return null;
                return (
                  <div key={origIdx} data-resume-item="education-item" className="break-inside-avoid">
                    <div className="flex justify-between items-baseline gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm font-serif">
                        {edu.institution || "University / Institution"}
                      </h3>
                      {edu.graduation_date && (
                        <span className="text-[11px] font-semibold text-slate-700 italic">
                          {formatDate(edu.graduation_date)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-800 font-sans mt-0.5">
                      <span>
                        {edu.degree}
                        {edu.field ? ` in ${edu.field}` : ""}
                      </span>
                      {edu.gpa && (
                        <span className="text-[11px] font-semibold text-slate-700">
                          GPA / Honors: {edu.gpa}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null;

      case "experience":
        return showExperience ? (
          <section key="experience" className="mb-4">
            {showExpTitle && (
              <div data-resume-section="experience-title">
                <SectionTitle continuation={isExpContinuation}>Professional Experience</SectionTitle>
              </div>
            )}
            <div className="space-y-3.5">
              {visibleExpIndices.map((origIdx) => {
                const exp = data?.experience?.[origIdx];
                if (!exp) return null;
                const bulletPoints = (exp.description || "")
                  .split("\n")
                  .map((b) => b.trim())
                  .filter(Boolean);

                return (
                  <div key={origIdx} data-resume-item="experience-item" className="break-inside-avoid">
                    <div className="flex justify-between items-baseline gap-2 flex-wrap">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm font-serif">{exp.position}</h3>
                        <span className="text-slate-400 select-none">|</span>
                        <span className="font-semibold text-slate-800 text-xs">{exp.company}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700 italic">
                        {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>

                    {bulletPoints.length > 0 && (
                      <ul className="mt-1.5 space-y-1 text-slate-800 text-xs leading-relaxed font-sans list-none pl-0">
                        {bulletPoints.map((point, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2">
                            <span className="text-slate-900 text-sm leading-none mt-0.5 select-none font-bold">▪</span>
                            <span className="flex-1">{point.replace(/^[•\-\*]\s*/, "")}</span>
                          </li>
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
                <SectionTitle>Key Initiatives & Projects</SectionTitle>
              </div>
            )}
            <div className="space-y-3">
              {visibleProjIndices.map((origIdx) => {
                const proj = data?.project?.[origIdx];
                if (!proj) return null;
                return (
                  <div key={origIdx} data-resume-item="project-item" className="break-inside-avoid">
                    <div className="flex justify-between items-baseline gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm font-serif">{proj.name}</h3>
                      {proj.type && (
                        <span className="text-[11px] font-semibold text-slate-700 italic">{proj.type}</span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-xs text-slate-800 mt-1 leading-relaxed whitespace-pre-line font-sans">
                        {proj.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null;

      case "skills":
        return showSkills && data?.skills && data.skills.length > 0 ? (
          <section key="skills" data-resume-section="skills" className="mb-4 break-inside-avoid">
            <SectionTitle>Areas of Expertise & Skills</SectionTitle>
            <div className="text-xs text-slate-800 leading-relaxed font-sans flex flex-wrap items-center">
              {data.skills.map((skill, index) => (
                <span key={index} className="inline-flex items-center font-medium">
                  {index > 0 && <span className="mx-2 text-slate-400 select-none">◆</span>}
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </section>
        ) : null;

      case "certifications":
        return showCertifications ? (
          <section key="certifications" className="mb-4">
            {showCertTitle && (
              <div data-resume-section="certifications-title">
                <SectionTitle>Certifications & Credentials</SectionTitle>
              </div>
            )}
            <div className="space-y-2">
              {visibleCertIndices.map((origIdx) => {
                const cert = data?.certifications?.[origIdx];
                if (!cert) return null;
                return (
                  <div key={origIdx} data-resume-item="certification-item" className="flex justify-between items-baseline text-xs break-inside-avoid">
                    <div className="flex items-center gap-1.5 font-sans">
                      <span className="font-bold text-slate-900">{cert.name}</span>
                      {cert.issuer && <span className="text-slate-600">({cert.issuer})</span>}
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline inline-flex items-center gap-0.5">
                          <ExternalLink className="size-2.5" />
                        </a>
                      )}
                    </div>
                    {cert.date && <span className="text-[11px] font-semibold text-slate-600 italic">{formatDate(cert.date)}</span>}
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
                <SectionTitle>Honors & Awards</SectionTitle>
              </div>
            )}
            <div className="space-y-2">
              {visibleAchieveIndices.map((origIdx) => {
                const ach = data?.achievements?.[origIdx];
                if (!ach) return null;
                return (
                  <div key={origIdx} data-resume-item="achievement-item" className="break-inside-avoid text-xs">
                    <div className="flex justify-between items-baseline gap-2">
                      <h4 className="font-bold text-slate-900">{ach.title}</h4>
                      {ach.date && <span className="text-[11px] font-semibold text-slate-600 italic">{formatDate(ach.date)}</span>}
                    </div>
                    {ach.description && <p className="text-slate-700 mt-0.5 leading-relaxed font-sans">{ach.description}</p>}
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
            <div className="text-xs text-slate-800 leading-relaxed font-sans flex flex-wrap items-center">
              {data.languages.map((lang, index) => (
                <span key={index} className="inline-flex items-center">
                  {index > 0 && <span className="mx-2 text-slate-400 select-none">◆</span>}
                  <span className="font-semibold text-slate-900">{lang.language}</span>
                  {lang.proficiency && <span className="text-slate-600 ml-1">({lang.proficiency})</span>}
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
            <SectionTitle>Personal Dossier</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-slate-800 font-sans">
              {pd.date_of_birth && <div><span className="font-bold text-slate-900">Date of Birth:</span> {formatDate(pd.date_of_birth)}</div>}
              {pd.gender && <div><span className="font-bold text-slate-900">Gender:</span> {pd.gender}</div>}
              {pd.nationality && <div><span className="font-bold text-slate-900">Nationality:</span> {pd.nationality}</div>}
              {pd.marital_status && <div><span className="font-bold text-slate-900">Marital Status:</span> {pd.marital_status}</div>}
              {pd.passport_no && <div><span className="font-bold text-slate-900">Passport / ID:</span> {pd.passport_no}</div>}
              {pd.address && <div className="col-span-2 sm:col-span-3"><span className="font-bold text-slate-900">Address:</span> {pd.address}</div>}
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
            {dec.statement && <p className="text-slate-800 leading-relaxed text-xs text-justify mb-2 font-sans">{dec.statement}</p>}
            <div className="flex justify-between items-end text-xs text-slate-800 pt-1 font-sans">
              <div className="space-y-0.5">
                {dec.place && <div><span className="font-bold text-slate-900">Place:</span> {dec.place}</div>}
                {dec.date && <div><span className="font-bold text-slate-900">Date:</span> {formatDate(dec.date)}</div>}
              </div>
              <div className="text-right font-serif font-bold text-slate-900 text-sm">
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
                  <SectionTitle>{sec.title || "Additional Information"}</SectionTitle>
                  <div className="space-y-2.5">
                    {(sec.items || []).map((item, iIdx) => (
                      <div key={iIdx} data-resume-item="custom-item" className="break-inside-avoid">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="font-bold text-slate-900 text-xs sm:text-sm font-serif">{item.title}</h3>
                          {item.date && <span className="text-[11px] font-semibold text-slate-600 italic">{item.date}</span>}
                        </div>
                        {item.subtitle && <p className="text-xs text-slate-700 italic font-sans">{item.subtitle}</p>}
                        {item.description && <p className="text-xs text-slate-800 mt-0.5 leading-relaxed whitespace-pre-line font-sans">{item.description}</p>}
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
      {/* PRESTIGIOUS CENTERED MASTHEAD */}
      {showHeader && (
        <header data-resume-section="header" className="mb-5 text-center border-b-2 border-slate-900 pb-3">
          <h1
            className="text-2xl sm:text-3xl font-serif font-bold tracking-tight uppercase"
            style={{ color: accentColor || "#1E3A8A" }}
          >
            {data?.personal_info?.full_name || "Your Name"}
          </h1>

          {data?.personal_info?.profession && (
            <p className="text-xs sm:text-sm font-serif italic text-slate-700 mt-0.5 tracking-wide">
              {data.personal_info.profession}
            </p>
          )}

          {/* BULLETED CONTACT ROW */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-700 mt-2 font-sans">
            {data?.personal_info?.email && (
              <a href={`mailto:${data.personal_info.email}`} className="hover:text-slate-900 flex items-center gap-1 font-medium">
                <Mail className="size-3 text-slate-600" />
                <span>{data.personal_info.email}</span>
              </a>
            )}
            {data?.personal_info?.phone && (
              <span className="flex items-center gap-1 font-medium">
                <Phone className="size-3 text-slate-600" />
                <span>{data.personal_info.phone}</span>
              </span>
            )}
            {data?.personal_info?.location && (
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="size-3 text-slate-600" />
                <span>{data.personal_info.location}</span>
              </span>
            )}
            {data?.personal_info?.linkedin && (
              <a href={data.personal_info.linkedin} target="_blank" rel="noreferrer" className="hover:text-slate-900 flex items-center gap-1 font-medium">
                <Linkedin className="size-3 text-slate-600" />
                <span>{data.personal_info.linkedin_label || "LinkedIn"}</span>
              </a>
            )}
            {data?.personal_info?.github && (
              <a href={data.personal_info.github} target="_blank" rel="noreferrer" className="hover:text-slate-900 flex items-center gap-1 font-medium">
                <Github className="size-3 text-slate-600" />
                <span>{data.personal_info.github_label || "GitHub"}</span>
              </a>
            )}
            {data?.personal_info?.website && (
              <a href={data.personal_info.website} target="_blank" rel="noreferrer" className="hover:text-slate-900 flex items-center gap-1 font-medium">
                <Globe className="size-3 text-slate-600" />
                <span>{data.personal_info.website_label || "Portfolio"}</span>
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

export default IvyLeagueTemplate;
