import React from "react";
import { UserCheck, Calendar, Globe, Heart, Flag, Home, Shield } from "lucide-react";

const PersonalDetailsForm = ({ data = {}, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <UserCheck className="size-5 text-emerald-600" />
          <span>Personal Details</span>
        </h3>
        <p className="text-sm text-gray-500">
          Add additional personal information (useful for international, regional, or specific industry CVs)
        </p>
      </div>

      <div className="p-4 border border-gray-200 rounded-2xl space-y-4 bg-white shadow-2xs">
        <div className="grid md:grid-cols-2 gap-4">
          {/* DATE OF BIRTH */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-slate-400" />
              <span>Date of Birth</span>
            </label>
            <input
              type="date"
              value={data.date_of_birth || ""}
              onChange={(e) => handleChange("date_of_birth", e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          {/* GENDER */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <UserCheck className="size-3.5 text-slate-400" />
              <span>Gender</span>
            </label>
            <select
              value={data.gender || ""}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
            >
              <option value="">Select Gender (Optional)</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* NATIONALITY */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Flag className="size-3.5 text-slate-400" />
              <span>Nationality</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Indian, American, British"
              value={data.nationality || ""}
              onChange={(e) => handleChange("nationality", e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          {/* MARITAL STATUS */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Heart className="size-3.5 text-slate-400" />
              <span>Marital Status</span>
            </label>
            <select
              value={data.marital_status || ""}
              onChange={(e) => handleChange("marital_status", e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none bg-white"
            >
              <option value="">Select Status (Optional)</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Unspecified">Prefer not to say</option>
            </select>
          </div>

          {/* PASSPORT / ID NO */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Shield className="size-3.5 text-slate-400" />
              <span>Passport / ID Number (Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Passport No. or National ID"
              value={data.passport_no || ""}
              onChange={(e) => handleChange("passport_no", e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          {/* PERMANENT ADDRESS */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Home className="size-3.5 text-slate-400" />
              <span>Permanent / Residential Address</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Flat 402, Green Valley Apartments, Mumbai, India - 400001"
              value={data.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;
