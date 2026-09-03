export const TRACKER_STAGES = [
  {
    id: "wishlist",
    title: "Wishlist",
    icon: "📌",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    badgeColor: "bg-slate-200 text-slate-800",
  },
  {
    id: "applied",
    title: "Applied",
    icon: "🚀",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    id: "interviewing",
    title: "Interviewing",
    icon: "📞",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    badgeColor: "bg-amber-100 text-amber-800",
  },
  {
    id: "offer",
    title: "Offer Received",
    icon: "🏆",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "archived",
    title: "Archived",
    icon: "📁",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    badgeColor: "bg-slate-200 text-slate-600",
  },
];

export const INITIAL_DEMO_APPLICATIONS = [
  {
    id: "app-1",
    company: "Stripe",
    position: "Senior Full Stack Engineer",
    location: "Remote",
    salary: "$165k - $190k",
    stage: "interviewing",
    appliedDate: "2026-08-28",
    followUpDate: "2026-09-06",
    tailoredResume: "Full Stack (Stripe Tailored)",
    notes: "System Design interview scheduled for Friday. Review distributed caching and idempotency.",
  },
  {
    id: "app-2",
    company: "Vercel",
    position: "Staff Frontend Architect",
    location: "San Francisco, CA (Hybrid)",
    salary: "$180k - $210k",
    stage: "applied",
    appliedDate: "2026-09-01",
    followUpDate: "2026-09-08",
    tailoredResume: "Frontend Architect 2026",
    notes: "Applied with 98% ATS verified tailored resume.",
  },
  {
    id: "app-3",
    company: "Linear",
    position: "Product Engineer",
    location: "Remote",
    salary: "$150k - $175k",
    stage: "offer",
    appliedDate: "2026-08-15",
    followUpDate: "2026-09-10",
    tailoredResume: "Full Stack Master",
    notes: "Received formal written offer! Considering equity vs base.",
  },
  {
    id: "app-4",
    company: "Figma",
    position: "UI Systems Engineer",
    location: "Remote",
    salary: "$160k - $185k",
    stage: "wishlist",
    appliedDate: "",
    followUpDate: "",
    tailoredResume: "",
    notes: "Need to tailor resume with WebGL and Canvas keywords before applying.",
  },
];

export const TRACKER_STORAGE_KEY = "froggie_job_applications_v1";

export default {
  TRACKER_STAGES,
  INITIAL_DEMO_APPLICATIONS,
  TRACKER_STORAGE_KEY,
};
