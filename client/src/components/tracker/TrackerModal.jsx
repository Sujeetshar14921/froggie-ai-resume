import React from "react";
import { X } from "lucide-react";
import { BrandIcon } from "../FrogLogo";

const TrackerModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingApp,
  stages = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 select-none">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <BrandIcon size="xs" />
            <h3 className="text-sm font-black text-white">
              {editingApp ? "Edit Application" : "Add New Application"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto no-scrollbar">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Company Name *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Stripe, Google, Acme Inc"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Role / Position *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Pipeline Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium bg-white"
              >
                {stages.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.icon} {st.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Target Salary / Range</label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="e.g. $140k - $160k"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Remote, San Francisco, CA"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Tailored Resume Version</label>
              <input
                type="text"
                value={formData.tailoredResume}
                onChange={(e) => setFormData({ ...formData, tailoredResume: e.target.value })}
                placeholder="e.g. Full Stack (Stripe Tailored)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Date Applied</label>
              <input
                type="date"
                value={formData.appliedDate}
                onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Follow-up Target Date</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-slate-700">Interview Notes & Next Steps</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Recruiter phone screen cleared. Next: Technical architecture interview with Engineering Lead."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-black text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              {editingApp ? "Save Changes" : "Create Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackerModal;
