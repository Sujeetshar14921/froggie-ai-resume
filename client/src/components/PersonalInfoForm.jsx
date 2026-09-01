import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User, Github } from 'lucide-react'
import React from 'react'

const PersonalInfoForm = ({data = {}, onChange, removeBackground, setRemoveBackground}) => {

    const handleChange = (field, value)=>{
        onChange({...data, [field]: value})
    }

  return (
    <div className="space-y-5">
      <div>
        <h3 className='text-lg font-bold text-gray-900'>Personal & Contact Details</h3>
        <p className='text-sm text-gray-500'>Enter your contact information, social links, and portfolio</p>
      </div>

      {/* AVATAR UPLOAD */}
      <div className='flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80'>
        <label className="cursor-pointer shrink-0">
          {data.image ? (
            <img
              src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
              alt="user-image"
              className='w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500 hover:opacity-80 shadow-xs'
            />
          ) : (
            <div className='flex flex-col items-center justify-center size-16 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl text-slate-500 hover:text-emerald-700 bg-white transition-all'>
              <User className='size-6'/> 
              <span className="text-[10px] font-bold mt-0.5">Photo</span>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleChange("image", e.target.files[0]);
              }
            }}
          />
        </label>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold text-slate-800">Profile Photo (Optional)</p>
            {data.image && (
              <button
                type="button"
                onClick={() => handleChange("image", null)}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Remove Photo
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-500">Upload a headshot for modern template styles.</p>

          <div className='flex items-center gap-2 mt-2'>
            <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-2 select-none'>
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={() => setRemoveBackground((prev) => !prev)}
                checked={Boolean(removeBackground)}
              />
              <div className='w-8 h-4 bg-slate-300 rounded-full peer peer-checked:bg-emerald-600 transition-colors duration-200'>
              </div>
              <span className='dot absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4'></span>
            </label>
            <span className="text-[11px] font-semibold text-slate-700">
              Remove Photo Background {removeBackground && <span className="text-emerald-600 font-bold">(Active)</span>}
            </span>
          </div>
        </div>
      </div>

      {/* CORE IDENTITY (NAME & PROFESSION) */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className='space-y-1'>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <User className="size-3.5 text-emerald-600"/>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.full_name || ""}
            onChange={(e)=>handleChange("full_name", e.target.value)}
            className='w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-xs sm:text-sm font-medium'
            placeholder="e.g. John Doe"
            required
          />
        </div>

        <div className='space-y-1'>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <BriefcaseBusiness className="size-3.5 text-emerald-600"/>
            Professional Title
          </label>
          <input
            type="text"
            value={data.profession || ""}
            onChange={(e)=>handleChange("profession", e.target.value)}
            className='w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-xs sm:text-sm font-medium'
            placeholder="e.g. Senior Full Stack Engineer"
          />
        </div>
      </div>

      {/* CONTACT DETAILS (EMAIL, PHONE, LOCATION) */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className='space-y-1'>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <Mail className="size-3.5 text-emerald-600"/>
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={data.email || ""}
            onChange={(e)=>handleChange("email", e.target.value)}
            className='w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-xs sm:text-sm font-medium'
            placeholder="john@example.com"
            required
          />
        </div>

        <div className='space-y-1'>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <Phone className="size-3.5 text-emerald-600"/>
            Phone Number
          </label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e)=>handleChange("phone", e.target.value)}
            className='w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-xs sm:text-sm font-medium'
            placeholder="+1 (555) 000-1234"
          />
        </div>

        <div className='space-y-1'>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <MapPin className="size-3.5 text-emerald-600"/>
            Location
          </label>
          <input
            type="text"
            value={data.location || ""}
            onChange={(e)=>handleChange("location", e.target.value)}
            className='w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-xs sm:text-sm font-medium'
            placeholder="San Francisco, CA"
          />
        </div>
      </div>

      {/* SOCIAL & PORTFOLIO LINKS WITH CUSTOM LABELS */}
      <div className="pt-3 border-t border-slate-100 space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
          Social, GitHub & Portfolio Links
        </h4>

        {/* LINKEDIN */}
        <div className="grid sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Linkedin className="size-3.5 text-[#0A66C2]"/>
              LinkedIn URL
            </label>
            <input
              type="url"
              value={data.linkedin || ""}
              onChange={(e)=>handleChange("linkedin", e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xs'
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              LinkedIn Display Label (Optional)
            </label>
            <input
              type="text"
              value={data.linkedin_label || ""}
              onChange={(e)=>handleChange("linkedin_label", e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xs'
              placeholder="e.g. linkedin.com/in/johndoe or John Doe"
            />
          </div>
        </div>

        {/* GITHUB */}
        <div className="grid sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Github className="size-3.5 text-slate-900"/>
              GitHub Profile URL
            </label>
            <input
              type="url"
              value={data.github || ""}
              onChange={(e)=>handleChange("github", e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xs'
              placeholder="https://github.com/username"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              GitHub Display Label (Optional)
            </label>
            <input
              type="text"
              value={data.github_label || ""}
              onChange={(e)=>handleChange("github_label", e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xs'
              placeholder="e.g. github.com/johndoe or johndoe"
            />
          </div>
        </div>

        {/* WEBSITE / PORTFOLIO */}
        <div className="grid sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="space-y-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Globe className="size-3.5 text-emerald-600"/>
              Personal Portfolio / Website URL
            </label>
            <input
              type="url"
              value={data.website || ""}
              onChange={(e)=>handleChange("website", e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xs'
              placeholder="https://johndoe.dev"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Website Display Label (Optional)
            </label>
            <input
              type="text"
              value={data.website_label || ""}
              onChange={(e)=>handleChange("website_label", e.target.value)}
              className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none text-xs'
              placeholder="e.g. johndoe.dev or Portfolio"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoForm
