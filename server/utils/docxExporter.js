import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Packer } from "docx";

export const generateResumeDocxBuffer = async (resume) => {
  const pInfo = resume.personal_info || {};
  const children = [];

  // Full Name Header
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: (pInfo.full_name || resume.title || "Resume").toUpperCase(),
          bold: true,
          size: 32, // 16pt
          color: "111827",
        }),
      ],
    })
  );

  // Profession Subtitle
  if (pInfo.profession) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: pInfo.profession,
            bold: true,
            size: 24, // 12pt
            color: "4B5563",
          }),
        ],
      })
    );
  }

  // Contact Info Line
  const contactParts = [
    pInfo.email,
    pInfo.phone,
    pInfo.location,
    pInfo.linkedin,
    pInfo.github,
    pInfo.website,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: contactParts.join("  |  "),
            size: 20, // 10pt
            color: "6B7280",
          }),
        ],
      })
    );
  }

  const addSectionTitle = (title) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: "059669",
            space: 4,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24, // 12pt
            color: "059669",
          }),
        ],
      })
    );
  };

  // Professional Summary
  if (resume.professional_summary && resume.professional_summary.trim()) {
    addSectionTitle("Professional Summary");
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: resume.professional_summary.trim(),
            size: 22,
            color: "374151",
          }),
        ],
      })
    );
  }

  // Experience
  if (Array.isArray(resume.experience) && resume.experience.length > 0) {
    addSectionTitle("Work Experience");
    resume.experience.forEach((exp) => {
      const titleLine = [exp.position, exp.company].filter(Boolean).join(" — ");
      const dateLine = [exp.start_date, exp.is_current ? "Present" : exp.end_date]
        .filter(Boolean)
        .join(" - ");

      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({ text: titleLine, bold: true, size: 22, color: "1F2937" }),
            dateLine ? new TextRun({ text: `  (${dateLine})`, italics: true, size: 20, color: "6B7280" }) : new TextRun(""),
          ],
        })
      );

      if (exp.description) {
        const lines = exp.description.split("\n").filter((l) => l.trim());
        lines.forEach((l) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60 },
              children: [
                new TextRun({
                  text: l.replace(/^[•\-\*]\s*/, ""),
                  size: 21,
                  color: "4B5563",
                }),
              ],
            })
          );
        });
      }
    });
  }

  // Projects
  if (Array.isArray(resume.project) && resume.project.length > 0) {
    addSectionTitle("Key Projects");
    resume.project.forEach((proj) => {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({ text: proj.name || "Project", bold: true, size: 22, color: "1F2937" }),
            proj.type ? new TextRun({ text: ` (${proj.type})`, italics: true, size: 20, color: "6B7280" }) : new TextRun(""),
          ],
        })
      );
      if (proj.description) {
        children.push(
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: proj.description, size: 21, color: "4B5563" }),
            ],
          })
        );
      }
    });
  }

  // Skills
  if (Array.isArray(resume.skills) && resume.skills.length > 0) {
    addSectionTitle("Technical & Core Skills");
    children.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({
            text: resume.skills.join("  •  "),
            bold: true,
            size: 21,
            color: "1F2937",
          }),
        ],
      })
    );
  }

  // Education
  if (Array.isArray(resume.education) && resume.education.length > 0) {
    addSectionTitle("Education");
    resume.education.forEach((edu) => {
      const degField = [edu.degree, edu.field].filter(Boolean).join(" in ");
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({ text: degField || "Degree", bold: true, size: 22, color: "1F2937" }),
            edu.institution ? new TextRun({ text: ` — ${edu.institution}`, size: 21, color: "4B5563" }) : new TextRun(""),
            edu.graduation_date ? new TextRun({ text: ` (${edu.graduation_date})`, italics: true, size: 20, color: "6B7280" }) : new TextRun(""),
            edu.gpa ? new TextRun({ text: ` [GPA: ${edu.gpa}]`, bold: true, size: 20, color: "059669" }) : new TextRun(""),
          ],
        })
      );
    });
  }

  // Certifications
  if (Array.isArray(resume.certifications) && resume.certifications.length > 0) {
    addSectionTitle("Certifications");
    resume.certifications.forEach((cert) => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [
            new TextRun({ text: cert.name || "Certification", bold: true, size: 21 }),
            cert.issuer ? new TextRun({ text: ` by ${cert.issuer}`, size: 20, color: "4B5563" }) : new TextRun(""),
            cert.date ? new TextRun({ text: ` (${cert.date})`, italics: true, size: 19, color: "6B7280" }) : new TextRun(""),
          ],
        })
      );
    });
  }

  // Key Achievements
  if (Array.isArray(resume.achievements) && resume.achievements.length > 0) {
    addSectionTitle("Key Achievements");
    resume.achievements.forEach((ach) => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [
            new TextRun({ text: ach.title || "Achievement", bold: true, size: 21 }),
            ach.date ? new TextRun({ text: ` (${ach.date})`, italics: true, size: 19, color: "6B7280" }) : new TextRun(""),
            ach.description ? new TextRun({ text: ` — ${ach.description}`, size: 20, color: "4B5563" }) : new TextRun(""),
          ],
        })
      );
    });
  }

  // Languages
  if (Array.isArray(resume.languages) && resume.languages.length > 0) {
    addSectionTitle("Languages");
    const langStr = resume.languages
      .map((l) => `${l.language || l.name || "Language"}${l.proficiency ? ` (${l.proficiency})` : ""}`)
      .join("  •  ");
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: langStr, size: 21, color: "1F2937" }),
        ],
      })
    );
  }

  // Custom Sections
  if (Array.isArray(resume.custom_sections) && resume.custom_sections.length > 0) {
    resume.custom_sections.forEach((sec) => {
      if (sec.title) {
        addSectionTitle(sec.title);
        (sec.items || []).forEach((item) => {
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 30 },
              children: [
                new TextRun({ text: item.title || "", bold: true, size: 21, color: "1F2937" }),
                item.subtitle ? new TextRun({ text: ` — ${item.subtitle}`, size: 20, color: "059669" }) : new TextRun(""),
                item.date ? new TextRun({ text: ` (${item.date})`, italics: true, size: 19, color: "6B7280" }) : new TextRun(""),
              ],
            })
          );
          if (item.description) {
            children.push(
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: item.description, size: 20, color: "4B5563" }),
                ],
              })
            );
          }
        });
      }
    });
  }

  // Personal Details
  const pDetails = resume.personal_details || {};
  const pDetailParts = [
    pDetails.date_of_birth ? `DOB: ${pDetails.date_of_birth}` : null,
    pDetails.gender ? `Gender: ${pDetails.gender}` : null,
    pDetails.nationality ? `Nationality: ${pDetails.nationality}` : null,
    pDetails.marital_status ? `Marital Status: ${pDetails.marital_status}` : null,
    pDetails.passport_no ? `Passport: ${pDetails.passport_no}` : null,
    pDetails.address ? `Address: ${pDetails.address}` : null,
  ].filter(Boolean);

  if (pDetailParts.length > 0) {
    addSectionTitle("Personal Details");
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({ text: pDetailParts.join("  |  "), size: 20, color: "4B5563" }),
        ],
      })
    );
  }

  // Declaration
  const declaration = resume.declaration || {};
  if (declaration.statement || declaration.name) {
    addSectionTitle("Declaration");
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: declaration.statement || "I hereby declare that the information provided above is true and correct to the best of my knowledge.",
            italics: true,
            size: 20,
            color: "4B5563",
          }),
        ],
      })
    );
    children.push(
      new Paragraph({
        spacing: { before: 80, after: 40 },
        children: [
          new TextRun({ text: `Place: ${declaration.place || ""}`, size: 20, color: "6B7280" }),
          new TextRun({ text: `            Date: ${declaration.date || ""}`, size: 20, color: "6B7280" }),
          new TextRun({ text: `            ${declaration.name || pInfo.full_name || ""}`, bold: true, size: 20, color: "111827" }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
};
