import { User, FileText, Briefcase, GraduationCap, FolderIcon, Sparkles, Award, Trophy, Languages, UserCheck, ScrollText, Layers } from "lucide-react";

/**
 * Resume Builder Stepper Sections Definition
 */
export const BUILDER_SECTIONS = [
  { id: "personal", name: "Contact Info", icon: User },
  { id: "summary", name: "Summary", icon: FileText },
  { id: "experience", name: "Experience", icon: Briefcase },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "projects", name: "Projects", icon: FolderIcon },
  { id: "skills", name: "Skills", icon: Sparkles },
  { id: "certifications", name: "Certifications", icon: Award },
  { id: "achievements", name: "Achievements", icon: Trophy },
  { id: "languages", name: "Languages", icon: Languages },
  { id: "personal_details", name: "Personal Details", icon: UserCheck },
  { id: "declaration", name: "Declaration", icon: ScrollText },
  { id: "custom_sections", name: "Custom Sections", icon: Layers },
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
  languages: [],
  personal_details: {
    date_of_birth: "",
    gender: "",
    nationality: "",
    marital_status: "",
    passport_no: "",
    address: "",
  },
  declaration: {
    statement: "",
    place: "",
    date: "",
    name: "",
  },
  custom_sections: [],
  section_order: [
    "summary",
    "experience",
    "projects",
    "education",
    "certifications",
    "achievements",
    "skills",
    "languages",
    "personal_details",
    "declaration",
    "custom_sections",
  ],
  template: "classic",
  accent_color: "#10B981",
  public: false,
};
