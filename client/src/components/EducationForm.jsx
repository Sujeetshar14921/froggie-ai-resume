import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import React from 'react'

const EducationForm = ({ data, onChange }) => {

const addEducation = () =>{
    const newEducation = {
        institution: "",
        degree: "",
        field: "",
        graduation_date: "",
        gpa: ""
    };
    onChange([...data, newEducation])
}

const removeEducation = (index)=>{
    const updated = data.filter((_, i)=> i !== index);
    onChange(updated)
}

const updateEducation = (index, field, value)=>{
    const updated = [...data];
    updated[index] = {...updated[index], [field]: value}
    onChange(updated)
}

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Education </h3>
            <p className='text-sm text-gray-500'>Add your education details</p>
        </div>
        <button onClick={addEducation} className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-xl transition-all cursor-pointer border border-emerald-500/30'>
            <Plus className="size-3.5 text-emerald-400"/>
            <span>Add Education</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
            <p>No education added yet.</p>
            <p className="text-sm">Click "Add Education" to get started.</p>
        </div>
      ): (
        <div className='space-y-4'>
            {data.map((education, index)=>(
                <div key={index} className="p-4 border border-gray-200 rounded-xl space-y-3 bg-white">
                    <div className='flex justify-between items-start'>
                        <h4 className="font-bold text-sm text-slate-800">Education #{index + 1}</h4>
                        <button onClick={()=> removeEducation(index)} className='text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer'>
                            <Trash2 className="size-4"/>
                        </button>
                    </div>

                    <div className='grid md:grid-cols-2 gap-3'>

                        <input value={education.institution || ""} onChange={(e)=>updateEducation(index, "institution", e.target.value)} type="text" placeholder="Institution Name" className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"/>

                        <input value={education.degree || ""} onChange={(e)=>updateEducation(index, "degree", e.target.value)} type="text" placeholder="Degree (e.g., Bachelor's, Master's)" className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"/>

                        <input value={education.field || ""} onChange={(e)=>updateEducation(index, "field", e.target.value)} type="text" className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none" placeholder="Field of Study"/>

                        <input value={education.graduation_date || ""} onChange={(e)=>updateEducation(index, "graduation_date", e.target.value)} type="month" className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"/>
                    </div>

                    <input value={education.gpa || ""} onChange={(e)=>updateEducation(index, "gpa", e.target.value)} type="text" className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none" placeholder="GPA (optional)"/>

                </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default EducationForm
