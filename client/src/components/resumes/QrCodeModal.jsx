import React, { useState, useRef } from "react";
import {
  X,
  Download,
  Copy,
  Check,
  QrCode,
  Share2,
  ExternalLink,
  Linkedin,
  MessageCircle,
  Mail,
  Sparkles,
} from "lucide-react";
import { BrandIcon } from "../FrogLogo";
import toast from "react-hot-toast";

const QrCodeModal = ({
  isOpen,
  onClose,
  resumeTitle = "Professional Resume",
  candidateName = "Candidate",
  shareUrl = "",
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const resolvedUrl = shareUrl || window.location.href;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&margin=12&data=${encodeURIComponent(
    resolvedUrl
  )}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resolvedUrl);
    setCopied(true);
    toast.success("Public Resume Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${candidateName.replace(/\s+/g, "_")}_Resume_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      toast.success("QR Code downloaded! Add it to your resume header.");
    } catch {
      toast.error("Could not download QR Code directly. Right click to save image.");
    } finally {
      setIsDownloading(false);
    }
  };

  const shareOnLinkedIn = () => {
    const text = `Check out my verified professional resume and career portfolio on froggie: ${resolvedUrl}`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(resolvedUrl)}`,
      "_blank"
    );
  };

  const shareOnWhatsApp = () => {
    const text = `Take a look at my verified resume on froggie: ${resolvedUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = `${candidateName} - Resume & Career Portfolio`;
    const body = `Hi,\n\nPlease find my professional resume and interactive career portfolio here:\n${resolvedUrl}\n\nBest regards,\n${candidateName}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 select-none">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-5 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BrandIcon size="xs" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-tight text-white">
                  Resume QR Code & Share Suite
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-[240px]">
                {resumeTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 sm:p-6 space-y-5 text-center">
          
          {/* QR CODE CARD */}
          <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/90 inline-flex flex-col items-center justify-center mx-auto shadow-inner">
            <div className="size-48 sm:size-52 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
              <img
                src={qrImageUrl}
                alt="Resume Public QR Code"
                className="size-full object-contain rounded-xl"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-2.5 max-w-[220px]">
              Scan with mobile camera to view live interactive portfolio
            </p>
          </div>

          {/* QUICK ACTIONS: DOWNLOAD QR & COPY LINK */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleDownloadQr}
              disabled={isDownloading}
              className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md border border-emerald-500/40 cursor-pointer disabled:opacity-60"
            >
              <Download size={14} className="text-emerald-400" />
              <span>{isDownloading ? "Saving..." : "Download QR"}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-200 shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Web Link</span>
                </>
              )}
            </button>
          </div>

          {/* SOCIAL RECRUITER OUTREACH BUTTONS */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
              Share Directly with Recruiters:
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={shareOnLinkedIn}
                className="p-2.5 rounded-xl bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] border border-[#0077B5]/30 transition-all cursor-pointer"
                title="Share on LinkedIn"
              >
                <Linkedin size={16} />
              </button>

              <button
                onClick={shareOnWhatsApp}
                className="p-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 transition-all cursor-pointer"
                title="Share on WhatsApp"
              >
                <MessageCircle size={16} />
              </button>

              <button
                onClick={shareViaEmail}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                title="Send via Email"
              >
                <Mail size={16} />
              </button>
            </div>
          </div>

          {/* PRO TIP ALERT */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900 text-left flex items-start gap-2">
            <Sparkles size={14} className="text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Recruiter Pro Tip: </strong> Placing this QR code in the top right of your printed or PDF resume allows interviewers to see your projects, code, and live updates with one tap.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default QrCodeModal;
