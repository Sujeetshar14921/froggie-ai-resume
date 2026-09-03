import React from "react";
import { User, Mail, Phone, MapPin, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

const XRayContactMatrix = ({ personal = {} }) => {
  const contactFields = [
    {
      label: "Full Name",
      value: personal.full_name,
      icon: User,
      status: Boolean(personal.full_name?.trim()),
    },
    {
      label: "Email Address",
      value: personal.email,
      icon: Mail,
      status: Boolean(personal.email?.includes("@")),
    },
    {
      label: "Phone Number",
      value: personal.phone,
      icon: Phone,
      status: Boolean(personal.phone?.trim()?.length >= 7),
    },
    {
      label: "Location",
      value: personal.location,
      icon: MapPin,
      status: Boolean(personal.location?.trim()),
    },
    {
      label: "Portfolio / Social",
      value: personal.linkedin || personal.github || personal.website,
      icon: Sparkles,
      status: Boolean(personal.linkedin || personal.github || personal.website),
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 text-left">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>Header Contact Parsing Matrix</span>
        </span>
        <span className="text-[11px] text-slate-400 font-semibold">Taleo / Workday Schema</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {contactFields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border flex flex-col justify-between space-y-1.5 transition-all ${
                field.status
                  ? "bg-emerald-50/40 border-emerald-200/80 text-emerald-950"
                  : "bg-rose-50/40 border-rose-200/80 text-rose-950"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon size={13} className={field.status ? "text-emerald-600" : "text-rose-500"} />
                {field.status ? (
                  <CheckCircle2 size={12} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={12} className="text-rose-500" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold block text-slate-500 uppercase tracking-tight">
                  {field.label}
                </span>
                <span
                  className={`text-[11px] font-semibold truncate block ${
                    field.status ? "text-slate-800" : "text-rose-600 italic"
                  }`}
                  title={field.value || "Not Detected"}
                >
                  {field.value || "Not Detected"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default XRayContactMatrix;
