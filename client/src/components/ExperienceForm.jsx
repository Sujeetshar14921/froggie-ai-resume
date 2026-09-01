import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { aiApi } from '../api/aiApi'
import toast from 'react-hot-toast'
import FrogFace from './FrogLogo'

const ExperienceForm = ({ data, onChange }) => {

    const { token } = useSelector(state => state.auth)
    const [generatingIndex, setGeneratingIndex] = useState(-1)

const addExperience = () =>{
    const newExperience = {
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: "",
        is_current: false
    };
    onChange([...data, newExperience])
}

const removeExperience = (index)=>{
    const updated = data.filter((_, i)=> i !== index);
    onChange(updated)
}

const updateExperience = (index, field, value)=>{
    const updated = [...data];
    updated[index] = {...updated[index], [field]: value}
    onChange(updated)
}

 const generateDescription = async (index) => {
    const experience = data[index]
    if (!experience.description && !experience.position) {
      toast.error("Please add a role or description first");
      return;
    }

    setGeneratingIndex(index)

    try {
        const res = await aiApi.enhanceJobDescription({
            description: experience.description,
            position: experience.position,
            company: experience.company
        }, token)
        updateExperience(index, "description", res.enhancedContent)
        toast.success("Experience bullet points enhanced with froggie AI!");
    } catch (error) {
        toast.error(error.message)
    }finally{
        setGeneratingIndex(-1)
    }
 }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Professional Experience </h3>
            <p className='text-sm text-gray-500'>Add your job experience</p>
        </div>
        <button onClick={addExperience} className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-xl transition-all cursor-pointer border border-emerald-500/30'>
            <Plus className="size-3.5 text-emerald-400"/>
            <span>Add Experience</span>
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
            <p>No work experience added yet.</p>
            <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      ): (
        <div className='space-y-4'>
            {data.map((experience, index)=>(
                <div key={index} className="p-4 border border-gray-200 rounded-xl space-y-3 bg-white">
                    <div className='flex justify-between items-start'>
                        <h4 className="font-bold text-sm text-slate-800">Experience #{index + 1}</h4>
                        <button onClick={()=> removeExperience(index)} className='text-red-500 hover:text-red-700 transition-colors p-1'>
                            <Trash2 className="size-4"/>
                        </button>
                    </div>

                    <div className='grid md:grid-cols-2 gap-3'>

                        <input value={experience.company || ""} onChange={(e)=>updateExperience(index, "company", e.target.value)} type="text" placeholder="Company Name" className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"/>

                        <input value={experience.position || ""} onChange={(e)=>updateExperience(index, "position", e.target.value)} type="text" placeholder="Job Title" className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"/>

                        <input value={experience.start_date || ""} onChange={(e)=>updateExperience(index, "start_date", e.target.value)} type="month" className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"/>

                        <input value={experience.end_date || ""} onChange={(e)=>updateExperience(index, "end_date", e.target.value)} type="month" disabled={experience.is_current} className="px-3 py-2 text-sm rounded-lg disabled:bg-gray-100 border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"/>
                    </div>

                    <label className='flex items-center gap-2 cursor-pointer'>
                        <input type="checkbox" checked={experience.is_current || false} onChange={(e)=>{updateExperience(index, "is_current", e.target.checked ? true : false); }} className='rounded border-gray-300 text-emerald-600 focus:ring-emerald-500'/>
                        <span className='text-xs font-medium text-gray-700'>Currently working here</span>
                    </label>

                    <div className="space-y-2">
                        <div className='flex items-center justify-between'>
                            <label className='text-xs font-bold text-gray-700'>Job Description</label>
                            <button onClick={()=> generateDescription(index)} disabled={generatingIndex === index || !experience.position || !experience.company} className='flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50 border border-emerald-200/80 cursor-pointer'>
                                {generatingIndex === index ? (
                                    <Loader2 className="w-3 h-3 animate-spin text-emerald-600"/>
                                ): (
                                    <FrogFace size={12}/>
                                )}
                                <span>Enhance with froggie</span>
                            </button>
                        </div>
                        <textarea value={experience.description || ""} onChange={(e)=> updateExperience(index, "description", e.target.value)} rows={4} className="w-full text-sm px-3 py-2 rounded-lg resize-none border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none" placeholder="Describe your key responsibilities and achievements..."/>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default ExperienceForm
