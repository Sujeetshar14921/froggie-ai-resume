import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { BulletAiToolbar } from './builder';

const ProjectForm = ({ data, onChange }) => {

const addProject = () =>{
    const newProject = {
        name: "",
        type: "",
        description: "",
    };
    onChange([...data, newProject])
}

const removeProject = (index)=>{
    const updated = data.filter((_, i)=> i !== index);
    onChange(updated)
}

const updateProject = (index, field, value)=>{
    const updated = [...data];
    updated[index] = {...updated[index], [field]: value}
    onChange(updated)
}

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Projects </h3>
            <p className='text-sm text-gray-500'>Add your projects</p>
        </div>
        <button onClick={addProject} className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-xl transition-all cursor-pointer border border-emerald-500/30'>
            <Plus className="size-3.5 text-emerald-400"/>
            <span>Add Project</span>
        </button>
      </div>

      
        <div className='space-y-4 mt-6'>
            {data.map((project, index)=>(
                <div key={index} className="p-4 border border-gray-200 rounded-xl space-y-3 bg-white">
                    <div className='flex justify-between items-start'>
                        <h4 className="font-bold text-sm text-slate-800">Project #{index + 1}</h4>
                        <button onClick={()=> removeProject(index)} className='text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer'>
                            <Trash2 className="size-4"/>
                        </button>
                    </div>

                    <div className='grid gap-3'>

                        <input value={project.name || ""} onChange={(e)=>updateProject(index, "name", e.target.value)} type="text" placeholder="Project Name" className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"/>

                        <input value={project.type || ""} onChange={(e)=>updateProject(index, "type", e.target.value)} type="text" placeholder="Project Type" className="px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"/>

                        <textarea rows={4} value={project.description || ""} onChange={(e)=>updateProject(index, "description", e.target.value)} placeholder="Describe your project..." className="w-full px-3 py-2 text-sm rounded-lg resize-none border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"/>
            
                        {/* AI QUICK OPTIMIZER TOOLBAR */}
                        <BulletAiToolbar
                          text={project.description || ""}
                          position={project.name || "Project"}
                          company={project.type || "Technical Project"}
                          onUpdate={(newText) => updateProject(index, "description", newText)}
                        />
                    </div>


                </div>
            ))}
        </div>
     
    </div>
  )
}

export default ProjectForm
