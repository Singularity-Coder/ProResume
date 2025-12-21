
import React, { useState } from 'react';
import { ResumeData, SectionItem, AppSettings, TemplateStyle } from '../types';
import { FONTS, FONT_SIZES } from '../constants';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ReactNode }> = ({ title, children, defaultOpen = false, icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            {icon || <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
          </div>
          <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        </div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-50">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </section>
  );
};

const EntryItem: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, onRemove, onDragStart, onDragOver, onDragEnd, isDragging, children }) => {
  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`border border-gray-100 rounded-xl mb-2 transition-all overflow-hidden ${isDragging ? 'opacity-40 border-blue-400' : 'bg-white hover:border-gray-200'}`}
    >
      <div className="flex items-center gap-3 px-3 py-3 group cursor-move">
        <div className="text-gray-300 group-hover:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
        </div>
        <div className="flex-1 truncate">
          <span className={`text-sm font-medium ${title ? 'text-gray-700' : 'text-gray-300 italic'}`}>
            {title || 'Untitled Entry'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-50 bg-gray-50/30">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
};

const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange, settings, onSettingsChange }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedSubItem, setDraggedSubItem] = useState<{ category: string; index: number } | null>(null);
  const [openSubEntries, setOpenSubEntries] = useState<Record<string, number | null>>({
    experience: 0,
    projects: 0,
    education: 0
  });
  
  const inputClass = "w-full mt-1 p-2 border border-gray-200 rounded-md text-sm text-gray-700 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50/50 outline-none transition-all placeholder:text-gray-300";
  const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1";
  
  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });
  };

  const updateSection = (key: 'experience' | 'education' | 'projects', index: number, field: keyof SectionItem, value: any) => {
    const newItems = [...data[key]];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, [key]: newItems });
  };

  const addSectionItem = (key: 'experience' | 'education' | 'projects') => {
    const newItem: SectionItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Entry', subtitle: '', location: '', dateRange: '', description: ['']
    };
    const updatedList = [...data[key], newItem];
    onChange({ ...data, [key]: updatedList });
    setOpenSubEntries(prev => ({ ...prev, [key]: updatedList.length - 1 }));
  };

  const removeSectionItem = (key: 'experience' | 'education' | 'projects', index: number) => {
    onChange({ ...data, [key]: data[key].filter((_, i) => i !== index) });
  };

  const updateBullet = (key: 'experience' | 'education' | 'projects', sectionIndex: number, bulletIndex: number, value: string) => {
    const newItems = [...data[key]];
    const newBullets = [...newItems[sectionIndex].description];
    newBullets[bulletIndex] = value;
    newItems[sectionIndex] = { ...newItems[sectionIndex], description: newBullets };
    onChange({ ...data, [key]: newItems });
  };

  const addBullet = (key: 'experience' | 'education' | 'projects', sectionIndex: number) => {
    const newItems = [...data[key]];
    newItems[sectionIndex] = { ...newItems[sectionIndex], description: [...newItems[sectionIndex].description, ''] };
    onChange({ ...data, [key]: newItems });
  };

  // Main Section Drag Handlers
  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newOrder = [...data.sectionOrder];
    const draggedItem = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    onChange({ ...data, sectionOrder: newOrder });
  };
  const handleDragEnd = () => setDraggedIndex(null);

  // Sub-item Drag Handlers
  const handleSubDragStart = (category: 'experience' | 'projects' | 'education', index: number) => {
    setDraggedSubItem({ category, index });
  };
  const handleSubDragOver = (e: React.DragEvent, category: 'experience' | 'projects' | 'education', index: number) => {
    e.preventDefault();
    if (!draggedSubItem || draggedSubItem.category !== category || draggedSubItem.index === index) return;
    const newItems = [...data[category]];
    const draggedItem = newItems[draggedSubItem.index];
    newItems.splice(draggedSubItem.index, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedSubItem({ category, index });
    
    // Maintain open item index
    if (openSubEntries[category] === draggedSubItem.index) {
      setOpenSubEntries(prev => ({ ...prev, [category]: index }));
    } else if (openSubEntries[category] === index) {
      setOpenSubEntries(prev => ({ ...prev, [category]: draggedSubItem.index }));
    }

    onChange({ ...data, [category]: newItems });
  };
  const handleSubDragEnd = () => setDraggedSubItem(null);

  const toggleSubEntry = (category: string, index: number) => {
    setOpenSubEntries(prev => ({
      ...prev,
      [category]: prev[category] === index ? null : index
    }));
  };

  const sectionNameMap: Record<string, string> = {
    summary: 'Summary',
    experience: 'Work Experience',
    projects: 'Projects',
    education: 'Education',
    skills: 'Technical Skills'
  };

  return (
    <div className="space-y-4 pb-20">
      <CollapsibleSection title="Design Settings" defaultOpen icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.21 0 4-1.79 4-4.04 0-1.65-1.34-3.02-3-3.02z"/></svg>}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className={labelClass}>Template Style</label>
            <select value={settings.template} onChange={(e) => onSettingsChange({ ...settings, template: e.target.value as TemplateStyle })} className={inputClass}>
              <option value={TemplateStyle.STANDARD_TECH}>Samuel Style</option>
              <option value={TemplateStyle.MODERN_ANALYST}>Analyst Style</option>
              <option value={TemplateStyle.CLASSIC_JAKE}>Jake's Style</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Font Family</label>
              <select value={settings.fontFamily} onChange={(e) => onSettingsChange({ ...settings, fontFamily: e.target.value })} className={inputClass}>
                {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Text Size</label>
              <select value={settings.fontSize} onChange={(e) => onSettingsChange({ ...settings, fontSize: e.target.value })} className={inputClass}>
                {FONT_SIZES.map(s => <option key={s.value} value={s.value}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Page Padding (mm)</label>
            <input 
              type="range" 
              min="10" 
              max="40" 
              step="1"
              value={parseInt(settings.pagePadding)} 
              onChange={(e) => onSettingsChange({ ...settings, pagePadding: `${e.target.value}mm` })} 
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-bold">
              <span>Narrow (10mm)</span>
              <span>{settings.pagePadding}</span>
              <span>Wide (40mm)</span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Reorder Sections" icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>}>
        <div className="space-y-2">
          {data.sectionOrder.map((section, index) => (
            <div 
              key={section}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 bg-white border rounded-lg transition-all cursor-move select-none ${draggedIndex === index ? 'opacity-50 scale-[1.02] border-blue-400 shadow-md' : 'border-gray-100 hover:border-blue-200'}`}
            >
              <div className="text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
              </div>
              <span className="text-sm font-bold text-gray-700">{sectionNameMap[section]}</span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Personal Information" icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Full Name</label>
            <input type="text" value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} className={inputClass} />
          </div>
          <div><label className={labelClass}>Email</label><input type="email" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className={inputClass} /></div>
          <div><label className={labelClass}>Phone</label><input type="text" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className={inputClass} /></div>
          <div className="md:col-span-2"><label className={labelClass}>Location</label><input type="text" value={data.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} className={inputClass} /></div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Summary" icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>}>
        <textarea 
          className={inputClass} 
          rows={4} 
          value={data.summary} 
          onChange={(e) => onChange({ ...data, summary: e.target.value })}
          placeholder="A brief overview of your background and career goals."
        />
      </CollapsibleSection>

      <CollapsibleSection title="Experience" icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}>
        <div className="space-y-1">
          {data.experience.map((exp, idx) => (
            <EntryItem
              key={exp.id}
              title={exp.title || exp.subtitle || 'Work Experience'}
              isOpen={openSubEntries.experience === idx}
              onToggle={() => toggleSubEntry('experience', idx)}
              onRemove={() => removeSectionItem('experience', idx)}
              onDragStart={() => handleSubDragStart('experience', idx)}
              onDragOver={(e) => handleSubDragOver(e, 'experience', idx)}
              onDragEnd={handleSubDragEnd}
              isDragging={draggedSubItem?.category === 'experience' && draggedSubItem.index === idx}
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input placeholder="Job Title" value={exp.title} onChange={(e) => updateSection('experience', idx, 'title', e.target.value)} className={inputClass} />
                <input placeholder="Company" value={exp.subtitle} onChange={(e) => updateSection('experience', idx, 'subtitle', e.target.value)} className={inputClass} />
                <input placeholder="Date Range" value={exp.dateRange} onChange={(e) => updateSection('experience', idx, 'dateRange', e.target.value)} className={inputClass} />
                <input placeholder="Location" value={exp.location} onChange={(e) => updateSection('experience', idx, 'location', e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-2">
                {exp.description.map((bullet, bIdx) => (
                  <input key={bIdx} value={bullet} onChange={(e) => updateBullet('experience', idx, bIdx, e.target.value)} className={inputClass} placeholder={`Achievement ${bIdx + 1}`} />
                ))}
                <button onClick={() => addBullet('experience', idx)} className="text-xs text-blue-500 font-bold mt-1 hover:underline">+ Add Point</button>
              </div>
            </EntryItem>
          ))}
          <button onClick={() => addSectionItem('experience')} className="w-full mt-2 py-2.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors">+ Add Position</button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Projects" icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>}>
        <div className="space-y-1">
          {data.projects.map((proj, idx) => (
            <EntryItem
              key={proj.id}
              title={proj.title || 'Untitled Project'}
              isOpen={openSubEntries.projects === idx}
              onToggle={() => toggleSubEntry('projects', idx)}
              onRemove={() => removeSectionItem('projects', idx)}
              onDragStart={() => handleSubDragStart('projects', idx)}
              onDragOver={(e) => handleSubDragOver(e, 'projects', idx)}
              onDragEnd={handleSubDragEnd}
              isDragging={draggedSubItem?.category === 'projects' && draggedSubItem.index === idx}
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input placeholder="Project Name" value={proj.title} onChange={(e) => updateSection('projects', idx, 'title', e.target.value)} className={inputClass} />
                <input placeholder="Date" value={proj.dateRange} onChange={(e) => updateSection('projects', idx, 'dateRange', e.target.value)} className={inputClass} />
              </div>
              <div className="space-y-2">
                {proj.description.map((bullet, bIdx) => (
                  <input key={bIdx} value={bullet} onChange={(e) => updateBullet('projects', idx, bIdx, e.target.value)} className={inputClass} placeholder={`Highlight ${bIdx + 1}`} />
                ))}
                <button onClick={() => addBullet('projects', idx)} className="text-xs text-blue-500 font-bold mt-1 hover:underline">+ Add Point</button>
              </div>
            </EntryItem>
          ))}
          <button onClick={() => addSectionItem('projects')} className="w-full mt-2 py-2.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors">+ Add Project</button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Skills" icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>}>
        <div className="space-y-3">
          {data.skills.map((skill, idx) => (
            <div key={idx} className="grid grid-cols-1 gap-2">
              <label className={labelClass}>{skill.category || 'Category'}</label>
              <input value={skill.items} onChange={(e) => {
                const newSkills = [...data.skills];
                newSkills[idx] = { ...newSkills[idx], items: e.target.value };
                onChange({ ...data, skills: newSkills });
              }} className={inputClass} placeholder="Items separated by commas" />
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Education" icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}>
        <div className="space-y-1">
          {data.education.map((edu, idx) => (
            <EntryItem
              key={edu.id}
              title={edu.title || edu.subtitle || 'Education Entry'}
              isOpen={openSubEntries.education === idx}
              onToggle={() => toggleSubEntry('education', idx)}
              onRemove={() => removeSectionItem('education', idx)}
              onDragStart={() => handleSubDragStart('education', idx)}
              onDragOver={(e) => handleSubDragOver(e, 'education', idx)}
              onDragEnd={handleSubDragEnd}
              isDragging={draggedSubItem?.category === 'education' && draggedSubItem.index === idx}
            >
              <div className="grid grid-cols-1 gap-3">
                <input placeholder="Degree" value={edu.title} onChange={(e) => updateSection('education', idx, 'title', e.target.value)} className={inputClass} />
                <input placeholder="School" value={edu.subtitle} onChange={(e) => updateSection('education', idx, 'subtitle', e.target.value)} className={inputClass} />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Location" value={edu.location} onChange={(e) => updateSection('education', idx, 'location', e.target.value)} className={inputClass} />
                  <input placeholder="Date Range" value={edu.dateRange} onChange={(e) => updateSection('education', idx, 'dateRange', e.target.value)} className={inputClass} />
                </div>
                <input placeholder="Additional Details" value={edu.description[0]} onChange={(e) => updateBullet('education', idx, 0, e.target.value)} className={inputClass} />
              </div>
            </EntryItem>
          ))}
          <button onClick={() => addSectionItem('education')} className="w-full mt-2 py-2.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors">+ Add Education</button>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default ResumeEditor;
