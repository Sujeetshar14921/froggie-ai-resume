import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";
import { formatDate } from "../../utils/formatters";

const SkillBulletTemplate = ({ data, accentColor = "#10B981", pageContent = null }) => {
  const imageSrc = data?.personal_info?.image
    ? typeof data.personal_info.image === "string"
      ? data.personal_info.image
      : URL.createObjectURL(data.personal_info.image)
    : null;

  const SectionTitle = ({ children, continuation = false }) => (
    <h2
      className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] mb-3 pb-1 border-b-2 flex items-center justify-between font-sans"
      style={{ color: accentColor, borderColor: `${accentColor}35` }}
    >
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: accentColor }} />
        {children}
      </span>
      {continuation && (
        <span className="text-[10px] lowercase font-normal text-slate-400 font-sans">(continued)</span>
      )}
    </h2>
  );

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

  const showSkills = pageContent ? pageContent.showSkills : Boolean(data?.skills && data.skills.length > 0);

  return (
    <div className="w-full bg-white text-slate-800 leading-relaxed font-sans text-xs sm:text-sm">
      {/* PROFESSIONAL ATS LETTERHEAD HEADER */}
      {showHeader && (
        <header data-resume-section="header" className="mb-6 pb-4 border-b-2 border-slate-200">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* OPTIONAL PROFILE AVATAR */}
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Profile"
                className="size-20 sm:size-24 rounded-2xl object-cover ring-2 ring-slate-200 shadow-xs shrink-0"
              />
            )}

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 uppercase leading-none">
                  {data?.personal_info?.full_name || "Your Name"}
                </h1>

                {data?.personal_info?.profession && (
                  <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                    <span className="h-1 w-6 rounded-full" style={{ backgroundColor: accentColor }} />
                    <p
                      className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.2em]"
                      style={{ color: accentColor }}
                    >
                      {data.personal_info.profession}
                    </p>
                  </div>
                )}
              </div>

              {/* CONTACT BADGES ROW */}
              {contactItems.length > 0 && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 pt-1 text-xs text-slate-600">
                  {contactItems.map(({ icon: Icon, label, href }, index) => {
                    const Tag = href ? "a" : "span";
                    return (
                      <Tag
                        key={index}
                        {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
                        className={`inline-flex items-center gap-1.5 ${
                          href
                            ? "hover:text-slate-950 transition-colors"
                            : ""
                        }`}
                      >
                        <span
                          className="size-5 rounded-md flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${accentColor}14`,
                            color: accentColor,
                          }}
                        >
                          <Icon size={11} />
                        </span>
                        <span className="font-medium break-all">{label}</span>
                      </Tag>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* PROFESSIONAL SUMMARY */}
      {showSummary && data?.professional_summary && (
        <section data-resume-section="summary" className="mb-5 break-inside-avoid">
          <SectionTitle>Professional Summary</SectionTitle>
          <p className="text-slate-700 leading-relaxed text-xs sm:text-sm text-justify pl-1">
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* VERTICAL BULLETED SKILLS SECTION */}
      {showSkills && data?.skills && data.skills.length > 0 && (
        <section data-resume-section="skills" className="mb-5 break-inside-avoid">
          <SectionTitle>Technical Skills & Core Competencies</SectionTitle>

          {/* Clean 2-column or 3-column vertical bulleted list */}
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-800 list-none pl-1">
            {data.skills.map((skill, index) => (
              <li key={index} className="flex items-start gap-2 break-inside-avoid">
                <span
                  className="mt-1.5 size-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="font-semibold text-slate-900 leading-tight">
                  {skill}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* WORK EXPERIENCE */}
      {showExperience && (
        <section className="mb-5">
          {showExpTitle && (
            <div data-resume-section="experience-title">
              <SectionTitle continuation={isExpContinuation}>Professional Experience</SectionTitle>
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
                  className="break-inside-avoid pl-1"
                >
                  <div className="flex flex-wrap justify-between items-baseline gap-x-4">
                    <h3 className="font-bold text-slate-950 text-xs sm:text-sm">{exp.position}</h3>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>

                  <p className="text-xs font-semibold mb-1.5" style={{ color: accentColor }}>
                    {exp.company}
                  </p>

                  {exp.description && (
                    <ul className="space-y-1 text-xs text-slate-700 leading-relaxed pl-4 list-disc">
                      {exp.description.split("\n").filter(Boolean).map((line, i) => (
                        <li key={i} className="pl-0.5">
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
      )}

      {/* KEY PROJECTS */}
      {showProjects && (
        <section className="mb-5">
          {showProjTitle && (
            <div data-resume-section="projects-title">
              <SectionTitle continuation={isProjContinuation}>Key Projects</SectionTitle>
            </div>
          )}

          <div className="space-y-3.5">
            {visibleProjIndices.map((origIdx) => {
              const proj = data?.project?.[origIdx];
              if (!proj) return null;
              return (
                <div
                  key={origIdx}
                  data-resume-item="project"
                  className="break-inside-avoid pl-1"
                >
                  <div className="flex flex-wrap justify-between items-baseline gap-x-4">
                    <h3 className="font-bold text-slate-950 text-xs sm:text-sm">{proj.name}</h3>
                    {proj.type && (
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {proj.type}
                      </span>
                    )}
                  </div>

                  {proj.description && (
                    <ul className="mt-1 space-y-1 text-xs text-slate-700 leading-relaxed pl-4 list-disc">
                      {proj.description.split("\n").filter(Boolean).map((line, i) => (
                        <li key={i} className="pl-0.5">
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
      )}

      {/* EDUCATION */}
      {showEducation && (
        <section className="mb-5">
          {showEduTitle && (
            <div data-resume-section="education-title">
              <SectionTitle continuation={isEduContinuation}>Education</SectionTitle>
            </div>
          )}

          <div className="space-y-3 pl-1">
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
                    <h3 className="font-bold text-slate-950 text-xs sm:text-sm">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-xs font-medium text-slate-700">{edu.institution}</p>
                    {edu.gpa && <p className="text-[11px] text-slate-500 mt-0.5">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {formatDate(edu.graduation_date)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CERTIFICATIONS & LICENSES */}
      {data?.certifications && data.certifications.length > 0 && (
        <section className="mb-5">
          <div data-resume-section="certifications-title">
            <SectionTitle>Certifications & Credentials</SectionTitle>
          </div>
          <div className="space-y-2.5 pl-1">
            {data.certifications.map((cert, idx) => (
              <div key={idx} data-resume-item="certification" className="flex justify-between items-start gap-3 break-inside-avoid">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-950 text-xs sm:text-sm">{cert.name}</h3>
                    {cert.url && (
                      <a
                        href={cert.url.startsWith("http") ? cert.url : `https://${cert.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-semibold hover:underline inline-flex items-center gap-0.5"
                        style={{ color: accentColor }}
                      >
                        [Verify]
                      </a>
                    )}
                  </div>
                  {cert.issuer && <p className="text-xs text-slate-600 font-medium">{cert.issuer}</p>}
                </div>
                {cert.date && (
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {formatDate(cert.date)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* KEY ACHIEVEMENTS & HONORS */}
      {data?.achievements && data.achievements.length > 0 && (
        <section className="mb-5">
          <div data-resume-section="achievements-title">
            <SectionTitle>Key Achievements & Honors</SectionTitle>
          </div>
          <div className="space-y-2.5 pl-1">
            {data.achievements.map((item, idx) => (
              <div key={idx} data-resume-item="achievement" className="break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm">{item.title}</h3>
                  {item.date && (
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {formatDate(item.date)}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SkillBulletTemplate;
