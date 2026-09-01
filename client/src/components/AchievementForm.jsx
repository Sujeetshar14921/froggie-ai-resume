import React from "react";
import { Trophy, Plus, Trash2, Sparkles } from "lucide-react";

const AchievementForm = ({ data = [], onChange }) => {
  const addAchievement = () => {
    const newAchievement = {
      title: "",
      date: "",
      description: "",
    };
    onChange([...data, newAchievement]);
  };

  const removeAchievement = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateAchievement = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            Key Achievements & Awards
          </h3>
          <p className="text-sm text-gray-500">
            Highlight honors, hackathons, awards, and significant milestones
          </p>
        </div>
        <button
          onClick={addAchievement}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-xl transition-all cursor-pointer border border-emerald-500/30 shadow-xs"
        >
          <Plus className="size-3.5 text-emerald-400" />
          <span>Add Achievement</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-6 text-gray-500 space-y-2">
          <Trophy className="w-12 h-12 mx-auto text-slate-300" />
          <p className="font-semibold text-slate-700 text-sm">No achievements added yet.</p>
          <p className="text-xs text-slate-400">
            Add awards, hackathon wins, top performer honors, scholarships, or publications.
          </p>
          <button
            onClick={addAchievement}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <Plus className="size-3" />
            <span>Add First Achievement</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-2xl space-y-3 bg-white shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-200/80">
                    {index + 1}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800">
                    {item.title || `Achievement #${index + 1}`}
                  </h4>
                </div>

                <button
                  onClick={() => removeAchievement(index)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                  title="Remove Achievement"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Achievement / Award Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={item.title || ""}
                    onChange={(e) => updateAchievement(index, "title", e.target.value)}
                    type="text"
                    placeholder="e.g. 1st Place Winner - Google AI Hackathon 2025"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Date Received</label>
                  <input
                    value={item.date || ""}
                    onChange={(e) => updateAchievement(index, "date", e.target.value)}
                    type="month"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Description / Impact (Optional)
                </label>
                <textarea
                  rows={3}
                  value={item.description || ""}
                  onChange={(e) => updateAchievement(index, "description", e.target.value)}
                  placeholder="Describe the recognition, ranking, or measurable impact achieved..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementForm;
