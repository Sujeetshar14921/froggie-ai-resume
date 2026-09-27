import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Users,
  Briefcase,
  Sparkles,
  MapPin,
  ExternalLink,
  Share2,
  Mail,
  Eye,
  CheckCircle2,
  ArrowRight,
  Filter,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  RefreshCw,
  FolderOpen,
  GraduationCap,
  Calendar,
  Award,
  Code2,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Phone,
  Globe,
  Bookmark,
  BookmarkCheck,
  FileText,
  Download,
  Send,
  Sliders,
  Check,
  Copy,
  FileSearch,
  Linkedin,
  Github,
  Printer,
  ChevronDown,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import ResumePreview from "../components/ResumePreview";
import { BrandIcon } from "../components/FrogLogo";
import { resumeApi } from "../api/resumeApi";
import { exportResumeAsPdf, exportResumeAsDoc } from "../utils/exportResume";
import { useSEO } from "../hooks/useSEO";
import toast from "react-hot-toast";

const ROLE_OPTIONS = [
  "All",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Software Engineer",
  "AI & ML Engineer",
  "Data Scientist",
  "DevOps Engineer",
  "Cloud Architect",
  "Mobile Developer (React Native/Flutter)",
  "UI/UX Designer",
  "Product Manager",
  "Cyber Security Analyst",
  "QA Automation Engineer",
  "Tech Lead / Architect",
];

const LOCATION_OPTIONS = [
  "All",
  "Remote Only",
  "Bangalore, India",
  "Delhi NCR, India",
  "Mumbai, India",
  "Hyderabad, India",
  "Pune, India",
  "Chennai, India",
  "United States",
  "United Kingdom",
  "Europe",
  "Singapore",
  "Canada",
];

const EXPERIENCE_OPTIONS = [
  { label: "All Experience", value: "All" },
  { label: "Fresher / Trainee (0 - 1 yr)", value: "fresher" },
  { label: "Junior / Mid (1 - 3 yrs)", value: "mid" },
  { label: "Senior Professional (3 - 5 yrs)", value: "senior" },
  { label: "Lead / Architect (5+ yrs)", value: "lead" },
];

const DEGREE_OPTIONS = [
  "All",
  "B.Tech / B.E. (Engineering)",
  "BCA / MCA (Computer Applications)",
  "B.Sc / M.Sc (Computer Science / IT)",
  "MBA (Business / Tech Management)",
  "Master's Degree (M.Tech / MS)",
  "Bachelor's Degree",
  "Diploma / Associate",
  "Self-Taught / Bootcamp Graduate",
];

const AGE_OPTIONS = [
  { label: "All Age Groups", value: "All" },
  { label: "18 - 24 yrs (Early Career / Gen Z)", value: "18-24" },
  { label: "25 - 30 yrs (Mid-Level Talent)", value: "25-30" },
  { label: "31 - 35 yrs (Experienced Specialists)", value: "31-35" },
  { label: "36+ yrs (Senior Leadership)", value: "36+" },
];

const POPULAR_SKILL_TAGS = [
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Java",
  "Kubernetes",
  "Figma",
  "GraphQL",
  "Flutter",
  "Machine Learning",
  "FastAPI",
];

const SAMPLE_JDS = [
  {
    label: "🚀 Full Stack MERN",
    text: "Looking for a Full Stack Developer with 2+ years experience in React, Node.js, Express, MongoDB, and Tailwind CSS. Must have experience building REST APIs, state management, and modern responsive web apps.",
  },
  {
    label: "🤖 AI / Python Engineer",
    text: "Seeking an AI & Python Engineer proficient in Python, Machine Learning, FastAPI, PyTorch, OpenAI / Gemini APIs, Docker, and PostgreSQL. Experience with generative AI applications preferred.",
  },
  {
    label: "💻 Frontend React / Next.js",
    text: "Seeking a Frontend Engineer with strong proficiency in React.js, Next.js, TypeScript, Tailwind CSS, and Redux. Passion for high-performance responsive UI and modern design systems.",
  },
];

const TalentPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [resumes, setResumes] = useState([]);
  const [popularSkills, setPopularSkills] = useState([]);
  const [popularRoles, setPopularRoles] = useState([]);

  const talentSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://froggie.site/talent#page",
    "name": "froggie Public Talent Discovery & Verified Resume Directory",
    "url": "https://froggie.site/talent",
    "description": "Discover verified candidate profiles, developer portfolios, and ATS-optimized resumes. Filter candidates by technical skills, experience level, location, and specialization.",
    "publisher": {
      "@type": "Organization",
      "name": "froggie",
      "url": "https://froggie.site/",
      "logo": "https://froggie.site/favicon.svg"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": (resumes || []).slice(0, 20).map((candidate, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "ProfilePage",
          "name": `${candidate.personal_info?.full_name || "Verified Candidate"} — ${candidate.personal_info?.profession || "Professional"}`,
          "url": `https://froggie.site/view/${candidate._id}`,
          "description": candidate.professional_summary || `${candidate.personal_info?.profession || "Candidate"} resume profile on froggie`,
          "image": candidate.personal_info?.image || candidate.userId?.image || "https://froggie.site/og-image.png"
        }
      }))
    }
  }), [resumes]);

  useSEO({
    title: "Public Talent Discovery & Resume Directory | froggie",
    description:
      "Explore, filter, and discover verified candidate resumes and portfolios. Search top talent by technical skills, roles, experience, degrees, and location on froggie.",
    keywords:
      "talent pool, verified resumes, candidate directory, hire developers, frontend developer resumes, backend engineer portfolios, full stack developer CV, data scientist resumes, ATS resumes directory, froggie talent showcase, public developer profiles",
    canonical: "https://froggie.site/talent",
    ogImage: "https://froggie.site/og-image.png",
    schema: talentSchema,
  });
  const [popularLocations, setPopularLocations] = useState([]);
  const [popularDegrees, setPopularDegrees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // View Mode: 'grid' (4-col dense cards) | 'list' (compact table view)
  const [viewMode, setViewMode] = useState("grid");
  const [pageSize, setPageSize] = useState(24);

  // Shortlisted candidates stored in localStorage
  const [shortlistedIds, setShortlistedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("froggie_shortlisted_talents");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedRole, setSelectedRole] = useState(searchParams.get("role") || "All");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "All");
  const [selectedExperience, setSelectedExperience] = useState(searchParams.get("experience") || "All");
  const [selectedDegree, setSelectedDegree] = useState(searchParams.get("degree") || "All");
  const [selectedAge, setSelectedAge] = useState(searchParams.get("age") || "All");
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get("skill") || "All");
  const [selectedTemplate, setSelectedTemplate] = useState(searchParams.get("template") || "All");
  const [hasProjectsOnly, setHasProjectsOnly] = useState(searchParams.get("projects") === "true");
  const [hasCertsOnly, setHasCertsOnly] = useState(searchParams.get("certs") === "true");
  const [onlyShortlisted, setOnlyShortlisted] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  
  // High-density pagination
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResumes, setTotalResumes] = useState(0);

  // AI JD Matcher state
  const [isJdMatcherOpen, setIsJdMatcherOpen] = useState(false);
  const [isAnalyzingJd, setIsAnalyzingJd] = useState(false);
  const [aiMatchData, setAiMatchData] = useState(null);
  const [jdText, setJdText] = useState("");

  // Modals & Drawers
  const [quickPreviewCandidate, setQuickPreviewCandidate] = useState(null);

  // Save shortlist changes
  useEffect(() => {
    localStorage.setItem("froggie_shortlisted_talents", JSON.stringify(shortlistedIds));
  }, [shortlistedIds]);

  const toggleShortlist = (e, id) => {
    e.stopPropagation();
    setShortlistedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      toast.success(exists ? "Removed from Shortlist" : "Candidate Shortlisted ⭐", { id: "shortlist-toast" });
      return next;
    });
  };

  // Fetch Public Talent Data
  const fetchTalentPool = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: pageSize,
        sortBy,
      };

      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (selectedRole !== "All") params.role = selectedRole;
      if (selectedLocation !== "All") params.location = selectedLocation;
      if (selectedExperience !== "All") params.experienceLevel = selectedExperience;
      if (selectedDegree !== "All") params.degree = selectedDegree;
      if (selectedAge !== "All") params.ageRange = selectedAge;
      if (selectedSkill !== "All") params.skill = selectedSkill;
      if (selectedTemplate !== "All") params.template = selectedTemplate;
      if (hasProjectsOnly) params.hasProjects = true;
      if (hasCertsOnly) params.hasCertifications = true;

      const data = await resumeApi.getPublicTalentPool(params);
      if (data.success) {
        setResumes(data.resumes || []);
        setTotalResumes(data.totalResumes || 0);
        setTotalPages(data.totalPages || 1);
        if (data.popularSkills?.length) setPopularSkills(data.popularSkills);
        if (data.popularRoles?.length) setPopularRoles(data.popularRoles);
        if (data.popularLocations?.length) setPopularLocations(data.popularLocations);
        if (data.popularDegrees?.length) setPopularDegrees(data.popularDegrees);
      }
    } catch (error) {
      console.error("Fetch talent pool error:", error);
      toast.error("Could not load candidate resumes");
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    searchQuery,
    selectedRole,
    selectedLocation,
    selectedExperience,
    selectedDegree,
    selectedAge,
    selectedSkill,
    selectedTemplate,
    hasProjectsOnly,
    hasCertsOnly,
    sortBy,
  ]);

  useEffect(() => {
    fetchTalentPool();
  }, [fetchTalentPool]);

  // Sync state to URL search params
  useEffect(() => {
    const nextParams = {};
    if (searchQuery.trim()) nextParams.q = searchQuery.trim();
    if (selectedRole !== "All") nextParams.role = selectedRole;
    if (selectedLocation !== "All") nextParams.location = selectedLocation;
    if (selectedExperience !== "All") nextParams.experience = selectedExperience;
    if (selectedDegree !== "All") nextParams.degree = selectedDegree;
    if (selectedAge !== "All") nextParams.age = selectedAge;
    if (selectedSkill !== "All") nextParams.skill = selectedSkill;
    if (selectedTemplate !== "All") nextParams.template = selectedTemplate;
    if (hasProjectsOnly) nextParams.projects = "true";
    if (hasCertsOnly) nextParams.certs = "true";
    if (sortBy !== "newest") nextParams.sortBy = sortBy;
    if (currentPage > 1) nextParams.page = currentPage;
    setSearchParams(nextParams, { replace: true });
  }, [
    searchQuery,
    selectedRole,
    selectedLocation,
    selectedExperience,
    selectedDegree,
    selectedAge,
    selectedSkill,
    selectedTemplate,
    hasProjectsOnly,
    hasCertsOnly,
    sortBy,
    currentPage,
    setSearchParams,
  ]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedRole !== "All") count++;
    if (selectedLocation !== "All") count++;
    if (selectedExperience !== "All") count++;
    if (selectedDegree !== "All") count++;
    if (selectedAge !== "All") count++;
    if (selectedSkill !== "All") count++;
    if (selectedTemplate !== "All") count++;
    if (hasProjectsOnly) count++;
    if (hasCertsOnly) count++;
    if (onlyShortlisted) count++;
    return count;
  }, [
    searchQuery,
    selectedRole,
    selectedLocation,
    selectedExperience,
    selectedDegree,
    selectedAge,
    selectedSkill,
    selectedTemplate,
    hasProjectsOnly,
    hasCertsOnly,
    onlyShortlisted,
  ]);

  // Handle AI JD Matcher Analysis & Ranking
  const handleApplyJdMatching = async () => {
    if (!jdText.trim()) {
      toast.error("Please paste job description text");
      return;
    }
    try {
      setIsAnalyzingJd(true);
      const res = await resumeApi.matchJdWithCandidates(jdText.trim());
      const candidateList = res.candidates || res.resumes || [];
      if (res.success && Array.isArray(candidateList)) {
        setResumes(candidateList);
        setTotalResumes(res.totalMatched || candidateList.length);
        setTotalPages(1);
        setCurrentPage(1);
        const extracted = res.extractedCriteria || res.extracted || {};
        setAiMatchData({
          role: extracted.role || "",
          skills: extracted.skills || res.matchedSkills || [],
          experienceLevel: extracted.experienceLevel || "All",
          location: extracted.location || "All",
          totalCandidates: candidateList.length,
        });
        setIsJdMatcherOpen(false);
        toast.success(`🎯 Matched & ranked ${candidateList.length} candidate(s) by JD score!`);
      } else {
        toast.error(res.message || "No candidates found matching the JD");
      }
    } catch (error) {
      console.error("AI JD Matcher error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to analyze JD. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsAnalyzingJd(false);
    }
  };

  // Reset AI Match
  const handleClearAiMatch = () => {
    setAiMatchData(null);
    setJdText("");
    fetchTalentPool();
    toast.success("AI JD Match reset to all candidates");
  };

  // Reset all filters
  const handleClearFilters = () => {
    setAiMatchData(null);
    setJdText("");
    setSearchQuery("");
    setSelectedRole("All");
    setSelectedLocation("All");
    setSelectedExperience("All");
    setSelectedDegree("All");
    setSelectedAge("All");
    setSelectedSkill("All");
    setSelectedTemplate("All");
    setHasProjectsOnly(false);
    setHasCertsOnly(false);
    setOnlyShortlisted(false);
    setSortBy("newest");
    setCurrentPage(1);
  };

  const displayedResumes = useMemo(() => {
    if (onlyShortlisted) {
      return resumes.filter((r) => shortlistedIds.includes(r._id));
    }
    return resumes;
  }, [resumes, onlyShortlisted, shortlistedIds]);

  const handleShareCandidate = (e, resumeId, candidateName) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/view/${resumeId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success(`Share link for ${candidateName || "Candidate"} copied! 🔗`);
    } else {
      toast.success("Link: " + shareUrl);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* TOP COMMAND HEADER */}
      <section className="relative overflow-hidden pt-7 pb-8 bg-white border-b border-slate-200/80">
        {/* Colorful half-circle ambient auras */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-500/15 via-teal-400/10 to-transparent rounded-bl-full pointer-events-none blur-xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-500/15 via-indigo-400/10 to-transparent rounded-tr-full pointer-events-none blur-xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-black">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Sparkles size={13} className="text-emerald-600" />
                  <span>Verified Public Talent Showcase</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                  Open Directory
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Public Talent Discovery & Resume Showcase
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
                Explore candidate profiles by exact skill stacks, roles, verified experience, degrees & age group.
              </p>
            </div>

            {/* ACTION BUTTONS & JD MATCHER */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() => setIsJdMatcherOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 text-emerald-900 border border-emerald-300 font-extrabold text-xs shadow-2xs transition-all cursor-pointer hover:scale-102"
              >
                <FileSearch size={15} className="text-emerald-700" />
                <span>AI Job Description Matcher</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlyShortlisted((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  onlyShortlisted
                    ? "bg-amber-50 text-amber-900 border-amber-300 shadow-xs"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <Bookmark size={14} className={onlyShortlisted ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
                <span>Shortlist ({shortlistedIds.length})</span>
              </button>
            </div>
          </div>

          {/* MAIN OMNI-SEARCH INPUT */}
          <div className="relative flex items-center bg-white rounded-2xl border-2 border-slate-200/90 shadow-md hover:border-emerald-500 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all p-1.5">
            <div className="pl-3.5 pr-2 text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by skill (React, AWS), role (Full Stack), name, college/degree, or keyword..."
              className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg mr-1 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="button"
              onClick={() => fetchTalentPool()}
              className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs sm:text-sm transition-all shadow-md shrink-0 cursor-pointer border border-emerald-500/30"
            >
              Search Candidates
            </button>
          </div>

          {/* POPULAR SKILLS CAROUSEL PILLS */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Code2 size={12} className="text-emerald-600" />
              Skill Chips:
            </span>
            {["All", ...POPULAR_SKILL_TAGS].map((sk) => {
              const isSelected = selectedSkill.toLowerCase() === sk.toLowerCase();
              return (
                <button
                  key={sk}
                  onClick={() => {
                    setSelectedSkill(sk);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-slate-950 text-white border-slate-950 shadow-xs scale-105"
                      : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {sk}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT: MULTI-FILTER BAR & CANDIDATE GRID */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-5 text-left">
        
        {/* AI JOB MATCH ACTIVE BANNER */}
        {aiMatchData && (
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-4 sm:p-5 rounded-3xl border border-emerald-500/40 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-xs">
                  <Sparkles size={11} className="text-emerald-400 animate-pulse" />
                  AI JD Match Active
                </span>
                {aiMatchData.role && (
                  <span className="text-xs font-black text-white bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                    Role: {aiMatchData.role}
                  </span>
                )}
                {aiMatchData.experienceLevel && aiMatchData.experienceLevel !== "All" && (
                  <span className="text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
                    Exp: {aiMatchData.experienceLevel}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Candidates are ranked by AI compatibility against your job description requirements.
              </p>
              {Array.isArray(aiMatchData.skills) && aiMatchData.skills.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400">Extracted Skills:</span>
                  {aiMatchData.skills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsJdMatcherOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer border border-white/10 flex items-center gap-1.5"
              >
                <FileSearch size={13} className="text-emerald-400" />
                Change JD
              </button>
              <button
                type="button"
                onClick={handleClearAiMatch}
                className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold text-xs transition-colors cursor-pointer border border-rose-500/30 flex items-center gap-1.5"
              >
                <X size={13} />
                Reset Match
              </button>
            </div>
          </div>
        )}

        {/* COMPREHENSIVE FILTER CONTROLS BAR */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
          
          {/* TOP ROW: VIEW TOGGLE, SORT, CLEAR & RESULTS COUNT */}
          <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900">
                {displayedResumes.length} of {totalResumes} Candidates
              </span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {activeFilterCount} Active Filters
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* VIEW SWITCHER: GRID (4 COL) OR COMPACT LIST */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Grid View (4 columns)"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-slate-950 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  title="Compact List View"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white text-slate-950 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <List size={15} />
                </button>
              </div>

              {/* PAGE SIZE SELECTOR */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600">
                <span>Show:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-transparent border-none outline-none cursor-pointer font-bold"
                >
                  <option value={12}>12 / page</option>
                  <option value={24}>24 / page</option>
                  <option value={48}>48 / page</option>
                </select>
              </div>

              {/* SORT DROPDOWN */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
                <span className="text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent border-none outline-none cursor-pointer pr-1 font-bold"
                >
                  <option value="newest">Recently Active</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Candidate Name (A-Z)</option>
                </select>
              </div>

              {/* RESET BUTTON */}
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <X size={13} />
                  <span>Reset All</span>
                </button>
              )}
            </div>
          </div>

          {/* MULTI-CRITERIA SELECTORS (ROLES, LOCATION, EXP, DEGREE, AGE, TEMPLATE) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
            
            {/* 1. JOB ROLE */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Briefcase size={11} /> Job Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-2 rounded-xl outline-none cursor-pointer truncate"
              >
                <option value="All">All Roles</option>
                {ROLE_OPTIONS.filter((r) => r !== "All").map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. LOCATION */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <MapPin size={11} /> Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-2 rounded-xl outline-none cursor-pointer truncate"
              >
                <option value="All">All Locations</option>
                {LOCATION_OPTIONS.filter((l) => l !== "All").map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. EXPERIENCE */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Award size={11} /> Experience
              </label>
              <select
                value={selectedExperience}
                onChange={(e) => {
                  setSelectedExperience(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-2 rounded-xl outline-none cursor-pointer truncate"
              >
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp.value} value={exp.value}>
                    {exp.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. DEGREE */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <GraduationCap size={11} /> Degree
              </label>
              <select
                value={selectedDegree}
                onChange={(e) => {
                  setSelectedDegree(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-2 rounded-xl outline-none cursor-pointer truncate"
              >
                {DEGREE_OPTIONS.map((deg) => (
                  <option key={deg} value={deg}>
                    {deg === "All" ? "All Degrees" : deg}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. AGE GROUP */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar size={11} /> Age Group
              </label>
              <select
                value={selectedAge}
                onChange={(e) => {
                  setSelectedAge(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-2 rounded-xl outline-none cursor-pointer truncate"
              >
                {AGE_OPTIONS.map((age) => (
                  <option key={age.value} value={age.value}>
                    {age.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. TEMPLATE STYLE */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Layers size={11} /> Format
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-2 rounded-xl outline-none cursor-pointer truncate"
              >
                <option value="All">All Formats</option>
                <option value="classic">Classic ATS</option>
                <option value="modern">Modern Tech</option>
                <option value="minimal">Minimal Clean</option>
                <option value="executive">Executive</option>
                <option value="creative">Creative</option>
                <option value="technical">Technical</option>
              </select>
            </div>

          </div>

          {/* TOGGLE CHECKBOXES (PROJECTS / CERTS) */}
          <div className="flex items-center gap-4 pt-1 flex-wrap text-xs font-bold text-slate-700">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasProjectsOnly}
                onChange={(e) => {
                  setHasProjectsOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="size-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span>Has Verified Projects 🚀</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasCertsOnly}
                onChange={(e) => {
                  setHasCertsOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="size-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span>Has Certifications 📜</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyShortlisted}
                onChange={(e) => setOnlyShortlisted(e.target.checked)}
                className="size-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
              />
              <span className="text-amber-700">Show Starred Candidates Only ⭐</span>
            </label>
          </div>
        </div>

        {/* CANDIDATES FEED (LOADING, EMPTY, GRID, OR LIST) */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 animate-pulse space-y-3 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-11 rounded-xl bg-slate-100" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                    <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-8 bg-slate-100 rounded-lg" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
                <div className="h-8 bg-slate-100 rounded-xl mt-3" />
              </div>
            ))}
          </div>
        ) : displayedResumes.length === 0 ? (
          /* EMPTY STATE */
          <div className="relative overflow-hidden text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200/90 shadow-2xs flex flex-col items-center max-w-xl mx-auto space-y-3 group">
            <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Users size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-950">No Matching Candidates Found</h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto font-medium">
              We couldn't find any public resumes matching your exact filters. Try broadening your criteria.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* HIGH-DENSITY 4-COLUMN CARDS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedResumes.map((candidate) => {
              const fullName = candidate.personal_info?.full_name || "Candidate";
              const profession = candidate.personal_info?.profession || candidate.title || "Professional";
              const location = candidate.personal_info?.location;
              const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
              const expCount = Array.isArray(candidate.experience) ? candidate.experience.length : 0;
              const projCount = Array.isArray(candidate.project) ? candidate.project.length : 0;
              const accentColor = candidate.accent_color || "#10B981";
              const degree = candidate.education?.[0]?.degree;
              const isShortlisted = shortlistedIds.includes(candidate._id);
              const candidateImage = candidate.personal_info?.image || candidate.userId?.image;

              return (
                <div
                  key={candidate._id}
                  onClick={() => setQuickPreviewCandidate(candidate)}
                  className="group relative overflow-hidden bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between text-left space-y-3"
                >
                  {/* Subtle Top Accent */}
                  <div
                    className="absolute top-0 left-4 right-4 h-0.5 rounded-b-full transition-all group-hover:h-1"
                    style={{ backgroundColor: accentColor }}
                  />

                  {/* HEADER: AVATAR, STATUS & BOOKMARK */}
                  <div className="space-y-2.5 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="relative shrink-0">
                        {candidateImage ? (
                          <img
                            src={candidateImage}
                            alt={fullName}
                            className="size-11 rounded-xl object-cover ring-2 ring-emerald-500/30 shadow-xs group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div
                            className="size-11 rounded-xl flex items-center justify-center font-black text-base text-white shadow-xs group-hover:scale-105 transition-transform"
                            style={{
                              background: `linear-gradient(135deg, ${accentColor}, #0f172a)`,
                            }}
                          >
                            {fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span
                          className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-1 ring-white"
                          title="Open to Work"
                        />
                      </div>

                      {/* BADGES & SHORTLIST STAR BUTTON */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => toggleShortlist(e, candidate._id)}
                          title={isShortlisted ? "Remove from Shortlist" : "Bookmark Candidate"}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isShortlisted
                              ? "bg-amber-50 border-amber-300 text-amber-500"
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-400"
                          }`}
                        >
                          <Bookmark size={13} className={isShortlisted ? "fill-amber-500" : ""} />
                        </button>

                        {candidate.matchScore != null && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-slate-950 border border-emerald-400 shadow-2xs">
                            <Sparkles size={10} />
                            {candidate.matchScore}% Match
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/70 shrink-0">
                          <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                          Available
                        </span>
                      </div>
                    </div>

                    {/* NAME & ROLE */}
                    <div>
                      <h3 className="text-sm font-black text-slate-950 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {fullName}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-600 truncate">
                        {profession}
                      </p>
                      {location && (
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5 truncate">
                          <MapPin size={10} className="shrink-0" />
                          <span className="truncate">{location}</span>
                        </p>
                      )}
                    </div>

                    {/* SKILLS CHIPS */}
                    {skills.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {skills.slice(0, 3).map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-bold border border-slate-200/70 truncate max-w-[100px]"
                          >
                            {sk}
                          </span>
                        ))}
                        {skills.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[9px] font-bold border border-emerald-200/60">
                            +{skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* DEGREE OR EXPERIENCE METADATA */}
                    <div className="text-[10px] text-slate-500 font-semibold space-y-0.5 pt-0.5 border-t border-slate-100">
                      {degree && (
                        <p className="truncate flex items-center gap-1 text-slate-600">
                          <GraduationCap size={11} className="shrink-0 text-slate-400" />
                          <span className="truncate">{degree}</span>
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-0.5">
                        {expCount > 0 && <span>💼 {expCount} {expCount === 1 ? "Role" : "Roles"}</span>}
                        {projCount > 0 && <span>🚀 {projCount} {projCount === 1 ? "Proj" : "Projs"}</span>}
                      </div>
                    </div>
                  </div>

                  {/* CARD BOTTOM ACTIONS */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={(e) => handleShareCandidate(e, candidate._id, fullName)}
                        title="Copy Share Link"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Share2 size={13} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/view/${candidate._id}`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-[11px] transition-all shadow-2xs cursor-pointer border border-emerald-500/30"
                    >
                      View Resume
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* COMPACT RECRUITER TABLE / DIRECTORY VIEW */
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Target Role</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Skills</th>
                    <th className="py-3 px-4">Experience / Degree</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {displayedResumes.map((candidate) => {
                    const fullName = candidate.personal_info?.full_name || "Candidate";
                    const profession = candidate.personal_info?.profession || candidate.title || "Professional";
                    const location = candidate.personal_info?.location || "Remote";
                    const skills = Array.isArray(candidate.skills) ? candidate.skills : [];
                    const degree = candidate.education?.[0]?.degree;
                    const expCount = Array.isArray(candidate.experience) ? candidate.experience.length : 0;
                    const isShortlisted = shortlistedIds.includes(candidate._id);
                    const candidateImage = candidate.personal_info?.image || candidate.userId?.image;

                    return (
                      <tr
                        key={candidate._id}
                        onClick={() => setQuickPreviewCandidate(candidate)}
                        className="hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={(e) => toggleShortlist(e, candidate._id)}
                              className="p-1 text-slate-400 hover:text-amber-500 cursor-pointer"
                            >
                              <Bookmark size={13} className={isShortlisted ? "fill-amber-500 text-amber-500" : ""} />
                            </button>

                            {candidateImage ? (
                              <img
                                src={candidateImage}
                                alt={fullName}
                                className="size-8 rounded-lg object-cover ring-1 ring-slate-200"
                              />
                            ) : (
                              <div className="size-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                                {fullName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-slate-950 group-hover:text-emerald-700 transition-colors">
                                  {fullName}
                                </p>
                                {candidate.matchScore != null && (
                                  <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black bg-emerald-500 text-slate-950">
                                    {candidate.matchScore}% Match
                                  </span>
                                )}
                              </div>
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700">
                                <span className="size-1 rounded-full bg-emerald-500" />
                                Available
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-slate-700">
                          {profession}
                        </td>

                        <td className="py-3 px-4 text-slate-500">
                          {location}
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <div className="flex items-center gap-1 flex-wrap">
                            {skills.slice(0, 3).map((sk, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-[9px] font-bold text-slate-700"
                              >
                                {sk}
                              </span>
                            ))}
                            {skills.length > 3 && (
                              <span className="text-[9px] font-bold text-slate-400">
                                +{skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-500">
                          <div>
                            <span className="font-bold text-slate-700">{expCount} {expCount === 1 ? "Role" : "Roles"}</span>
                            {degree && <span className="text-[10px] block text-slate-400 truncate max-w-[140px]">{degree}</span>}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => handleShareCandidate(e, candidate._id, fullName)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                              title="Share Link"
                            >
                              <Share2 size={13} />
                            </button>
                            {candidate.personal_info?.email && (
                              <button
                                type="button"
                                onClick={(e) => handleOpenContact(e, candidate)}
                                className="p-1 text-slate-400 hover:text-emerald-700 rounded cursor-pointer"
                                title="Contact"
                              >
                                <Mail size={13} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/view/${candidate._id}`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-950 text-white font-bold text-[10px] hover:bg-slate-900 cursor-pointer"
                            >
                              Resume
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HIGH-DENSITY PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-4">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`size-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-slate-950 text-white shadow-xs scale-105"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs text-xs font-bold flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </main>

      {/* QUICK PREVIEW SLIDE-OVER DRAWER */}
      {quickPreviewCandidate && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 text-left">
            {/* DRAWER TOP BAR */}
            <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-bold text-sm">
                  {quickPreviewCandidate.personal_info?.full_name?.charAt(0) || "C"}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">
                    {quickPreviewCandidate.personal_info?.full_name || "Candidate"}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {quickPreviewCandidate.personal_info?.profession || quickPreviewCandidate.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/view/${quickPreviewCandidate._id}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 text-white font-bold text-xs shadow-xs hover:bg-slate-900 cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>Full Screen</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuickPreviewCandidate(null)}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* DRAWER RESUME BODY */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70 flex justify-center">
              <div className="w-full max-w-[210mm]">
                <ResumePreview
                  data={quickPreviewCandidate}
                  template={quickPreviewCandidate.template}
                  accentColor={quickPreviewCandidate.accent_color}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI JOB DESCRIPTION (JD) MATCHER MODAL */}
      {isJdMatcherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-left relative">
            <button
              onClick={() => setIsJdMatcherOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <FileSearch size={22} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-950">AI Job Description Matcher</h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Paste requirements or job description to find compatible candidate resumes
                </p>
              </div>
            </div>

            {/* QUICK PRESET TEMPLATES */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                Quick Sample JDs (Click to Test):
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {SAMPLE_JDS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setJdText(sample.text)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 text-[11px] font-bold border border-slate-200 transition-all cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Paste Job Description / Requirements:
              </label>
              <textarea
                rows={6}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="e.g. Looking for a Senior Full Stack Engineer with 3+ years in React, Node.js, AWS, and MongoDB. Must have experience building scalable web applications..."
                className="w-full text-xs font-medium p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={isAnalyzingJd || !jdText.trim()}
                onClick={handleApplyJdMatching}
                className="flex-1 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-xs shadow-md transition-all border border-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isAnalyzingJd ? (
                  <>
                    <RefreshCw size={14} className="text-emerald-400 animate-spin" />
                    <span>AI Analyzing JD & Matching Candidates...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-emerald-400" />
                    <span>Extract & Match Candidates</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isAnalyzingJd}
                onClick={() => {
                  setJdText("");
                  setIsJdMatcherOpen(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TalentPage;
