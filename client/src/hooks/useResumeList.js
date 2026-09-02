import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { resumeApi } from "../api/resumeApi";
import toast from "react-hot-toast";

/**
 * Custom Hook for managing the user's resume collection
 */
export const useResumeList = () => {
  const { token } = useSelector((state) => state.auth);

  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadResumes = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await resumeApi.getUserResumes(token);
      setResumes(data.resumes || []);
    } catch (error) {
      console.error("Load resumes error:", error);
      toast.error(error?.response?.data?.message || "Could not load your resumes");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadResumes();
    const handleSync = () => loadResumes();
    window.addEventListener("resumes-updated", handleSync);
    return () => window.removeEventListener("resumes-updated", handleSync);
  }, [loadResumes]);

  const deleteResume = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingId(id);
      await resumeApi.deleteResume(id, token);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Resume deleted successfully");
    } catch (error) {
      console.error("Delete resume error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete resume");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredResumes = useMemo(() => {
    if (!searchQuery.trim()) return resumes;
    const q = searchQuery.toLowerCase();
    return resumes.filter((r) => (r.title || "Untitled Resume").toLowerCase().includes(q));
  }, [resumes, searchQuery]);

  return {
    resumes,
    filteredResumes,
    isLoading,
    searchQuery,
    setSearchQuery,
    deletingId,
    deleteResume,
    refreshResumes: loadResumes,
  };
};

export default useResumeList;
