import React from "react";
import { User, Mail, Briefcase, Phone, MapPin, Camera, Loader2, Check } from "lucide-react";

const ProfileTab = ({
  user,
  profileName,
  setProfileName,
  profileProfession,
  setProfileProfession,
  profilePhone,
  setProfilePhone,
  profileLocation,
  setProfileLocation,
  profileBio,
  setProfileBio,
  imagePreview,
  fileInputRef,
  handleImageChange,
  handleRemoveImage,
  handleSaveProfile,
  isSavingProfile,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-8 space-y-6 shadow-xs">
      <div>
        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <User className="size-5 text-emerald-500" />
          <span>Personal Profile & Identity</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Update your contact details, profession headline, and profile avatar.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* AVATAR ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800">
          <div className="relative group size-20 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border-2 border-slate-300 dark:border-slate-700 shadow-xs">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-slate-400" />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </button>

              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              JPG, PNG or GIF up to 5MB. Photo will appear on supported resume templates.
            </p>
          </div>
        </div>

        {/* FORM FIELDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g. Sujeet Kumar"
                required
                className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full h-11 pl-10 pr-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Headline / Profession
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Briefcase className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={profileProfession}
                onChange={(e) => setProfileProfession(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer"
                className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Phone Number
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Location
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={profileLocation}
              onChange={(e) => setProfileLocation(e.target.value)}
              placeholder="e.g. Bangalore, India"
              className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Bio / Summary
          </label>
          <textarea
            rows={3}
            value={profileBio}
            onChange={(e) => setProfileBio(e.target.value)}
            placeholder="Brief overview of your career background and core competencies..."
            className="w-full p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSavingProfile}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm transition-colors flex items-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isSavingProfile ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{isSavingProfile ? "Saving Profile..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
