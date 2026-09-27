import React from "react";
import { ScrollText, Calendar, MapPin, UserCheck, Sparkles } from "lucide-react";

const DEFAULT_DECLARATION =
  "I hereby declare that all the details and information given above are complete, true, and correct to the best of my knowledge and belief.";

const DeclarationForm = ({ data = {}, candidateName = "", onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleUseDefault = () => {
    handleChange("statement", DEFAULT_DECLARATION);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <ScrollText className="size-5 text-emerald-600" />
          <span>Declaration</span>
        </h3>
        <p className="text-sm text-gray-500">
          Formal statement confirming accuracy of your resume contents (often required in Indian & formal corporate applications)
        </p>
      </div>

      <div className="p-4 border border-gray-200 rounded-2xl space-y-4 bg-white shadow-2xs">
        {/* STATEMENT TEXT */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <ScrollText className="size-3.5 text-slate-400" />
              <span>Declaration Statement</span>
            </label>
            <button
              type="button"
              onClick={handleUseDefault}
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer hover:underline"
            >
              <Sparkles className="size-3" />
              <span>Insert Standard Statement</span>
            </button>
          </div>
          <textarea
            rows={3}
            value={data.statement || ""}
            onChange={(e) => handleChange("statement", e.target.value)}
            placeholder={`e.g. ${DEFAULT_DECLARATION}`}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-3 pt-2">
          {/* PLACE / LOCATION */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="size-3.5 text-slate-400" />
              <span>Place / City</span>
            </label>
            <input
              type="text"
              placeholder="e.g. New Delhi, Mumbai"
              value={data.place || ""}
              onChange={(e) => handleChange("place", e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          {/* DATE */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-slate-400" />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={data.date || ""}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          {/* CANDIDATE NAME / SIGNATURE */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <UserCheck className="size-3.5 text-slate-400" />
              <span>Signatory Name</span>
            </label>
            <input
              type="text"
              placeholder={candidateName || "Your Full Name"}
              value={data.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclarationForm;
