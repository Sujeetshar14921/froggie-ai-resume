import React from "react";
import { Languages, Plus, Trash2 } from "lucide-react";

const PROFICIENCY_LEVELS = [
  "Native / Bilingual",
  "Fluent",
  "Proficient",
  "Intermediate",
  "Basic / Conversational",
];

const LanguagesForm = ({ data = [], onChange }) => {
  const addLanguage = () => {
    const newLang = {
      language: "",
      proficiency: "Fluent",
    };
    onChange([...data, newLang]);
  };

  const removeLanguage = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateLanguage = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Languages className="size-5 text-emerald-600" />
            <span>Languages</span>
          </h3>
          <p className="text-sm text-gray-500">
            Add languages you can speak, write, or converse in along with your proficiency level
          </p>
        </div>
        <button
          onClick={addLanguage}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-xl transition-all cursor-pointer border border-emerald-500/30 shadow-xs"
        >
          <Plus className="size-3.5 text-emerald-400" />
          <span>Add Language</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-6 text-gray-500 space-y-2">
          <Languages className="w-12 h-12 mx-auto text-slate-300" />
          <p className="font-semibold text-slate-700 text-sm">No languages added yet.</p>
          <p className="text-xs text-slate-400">
            Adding languages is highly valued for global, remote, or client-facing roles (e.g. English, Spanish, Hindi, German, French).
          </p>
          <button
            onClick={addLanguage}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <Plus className="size-3" />
            <span>Add First Language</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((lang, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-2xl space-y-3 bg-white shadow-2xs"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-200/80">
                    {index + 1}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800">
                    {lang.language || `Language #${index + 1}`}
                  </h4>
                </div>

                <button
                  onClick={() => removeLanguage(index)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                  title="Remove Language"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Language <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lang.language || ""}
                    onChange={(e) => updateLanguage(index, "language", e.target.value)}
                    placeholder="e.g. English, Hindi, Spanish, French"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Proficiency Level</label>
                  <select
                    value={lang.proficiency || "Fluent"}
                    onChange={(e) => updateLanguage(index, "proficiency", e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
                  >
                    {PROFICIENCY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguagesForm;
