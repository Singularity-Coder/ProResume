
import React, { useState, useEffect } from 'react';
import { ResumeData, AppSettings, TemplateStyle } from './types';
import { INITIAL_DATA, FONTS, FONT_SIZES } from './constants';
import ResumeEditor from './components/ResumeEditor';
import ResumePreview from './components/ResumePreview';

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [zoom, setZoom] = useState(0.8);
  const [settings, setSettings] = useState<AppSettings>({
    fontFamily: FONTS[0].value,
    fontSize: FONT_SIZES[1].value,
    template: TemplateStyle.CLASSIC_JAKE,
    pagePadding: '20mm'
  });

  const handleDownloadPDF = () => {
    // Standardize title for filename
    const originalTitle = document.title;
    document.title = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume`;
    
    // Use a small timeout to ensure DOM state is rendered for print
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 100);
  };

  const handleDownloadMarkdown = () => {
    const md = `# ${data.personalInfo.fullName}\n${data.personalInfo.title}\n\n## Summary\n${data.summary}\n\n## Experience\n${data.experience.map(exp => `### ${exp.title} - ${exp.subtitle}\n${exp.description.map(b => `- ${b}`).join('\n')}`).join('\n\n')}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadText = () => {
    let txt = `${data.personalInfo.fullName.toUpperCase()}\n${data.personalInfo.title}\n\nSUMMARY\n${data.summary}\n\nEXPERIENCE\n${data.experience.map(exp => `${exp.title} | ${exp.subtitle}\n${exp.description.map(b => `- ${b}`).join('\n')}`).join('\n\n')}`;
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center z-50 no-print flex-shrink-0 h-16">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsEditorVisible(!isEditorVisible)}
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors bg-gray-50 rounded-lg border border-gray-100 hidden md:flex items-center justify-center"
            title={isEditorVisible ? "Hide Editor" : "Show Editor"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-lg shadow-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <h1 className="text-base font-bold tracking-tight text-gray-900 leading-none">Pro<span className="text-blue-600">Resume</span></h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Zoom Controls */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg p-1 mr-2">
            <button onClick={() => setZoom(Math.max(0.3, zoom - 0.05))} className="p-1.5 text-gray-400 hover:text-gray-600 active:bg-gray-200 rounded transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
            <span className="text-[10px] font-bold text-gray-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(1.5, zoom + 0.05))} className="p-1.5 text-gray-400 hover:text-gray-600 active:bg-gray-200 rounded transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
          </div>

          <div className="relative group">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="opacity-60 transition-transform group-hover:translate-y-0.5"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-[60]">
              <div className="bg-white border border-gray-100 rounded-xl shadow-2xl w-44 overflow-hidden">
                <button onClick={handleDownloadPDF} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-blue-50 text-gray-700 flex items-center justify-between border-b border-gray-50 group/item">
                  <span>PDF Document</span>
                  <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded uppercase">Print</span>
                </button>
                <button onClick={handleDownloadMarkdown} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-blue-50 text-gray-700 flex items-center justify-between border-b border-gray-50">
                  <span>Markdown</span>
                  <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded uppercase">MD</span>
                </button>
                <button onClick={handleDownloadText} className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-blue-50 text-gray-700 flex items-center justify-between">
                  <span>Plain Text</span>
                  <span className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded uppercase">TXT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Editor Side: Standardized 16px padding */}
        <div 
          className={`editor-side flex-shrink-0 bg-gray-50/50 no-print transition-all duration-500 ease-in-out border-r border-gray-100 h-full overflow-y-auto ${isEditorVisible ? 'w-full md:w-[450px] lg:w-[500px]' : 'w-0 opacity-0 pointer-events-none'}`}
        >
          <div className="p-4 max-w-2xl mx-auto space-y-6">
            <div className="mb-2">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Editor</h2>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-1">Live Builder v2.0</p>
            </div>
            <ResumeEditor 
              data={data} 
              onChange={setData} 
              settings={settings} 
              onSettingsChange={setSettings} 
            />
          </div>
        </div>

        {/* Preview Side: Now allows scrolling when zoomed content exceeds bounds */}
        <div className={`preview-side flex-1 bg-gray-100 relative h-full flex flex-col items-center overflow-auto no-print transition-all duration-500`}>
          {/* Wrapper that handles scaling. min-width/height ensures scrollbars trigger correctly */}
          <div 
            className="preview-container-wrapper p-8 flex items-start justify-center transition-transform duration-200" 
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: 'top center',
              minHeight: `calc(297mm * ${zoom} + 4rem)`,
              minWidth: `calc(210mm * ${zoom} + 4rem)`
            }}
          >
            <ResumePreview data={data} settings={settings} />
          </div>
        </div>
      </main>

      {/* Mobile Drawer Overlay */}
      <div className={`md:hidden fixed inset-0 z-40 no-print transition-opacity duration-300 ${isEditorVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditorVisible(false)}></div>
        <div className="absolute inset-y-0 left-0 w-[85%] bg-white shadow-2xl overflow-y-auto p-4 transition-transform duration-300 transform">
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-100">
            <h2 className="font-bold text-gray-900">Resume Editor</h2>
            <button onClick={() => setIsEditorVisible(false)} className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <ResumeEditor data={data} onChange={setData} settings={settings} onSettingsChange={setSettings} />
        </div>
      </div>
      
      {/* Mobile Float Toggle */}
      {!isEditorVisible && (
        <button 
          onClick={() => setIsEditorVisible(true)} 
          className="md:hidden fixed bottom-6 left-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl no-print active:scale-90 transition-transform"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      )}
    </div>
  );
};

export default App;
