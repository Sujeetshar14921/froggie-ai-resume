import React, { useState } from "react";
import {
  X,
  Building2,
  Briefcase,
  DollarSign,
  MapPin,
  Calendar,
  Clock,
  User,
  Mail,
  FileText,
  Sparkles,
  Link as LinkIcon,
  Flame,
  Star,
  Layers,
} from "lucide-react";
import { BrandIcon } from "../FrogLogo";
import {
  PRIORITY_LEVELS,
  INTERVIEW_ROUNDS,
  TRACKER_STAGES,
} from "../../constants/trackerConfig";

const TrackerModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingApp,
  stages = TRACKER_STAGES,
}) => {
  const [activeTab, setActiveTab] = useState("general");

  if (!isOpen) return null;

  const handleQuickNote = (snippet) => {
    setFormData((prev) => ({
      ...prev,
      notes: prev.notes ? `${prev.notes}\n• ${snippet}` : `• ${snippet}`,
    }));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 select-none">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* MODAL WINDOW */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <BrandIcon size="sm" />
            <div>
              <h3 className="text-sm font-black text-white tracking-tight">
                {editingApp ? "Edit Job Application" : "Track New Job Opportunity"}
              </h3>
              <p className="text-[11px] text-slate-400">
                Manage interview schedules, resume variants, and job pipeline.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* SECTION TABS */}
        <div className="flex border-b border-slate-200/80 bg-slate-50/70 px-6 shrink-0 gap-1 text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "general"
                ? "border-emerald-600 text-emerald-800 font-extrabold bg-white/60"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Briefcase size={13} />
            <span>Role & Pipeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("interviews")}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "interviews"
                ? "border-emerald-600 text-emerald-800 font-extrabold bg-white/60"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <Clock size={13} />
            <span>Interviews & Recruiter</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "notes"
                ? "border-emerald-600 text-emerald-800 font-extrabold bg-white/60"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <FileText size={13} />
            <span>Resume & Notes</span>
          </button>
        </div>

        {/* MODAL FORM BODY */}
        <form onSubmit={onSubmit} className="p-6 space-y-4 overflow-y-auto no-scrollbar flex-1 text-left">
          {/* TAB 1: GENERAL ROLE & PIPELINE */}
          {activeTab === "general" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                    <Building2 size={12} className="text-slate-400" />
                    <span>Company Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company || ""}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Stripe, OpenAI, Microsoft"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                    <Briefcase size={12} className="text-slate-400" />
                    <span>Role / Position *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position || ""}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g. Senior Full Stack Engineer"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                  />
                </div>
              </div>

              {/* PIPELINE STAGE SELECTOR (VISUAL BUTTONS) */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">Pipeline Stage</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {stages.map((st) => {
                    const isSelected = formData.stage === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, stage: st.id })}
                        className={`p-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          isSelected
                            ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        <span className="text-sm">{st.icon}</span>
                        <span className="text-[11px] truncate w-full">{st.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PRIORITY SELECTOR */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700">Priority Level</label>
                <div className="flex flex-wrap gap-2">
                  {PRIORITY_LEVELS.map((p) => {
                    const isSelected = (formData.priority || "medium") === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, priority: p.id })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-emerald-500 text-slate-950 border-emerald-600 shadow-xs scale-102"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span>{p.icon}</span>
                        <span>{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                    <DollarSign size={12} className="text-slate-400" />
                    <span>Target Compensation</span>
                  </label>
                  <input
                    type="text"
                    value={formData.salary || ""}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g. $160k - $185k"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Remote, San Francisco"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700">Work Mode</label>
                  <select
                    value={formData.workMode || "Remote"}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium bg-white"
                  >
                    <option value="Remote">🌐 Remote</option>
                    <option value="Hybrid">🏢 Hybrid</option>
                    <option value="On-site">📍 On-site</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  <LinkIcon size={12} className="text-slate-400" />
                  <span>Job Posting URL</span>
                </label>
                <input
                  type="url"
                  value={formData.jobUrl || ""}
                  onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                  placeholder="https://company.com/careers/job-id"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                />
              </div>
            </div>
          )}

          {/* TAB 2: INTERVIEWS & RECRUITER */}
          {activeTab === "interviews" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                    <Clock size={12} className="text-amber-500" />
                    <span>Interview Round</span>
                  </label>
                  <select
                    value={formData.interviewRound || ""}
                    onChange={(e) => setFormData({ ...formData, interviewRound: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium bg-white"
                  >
                    <option value="">-- Select Interview Round --</option>
                    {INTERVIEW_ROUNDS.map((round) => (
                      <option key={round} value={round}>
                        {round}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                    <Calendar size={12} className="text-amber-500" />
                    <span>Scheduled Interview Date</span>
                  </label>
                  <input
                    type="date"
                    value={formData.interviewDate || ""}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                    <Calendar size={12} className="text-slate-400" />
                    <span>Date Applied</span>
                  </label>
                  <input
                    type="date"
                    value={formData.appliedDate || ""}
                    onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                    <Clock size={12} className="text-slate-400" />
                    <span>Follow-Up Target Date</span>
                  </label>
                  <input
                    type="date"
                    value={formData.followUpDate || ""}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  Recruiter / Contact Person
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <User size={11} className="text-slate-400" />
                      <span>Contact Name</span>
                    </label>
                    <input
                      type="text"
                      value={formData.recruiterName || ""}
                      onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
                      placeholder="e.g. Sarah Jenkins (Recruiter)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Mail size={11} className="text-slate-400" />
                      <span>Contact Email or LinkedIn</span>
                    </label>
                    <input
                      type="text"
                      value={formData.recruiterEmail || ""}
                      onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
                      placeholder="recruiter@company.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RESUME & NOTES */}
          {activeTab === "notes" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                  <FileText size={12} className="text-emerald-600" />
                  <span>Tailored Resume Version</span>
                </label>
                <input
                  type="text"
                  value={formData.tailoredResume || ""}
                  onChange={(e) => setFormData({ ...formData, tailoredResume: e.target.value })}
                  placeholder="e.g. Full Stack (Stripe Tailored) or Staff Architect 2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-700">Interview Notes & Next Steps</label>
                  <span className="text-[10px] text-slate-400 font-medium">Supports quick templates</span>
                </div>

                {/* QUICK PROMPT CHIPS */}
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {[
                    "Recruiter screen cleared",
                    "System design prep scheduled",
                    "Follow-up email sent",
                    "Reviewing compensation & equity",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleQuickNote(chip)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Recruiter phone screen cleared. Next: Technical architecture interview with Engineering Lead. Review system design concepts."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Sparkles size={13} className="text-emerald-500" />
              <span>Auto-saved locally</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-black text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98"
              >
                {editingApp ? "Save Changes" : "Create Application"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackerModal;

