import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  X,
  Camera,
  Trash2,
  Loader2,
  User,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { authApi } from "../api/authApi";
import { updateUser } from "../app/features/authSlice";
import toast from "react-hot-toast";
import FrogFace from "./FrogLogo";

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    phone: "",
    location: "",
    bio: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        profession: user.profession || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.bio || "",
      });
      setImagePreview(user.image || "");
      setImageFile(null);
      setRemoveImage(false);
    }
  }, [user, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("profession", formData.profession.trim());
      data.append("phone", formData.phone.trim());
      data.append("location", formData.location.trim());
      data.append("bio", formData.bio.trim());

      if (removeImage) {
        data.append("removeImage", "true");
      } else if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await authApi.updateProfile(data, token);

      if (res?.user) {
        dispatch(updateUser(res.user));
        toast.success(res.message || "Profile updated successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* BACKDROP CLICK */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* MODAL CARD */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="relative px-6 py-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FrogFace size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Edit Profile</h2>
              <p className="text-[11px] text-slate-300">Personalize your candidate identity</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 max-h-[calc(85vh-120px)] overflow-y-auto no-scrollbar hide-scrollbar">
          
          {/* AVATAR UPLOAD SECTION */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="relative group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={formData.name || "User Avatar"}
                  className="size-20 sm:size-24 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
                />
              ) : (
                <div className="size-20 sm:size-24 rounded-2xl bg-slate-950 text-white flex items-center justify-center text-3xl font-black ring-4 ring-white shadow-md border border-emerald-500/30">
                  {formData.name?.charAt(0)?.toUpperCase() || <User size={32} />}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 bg-slate-950 hover:bg-black text-white rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer ring-2 ring-white border border-emerald-500/40"
                title="Change Photo"
              >
                <Camera size={14} className="text-emerald-400" />
              </button>
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <h3 className="text-xs font-bold text-slate-900">Profile Photo</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                PNG, JPG, or WebP up to 5MB. Clear headshots improve resume appearance.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                >
                  Upload New
                </button>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* INPUT FIELDS */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* FULL NAME */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <User size={13} className="text-emerald-600" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sujeet Kumar"
                required
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
            </div>

            {/* PROFESSION / ROLE */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Briefcase size={13} className="text-emerald-600" />
                Professional Title
              </label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
            </div>

            {/* EMAIL (READ-ONLY) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-emerald-600" /> Email Address
                </span>
                <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={11} /> Verified
                </span>
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-500 bg-slate-100/80 border border-slate-200 rounded-xl cursor-not-allowed"
              />
            </div>

            {/* PHONE */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Phone size={13} className="text-emerald-600" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +1 (555) 000-1234"
                className="w-full px-3.5 py-2 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
              />
            </div>

          </div>

          {/* LOCATION */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin size={13} className="text-emerald-600" />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. San Francisco, CA / London, UK"
              className="w-full px-3.5 py-2 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
          </div>

          {/* BIO / HEADLINE */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText size={13} className="text-emerald-600" />
              Bio / Candidate Headline
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Write a brief intro or career objective..."
              className="w-full px-3.5 py-2 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
            />
          </div>

          {/* MODAL FOOTER */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border border-emerald-500/30"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin text-emerald-400" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ProfileModal;
