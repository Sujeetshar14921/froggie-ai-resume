import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Sparkles,
  LayoutGrid,
  List,
  Download,
  RotateCcw,
  ArrowUpDown,
  X,
  Briefcase,
  Flame,
  Calendar,
  Layers,
} from "lucide-react";
import { BrandIcon } from "../components/FrogLogo";
import { useSEO } from "../hooks/useSEO";
import toast from "react-hot-toast";
import {
  TRACKER_STAGES,
  PRIORITY_LEVELS,
  INITIAL_DEMO_APPLICATIONS,
  TRACKER_STORAGE_KEY,
} from "../constants/trackerConfig";
import {
  sendMilestoneNotification,
  NOTIFICATION_CATEGORIES,
} from "../utils/browserNotification";
import {
  TrackerMetrics,
  TrackerCard,
  TrackerListView,
  TrackerModal,
} from "../components/tracker";

const ApplicationTracker = () => {
  useSEO({
    title: "Job Application CRM Tracker | froggie AI",
    description:
      "Manage, track, and optimize your job applications with a smart visual pipeline, ATS compatibility tags, and interview reminders.",
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

  const [viewMode, setViewMode] = useState("kanban"); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("default"); // 'default' | 'date' | 'company' | 'salary'

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const [formData, setFormData] = useState({
    company: "",
    position: "",
    stage: "wishlist",
    priority: "medium",
    salary: "",
    location: "",
    workMode: "Remote",
    appliedDate: new Date().toISOString().split("T")[0],
    followUpDate: "",
    interviewRound: "",
    interviewDate: "",
    jobUrl: "",
    recruiterName: "",
    recruiterEmail: "",
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
    const wishlist = applications.filter((a) => a.stage === "wishlist").length;
    const applied = applications.filter((a) => a.stage === "applied").length;
    const interviewing = applications.filter((a) => a.stage === "interviewing").length;
    const offers = applications.filter((a) => a.stage === "offer").length;
    const totalActive = applied + interviewing + offers;
    const responseRate =
      totalActive > 0 ? Math.round(((interviewing + offers) / totalActive) * 100) : 0;

    return { total, wishlist, applied, interviewing, responseRate, offers };
  }, [applications]);

  // Filtered & Sorted applications
  const filteredApps = useMemo(() => {
    let result = applications.filter((app) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (app.company || "").toLowerCase().includes(q) ||
        (app.position || "").toLowerCase().includes(q) ||
        (app.notes || "").toLowerCase().includes(q) ||
        (app.tailoredResume || "").toLowerCase().includes(q) ||
        (app.location || "").toLowerCase().includes(q);

      const matchesStage = filterStage === "all" || app.stage === filterStage;
      const matchesPriority =
        filterPriority === "all" ||
        (filterPriority === "urgent" && (app.priority === "urgent" || app.priority === "high")) ||
        app.priority === filterPriority;

      return matchesSearch && matchesStage && matchesPriority;
    });

    // Sorting
    if (sortBy === "company") {
      result = [...result].sort((a, b) => (a.company || "").localeCompare(b.company || ""));
    } else if (sortBy === "date") {
      result = [...result].sort((a, b) => {
        const dateA = a.interviewDate || a.followUpDate || a.appliedDate || "";
        const dateB = b.interviewDate || b.followUpDate || b.appliedDate || "";
        return dateB.localeCompare(dateA);
      });
    } else if (sortBy === "salary") {
      const getNum = (str = "") => {
        const match = str.match(/(\d+)/g);
        return match ? parseInt(match[match.length - 1], 10) : 0;
      };
      result = [...result].sort((a, b) => getNum(b.salary) - getNum(a.salary));
    }

    return result;
  }, [applications, searchQuery, filterStage, filterPriority, sortBy]);

  // Trigger milestone alerts upon advancing
  const notifyStageMilestone = (app, newStage) => {
    if (newStage === "interviewing") {
      sendMilestoneNotification({
        title: "Interview Scheduled! 🎯",
        message: `You moved ${app.position} at ${app.company} to Interview stage. Best of luck!`,
        category: NOTIFICATION_CATEGORIES.TRACKER,
        actionLink: "/app/tracker",
        actionLabel: "View Tracker",
      });
    } else if (newStage === "offer") {
      sendMilestoneNotification({
        title: "Job Offer Received! 🎉",
        message: `Congratulations on receiving an offer for ${app.position} at ${app.company}!`,
        category: NOTIFICATION_CATEGORIES.TRACKER,
        actionLink: "/app/tracker",
        actionLabel: "View Tracker",
      });
    }
  };

  // Stage advancement via arrow buttons
  const handleMoveStage = (id, direction) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        const currentIdx = TRACKER_STAGES.findIndex((s) => s.id === app.stage);
        const newIdx = currentIdx + direction;
        if (newIdx < 0 || newIdx >= TRACKER_STAGES.length) return app;
        const newStage = TRACKER_STAGES[newIdx].id;
        toast.success(`Moved to ${TRACKER_STAGES[newIdx].title}!`);
        notifyStageMilestone(app, newStage);
        return { ...app, stage: newStage };
      })
    );
  };

  // Stage direct change via dropdown
  const handleStageChange = (id, newStage) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        const stageObj = TRACKER_STAGES.find((s) => s.id === newStage);
        toast.success(`Updated stage to ${stageObj ? stageObj.title : newStage}!`);
        notifyStageMilestone(app, newStage);
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
      priority: "medium",
      salary: "",
      location: "",
      workMode: "Remote",
      appliedDate: new Date().toISOString().split("T")[0],
      followUpDate: "",
      interviewRound: "",
      interviewDate: "",
      jobUrl: "",
      recruiterName: "",
      recruiterEmail: "",
      tailoredResume: "",
      notes: "",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (app) => {
    setEditingApp(app);
    setFormData({
      priority: "medium",
      workMode: "Remote",
      ...app,
    });
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

  // Export to CSV
  const handleExportCSV = () => {
    if (applications.length === 0) {
      toast.error("No applications to export");
      return;
    }

    const headers = [
      "Company",
      "Position",
      "Stage",
      "Priority",
      "Salary",
      "Location",
      "Work Mode",
      "Applied Date",
      "Interview Date",
      "Follow-up Date",
      "Tailored Resume",
      "Notes",
    ];

    const rows = applications.map((a) => [
      `"${(a.company || "").replace(/"/g, '""')}"`,
      `"${(a.position || "").replace(/"/g, '""')}"`,
      `"${a.stage || ""}"`,
      `"${a.priority || "medium"}"`,
      `"${(a.salary || "").replace(/"/g, '""')}"`,
      `"${(a.location || "").replace(/"/g, '""')}"`,
      `"${a.workMode || ""}"`,
      `"${a.appliedDate || ""}"`,
      `"${a.interviewDate || ""}"`,
      `"${a.followUpDate || ""}"`,
      `"${(a.tailoredResume || "").replace(/"/g, '""')}"`,
      `"${(a.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `froggie_job_pipeline_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Pipeline exported to CSV! 📊");
  };

  // Reset sample demo data
  const handleResetDemoData = () => {
    if (window.confirm("Reset pipeline to sample demo jobs? Your changes will be replaced.")) {
      setApplications(INITIAL_DEMO_APPLICATIONS);
      toast.success("Reset to sample pipeline!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP COMMAND HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2">
              <BrandIcon size="sm" />
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/70 tracking-wide uppercase">
                Job Hunt CRM
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400">•</span>
              <span className="hidden sm:inline-block text-xs font-bold text-slate-500">
                {applications.length} Tracked Roles
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Application Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Organize your job hunt, track interview dates, link tailored resumes, and monitor conversion rates.
            </p>
          </div>

          {/* TOP RIGHT ACTION BAR */}
          <div className="flex flex-wrap items-center gap-2.5 justify-start md:justify-end">
            {/* View Mode Toggle Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "kanban"
                    ? "bg-white text-slate-950 shadow-xs scale-102"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Kanban Board View"
              >
                <LayoutGrid size={14} />
                <span>Board</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-slate-950 shadow-xs scale-102"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Table / List View"
              >
                <List size={14} />
                <span>Table</span>
              </button>
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="Export to CSV"
            >
              <Download size={15} />
            </button>

            {/* Reset Demo Data */}
            <button
              onClick={handleResetDemoData}
              className="p-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="Reset Sample Data"
            >
              <RotateCcw size={15} />
            </button>

            {/* Primary Add Button */}
            <button
              onClick={() => handleOpenAddModal("wishlist")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 border border-emerald-500/30"
            >
              <Plus size={15} className="text-emerald-400" />
              <span>Add Application</span>
            </button>
          </div>
        </div>

        {/* METRICS & PIPELINE INSIGHTS */}
        <TrackerMetrics metrics={metrics} applications={applications} />

        {/* SEARCH, FILTER & SORT TOOLBAR */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs text-left">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, title, resume, or notes..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none font-medium text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Pills & Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Priority Filter */}
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setFilterPriority(filterPriority === "urgent" ? "all" : "urgent")}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
                  filterPriority === "urgent"
                    ? "bg-red-50 text-red-700 border-red-200 shadow-2xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Flame size={12} className="text-red-500" />
                <span>Urgent Roles</span>
              </button>
            </div>

            {/* Stage Selector Dropdown */}
            <div className="flex items-center gap-1.5">
              <Filter size={13} className="text-slate-400 shrink-0" />
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-xl outline-none cursor-pointer"
              >
                <option value="all">All Stages ({applications.length})</option>
                {TRACKER_STAGES.map((st) => {
                  const count = applications.filter((a) => a.stage === st.id).length;
                  return (
                    <option key={st.id} value={st.id}>
                      {st.icon} {st.title} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown size={13} className="text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/90 px-3 py-1.5 rounded-xl outline-none cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="date">Sort: Upcoming Due Date</option>
                <option value="company">Sort: Company (A-Z)</option>
                <option value="salary">Sort: Highest Salary</option>
              </select>
            </div>
          </div>
        </div>

        {/* MAIN VIEW CONTENT: KANBAN OR TABLE */}
        {viewMode === "kanban" ? (
          /* 5-COLUMN KANBAN BOARD */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
            {TRACKER_STAGES.map((stage) => {
              const stageApps = filteredApps.filter((a) => a.stage === stage.id);

              return (
                <div
                  key={stage.id}
                  className="flex flex-col rounded-3xl p-3 bg-slate-100/70 border border-slate-200/90 space-y-3 min-h-[400px]"
                >
                  {/* COLUMN HEADER */}
                  <div className="flex items-center justify-between px-1.5 py-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                      <span className="text-sm">{stage.icon}</span>
                      <span>{stage.title}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${stage.badgeColor}`}
                      >
                        {stageApps.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenAddModal(stage.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                        title={`Add job to ${stage.title}`}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
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
                      <div className="py-10 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4">
                        <span className="text-lg opacity-40 mb-1">{stage.icon}</span>
                        <p className="text-xs font-semibold text-slate-400">No applications</p>
                        <button
                          onClick={() => handleOpenAddModal(stage.id)}
                          className="mt-2 text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                        >
                          + Add role
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* HIGH-DENSITY LIST / TABLE VIEW */
          <TrackerListView
            applications={filteredApps}
            onEdit={handleOpenEditModal}
            onDelete={handleDelete}
            onStageChange={handleStageChange}
          />
        )}
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
