import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { resumeApi } from "../api/resumeApi";
import { aiApi } from "../api/aiApi";
import {
  CreateResumeModal,
  UploadResumeModal,
  DashboardHeader,
  DashboardStats,
  DashboardWorkflowCards,
  DashboardRecentResumes,
  DashboardFeatureBanner,
} from "../components/dashboard";
import { useSEO } from "../hooks/useSEO";
import { TRACKER_STORAGE_KEY } from "../constants/trackerConfig";

const Dashboard = () => {
  useSEO({
    title: "Candidate Career Studio & Resume Dashboard | froggie",
    description:
      "Manage your resumes, run ATS scans, create new ATS-optimized resumes with AI, and track career applications in your froggie dashboard.",
  });

  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [resumes, setResumes] = useState([]);
  const [isFetchingResumes, setIsFetchingResumes] = useState(false);

  // Load tracker jobs from localStorage for KPI stats
  const [trackedJobs, setTrackedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem(TRACKER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Fetch real resumes from backend
  const fetchUserResumes = async () => {
    if (!token) return;
    try {
      setIsFetchingResumes(true);
      const data = await resumeApi.getUserResumes(token);
      setResumes(data.resumes || []);
    } catch (err) {
      console.error("Failed to fetch user resumes:", err);
    } finally {
      setIsFetchingResumes(false);
    }
  };

  useEffect(() => {
    fetchUserResumes();
  }, [token]);

  // Handle manual resume creation
  const handleCreateResume = async (title, onSuccess) => {
    if (!title.trim()) {
      toast.error("Please enter a title for your resume");
      return;
    }

    try {
      setIsLoading(true);
      const data = await resumeApi.createResume({ title: title.trim() }, token);

      setShowCreateResume(false);
      onSuccess?.();
      toast.success("Resume created! Opening editor...");
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      console.error("Create resume error:", error);
      toast.error(error?.response?.data?.message || "Failed to create resume");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PDF resume parsing & creation
  const handleUploadResume = async (payload, onSuccess) => {
    try {
      setIsLoading(true);
      const data = await aiApi.uploadResumePdf(payload, token);

      setShowUploadResume(false);
      onSuccess?.();
      toast.success("Resume parsed successfully!");
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      console.error("Upload resume error:", error);
      toast.error(error?.response?.data?.message || "Failed to parse resume");
    } finally {
      setIsLoading(false);
    }
  };

  // Duplicate resume
  const handleDuplicateResume = async (resumeId, e) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await resumeApi.duplicateResume(resumeId, token);
      toast.success("Resume duplicated!");
      fetchUserResumes();
    } catch {
      toast.error("Could not duplicate resume");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate telemetry stats
  const activeInterviews = trackedJobs.filter((j) => j.stage === "interviewing").length;
  const totalOffers = trackedJobs.filter((j) => j.stage === "offer").length;
  const totalTracked = trackedJobs.length;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-8 lg:px-12 xl:px-16 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* HERO COMMAND HEADER */}
        <DashboardHeader
          user={user}
          onCreateResume={() => setShowCreateResume(true)}
          onUploadResume={() => setShowUploadResume(true)}
        />

        {/* 4 TELEMETRY STATS CARDS */}
        <DashboardStats
          resumesCount={resumes.length}
          totalTracked={totalTracked}
          activeInterviews={activeInterviews}
          totalOffers={totalOffers}
        />

        {/* 5 CORE WORKFLOW HERO CARDS */}
        <DashboardWorkflowCards
          onCreateResume={() => setShowCreateResume(true)}
          onUploadResume={() => setShowUploadResume(true)}
          onNavigate={navigate}
        />

        {/* RECENT RESUMES SECTION */}
        <DashboardRecentResumes
          resumes={resumes}
          isFetching={isFetchingResumes}
          onNavigate={navigate}
          onDuplicate={handleDuplicateResume}
          onCreateResume={() => setShowCreateResume(true)}
        />

        {/* AI CAREER STUDIO POWER BANNER */}
        <DashboardFeatureBanner />

        {/* CREATE RESUME MODAL */}
        <CreateResumeModal
          isOpen={showCreateResume}
          onClose={() => setShowCreateResume(false)}
          onSubmit={handleCreateResume}
          isLoading={isLoading}
        />

        {/* UPLOAD RESUME MODAL */}
        <UploadResumeModal
          isOpen={showUploadResume}
          onClose={() => setShowUploadResume(false)}
          onUpload={handleUploadResume}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
