import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { resumeApi } from "../api/resumeApi";
import { INITIAL_RESUME_STATE } from "../constants/sections";
import toast from "react-hot-toast";

/**
 * Custom Hook for managing a single resume document in the builder
 * @param {string} resumeId
 */
export const useResume = (resumeId) => {
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState(INITIAL_RESUME_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);

  // Load resume data
  const loadResume = useCallback(async () => {
    if (!resumeId) return;

    try {
      setIsLoading(true);
      const data = await resumeApi.getResumeById(resumeId, token);
      if (data.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title ? `${data.resume.title} | ResumeForge` : "Resume Builder";
      }
    } catch (error) {
      console.error("Load resume error:", error);
      toast.error(error?.response?.data?.message || "Could not load this resume");
    } finally {
      setIsLoading(false);
    }
  }, [resumeId, token]);

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  // Save resume changes
  const saveResume = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      const updatedResumeData = structuredClone(resumeData);

      // Handle raw file image separately
      if (typeof resumeData.personal_info?.image === "object") {
        delete updatedResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));

      if (removeBackground) {
        formData.append("removeBackground", "yes");
      }

      if (typeof resumeData.personal_info?.image === "object" && resumeData.personal_info.image) {
        formData.append("image", resumeData.personal_info.image);
      }

      const data = await resumeApi.updateResume(formData, token);

      if (data.resume) {
        setResumeData(data.resume);
      }
      setRemoveBackground(false);
      toast.success(data.message || "Resume saved successfully");
      return data.resume;
    } catch (error) {
      console.error("Save resume error:", error);
      toast.error(error?.response?.data?.message || "Could not save resume");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle public / private visibility
  const toggleVisibility = async () => {
    const nextPublic = !resumeData.public;
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify({ public: nextPublic }));

      const data = await resumeApi.updateResume(formData, token);

      setResumeData((prev) => ({ ...prev, public: nextPublic }));
      toast.success(data.message || (nextPublic ? "Resume is now public" : "Resume is now private"));
    } catch (error) {
      console.error("Visibility toggle error:", error);
      toast.error(error?.response?.data?.message || "Could not update visibility");
    }
  };

  // Share resume link
  const shareResume = async () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = `${frontendUrl}/view/${resumeId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: resumeData.title || "My Resume",
          text: `Check out my resume: ${resumeData.title}`,
          url: resumeUrl,
        });
      } catch {
        // User dismissed native sheet
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(resumeUrl);
      toast.success("Public link copied to clipboard");
    } else {
      toast.error("Sharing is not supported on this browser");
    }
  };

  return {
    resumeData,
    setResumeData,
    isLoading,
    isSaving,
    removeBackground,
    setRemoveBackground,
    saveResume,
    toggleVisibility,
    shareResume,
    reloadResume: loadResume,
  };
};

export default useResume;
