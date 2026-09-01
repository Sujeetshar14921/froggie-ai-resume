/**
 * Smart Resume Pagination Engine
 * Measures semantic blocks under strict A4 dimensions (210mm x 297mm @ 96 DPI)
 * and partitions resume content across pages preventing orphaned titles,
 * cut-off bullet items, and layout breakage.
 */

// A4 Dimensions in Pixels at 96 DPI (Standard Web Standard: 210mm x 297mm)
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

// Default usable height settings (A4 height minus top and bottom page paddings)
export const PAGE_PADDING_TOP_PX = 36;
export const PAGE_PADDING_BOTTOM_PX = 36;
export const USABLE_PAGE_HEIGHT_PX = A4_HEIGHT_PX - PAGE_PADDING_TOP_PX - PAGE_PADDING_BOTTOM_PX; // ~1051px

/**
 * Calculates item-by-item page distribution for single-column templates
 * (Classic, Modern, Minimal, Boardroom)
 *
 * @param {HTMLElement} container - Measured DOM element in sandbox
 * @param {Object} resumeData - Resume data object
 * @returns {Array<Object>} Array of page specifications
 */
export const paginateSingleColumn = (container, resumeData) => {
  if (!container || !resumeData) {
    return [createDefaultSingleColumnPage(resumeData)];
  }

  const pages = [];
  let currentPage = createEmptySingleColumnPage();
  let currentHeight = 0;
  const maxPageHeight = USABLE_PAGE_HEIGHT_PX;

  // 1. Measure Header
  const headerEl = container.querySelector('[data-resume-section="header"]');
  const headerHeight = headerEl ? getElementHeightWithMargin(headerEl) : 0;
  currentPage.showHeader = true;
  currentHeight += headerHeight;

  // 2. Measure Summary
  if (resumeData.professional_summary) {
    const summaryEl = container.querySelector('[data-resume-section="summary"]');
    const summaryHeight = summaryEl ? getElementHeightWithMargin(summaryEl) : 0;

    if (currentHeight + summaryHeight <= maxPageHeight) {
      currentPage.showSummary = true;
      currentHeight += summaryHeight;
    } else {
      // Summary doesn't fit on Page 1 -> push to Page 2
      pages.push(currentPage);
      currentPage = createEmptySingleColumnPage();
      currentPage.showSummary = true;
      currentHeight = summaryHeight;
    }
  }

  // 3. Measure Experience
  const expList = resumeData.experience || [];
  if (expList.length > 0) {
    const expTitleEl = container.querySelector('[data-resume-section="experience-title"]');
    const expTitleHeight = expTitleEl ? getElementHeightWithMargin(expTitleEl) : 38;

    const expItemEls = Array.from(
      container.querySelectorAll('[data-resume-item="experience"]')
    );

    let isSectionStarted = false;

    expList.forEach((exp, idx) => {
      const itemEl = expItemEls[idx];
      const itemHeight = itemEl ? getElementHeightWithMargin(itemEl) : 90;

      if (!isSectionStarted) {
        // Need space for section title + at least the first item
        if (currentHeight + expTitleHeight + itemHeight <= maxPageHeight) {
          currentPage.showExperienceTitle = true;
          currentPage.experienceIndices.push(idx);
          currentHeight += expTitleHeight + itemHeight;
          isSectionStarted = true;
        } else {
          // Move title + item to next page to prevent orphan heading
          pages.push(currentPage);
          currentPage = createEmptySingleColumnPage();
          currentPage.showExperienceTitle = true;
          currentPage.experienceIndices.push(idx);
          currentHeight = expTitleHeight + itemHeight;
          isSectionStarted = true;
        }
      } else {
        // Section already started
        if (currentHeight + itemHeight <= maxPageHeight) {
          currentPage.experienceIndices.push(idx);
          currentHeight += itemHeight;
        } else {
          // Move item to next page
          pages.push(currentPage);
          currentPage = createEmptySingleColumnPage();
          currentPage.showExperienceContinuationTitle = true;
          currentPage.experienceIndices.push(idx);
          currentHeight = itemHeight + 24;
        }
      }
    });
  }

  // 4. Measure Projects
  const projList = resumeData.project || [];
  if (projList.length > 0) {
    const projTitleEl = container.querySelector('[data-resume-section="projects-title"]');
    const projTitleHeight = projTitleEl ? getElementHeightWithMargin(projTitleEl) : 38;

    const projItemEls = Array.from(
      container.querySelectorAll('[data-resume-item="project"]')
    );

    let isSectionStarted = false;

    projList.forEach((proj, idx) => {
      const itemEl = projItemEls[idx];
      const itemHeight = itemEl ? getElementHeightWithMargin(itemEl) : 75;

      if (!isSectionStarted) {
        if (currentHeight + projTitleHeight + itemHeight <= maxPageHeight) {
          currentPage.showProjectsTitle = true;
          currentPage.projectIndices.push(idx);
          currentHeight += projTitleHeight + itemHeight;
          isSectionStarted = true;
        } else {
          pages.push(currentPage);
          currentPage = createEmptySingleColumnPage();
          currentPage.showProjectsTitle = true;
          currentPage.projectIndices.push(idx);
          currentHeight = projTitleHeight + itemHeight;
          isSectionStarted = true;
        }
      } else {
        if (currentHeight + itemHeight <= maxPageHeight) {
          currentPage.projectIndices.push(idx);
          currentHeight += itemHeight;
        } else {
          pages.push(currentPage);
          currentPage = createEmptySingleColumnPage();
          currentPage.showProjectsContinuationTitle = true;
          currentPage.projectIndices.push(idx);
          currentHeight = itemHeight + 24;
        }
      }
    });
  }

  // 5. Measure Education
  const eduList = resumeData.education || [];
  if (eduList.length > 0) {
    const eduTitleEl = container.querySelector('[data-resume-section="education-title"]');
    const eduTitleHeight = eduTitleEl ? getElementHeightWithMargin(eduTitleEl) : 38;

    const eduItemEls = Array.from(
      container.querySelectorAll('[data-resume-item="education"]')
    );

    let isSectionStarted = false;

    eduList.forEach((edu, idx) => {
      const itemEl = eduItemEls[idx];
      const itemHeight = itemEl ? getElementHeightWithMargin(itemEl) : 60;

      if (!isSectionStarted) {
        if (currentHeight + eduTitleHeight + itemHeight <= maxPageHeight) {
          currentPage.showEducationTitle = true;
          currentPage.educationIndices.push(idx);
          currentHeight += eduTitleHeight + itemHeight;
          isSectionStarted = true;
        } else {
          pages.push(currentPage);
          currentPage = createEmptySingleColumnPage();
          currentPage.showEducationTitle = true;
          currentPage.educationIndices.push(idx);
          currentHeight = eduTitleHeight + itemHeight;
          isSectionStarted = true;
        }
      } else {
        if (currentHeight + itemHeight <= maxPageHeight) {
          currentPage.educationIndices.push(idx);
          currentHeight += itemHeight;
        } else {
          pages.push(currentPage);
          currentPage = createEmptySingleColumnPage();
          currentPage.showEducationContinuationTitle = true;
          currentPage.educationIndices.push(idx);
          currentHeight = itemHeight + 24;
        }
      }
    });
  }

  // 6. Measure Skills
  const skillsList = resumeData.skills || [];
  if (skillsList.length > 0) {
    const skillsEl = container.querySelector('[data-resume-section="skills"]');
    const skillsHeight = skillsEl ? getElementHeightWithMargin(skillsEl) : 65;

    if (currentHeight + skillsHeight <= maxPageHeight) {
      currentPage.showSkills = true;
      currentHeight += skillsHeight;
    } else {
      pages.push(currentPage);
      currentPage = createEmptySingleColumnPage();
      currentPage.showSkills = true;
      currentHeight = skillsHeight;
    }
  }

  // Push final page
  pages.push(currentPage);

  return pages.length > 0 ? pages : [createDefaultSingleColumnPage(resumeData)];
};

/**
 * Calculates page distribution for two-column templates
 * (MinimalImageTemplate, ExecutiveTemplate)
 *
 * @param {HTMLElement} container - Measured DOM element in sandbox
 * @param {Object} resumeData - Resume data object
 * @returns {Array<Object>} Array of two-column page specifications
 */
export const paginateTwoColumn = (container, resumeData) => {
  if (!container || !resumeData) {
    return [createDefaultTwoColumnPage(resumeData)];
  }

  const maxPageHeight = USABLE_PAGE_HEIGHT_PX;

  // --- 1. SIDEBAR PAGINATION ---
  const sidebarPages = [];
  let currentSidebarPage = createEmptySidebarPage();
  let currentSidebarHeight = 0;

  // Sidebar Avatar / Profile Header
  const avatarEl = container.querySelector('[data-resume-sidebar="avatar"]');
  const avatarHeight = avatarEl ? getElementHeightWithMargin(avatarEl) : 120;
  currentSidebarPage.showAvatar = true;
  currentSidebarHeight += avatarHeight;

  // Sidebar Contact Details
  const contactEl = container.querySelector('[data-resume-sidebar="contact"]');
  const contactHeight = contactEl ? getElementHeightWithMargin(contactEl) : 110;
  if (currentSidebarHeight + contactHeight <= maxPageHeight) {
    currentSidebarPage.showContact = true;
    currentSidebarHeight += contactHeight;
  } else {
    sidebarPages.push(currentSidebarPage);
    currentSidebarPage = createEmptySidebarPage();
    currentSidebarPage.showContact = true;
    currentSidebarHeight = contactHeight;
  }

  // Sidebar Education
  const eduList = resumeData.education || [];
  if (eduList.length > 0) {
    const eduTitleEl = container.querySelector('[data-resume-sidebar="education-title"]');
    const eduTitleHeight = eduTitleEl ? getElementHeightWithMargin(eduTitleEl) : 32;

    const eduItemEls = Array.from(
      container.querySelectorAll('[data-resume-sidebar-item="education"]')
    );

    let isEduStarted = false;

    eduList.forEach((edu, idx) => {
      const itemEl = eduItemEls[idx];
      const itemHeight = itemEl ? getElementHeightWithMargin(itemEl) : 55;

      if (!isEduStarted) {
        if (currentSidebarHeight + eduTitleHeight + itemHeight <= maxPageHeight) {
          currentSidebarPage.showEducationTitle = true;
          currentSidebarPage.educationIndices.push(idx);
          currentSidebarHeight += eduTitleHeight + itemHeight;
          isEduStarted = true;
        } else {
          sidebarPages.push(currentSidebarPage);
          currentSidebarPage = createEmptySidebarPage();
          currentSidebarPage.showEducationTitle = true;
          currentSidebarPage.educationIndices.push(idx);
          currentSidebarHeight = eduTitleHeight + itemHeight;
          isEduStarted = true;
        }
      } else {
        if (currentSidebarHeight + itemHeight <= maxPageHeight) {
          currentSidebarPage.educationIndices.push(idx);
          currentSidebarHeight += itemHeight;
        } else {
          sidebarPages.push(currentSidebarPage);
          currentSidebarPage = createEmptySidebarPage();
          currentSidebarPage.showEducationTitle = true;
          currentSidebarPage.educationIndices.push(idx);
          currentSidebarHeight = itemHeight + 32;
        }
      }
    });
  }

  // Sidebar Skills
  const skillsList = resumeData.skills || [];
  if (skillsList.length > 0) {
    const skillsEl = container.querySelector('[data-resume-sidebar="skills"]');
    const skillsHeight = skillsEl ? getElementHeightWithMargin(skillsEl) : 100;

    if (currentSidebarHeight + skillsHeight <= maxPageHeight) {
      currentSidebarPage.showSkills = true;
      currentSidebarHeight += skillsHeight;
    } else {
      sidebarPages.push(currentSidebarPage);
      currentSidebarPage = createEmptySidebarPage();
      currentSidebarPage.showSkills = true;
      currentSidebarHeight = skillsHeight;
    }
  }
  sidebarPages.push(currentSidebarPage);

  // --- 2. MAIN COLUMN PAGINATION ---
  const mainPages = [];
  let currentMainPage = createEmptyMainPage();
  let currentMainHeight = 0;

  // Main Header (Name, Profession)
  const mainHeaderEl = container.querySelector('[data-resume-main="header"]');
  const mainHeaderHeight = mainHeaderEl ? getElementHeightWithMargin(mainHeaderEl) : 70;
  currentMainPage.showHeader = true;
  currentMainHeight += mainHeaderHeight;

  // Main Professional Summary
  if (resumeData.professional_summary) {
    const summaryEl = container.querySelector('[data-resume-main="summary"]');
    const summaryHeight = summaryEl ? getElementHeightWithMargin(summaryEl) : 80;

    if (currentMainHeight + summaryHeight <= maxPageHeight) {
      currentMainPage.showSummary = true;
      currentMainHeight += summaryHeight;
    } else {
      mainPages.push(currentMainPage);
      currentMainPage = createEmptyMainPage();
      currentMainPage.showSummary = true;
      currentMainHeight = summaryHeight;
    }
  }

  // Main Experience
  const expList = resumeData.experience || [];
  if (expList.length > 0) {
    const expTitleEl = container.querySelector('[data-resume-main="experience-title"]');
    const expTitleHeight = expTitleEl ? getElementHeightWithMargin(expTitleEl) : 36;

    const expItemEls = Array.from(
      container.querySelectorAll('[data-resume-main-item="experience"]')
    );

    let isExpStarted = false;

    expList.forEach((exp, idx) => {
      const itemEl = expItemEls[idx];
      const itemHeight = itemEl ? getElementHeightWithMargin(itemEl) : 90;

      if (!isExpStarted) {
        if (currentMainHeight + expTitleHeight + itemHeight <= maxPageHeight) {
          currentMainPage.showExperienceTitle = true;
          currentMainPage.experienceIndices.push(idx);
          currentMainHeight += expTitleHeight + itemHeight;
          isExpStarted = true;
        } else {
          mainPages.push(currentMainPage);
          currentMainPage = createEmptyMainPage();
          currentMainPage.showExperienceTitle = true;
          currentMainPage.experienceIndices.push(idx);
          currentMainHeight = expTitleHeight + itemHeight;
          isExpStarted = true;
        }
      } else {
        if (currentMainHeight + itemHeight <= maxPageHeight) {
          currentMainPage.experienceIndices.push(idx);
          currentMainHeight += itemHeight;
        } else {
          mainPages.push(currentMainPage);
          currentMainPage = createEmptyMainPage();
          currentMainPage.showExperienceContinuationTitle = true;
          currentMainPage.experienceIndices.push(idx);
          currentMainHeight = itemHeight + 24;
        }
      }
    });
  }

  // Main Projects
  const projList = resumeData.project || [];
  if (projList.length > 0) {
    const projTitleEl = container.querySelector('[data-resume-main="projects-title"]');
    const projTitleHeight = projTitleEl ? getElementHeightWithMargin(projTitleEl) : 36;

    const projItemEls = Array.from(
      container.querySelectorAll('[data-resume-main-item="project"]')
    );

    let isProjStarted = false;

    projList.forEach((proj, idx) => {
      const itemEl = projItemEls[idx];
      const itemHeight = itemEl ? getElementHeightWithMargin(itemEl) : 75;

      if (!isProjStarted) {
        if (currentMainHeight + projTitleHeight + itemHeight <= maxPageHeight) {
          currentMainPage.showProjectsTitle = true;
          currentMainPage.projectIndices.push(idx);
          currentMainHeight += projTitleHeight + itemHeight;
          isProjStarted = true;
        } else {
          mainPages.push(currentMainPage);
          currentMainPage = createEmptyMainPage();
          currentMainPage.showProjectsTitle = true;
          currentMainPage.projectIndices.push(idx);
          currentMainHeight = projTitleHeight + itemHeight;
          isProjStarted = true;
        }
      } else {
        if (currentMainHeight + itemHeight <= maxPageHeight) {
          currentMainPage.projectIndices.push(idx);
          currentMainHeight += itemHeight;
        } else {
          mainPages.push(currentMainPage);
          currentMainPage = createEmptyMainPage();
          currentMainPage.showProjectsContinuationTitle = true;
          currentMainPage.projectIndices.push(idx);
          currentMainHeight = itemHeight + 24;
        }
      }
    });
  }
  mainPages.push(currentMainPage);

  // Combine Sidebar and Main pages
  const totalPages = Math.max(sidebarPages.length, mainPages.length, 1);
  const combinedPages = [];

  for (let i = 0; i < totalPages; i++) {
    combinedPages.push({
      pageIndex: i,
      sidebar: sidebarPages[i] || createEmptySidebarPage(),
      main: mainPages[i] || createEmptyMainPage(),
    });
  }

  return combinedPages;
};

// Helper methods for empty states
export const createEmptySingleColumnPage = () => ({
  showHeader: false,
  showSummary: false,
  showExperienceTitle: false,
  showExperienceContinuationTitle: false,
  experienceIndices: [],
  showProjectsTitle: false,
  showProjectsContinuationTitle: false,
  projectIndices: [],
  showEducationTitle: false,
  showEducationContinuationTitle: false,
  educationIndices: [],
  showSkills: false,
});

export const createDefaultSingleColumnPage = (resumeData = {}) => ({
  showHeader: true,
  showSummary: Boolean(resumeData.professional_summary),
  showExperienceTitle: (resumeData.experience || []).length > 0,
  showExperienceContinuationTitle: false,
  experienceIndices: (resumeData.experience || []).map((_, i) => i),
  showProjectsTitle: (resumeData.project || []).length > 0,
  showProjectsContinuationTitle: false,
  projectIndices: (resumeData.project || []).map((_, i) => i),
  showEducationTitle: (resumeData.education || []).length > 0,
  showEducationContinuationTitle: false,
  educationIndices: (resumeData.education || []).map((_, i) => i),
  showSkills: (resumeData.skills || []).length > 0,
});

export const createEmptySidebarPage = () => ({
  showAvatar: false,
  showContact: false,
  showEducationTitle: false,
  educationIndices: [],
  showSkills: false,
});

export const createEmptyMainPage = () => ({
  showHeader: false,
  showSummary: false,
  showExperienceTitle: false,
  showExperienceContinuationTitle: false,
  experienceIndices: [],
  showProjectsTitle: false,
  showProjectsContinuationTitle: false,
  projectIndices: [],
});

export const createDefaultTwoColumnPage = (resumeData = {}) => ({
  pageIndex: 0,
  sidebar: {
    showAvatar: true,
    showContact: true,
    showEducationTitle: (resumeData.education || []).length > 0,
    educationIndices: (resumeData.education || []).map((_, i) => i),
    showSkills: (resumeData.skills || []).length > 0,
  },
  main: {
    showHeader: true,
    showSummary: Boolean(resumeData.professional_summary),
    showExperienceTitle: (resumeData.experience || []).length > 0,
    showExperienceContinuationTitle: false,
    experienceIndices: (resumeData.experience || []).map((_, i) => i),
    showProjectsTitle: (resumeData.project || []).length > 0,
    showProjectsContinuationTitle: false,
    projectIndices: (resumeData.project || []).map((_, i) => i),
  },
});

/**
 * Calculates element height including top and bottom margins
 */
const getElementHeightWithMargin = (el) => {
  if (!el) return 0;
  const style = window.getComputedStyle ? window.getComputedStyle(el) : null;
  const height = el.getBoundingClientRect().height || el.offsetHeight || 0;
  if (!style) return height;

  const marginTop = parseFloat(style.marginTop) || 0;
  const marginBottom = parseFloat(style.marginBottom) || 0;
  return height + marginTop + marginBottom;
};

export default {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  PAGE_PADDING_TOP_PX,
  PAGE_PADDING_BOTTOM_PX,
  USABLE_PAGE_HEIGHT_PX,
  paginateSingleColumn,
  paginateTwoColumn,
  createEmptySingleColumnPage,
  createDefaultSingleColumnPage,
  createDefaultTwoColumnPage,
};
