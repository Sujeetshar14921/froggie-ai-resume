import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe, GraduationCap, Sparkles, Briefcase, FolderGit2, Github, Award, Trophy } from "lucide-react";
import { formatDate } from "../../utils/formatters";

const MinimalImageTemplate = ({ data, accentColor = "#0284C7", pageContent = null }) => {
  const initials = (data?.personal_info?.full_name || "Your Name")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  const imageSrc = data?.personal_info?.image
    ? typeof data.personal_info.image === "string"
      ? data.personal_info.image
      : URL.createObjectURL(data.personal_info.image)
    : null;

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

  // Pagination filters (Two-Column format)
  const sidebarContent = pageContent?.sidebar;
  const mainContent = pageContent?.main;

  const showAvatar = sidebarContent ? sidebarContent.showAvatar : true;
  const showContact = sidebarContent ? sidebarContent.showContact : true;
  const showEdu = sidebarContent
    ? sidebarContent.educationIndices && sidebarContent.educationIndices.length > 0
    : Boolean(data?.education && data.education.length > 0);
  const visibleEduIndices = sidebarContent?.educationIndices ?? (data?.education || []).map((_, i) => i);
  const showEduTitle = sidebarContent ? sidebarContent.showEducationTitle : true;
  const showSkills = sidebarContent ? sidebarContent.showSkills : Boolean(data?.skills && data.skills.length > 0);

  const showMainHeader = mainContent ? mainContent.showHeader : true;
  const showSummary = mainContent ? mainContent.showSummary : Boolean(data?.professional_summary?.trim());
  const showExp = mainContent
    ? mainContent.experienceIndices && mainContent.experienceIndices.length > 0
    : Boolean(data?.experience && data.experience.length > 0);
  const visibleExpIndices = mainContent?.experienceIndices ?? (data?.experience || []).map((_, i) => i);
  const showExpTitle = mainContent
    ? mainContent.showExperienceTitle || mainContent.showExperienceContinuationTitle
    : true;
  const isExpContinuation = mainContent ? mainContent.showExperienceContinuationTitle : false;

  const showProj = mainContent
    ? mainContent.projectIndices && mainContent.projectIndices.length > 0
    : Boolean(data?.project && data.project.length > 0);
  const visibleProjIndices = mainContent?.projectIndices ?? (data?.project || []).map((_, i) => i);
  const showProjTitle = mainContent
    ? mainContent.showProjectsTitle || mainContent.showProjectsContinuationTitle
    : true;
  const isProjContinuation = mainContent ? mainContent.showProjectsContinuationTitle : false;

  return (
    <div className="w-full bg-white text-slate-800 font-sans text-xs sm:text-sm leading-relaxed">
      <div className="grid grid-cols-12 min-h-full">
        {/* LEFT SIDEBAR (4 COLUMNS) */}
        <aside className="resume-sidebar col-span-4 bg-slate-50/90 p-5 sm:p-6 border-r border-slate-200 flex flex-col gap-5">
          {/* AVATAR PHOTO */}
          {showAvatar && (
            <div data-resume-sidebar="avatar" className="text-center">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl mx-auto ring-3 ring-white shadow-sm"
                  style={{ backgroundColor: `${accentColor}15` }}
                />
              ) : (
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl mx-auto flex items-center justify-center text-2xl font-black text-white shadow-sm ring-3 ring-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {initials}
                </div>
              )}
            </div>
          )}

          {/* CONTACT INFO */}
          {showContact && (
            <section data-resume-sidebar="contact" className="break-inside-avoid">
              <h2
                className="text-xs font-bold uppercase tracking-[0.16em] pb-1 mb-2.5 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                Contact
              </h2>

              <div className="space-y-2 text-xs text-slate-700">
                {data?.personal_info?.email && (
                  <div className="flex items-start gap-1.5">
                    <Mail size={12} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                    <span className="break-all">{data.personal_info.email}</span>
                  </div>
                )}
                {data?.personal_info?.phone && (
                  <div className="flex items-start gap-1.5">
                    <Phone size={12} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                    <span>{data.personal_info.phone}</span>
                  </div>
                )}
                {data?.personal_info?.location && (
                  <div className="flex items-start gap-1.5">
                    <MapPin size={12} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                    <span>{data.personal_info.location}</span>
                  </div>
                )}
                {data?.personal_info?.linkedin && (
                  <div className="flex items-start gap-1.5">
                    <Linkedin size={12} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                    <a
                      href={data.personal_info.linkedin.startsWith("http") ? data.personal_info.linkedin : `https://${data.personal_info.linkedin}`}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all hover:underline"
                    >
                      {linkedinLabel}
                    </a>
                  </div>
                )}
                {data?.personal_info?.github && (
                  <div className="flex items-start gap-1.5">
                    <Github size={12} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                    <a
                      href={data.personal_info.github.startsWith("http") ? data.personal_info.github : `https://${data.personal_info.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all hover:underline"
                    >
                      {githubLabel}
                    </a>
                  </div>
                )}
                {data?.personal_info?.website && (
                  <div className="flex items-start gap-1.5">
                    <Globe size={12} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                    <a
                      href={data.personal_info.website.startsWith("http") ? data.personal_info.website : `https://${data.personal_info.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all hover:underline"
                    >
                      {websiteLabel}
                    </a>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* EDUCATION IN SIDEBAR */}
          {showEdu && (
            <section data-resume-sidebar="education" className="break-inside-avoid">
              {showEduTitle && (
                <h2
                  data-resume-sidebar="education-title"
                  className="text-xs font-bold uppercase tracking-[0.16em] pb-1 mb-2.5 border-b flex items-center gap-1.5"
                  style={{ color: accentColor, borderColor: `${accentColor}30` }}
                >
                  <GraduationCap size={13} />
                  <span>Education</span>
                </h2>
              )}

              <div className="space-y-2.5 text-xs">
                {visibleEduIndices.map((origIdx) => {
                  const edu = data?.education?.[origIdx];
                  if (!edu) return null;
                  return (
                    <div key={origIdx} data-resume-sidebar-item="education">
                      <p className="font-bold text-slate-900 leading-snug">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                      <p className="text-slate-600 font-medium text-[11px]">{edu.institution}</p>
                      <div className="flex justify-between items-center text-[10.5px] text-slate-400 mt-0.5">
                        <span>{formatDate(edu.graduation_date)}</span>
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* SKILLS IN SIDEBAR */}
          {showSkills && data?.skills && data.skills.length > 0 && (
            <section data-resume-sidebar="skills" className="break-inside-avoid">
              <h2
                className="text-xs font-bold uppercase tracking-[0.16em] pb-1 mb-2.5 border-b flex items-center gap-1.5"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                <Sparkles size={13} />
                <span>Skills</span>
              </h2>

              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-white text-slate-800 rounded border border-slate-200 text-[11px] font-medium shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* RIGHT MAIN CONTENT (8 COLUMNS) */}
        <main className="col-span-8 p-6 sm:p-7 space-y-5">
          {/* HEADER / NAME */}
          {showMainHeader && (
            <header data-resume-main="header" className="border-b border-slate-100 pb-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
                {data?.personal_info?.full_name || "Your Name"}
              </h1>
              {data?.personal_info?.profession && (
                <p
                  className="mt-0.5 text-xs sm:text-sm font-bold uppercase tracking-[0.16em]"
                  style={{ color: accentColor }}
                >
                  {data.personal_info.profession}
                </p>
              )}
            </header>
          )}

          {/* PROFESSIONAL SUMMARY */}
          {showSummary && data?.professional_summary && (
            <section data-resume-main="summary" className="break-inside-avoid">
              <h2
                className="text-xs font-bold uppercase tracking-[0.16em] mb-2 pb-1 border-b"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                Professional Summary
              </h2>
              <p className="text-slate-700 leading-relaxed text-justify text-xs sm:text-sm">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* EXPERIENCE */}
          {showExp && (
            <section>
              {showExpTitle && (
                <h2
                  data-resume-main="experience-title"
                  className="text-xs font-bold uppercase tracking-[0.16em] mb-3 pb-1 border-b flex items-center gap-1.5"
                  style={{ color: accentColor, borderColor: `${accentColor}30` }}
                >
                  <Briefcase size={13} />
                  <span>Work Experience</span>
                  {isExpContinuation && <span className="text-[10px] lowercase font-normal text-slate-400">(cont.)</span>}
                </h2>
              )}

              <div className="space-y-4">
                {visibleExpIndices.map((origIdx) => {
                  const exp = data?.experience?.[origIdx];
                  if (!exp) return null;
                  return (
                    <div key={origIdx} data-resume-main-item="experience" className="break-inside-avoid">
                      <div className="flex flex-wrap justify-between items-baseline gap-x-3">
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{exp.position}</h3>
                        <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                          {formatDate(exp.start_date)} — {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        </span>
                      </div>

                      <p className="text-xs font-semibold mb-1" style={{ color: accentColor }}>
                        {exp.company}
                      </p>

                      {exp.description && (
                        <ul className="space-y-1 text-slate-700 leading-relaxed text-xs pl-4 list-disc">
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

          {/* PROJECTS */}
          {showProj && (
            <section>
              {showProjTitle && (
                <h2
                  data-resume-main="projects-title"
                  className="text-xs font-bold uppercase tracking-[0.16em] mb-3 pb-1 border-b flex items-center gap-1.5"
                  style={{ color: accentColor, borderColor: `${accentColor}30` }}
                >
                  <FolderGit2 size={13} />
                  <span>Key Projects</span>
                  {isProjContinuation && <span className="text-[10px] lowercase font-normal text-slate-400">(cont.)</span>}
                </h2>
              )}

              <div className="space-y-3">
                {visibleProjIndices.map((origIdx) => {
                  const proj = data?.project?.[origIdx];
                  if (!proj) return null;
                  return (
                    <div key={origIdx} data-resume-main-item="project" className="break-inside-avoid">
                      <div className="flex justify-between items-baseline gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{proj.name}</h3>
                        {proj.type && (
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                            {proj.type}
                          </span>
                        )}
                      </div>

                      {proj.description && (
                        <p className="text-slate-700 leading-relaxed mt-0.5 text-xs">
                          {proj.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS */}
          {data?.certifications && data.certifications.length > 0 && (
            <section>
              <h2
                data-resume-main="certifications-title"
                className="text-xs font-bold uppercase tracking-[0.16em] mb-3 pb-1 border-b flex items-center gap-1.5"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                <Award size={13} />
                <span>Certifications</span>
              </h2>

              <div className="space-y-2.5">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} data-resume-main-item="certification" className="flex justify-between items-start gap-2 break-inside-avoid">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
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
                      <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {formatDate(cert.date)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* KEY ACHIEVEMENTS */}
          {data?.achievements && data.achievements.length > 0 && (
            <section>
              <h2
                data-resume-main="achievements-title"
                className="text-xs font-bold uppercase tracking-[0.16em] mb-3 pb-1 border-b flex items-center gap-1.5"
                style={{ color: accentColor, borderColor: `${accentColor}30` }}
              >
                <Trophy size={13} />
                <span>Honors & Achievements</span>
              </h2>

              <div className="space-y-2.5">
                {data.achievements.map((item, idx) => (
                  <div key={idx} data-resume-main-item="achievement" className="break-inside-avoid">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h3>
                      {item.date && (
                        <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
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
        </main>
      </div>
    </div>
  );
};

export default MinimalImageTemplate;