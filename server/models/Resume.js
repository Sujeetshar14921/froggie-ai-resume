import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    title: { type: String, default: 'Untitled Resume' },
    public: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    template: { type: String, default: "classic" },
    accent_color: { type: String, default: "#10B981" },
    section_order: {
        type: [String],
        default: ["summary", "experience", "projects", "education", "certifications", "achievements", "languages", "skills", "custom_sections"]
    },
    professional_summary: { type: String, default: '' },
    skills: [{ type: String }],
    personal_info: {
        image: { type: String, default: '' },
        full_name: { type: String, default: '' },
        profession: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        linkedin_label: { type: String, default: '' },
        github: { type: String, default: '' },
        github_label: { type: String, default: '' },
        website: { type: String, default: '' },
        website_label: { type: String, default: '' },
    },
    experience: [
        {
            company: { type: String },
            position: { type: String },
            start_date: { type: String },
            end_date: { type: String },
            description: { type: String },
            is_current: { type: Boolean },
        }
    ],
    project: [
        {
            name: { type: String },
            type: { type: String },
            description: { type: String },
        }
    ],
    education: [
        {
            institution: { type: String },
            degree: { type: String },
            field: { type: String },
            graduation_date: { type: String },
            gpa: { type: String },
        }
    ],
    certifications: [
        {
            name: { type: String },
            issuer: { type: String },
            date: { type: String },
            url: { type: String },
        }
    ],
    achievements: [
        {
            title: { type: String },
            date: { type: String },
            description: { type: String },
        }
    ],
    languages: [
        {
            language: { type: String },
            proficiency: { type: String },
        }
    ],
    personal_details: {
        date_of_birth: { type: String, default: '' },
        gender: { type: String, default: '' },
        nationality: { type: String, default: '' },
        marital_status: { type: String, default: '' },
        passport_no: { type: String, default: '' },
        address: { type: String, default: '' },
    },
    declaration: {
        statement: { type: String, default: '' },
        place: { type: String, default: '' },
        date: { type: String, default: '' },
        name: { type: String, default: '' },
    },
    custom_sections: [
        {
            title: { type: String },
            items: [
                {
                    title: { type: String },
                    subtitle: { type: String },
                    date: { type: String },
                    description: { type: String },
                }
            ]
        }
    ],
    // Snapshot version history for Rollback & Undo support (keeps last 10 snapshots)
    versions: [
        {
            versionNumber: { type: Number },
            savedAt: { type: Date, default: Date.now },
            note: { type: String, default: "Autosave revision" },
            snapshot: { type: Object }
        }
    ]
}, { timestamps: true, minimize: false });

// Compound Indexes for ultra-fast queries & filtering
ResumeSchema.index({ public: 1, isDeleted: 1, updatedAt: -1 });
ResumeSchema.index({ userId: 1, isDeleted: 1, updatedAt: -1 });
ResumeSchema.index({ "personal_info.profession": 1, public: 1, isDeleted: 1 });
ResumeSchema.index({ skills: 1, public: 1, isDeleted: 1 });
ResumeSchema.index({ "personal_info.location": 1, public: 1, isDeleted: 1 });

const Resume = mongoose.model('Resume', ResumeSchema);

export default Resume;