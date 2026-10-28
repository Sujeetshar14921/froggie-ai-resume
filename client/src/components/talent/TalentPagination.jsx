import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TalentPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 pt-4">
      <button
        type="button"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs text-xs font-bold flex items-center gap-1"
      >
        <ChevronLeft size={14} />
        <span>Prev</span>
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => setCurrentPage(page)}
          className={`size-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            currentPage === page
              ? "bg-slate-950 text-white shadow-xs scale-105"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs text-xs font-bold flex items-center gap-1"
      >
        <span>Next</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default TalentPagination;
