import React from "react";
import { Award, Plus, Trash2, ExternalLink } from "lucide-react";

const CertificationForm = ({ data = [], onChange }) => {
  const addCertification = () => {
    const newCert = {
      name: "",
      issuer: "",
      date: "",
      url: "",
    };
    onChange([...data, newCert]);
  };

  const removeCertification = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateCertification = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            Certifications & Licenses
          </h3>
          <p className="text-sm text-gray-500">
            Add your professional certifications, credentials, and courses
          </p>
        </div>
        <button
          onClick={addCertification}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-xl transition-all cursor-pointer border border-emerald-500/30 shadow-xs"
        >
          <Plus className="size-3.5 text-emerald-400" />
          <span>Add Certification</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-6 text-gray-500 space-y-2">
          <Award className="w-12 h-12 mx-auto text-slate-300" />
          <p className="font-semibold text-slate-700 text-sm">No certifications added yet.</p>
          <p className="text-xs text-slate-400">
            Showcase certifications like AWS Certified, PMP, Google Cloud, Meta Developer, etc.
          </p>
          <button
            onClick={addCertification}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <Plus className="size-3" />
            <span>Add First Certification</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((cert, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-2xl space-y-3 bg-white shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-200/80">
                    {index + 1}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800">
                    {cert.name || `Certification #${index + 1}`}
                  </h4>
                </div>

                <button
                  onClick={() => removeCertification(index)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                  title="Remove Certification"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Certification Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={cert.name || ""}
                    onChange={(e) => updateCertification(index, "name", e.target.value)}
                    type="text"
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Issuing Organization <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={cert.issuer || ""}
                    onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                    type="text"
                    placeholder="e.g. Amazon Web Services, Google, Coursera"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Issue Date</label>
                  <input
                    value={cert.date || ""}
                    onChange={(e) => updateCertification(index, "date", e.target.value)}
                    type="month"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <ExternalLink className="size-3 text-slate-400" />
                    Credential URL / Verification Link
                  </label>
                  <input
                    value={cert.url || ""}
                    onChange={(e) => updateCertification(index, "url", e.target.value)}
                    type="url"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationForm;
