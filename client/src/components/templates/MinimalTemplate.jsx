import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";
import { formatDate } from "../../utils/formatters";

const MinimalTemplate = ({ data, accentColor = "#0D9488", pageContent = null }) => {
  const linkedinLabel = data?.personal_info?.linkedin_label?.trim() || (
    data?.personal_info?.linkedin
      ? data.personal_info.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/(in\/)?/, "linkedin.com/in/")
      : null
  );

  const githubLabel = data?.personal_info?.github_label?.trim() || (
    data?.personal_info?.github
      ? data.personal_info.github.replace(/^https?:\/\/(www\.)?github\.com\//, "github.com/")
      : null
  );

  const websiteLabel = data?.personal_info?.website_label?.trim() || (
    data?.personal_info?.website
      ? data.personal_info.website.replace(/^https?:\/\/(www\.)?/, "")
      : null
  );

  const contactItems = [
    { icon: Mail, label: data?.personal_info?.email, href: data?.personal_info?.email ? `mailto:${data.personal_info.email}` : null },
    { icon: Phone, label: data?.personal_info?.phone, href: data?.personal_info?.phone ? `tel:${data.personal_info.phone}` : null },
    { icon: MapPin, label: data?.personal_info?.location },
    {
      icon: Linkedin,
      label: linkedinLabel,
      href: data?.personal_info?.linkedin?.startsWith("http") ? data?.personal_info?.linkedin : `https://${data?.personal_info?.linkedin}`,
    },
    {
      icon: Github,
      label: githubLabel,
      href: data?.personal_info?.github?.startsWith("http") ? data?.personal_info?.github : `https://${data?.personal_info?.github}`,
    },
    {
      icon: Globe,
      label: websiteLabel,
      href: data?.personal_info?.website?.startsWith("http") ? data?.personal_info?.website : `https://${data?.personal_info?.website}`,
    },
  ].filter((item) => item.label);

  const SectionTitle = ({ children, continuation = false }) => (
    <h2
      className="text-xs font-bold uppercase tracking-[0.25em] mb-3 pb-1 border-b border-slate-200 flex items-center justify-between"
      style={{ color: accentColor }}
    >
      <span>{children}</span>
      {continuation && <span className="text-[10px] lowercase font-normal text-slate-400 font-sans">(continued)</span>}
    </h2>
  );

  // Pagination filters
  const showHeader = pageContent ? pageContent.showHeader : true;
  const showSummary = pageContent ? pageContent.showSummary : Boolean(data?.professional_summary?.trim());
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
  const showProjTitle = pageContent
    ? pageContent.showProjectsTitle || pageContent.showProjectsContinuationTitle
    : true;
  const isProjContinuation = pageContent ? pageContent.showProjectsContinuationTitle : false;

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
    "experience",
    "projects",
    "education",
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

  const renderSection = (sectionKey) => {
    switch (sectionKey) {
      case "summary":
        return showSummary && data?.professional_summary ? (
          <section key="summary" data-resume-section="summary" className="mb-5 break-inside-avoid">
            <SectionTitle>Professional Summary</SectionTitle>
            <p className="text-slate-700 leading-relaxed text-justify text-xs sm:text-sm">
              {data.professional_summary}
            </p>
          </section>
        ) : null;

      case "experience":
        return showExperience ? (
          <section key="experience" className="mb-5">
            {showExpTitle && (
              <div data-resume-section="experience-title">
                <SectionTitle continuation={isExpContinuation}>Work Experience</SectionTitle>
              </div>
            )}

            <div className="space-y-4">
              {visibleExpIndices.map((origIdx) => {
                const exp = data?.experience?.[origIdx];
                if (!exp) return null;
                return (
                  <div
                    key={origIdx}
                    data-resume-item="experience"
                    className="break-inside-avoid"
                  >
                    <div className="flex justify-between items-baseline flex-wrap gap-x-4">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{exp.position}</h3>
                      <span className="text-[11px] font-normal text-slate-400">
                        {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-600 mb-1">{exp.company}</p>

                    {exp.description && (
                      <ul className="space-y-1 text-xs text-slate-600 pl-4 list-disc">
                        {exp.description.split("\n").filter(Boolean).map((line, i) => (
                          <li key={i}>
                            <span>{line.replace(/^[•*–-]\s*/, "")}</span>
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
          <section key="projects" className="mb-5">
            {showProjTitle && (
              <div data-resume-section="projects-title">
                <SectionTitle continuation={isProjContinuation}>Key Projects</SectionTitle>
              </div>
            )}

            <div className="space-y-3">
              {visibleProjIndices.map((origIdx) => {
                const proj = data?.project?.[origIdx];
                if (!proj) return null;
                return (
                  <div
                    key={origIdx}
                    data-resume-item="project"
                    className="break-inside-avoid"
                  >
                    <div className="flex justify-between items-baseline flex-wrap gap-x-4">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{proj.name}</h3>
                      {proj.type && (
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">
                          {proj.type}
                        </span>
                      )}
                    </div>

                    {proj.description && (
                      <ul className="mt-1 space-y-1 text-xs text-slate-600 pl-4 list-disc">
                        {proj.description.split("\n").filter(Boolean).map((line, i) => (
                          <li key={i}>
                            <span>{line.replace(/^[•*–-]\s*/, "")}</span>
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

      case "education":
        return showEducation ? (
          <section key="education" className="mb-5">
            {showEduTitle && (
              <div data-resume-section="education-title">
                <SectionTitle continuation={isEduContinuation}>Education</SectionTitle>
              </div>
            )}

            <div className="space-y-3">
              {visibleEduIndices.map((origIdx) => {
                const edu = data?.education?.[origIdx];
                if (!edu) return null;
                return (
                  <div
                    key={origIdx}
                    data-resume-item="education"
                    className="flex justify-between items-start gap-4 break-inside-avoid"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-xs text-slate-600">{edu.institution}</p>
                      {edu.gpa && <p className="text-[11px] text-slate-400 mt-0.5">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                      {formatDate(edu.graduation_date)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null;

      case "certifications":
        return showCertifications ? (
          <section key="certifications" className="mb-5">
            {showCertTitle && (
              <div data-resume-section="certifications-title">
                <SectionTitle>Certifications & Credentials</SectionTitle>
              </div>
            )}
            <div className="space-y-2.5">
              {visibleCertIndices.map((origIdx) => {
                const cert = data?.certifications?.[origIdx];
                if (!cert) return null;
                return (
                  <div key={origIdx} data-resume-item="certification" className="flex justify-between items-start gap-3 break-inside-avoid">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{cert.name}</h3>
                        {cert.url && (
                          <a
                            href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-semibold hover:underline"
                            style={{ color: accentColor }}
                          >
                            [Verify]
                          </a>
                        )}
                      </div>
                      {cert.issuer && <p className="text-xs text-slate-600">{cert.issuer}</p>}
                    </div>
                    {cert.date && (
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {formatDate(cert.date)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null;

      case "achievements":
        return showAchievements ? (
          <section key="achievements" className="mb-5">
            {showAchieveTitle && (
              <div data-resume-section="achievements-title">
                <SectionTitle>Honors & Achievements</SectionTitle>
              </div>
            )}
            <div className="space-y-2.5">
              {visibleAchieveIndices.map((origIdx) => {
                const item = data?.achievements?.[origIdx];
                if (!item) return null;
                return (
                  <div key={origIdx} data-resume-item="achievement" className="break-inside-avoid">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h3>
                      {item.date && (
                        <span className="text-[11px] text-slate-400 whitespace-nowrap">
                          {formatDate(item.date)}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null;

      case "custom_sections":
        return showCustomSections && data?.custom_sections && data.custom_sections.length > 0 ? (
          <React.Fragment key="custom_sections">
            {data.custom_sections.map((sec, sIdx) => {
              if (!sec.title && (!sec.items || sec.items.length === 0)) return null;
              return (
                <section key={sIdx} className="mb-5">
                  <div data-resume-section="custom-section-title">
                    <SectionTitle>{sec.title || "Additional Information"}</SectionTitle>
                  </div>
                  <div className="space-y-3">
                    {(sec.items || []).map((item, iIdx) => (
                      <div key={iIdx} data-resume-item="custom-item" className="break-inside-avoid">
                        <div className="flex justify-between items-baseline gap-2">
                          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h3>
                          {item.date && (
                            <span className="text-[11px] text-slate-400 whitespace-nowrap">
                              {item.date}
                            </span>
                          )}
                        </div>
                        {item.subtitle && <p className="text-xs text-slate-600 font-medium italic">{item.subtitle}</p>}
                        {item.description && (
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed whitespace-pre-line">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </React.Fragment>
        ) : null;

      case "languages":
        return showLanguages && data?.languages && data.languages.length > 0 ? (
          <section key="languages" data-resume-section="languages" className="mb-5 break-inside-avoid">
            <SectionTitle>Languages</SectionTitle>
            <div className="flex flex-wrap items-center gap-y-2 text-xs leading-relaxed text-slate-700">
              {data.languages.map((lang, index) => (
                <span key={index} className="inline-flex items-center">
                  {index > 0 && <span className="mx-2.5 font-bold select-none text-slate-300">•</span>}
                  <span className="font-semibold text-slate-900">{lang.language}</span>
                  {lang.proficiency && <span className="text-slate-500 ml-1">({lang.proficiency})</span>}
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
          <section key="personal_details" data-resume-section="personal_details" className="mb-5 break-inside-avoid">
            <SectionTitle>Personal Details</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs text-slate-700">
              {pd.date_of_birth && (
                <div>
                  <span className="font-semibold text-slate-900">Date of Birth: </span>
                  <span>{formatDate(pd.date_of_birth)}</span>
                </div>
              )}
              {pd.gender && (
                <div>
                  <span className="font-semibold text-slate-900">Gender: </span>
                  <span>{pd.gender}</span>
                </div>
              )}
              {pd.nationality && (
                <div>
                  <span className="font-semibold text-slate-900">Nationality: </span>
                  <span>{pd.nationality}</span>
                </div>
              )}
              {pd.marital_status && (
                <div>
                  <span className="font-semibold text-slate-900">Marital Status: </span>
                  <span>{pd.marital_status}</span>
                </div>
              )}
              {pd.passport_no && (
                <div>
                  <span className="font-semibold text-slate-900">Passport / ID: </span>
                  <span>{pd.passport_no}</span>
                </div>
              )}
              {pd.address && (
                <div className="col-span-2 sm:col-span-3">
                  <span className="font-semibold text-slate-900">Permanent Address: </span>
                  <span>{pd.address}</span>
                </div>
              )}
            </div>
          </section>
        );
      }

      case "declaration": {
        const dec = data?.declaration;
        const hasDec = dec && (dec.statement || dec.place || dec.date || dec.name);
        if (!hasDec) return null;
        return (
          <section key="declaration" data-resume-section="declaration" className="mb-5 break-inside-avoid">
            <SectionTitle>Declaration</SectionTitle>
            {dec.statement && (
              <p className="text-slate-700 leading-relaxed text-xs text-justify mb-3">
                {dec.statement}
              </p>
            )}
            <div className="flex justify-between items-end text-xs text-slate-700 pt-1">
              <div className="space-y-0.5">
                {dec.place && <div><span className="font-semibold text-slate-900">Place:</span> {dec.place}</div>}
                {dec.date && <div><span className="font-semibold text-slate-900">Date:</span> {formatDate(dec.date)}</div>}
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  {dec.name || data?.personal_info?.full_name || ""}
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">(Signature)</div>
              </div>
            </div>
          </section>
        );
      }

      case "skills":
        return showSkills && data?.skills && data.skills.length > 0 ? (
          <section key="skills" data-resume-section="skills" className="break-inside-avoid">
            <SectionTitle>Core Competencies</SectionTitle>
            <div className="flex flex-wrap items-center gap-y-2 text-xs leading-relaxed text-slate-700">
              {data.skills.map((skill, index) => (
                <span key={index} className="inline-flex items-center">
                  {index > 0 && (
                    <span className="mx-2.5 font-bold select-none text-slate-300">
                      •
                    </span>
                  )}
                  <span className="font-semibold text-slate-800 tracking-wide">
                    {skill}
                  </span>
                </span>
              ))}
            </div>
          </section>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 font-sans text-xs sm:text-sm leading-relaxed">
      {/* HEADER */}
      {showHeader && (
        <header data-resume-section="header" className="mb-6 pb-2">
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900">
            {data?.personal_info?.full_name || "Your Name"}
          </h1>

          {data?.personal_info?.profession && (
            <p className="mt-1 text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-500 font-medium">
              {data.personal_info.profession}
            </p>
          )}

          {contactItems.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
              {contactItems.map(({ icon: Icon, label, href }, index) => {
                const Tag = href ? "a" : "span";
                return (
                  <React.Fragment key={index}>
                    {index > 0 && <span className="text-slate-300 select-none">•</span>}
                    <Tag
                      {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
                      className={`inline-flex items-center gap-1 ${href ? "hover:underline text-slate-700 hover:text-slate-900" : ""}`}
                    >
                      <Icon size={12} className="shrink-0 text-slate-400" />
                      <span className="break-all">{label}</span>
                    </Tag>
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <div className="mt-4 h-[1px] bg-slate-200" />
        </header>
      )}

      {/* SECTIONS IN EXTRACTED / CONFIGURED HEADING SEQUENCE */}
      {orderedSections.map((secKey) => renderSection(secKey))}
    </div>
  );
};

export default MinimalTemplate;