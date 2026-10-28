import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, FileSearch, X, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/home/Footer";
import { resumeApi } from "../api/resumeApi";
import { useSEO } from "../hooks/useSEO";
import toast from "react-hot-toast";
import {
  TalentHero,
  TalentFilterBar,
  TalentCandidateCard,
  TalentCandidateTable,
  TalentJdMatcherModal,
  TalentPreviewDrawer,
  TalentPagination,
} from "../components/talent";

const TalentPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [resumes, setResumes] = useState([]);
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

  // Quick Preview Drawer
  const [quickPreviewCandidate, setQuickPreviewCandidate] = useState(null);

  const talentSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://froggie.site/talent#directory",
        "name": "froggie Public Talent Discovery & Verified Candidate Directory",
        "url": "https://froggie.site/talent",
        "description": "Discover, filter, and hire pre-screened tech talent, full-stack developers, software engineers, and UI/UX designers with ATS-optimized resumes and portfolios.",
        "publisher": {
          "@type": "Organization",
          "name": "froggie",
          "url": "https://froggie.site/",
          "logo": "https://froggie.site/froggie_logo.png",
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://froggie.site/talent?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": (resumes || []).length,
          "itemListElement": (resumes || []).slice(0, 25).map((candidate, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "item": {
              "@type": "ProfilePage",
              "name": `${candidate.personal_info?.full_name || "Verified Candidate"} — ${candidate.personal_info?.profession || "Software Professional"}`,
              "url": `https://froggie.site/view/${candidate._id}`,
              "description": candidate.professional_summary || `${candidate.personal_info?.profession || "Candidate"} verified resume profile on froggie`,
              "image": candidate.personal_info?.image || candidate.userId?.image || "https://froggie.site/froggie_banner.jpg",
            },
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://froggie.site/talent#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://froggie.site/",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Public Talent Pool",
            "item": "https://froggie.site/talent",
          },
        ],
      },
    ],
  }), [resumes]);

  useSEO({
    title: "Public Talent Directory | froggie",
    description:
      "Discover and hire verified software engineers, full-stack developers, React engineers, and tech talent. Browse pre-screened ATS-compliant resumes, GitHub portfolios, and direct contact details. Free for hiring teams & recruiters.",
    keywords:
      "hire developers, tech talent pool, public candidate directory, developer resumes, hire software engineers, full stack developer resumes, frontend developer CV, backend engineer portfolio, hire React developers, hire Node.js developers, hire Python engineers, data scientist resumes, verified candidate showcase, ATS resumes directory, remote tech talent, hire talent India, hire freelance developers, froggie talent pool, froggie candidate showcase, hire AI engineers",
    canonical: "https://froggie.site/talent",
    ogImage: "https://froggie.site/froggie_banner.jpg",
    schema: talentSchema,
  });

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

  const handleOpenContact = (e, candidate) => {
    e.stopPropagation();
    if (candidate.personal_info?.email) {
      window.location.href = `mailto:${candidate.personal_info.email}?subject=Opportunity from froggie Talent Directory`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#090d16] text-slate-800 dark:text-slate-100 flex flex-col font-sans pb-20 lg:pb-0">
      <Navbar />

      {/* TOP COMMAND HERO */}
      <TalentHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSkill={selectedSkill}
        setSelectedSkill={(sk) => {
          setSelectedSkill(sk);
          setCurrentPage(1);
        }}
        onSearch={() => fetchTalentPool()}
        onOpenJdMatcher={() => setIsJdMatcherOpen(true)}
        onlyShortlisted={onlyShortlisted}
        setOnlyShortlisted={setOnlyShortlisted}
        shortlistedCount={shortlistedIds.length}
      />

      {/* MAIN CONTENT: MULTI-FILTER BAR & CANDIDATE GRID */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-8 space-y-6 text-left">
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
        <TalentFilterBar
          displayedCount={displayedResumes.length}
          totalCount={totalResumes}
          activeFilterCount={activeFilterCount}
          viewMode={viewMode}
          setViewMode={setViewMode}
          pageSize={pageSize}
          setPageSize={(ps) => {
            setPageSize(ps);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          setSortBy={(sb) => {
            setSortBy(sb);
            setCurrentPage(1);
          }}
          handleClearFilters={handleClearFilters}
          selectedRole={selectedRole}
          setSelectedRole={(r) => {
            setSelectedRole(r);
            setCurrentPage(1);
          }}
          selectedLocation={selectedLocation}
          setSelectedLocation={(l) => {
            setSelectedLocation(l);
            setCurrentPage(1);
          }}
          selectedExperience={selectedExperience}
          setSelectedExperience={(e) => {
            setSelectedExperience(e);
            setCurrentPage(1);
          }}
          selectedDegree={selectedDegree}
          setSelectedDegree={(d) => {
            setSelectedDegree(d);
            setCurrentPage(1);
          }}
          selectedAge={selectedAge}
          setSelectedAge={(a) => {
            setSelectedAge(a);
            setCurrentPage(1);
          }}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={(t) => {
            setSelectedTemplate(t);
            setCurrentPage(1);
          }}
          hasProjectsOnly={hasProjectsOnly}
          setHasProjectsOnly={(p) => {
            setHasProjectsOnly(p);
            setCurrentPage(1);
          }}
          hasCertsOnly={hasCertsOnly}
          setHasCertsOnly={(c) => {
            setHasCertsOnly(c);
            setCurrentPage(1);
          }}
          onlyShortlisted={onlyShortlisted}
          setOnlyShortlisted={setOnlyShortlisted}
        />

        {/* CANDIDATES FEED */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedResumes.map((candidate) => (
              <TalentCandidateCard
                key={candidate._id}
                candidate={candidate}
                isShortlisted={shortlistedIds.includes(candidate._id)}
                onToggleShortlist={toggleShortlist}
                onQuickPreview={setQuickPreviewCandidate}
                onShare={handleShareCandidate}
                onNavigateView={(id) => navigate(`/view/${id}`)}
              />
            ))}
          </div>
        ) : (
          <TalentCandidateTable
            candidates={displayedResumes}
            shortlistedIds={shortlistedIds}
            onToggleShortlist={toggleShortlist}
            onQuickPreview={setQuickPreviewCandidate}
            onShare={handleShareCandidate}
            onOpenContact={handleOpenContact}
            onNavigateView={(id) => navigate(`/view/${id}`)}
          />
        )}

        {/* HIGH-DENSITY PAGINATION CONTROLS */}
        <TalentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </main>

      {/* QUICK PREVIEW SLIDE-OVER DRAWER */}
      <TalentPreviewDrawer
        candidate={quickPreviewCandidate}
        onClose={() => setQuickPreviewCandidate(null)}
        onNavigateView={(id) => navigate(`/view/${id}`)}
      />

      {/* AI JOB DESCRIPTION (JD) MATCHER MODAL */}
      <TalentJdMatcherModal
        isOpen={isJdMatcherOpen}
        onClose={() => setIsJdMatcherOpen(false)}
        jdText={jdText}
        setJdText={setJdText}
        isAnalyzingJd={isAnalyzingJd}
        onApplyJdMatching={handleApplyJdMatching}
      />

      <Footer />
    </div>
  );
};

export default TalentPage;
