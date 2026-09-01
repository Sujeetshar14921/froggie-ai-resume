import { Loader2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { aiApi } from '../api/aiApi'
import toast from 'react-hot-toast'
import FrogFace from './FrogLogo'

const ProfessionalSummaryForm = ({data, onChange, setResumeData}) => {

  const { token } = useSelector(state => state.auth)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSummary = async () => {
    if (!data || !data.trim()) {
      toast.error("Please enter a professional summary draft to enhance");
      return;
    }

    try {
      setIsGenerating(true)
      const response = await aiApi.enhanceSummary(data, token)
      setResumeData(prev => ({...prev, professional_summary: response.enhancedContent}))
      toast.success("Summary enhanced with froggie AI!");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    finally{
      setIsGenerating(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Professional Summary </h3>
            <p className='text-sm text-gray-500'>Add summary for your resume here</p>
        </div>
        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-800 rounded-xl hover:bg-emerald-100 transition-colors disabled:opacity-50 border border-emerald-200/80 cursor-pointer'
        >
          {isGenerating ? (
            <Loader2 className="size-3.5 animate-spin text-emerald-600"/>
          ) : (
            <FrogFace size={14}/>
          )}
          <span>{isGenerating ? "Enhancing..." : "froggie AI Enhance"}</span>
        </button>
      </div>

      <div className="mt-6">
        <textarea
          value={data || ""}
          onChange={(e)=> onChange(e.target.value)}
          rows={7}
          className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-colors resize-none'
          placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'
        />
        <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center mt-2'>Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.</p>
      </div>
    </div>
  )
}

export default ProfessionalSummaryForm
