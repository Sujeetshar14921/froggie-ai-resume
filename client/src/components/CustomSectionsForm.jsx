import React, { useState } from "react";
import { Layers, Plus, Trash2, GripVertical, Sparkles, BookOpen, HeartHandshake, Bookmark, FileText } from "lucide-react";

const SUGGESTED_SECTION_TEMPLATES = [
  { title: "Volunteer Experience", icon: HeartHandshake, placeholder: "e.g. Volunteer Lead at Red Cross" },
  { title: "Publications & Research", icon: BookOpen, placeholder: "e.g. AI-driven Resume Optimization, IEEE 2025" },
  { title: "Key Highlights & Honors", icon: Sparkles, placeholder: "e.g. 1st Place National Hackathon" },
  { title: "Hobbies & Interests", icon: Bookmark, placeholder: "e.g. Open Source, Competitive Chess" },
];

const CustomSectionsForm = ({ data = [], onChange, activeCustomIndex = null }) => {
  const [selectedSectionIdx, setSelectedSectionIdx] = useState(
    activeCustomIndex !== null && activeCustomIndex >= 0 && activeCustomIndex < data.length
      ? activeCustomIndex
      : 0
  );

  // Add a brand new custom section
  const handleAddSection = (suggestedTitle = "Additional Section") => {
    const newSection = {
      title: suggestedTitle,
      items: [
        {
          title: "",
          subtitle: "",
          date: "",
          description: "",
        },
      ],
    };
    const updated = [...data, newSection];
    onChange(updated);
    setSelectedSectionIdx(updated.length - 1);
  };

  // Remove an entire custom section
  const handleRemoveSection = (sectionIndex) => {
    const updated = data.filter((_, i) => i !== sectionIndex);
    onChange(updated);
    if (selectedSectionIdx >= updated.length) {
      setSelectedSectionIdx(Math.max(0, updated.length - 1));
    }
  };

  // Update section title
  const handleUpdateSectionTitle = (sectionIndex, newTitle) => {
    const updated = [...data];
    updated[sectionIndex] = { ...updated[sectionIndex], title: newTitle };
    onChange(updated);
  };

  // Add item inside a custom section
  const handleAddItem = (sectionIndex) => {
    const updated = [...data];
    const section = { ...updated[sectionIndex] };
    section.items = [
      ...(section.items || []),
      {
        title: "",
        subtitle: "",
        date: "",
        description: "",
      },
    ];
    updated[sectionIndex] = section;
    onChange(updated);
  };

  // Remove item inside a custom section
  const handleRemoveItem = (sectionIndex, itemIndex) => {
    const updated = [...data];
    const section = { ...updated[sectionIndex] };
    section.items = (section.items || []).filter((_, i) => i !== itemIndex);
    updated[sectionIndex] = section;
    onChange(updated);
  };

  // Update item field inside a custom section
  const handleUpdateItem = (sectionIndex, itemIndex, field, value) => {
    const updated = [...data];
    const section = { ...updated[sectionIndex] };
    const items = [...(section.items || [])];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    section.items = items;
    updated[sectionIndex] = section;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Layers className="size-5 text-emerald-600" />
            <span>Custom & Additional Sections</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">
            Add or edit any custom heading extracted from your uploaded resume or create your own.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleAddSection("Custom Section")}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-xl transition-all cursor-pointer border border-emerald-500/30 shadow-xs self-start sm:self-auto shrink-0"
        >
          <Plus className="size-3.5 text-emerald-400" />
          <span>Add Custom Section</span>
        </button>
      </div>

      {/* ZERO STATE */}
      {data.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/80 border border-dashed border-slate-200 rounded-2xl p-6 space-y-4">
          <Layers className="w-12 h-12 mx-auto text-slate-300" />
          <div className="space-y-1">
            <p className="font-bold text-slate-700 text-sm">No custom sections added yet.</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You can create unique sections like Volunteer Work, Publications, Honors, or Custom Projects.
            </p>
          </div>

          {/* QUICK SUGGESTIONS */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {SUGGESTED_SECTION_TEMPLATES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSection(item.title)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                >
                  <Icon className="size-3.5 text-emerald-600" />
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* SECTION TABS (IF MULTIPLE CUSTOM SECTIONS EXIST) */}
          {data.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200/80">
              {data.map((sec, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSectionIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedSectionIdx === idx
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  <span>{sec.title || `Section ${idx + 1}`}</span>
                  <span className="text-[10px] opacity-70">({sec.items?.length || 0})</span>
                </button>
              ))}
            </div>
          )}

          {/* RENDER CURRENT / ALL CUSTOM SECTIONS */}
          {data.map((sec, sIdx) => {
            // If tabs are shown and multiple exist, show only selected tab
            if (data.length > 1 && sIdx !== selectedSectionIdx) return null;

            return (
              <div
                key={sIdx}
                className="p-4 sm:p-5 border border-slate-200/90 rounded-2xl space-y-4 bg-white shadow-2xs"
              >
                {/* SECTION HEADING CONTROLS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Section Heading Title
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={sec.title || ""}
                        onChange={(e) => handleUpdateSectionTitle(sIdx, e.target.value)}
                        placeholder="e.g. Volunteer Experience, Publications, Key Highlights"
                        className="w-full text-base font-extrabold text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleAddItem(sIdx)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Plus className="size-3 text-emerald-600" />
                      <span>Add Item</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveSection(sIdx)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      title="Delete this entire section"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* ITEMS IN SECTION */}
                {(!sec.items || sec.items.length === 0) ? (
                  <div className="text-center py-6 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 p-4 space-y-2">
                    <p className="text-xs text-slate-500 font-medium">No items added to this section yet.</p>
                    <button
                      type="button"
                      onClick={() => handleAddItem(sIdx)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      <Plus className="size-3" />
                      <span>Add First Item</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sec.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="p-3.5 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500">
                            Item #{iIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(sIdx, iIdx)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-xs font-bold text-slate-700">
                              Title / Role / Subject <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={item.title || ""}
                              onChange={(e) => handleUpdateItem(sIdx, iIdx, "title", e.target.value)}
                              placeholder="e.g. Lead Volunteer / Co-Author / Project Name"
                              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">
                              Organization / Subtitle
                            </label>
                            <input
                              type="text"
                              value={item.subtitle || ""}
                              onChange={(e) => handleUpdateItem(sIdx, iIdx, "subtitle", e.target.value)}
                              placeholder="e.g. UNICEF / IEEE Journal / University"
                              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">
                              Date / Duration
                            </label>
                            <input
                              type="text"
                              value={item.date || ""}
                              onChange={(e) => handleUpdateItem(sIdx, iIdx, "date", e.target.value)}
                              placeholder="e.g. 2023 - Present or May 2024"
                              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
                            />
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-xs font-bold text-slate-700">
                              Description & Bullet Details
                            </label>
                            <textarea
                              rows={3}
                              value={item.description || ""}
                              onChange={(e) => handleUpdateItem(sIdx, iIdx, "description", e.target.value)}
                              placeholder="Describe your role, contributions, achievements, or publication abstract..."
                              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white resize-y"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSectionsForm;
