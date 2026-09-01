import { User, FileText, Briefcase, GraduationCap, FolderIcon, Sparkles, Award, Trophy } from "lucide-react";

/**
 * Resume Builder Stepper Sections Definition
 */
export const BUILDER_SECTIONS = [
  { id: "personal", name: "Personal", icon: User },
  { id: "summary", name: "Summary", icon: FileText },
  { id: "experience", name: "Experience", icon: Briefcase },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "projects", name: "Projects", icon: FolderIcon },
  { id: "skills", name: "Skills", icon: Sparkles },
  { id: "certifications", name: "Certifications", icon: Award },
  { id: "achievements", name: "Achievements", icon: Trophy },
];

/**
 * Default empty resume data structure
 */
export const INITIAL_RESUME_STATE = {
  _id: "",
  title: "",
  personal_info: {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    profession: "",
    linkedin: "",
    linkedin_label: "",
    github: "",
    github_label: "",
    website: "",
    website_label: "",
    image: "",
  },
  professional_summary: "",
  experience: [],
  education: [],
  project: [],
  skills: [],
  certifications: [],
  achievements: [],
  template: "classic",
  accent_color: "#10B981",
  public: false,
};
