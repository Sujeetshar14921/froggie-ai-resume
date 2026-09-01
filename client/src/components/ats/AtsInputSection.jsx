import React, { useState } from "react";
import {
  FileText,
  UploadCloud,
  FileUp,
  Sparkles,
  Clipboard,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import FrogFace from "../FrogLogo";

const AtsInputSection = ({
  userResumes = [],
  selectedResumeId,
  onSelectResumeId,
  uploadedFile,
  onSetUploadedFile,
  jobDescription,
  onChangeJobDescription,
  customJobTitle,
  onChangeCustomJobTitle,
  onAnalyze,
  isLoading,
}) => {
  const [inputTab, setInputTab] = useState(userResumes.length > 0 ? "saved" : "upload");
  const [isDragging, setIsDragging] = useState(false);

  const charCount = (jobDescription || "").length;
  const isJdValid = charCount >= 30;

  const handlePasteJd = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChangeJobDescription(text);
        toast.success("Job description pasted from clipboard");
      }
    } catch {
      toast.error("Clipboard access denied. Please paste manually.");
    }
  };

  const handleClearJd = () => {
    onChangeJobDescription("");
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("Please drop a valid .pdf resume file");
      } else {
        onSetUploadedFile(file);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-7">
      
      {/* 1. RESUME SELECTION / UPLOAD SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck size={20} className="text-emerald-600" />
              1. Choose Resume to Audit
            </h3>
            <p className="text-xs text-slate-500">
              Select one of your existing resumes or upload a new PDF file
            </p>
          </div>

          {/* TAB TOGGLE */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setInputTab("saved")}
              disabled={userResumes.length === 0}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                inputTab === "saved"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              My Resumes ({userResumes.length})
            </button>
            <button
              type="button"
              onClick={() => setInputTab("upload")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                inputTab === "upload"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Upload PDF
            </button>
          </div>
        </div>

        {/* TAB 1: SAVED RESUMES SELECTOR */}
        {inputTab === "saved" && (
          <div className="space-y-2">
            {userResumes.length === 0 ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600 shrink-0" />
                <span>No saved resumes found. Please switch to "Upload PDF" tab.</span>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {userResumes.map((res) => {
                  const isSelected = selectedResumeId === res._id && !uploadedFile;
                  return (
                    <div
                      key={res._id}
                      onClick={() => {
                        onSelectResumeId(res._id);
                        onSetUploadedFile(null);
                      }}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 shadow-xs"
                          : "border-slate-200/80 hover:border-emerald-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <FileText size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {res.title || "Untitled Resume"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Template: <span className="capitalize">{res.template || "Classic"}</span>
                        </p>
                      </div>

                      {isSelected && (
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: UPLOAD PDF RESUME */}
        {inputTab === "upload" && (
          <div>
            <label
              htmlFor="ats-pdf-upload"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50"
                  : uploadedFile
                  ? "border-emerald-400 bg-emerald-50/40"
                  : "border-slate-200 hover:border-emerald-400 hover:bg-slate-50/50"
              }`}
            >
              <div
                className={`size-12 rounded-2xl flex items-center justify-center mb-2.5 ${
                  uploadedFile ? "bg-emerald-100 text-emerald-700" : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {uploadedFile ? <FileUp size={22} /> : <UploadCloud size={22} />}
              </div>

              {uploadedFile ? (
                <div>
                  <p className="text-xs font-bold text-slate-900">{uploadedFile.name}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    ✓ PDF file loaded ({(uploadedFile.size / 1024).toFixed(1)} KB)
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Click to browse or drag & drop PDF resume
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supported: Standard text-based PDF documents up to 10MB
                  </p>
                </div>
              )}
            </label>

            <input
              id="ats-pdf-upload"
              type="file"
              accept=".pdf"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onSetUploadedFile(file);
                }
              }}
            />
          </div>
        )}
      </div>

      <hr className="border-slate-100" />

      {/* 2. JOB DESCRIPTION INPUT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={20} className="text-emerald-600" />
              2. Paste Job Description (JD)
            </h3>
            <p className="text-xs text-slate-500">
              Paste the complete target job posting to scan required skills, keywords, and qualifications
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePasteJd}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
            >
              <Clipboard size={13} />
              <span className="hidden sm:inline">Paste</span>
            </button>
            {charCount > 0 && (
              <button
                type="button"
                onClick={handleClearJd}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* OPTIONAL TARGET ROLE TITLE */}
        <div>
          <input
            type="text"
            value={customJobTitle}
            onChange={(e) => onChangeCustomJobTitle(e.target.value)}
            placeholder="Target Job Title (Optional, e.g. Senior Frontend Engineer)"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
          />
        </div>

        {/* TEXTAREA */}
        <div className="relative">
          <textarea
            value={jobDescription}
            onChange={(e) => onChangeJobDescription(e.target.value)}
            rows={8}
            placeholder="Paste complete Job Description here... (e.g. We are seeking a Full-Stack Developer with 3+ years experience in React, Node.js, TypeScript, REST APIs, and AWS...)"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-y leading-relaxed font-mono"
          />

          <div className="flex items-center justify-between text-[11px] px-1 pt-1 text-slate-400 font-medium">
            <span>
              {charCount < 30 ? (
                <span className="text-amber-600 flex items-center gap-1 font-semibold">
                  <AlertCircle size={12} /> Minimum 30 characters required ({charCount}/30)
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold">
                  ✓ Valid Job Description ({charCount} characters)
                </span>
              )}
            </span>
            <span>Max 15,000 chars</span>
          </div>
        </div>
      </div>

      {/* 3. ANALYZE BUTTON */}
      <div>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isLoading || !isJdValid || (!selectedResumeId && !uploadedFile)}
          className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg hover:scale-[1.005] active:scale-[0.995] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-emerald-500/40"
        >
          <FrogFace size={18} />
          <span>{isLoading ? "Running froggie ATS Engine..." : "Analyze ATS Match Score"}</span>
        </button>
      </div>
    </div>
  );
};

export default AtsInputSection;
