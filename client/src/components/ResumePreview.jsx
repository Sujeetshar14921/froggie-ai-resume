import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import BoardroomTemplate from "./templates/BoardroomTemplate";
import SkillBulletTemplate from "./templates/SkillBulletTemplate";
import IvyLeagueTemplate from "./templates/IvyLeagueTemplate";
import NovaSidebarTemplate from "./templates/NovaSidebarTemplate";
import ApexGridTemplate from "./templates/ApexGridTemplate";
import {
  paginateSingleColumn,
  paginateTwoColumn,
  createDefaultSingleColumnPage,
  createDefaultTwoColumnPage,
} from "../utils/resumePaginator";

const ResumePreview = ({
  data,
  template = "classic",
  accentColor = "#3B82F6",
  classes = "",
  autoFitSinglePage = false,
}) => {
  const authUser = useSelector((state) => state.auth?.user);

  // Fallback to user's account profile photo if resume personal_info.image is empty
  const effectiveData = useMemo(() => {
    if (!data) return data;
    const existingImg = data.personal_info?.image;
    if (existingImg && typeof existingImg === "string" && existingImg.trim()) {
      return data;
    }
    const fallbackImage =
      data.userId?.image ||
      (authUser?.image && (data.userId === authUser._id || !data.userId) ? authUser.image : "");

    if (!fallbackImage) return data;

    return {
      ...data,
      personal_info: {
        ...(data.personal_info || {}),
        image: fallbackImage,
      },
    };
  }, [data, authUser]);

  const measurementRef = useRef(null);
  const isTwoColumn = template === "minimal-image" || template === "nova-sidebar";

  const [pages, setPages] = useState(() => [
    isTwoColumn ? createDefaultTwoColumnPage(effectiveData) : createDefaultSingleColumnPage(effectiveData),
  ]);

  const renderTemplateContent = (pageContent = null) => {
    switch (template) {
      case "skill-bullet":
        return <SkillBulletTemplate data={effectiveData} accentColor={accentColor} pageContent={pageContent} />;
      case "modern":
        return <ModernTemplate data={effectiveData} accentColor={accentColor} pageContent={pageContent} />;
      case "minimal":
        return <MinimalTemplate data={effectiveData} accentColor={accentColor} pageContent={pageContent} />;
      case "minimal-image":
        return <MinimalImageTemplate data={effectiveData} accentColor={accentColor} pageContent={pageContent} />;
      case "executive":
        return <ExecutiveTemplate data={effectiveData} accentColor={accentColor} pageContent={pageContent} />;
      case "boardroom":
        return <BoardroomTemplate data={effectiveData} accentColor={accentColor} pageContent={pageContent} />;
      case "ivy-league":
        return <IvyLeagueTemplate data={effectiveData} accentColor={accentColor} pageContent={pageContent} />;
      case "nova-sidebar":
        return <NovaSidebarTemplate data={effectiveData} accentColor={accentColor} pageContent={pageContent} />;
      case "apex-grid":
        return <ApexGridTemplate data={effectiveData} accentColor={accentColor} pageContent={pageContent} />;
      default:
        return <ClassicTemplate data={effectiveData} accentColor={accentColor} pageContent={pageContent} />;
    }
  };

  // Compute pagination for discrete PDF/Print export in background
  useEffect(() => {
    const computePagination = async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch {
        // Ignore font errors
      }

      if (!measurementRef.current) return;

      if (isTwoColumn) {
        const paginatedPages = paginateTwoColumn(measurementRef.current, effectiveData, autoFitSinglePage);
        setPages(paginatedPages);
      } else {
        const paginatedPages = paginateSingleColumn(measurementRef.current, effectiveData, autoFitSinglePage);
        setPages(paginatedPages);
      }
    };

    const timer = setTimeout(computePagination, 60);
    return () => clearTimeout(timer);
  }, [effectiveData, template, accentColor, isTwoColumn, autoFitSinglePage]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* HIDDEN MEASUREMENT SANDBOX CONTAINER */}
      <div
        ref={measurementRef}
        aria-hidden="true"
        className="fixed -top-[99999px] -left-[99999px] w-[794px] min-h-[1123px] bg-white p-[36px] box-border pointer-events-none opacity-0 select-none z-[-9999]"
      >
        {renderTemplateContent(null)}
      </div>

      {/* DISCRETE A4 PAGES CONTAINER (USED FOR PDF EXPORT & BROWSER PRINT) */}
      <div
        id="resume-pages-container"
        aria-hidden="true"
        className="fixed -top-[99999px] -left-[99999px] w-[794px] pointer-events-none opacity-0 select-none z-[-9999] print:static print:opacity-100 print:pointer-events-auto print:z-auto"
      >
        {pages.map((pageData, pageIdx) => (
          <div
            key={pageIdx}
            id={`resume-page-${pageIdx}`}
            data-page-index={pageIdx}
            className={`resume-page bg-white box-border ${
              isTwoColumn ? "p-0 overflow-hidden" : "p-[36px]"
            }`}
            style={{
              width: "794px",
              height: "1123px",
              minHeight: "1123px",
              maxHeight: "1123px",
              boxSizing: "border-box",
            }}
          >
            <div className="w-full h-full overflow-hidden">
              {renderTemplateContent(pageData)}
            </div>
          </div>
        ))}
      </div>

      {/* VISIBLE LIVE PREVIEW (SEAMLESS CONTINUOUS DOCUMENT - ALL SECTIONS 100% VISIBLE) */}
      <div className="resume-preview-scroll-wrapper w-full h-full overflow-y-auto no-scrollbar hide-scrollbar py-4 px-1 sm:px-3">
        {/* TOP STATUS BADGE */}
        <div className="flex items-center justify-between w-full max-w-[210mm] mx-auto px-3 pb-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none no-print">
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Preview • All Sections
          </span>
          {autoFitSinglePage ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
              Auto-Fit 1-Page Active
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">Continuous Document Flow</span>
          )}
        </div>

        {/* PRIMARY RESUME CONTAINER (ALL SECTIONS DISPLAYED NATURALLY WITHOUT A4 CUTOFF) */}
        <div
          id="resume-preview"
          className={`relative w-full max-w-[210mm] bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-xl mx-auto box-border transition-all ${
            isTwoColumn ? "p-0 overflow-hidden" : autoFitSinglePage ? "p-4 sm:p-6" : "p-6 sm:p-9"
          } ${autoFitSinglePage ? "resume-auto-fit-page [transform:scale(0.98)] origin-top text-[0.95em]" : ""} ${classes}`}
          style={{
            width: "100%",
            maxWidth: "210mm",
            minHeight: "auto",
            height: "auto",
            boxSizing: "border-box",
          }}
        >
          <div id="resume-export-content" className="w-full bg-white relative">
            {renderTemplateContent(null)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;