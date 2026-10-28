# Froggie Project Information

## Project Overview
Froggie is an AI-powered resume builder and ATS score checker designed to help job seekers create polished, recruiter-friendly resumes that are optimized for applicant tracking systems. The platform combines interactive resume editing, AI-generated content improvements, resume parsing, and detailed ATS analysis in one workflow.

## Core Features

### 1. AI Resume Builder
- Real-time dual-pane resume editing and live preview
- Dynamic resume sections for personal details, summary, experience, projects, education, skills, certifications, and achievements
- Multi-resume management for creating and organizing multiple variants
- Theme customization with color palettes and professional templates

### 2. AI Content Enhancement
- AI-powered professional summary generation
- AI-assisted improvement of work experience bullets
- Keyword and impact-oriented rewriting to match job requirements
- Smart PDF resume import to convert existing resumes into structured profile data

### 3. ATS Optimization and Scoring
- Weighted ATS analysis across keywords, skills, job title relevance, experience, education, formatting, and readability
- Score breakdown with actionable recommendations
- Missing keyword detection and skill gap insights
- Resume comparison with target job descriptions

### 4. Resume Templates and Exporting
- Seven ATS-friendly resume templates for different career profiles
- Export to PDF, DOCX, JSON, and plain text
- High-fidelity rendering for professional and recruiter-ready output
- Pagination and formatting optimizations for clean document layout

### 5. Authentication and User Management
- Email/password registration and login
- JWT-based authentication
- Social login support for Google, GitHub, LinkedIn, and Facebook (where configured)
- User profile management and secure session handling

### 6. Dashboard and Workflow Support
- Personalized dashboard for managing resumes and reports
- Resume preview and editing workflows
- ATS scan history and iterative improvement tracking
- Support for uploading profile images and other media assets

## Tech Stack

### Frontend
- React 19
- Vite 7
- Tailwind CSS v4
- Redux Toolkit
- React Router
- GSAP for animations
- Axios for API calls
- jsPDF, html2canvas, html-to-image for export generation
- Lucide React for icons

### Backend
- Node.js
- Express 5
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- multer for file uploads
- helmet for security headers
- express-rate-limit for request protection
- compression for optimized responses
- nodemailer for email features

### AI and Document Processing
- Google Gemini via OpenAI-compatible API integration
- PDF parsing with pdf-parse
- DOCX processing with docx and mammoth
- Resume sanitization and extraction utilities for structured document processing

### Media and Storage
- ImageKit for profile image upload and delivery

### Deployment and Tooling
- Vercel for frontend deployment
- Render / Railway / VPS-friendly backend deployment
- Concurrent npm workflow to run frontend and backend together during development
- ESLint for frontend linting
- Nodemon for backend development reloading

## Architecture Summary
The project follows a full-stack architecture with:
- Client: React + Vite frontend for resume creation and UI
- Server: Express API for authentication, resume CRUD, AI features, ATS scanning, and document processing
- Database: MongoDB for persistent user and resume data
- AI Layer: Gemini-based content generation and evaluation pipeline
- File/Media Layer: ImageKit and document parsing utilities

## Intended Use Case
Froggie is intended for job seekers, career changers, and professionals who want to:
- build resumes quickly,
- optimize content for ATS checks,
- improve keyword alignment with job descriptions,
- and export professional-quality resumes without a heavy manual process.
