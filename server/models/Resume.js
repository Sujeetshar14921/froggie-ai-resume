import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title: {type: String, default: 'Untitled Resume'},
    public: { type: Boolean, default: false },
    template: { type: String, default: "classic" },
    accent_color: { type: String, default: "#10B981" },
    professional_summary: { type: String, default: '' },
    skills: [{ type: String }],
    personal_info: {
        image: {type: String, default: '' },
        full_name: {type: String, default: '' },
        profession: {type: String, default: '' },
        email: {type: String, default: '' },
        phone: {type: String, default: '' },
        location: {type: String, default: '' },
        linkedin: {type: String, default: '' },
        linkedin_label: {type: String, default: '' },
        github: {type: String, default: '' },
        github_label: {type: String, default: '' },
        website: {type: String, default: '' },
        website_label: {type: String, default: '' },
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
}, {timestamps: true, minimize: false})

const Resume = mongoose.model('Resume', ResumeSchema)

export default Resume