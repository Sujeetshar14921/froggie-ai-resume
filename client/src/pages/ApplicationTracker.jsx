import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Filter, Sparkles } from "lucide-react";
import { BrandIcon } from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";
import toast from "react-hot-toast";
import {
  TRACKER_STAGES,
  INITIAL_DEMO_APPLICATIONS,
  TRACKER_STORAGE_KEY,
} from "../constants/trackerConfig";
import {
  TrackerMetrics,
  TrackerCard,
  TrackerModal,
} from "../components/tracker";

const ApplicationTracker = () => {
  useSEO({
    title: "Job Application CRM Tracker | froggie AI",
    description: "Manage, track, and optimize your job applications with a smart visual pipeline.",
  });

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(TRACKER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_DEMO_APPLICATIONS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    stage: "wishlist",
    salary: "",
    location: "",
    appliedDate: new Date().toISOString().split("T")[0],
    followUpDate: "",
    tailoredResume: "",
    notes: "",
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(applications));
    } catch {
      // ignore
    }
  }, [applications]);

  // Telemetry metrics
  const metrics = useMemo(() => {
    const total = applications.length;
    const interviewing = applications.filter((a) => a.stage === "interviewing").length;
    const offers = applications.filter((a) => a.stage === "offer").length;
    const applied = applications.filter((a) => a.stage === "applied").length;
    const totalActive = applied + interviewing + offers;
    const responseRate = totalActive > 0 ? Math.round(((interviewing + offers) / totalActive) * 100) : 0;

    return { total, interviewing, responseRate, offers };
  }, [applications]);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        (app.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.position || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.notes || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage = filterStage === "all" || app.stage === filterStage;
      return matchesSearch && matchesStage;
    });
  }, [applications, searchQuery, filterStage]);

  // Stage advancement
  const handleMoveStage = (id, direction) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        const currentIdx = TRACKER_STAGES.findIndex((s) => s.id === app.stage);
        const newIdx = currentIdx + direction;
        if (newIdx < 0 || newIdx >= TRACKER_STAGES.length) return app;
        const newStage = TRACKER_STAGES[newIdx].id;
        toast.success(`Moved to ${TRACKER_STAGES[newIdx].title}!`);
        return { ...app, stage: newStage };
      })
    );
  };

  const handleDelete = (id) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    toast.success("Application deleted");
  };

  const handleOpenAddModal = (stageId = "wishlist") => {
    setEditingApp(null);
    setFormData({
      company: "",
      position: "",
      stage: stageId,
      salary: "",
      location: "",
      appliedDate: new Date().toISOString().split("T")[0],
      followUpDate: "",
      tailoredResume: "",
      notes: "",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (app) => {
    setEditingApp(app);
    setFormData({ ...app });
    setIsAddModalOpen(true);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.position) {
      toast.error("Company and position are required");
      return;
    }

    if (editingApp) {
      setApplications((prev) =>
        prev.map((a) => (a.id === editingApp.id ? { ...formData, id: a.id } : a))
      );
      toast.success("Application updated! 🎯");
    } else {
      const newApp = {
        ...formData,
        id: "app-" + Date.now(),
      };
      setApplications((prev) => [newApp, ...prev]);
      toast.success("Application added to tracker! 🚀");
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
              <BrandIcon size="sm" />
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/70 tracking-wide uppercase">
                Job Hunt CRM
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Application Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Track your tailored resumes, interviews, and offers in one visual pipeline.
            </p>
          </div>

          <button
            onClick={() => handleOpenAddModal("wishlist")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 border border-emerald-500/30"
          >
            <Plus size={15} className="text-emerald-400" />
            <span>Add Application</span>
          </button>
        </div>

        {/* METRICS PERFORMANCE BAR */}
        <TrackerMetrics metrics={metrics} />

        {/* SEARCH & FILTER CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, roles, or notes..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Filter size={14} className="text-slate-400 shrink-0" />
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl outline-none cursor-pointer"
            >
              <option value="all">All Pipeline Stages</option>
              {TRACKER_STAGES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.icon} {st.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5-COLUMN KANBAN BOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {TRACKER_STAGES.map((stage) => {
            const stageApps = filteredApps.filter((a) => a.stage === stage.id);

            return (
              <div
                key={stage.id}
                className="flex flex-col rounded-3xl p-3 bg-slate-100/60 border border-slate-200/80 space-y-3 min-h-[350px]"
              >
                {/* COLUMN HEADER */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    <span>{stage.icon}</span>
                    <span>{stage.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${stage.badgeColor}`}>
                    {stageApps.length}
                  </span>
                </div>

                {/* CARDS LIST */}
                <div className="space-y-3 flex-1">
                  {stageApps.map((app) => (
                    <TrackerCard
                      key={app.id}
                      app={app}
                      stage={stage}
                      onEdit={handleOpenEditModal}
                      onDelete={handleDelete}
                      onMoveStage={handleMoveStage}
                    />
                  ))}

                  {stageApps.length === 0 && (
                    <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                      <p className="text-xs font-medium">No applications</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      <TrackerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSaveForm}
        formData={formData}
        setFormData={setFormData}
        editingApp={editingApp}
        stages={TRACKER_STAGES}
      />
    </div>
  );
};

export default ApplicationTracker;
