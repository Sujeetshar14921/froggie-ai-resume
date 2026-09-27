import React, { useState } from "react";
import { X, UploadCloud, FileUp, Loader2, FileText, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import FrogFace from "../FrogLogo";

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"];

const UploadResumeModal = ({ isOpen, onClose, onUpload, isLoading }) => {
  const [title, setTitle] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setTitle("");
    setResumeFile(null);
    onClose();
  };

  const getCleanTitle = (fileName) => {
    return fileName.replace(/\.(pdf|docx?|txt)$/i, "");
  };

  const isValidFile = (file) => {
    if (!file) return false;
    const name = file.name.toLowerCase();
    return ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!isValidFile(file)) {
      toast.error("Please select a valid PDF or Word (.docx, .doc) file");
      return;
    }
    setResumeFile(file);
    if (!title) {
      setTitle(getCleanTitle(file.name));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error("Please select a PDF or Word DOC file");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title for your resume");
      return;
    }

    onUpload({ file: resumeFile, title: title.trim() }, handleClose);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
          <UploadCloud size={24} />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">Upload & Import Resume</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6">
          Upload any <strong>PDF</strong> or <strong>Word (.doc, .docx)</strong> resume. froggie AI extracts all details and loads them directly into the visual preview & editor.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Resume Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Engineer Resume"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Resume File (PDF / DOC / DOCX)
            </label>
            <label
              htmlFor="resume-upload-input"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50"
                  : resumeFile
                  ? "border-emerald-400 bg-emerald-50/50"
                  : "border-slate-200 hover:border-emerald-400 hover:bg-slate-50"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${
                  resumeFile ? "bg-emerald-100 text-emerald-700" : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {resumeFile ? <CheckCircle2 size={24} /> : <FileUp size={24} />}
              </div>

              {resumeFile ? (
                <div>
                  <p className="font-bold text-slate-900 text-sm">{resumeFile.name}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    ✓ File attached ({(resumeFile.size / 1024).toFixed(1)} KB) · Click to change
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    Click to browse or drag & drop Resume
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports PDF, Word (.docx, .doc), or TXT up to 10MB
                  </p>
                </div>
              )}
            </label>

            <input
              id="resume-upload-input"
              hidden
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileSelect(file);
                }
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !resumeFile}
            className="w-full mt-2 py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-950/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border border-emerald-500/30"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin text-emerald-400" />
            ) : (
              <FrogFace size={18} />
            )}
            <span>{isLoading ? "froggie AI Parsing & Loading..." : "Parse & Open in Visual Editor"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResumeModal;
