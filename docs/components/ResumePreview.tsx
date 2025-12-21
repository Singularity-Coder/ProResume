
import React from 'react';
import { ResumeData, AppSettings, TemplateStyle } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  settings: AppSettings;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, settings }) => {
  const { personalInfo, summary, experience, education, projects, skills, sectionOrder } = data;
  const { fontFamily, fontSize, template, pagePadding } = settings;

  const containerStyle: React.CSSProperties = {
    fontFamily: fontFamily,
    fontSize: fontSize,
    color: '#111827',
    lineHeight: '1.4',
    padding: pagePadding, // Dynamic margin
    boxSizing: 'border-box'
  };

  const renderHeader = () => {
    switch (template) {
      case TemplateStyle.STANDARD_TECH:
        return (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{personalInfo.fullName}</h1>
            <div className="text-[12px] text-gray-600 flex flex-wrap gap-2">
              <span>{personalInfo.email}</span>
              <span>•</span>
              <span>{personalInfo.phone}</span>
              <span>•</span>
              <span>{personalInfo.location}</span>
            </div>
          </div>
        );
      case TemplateStyle.MODERN_ANALYST:
        return (
          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{personalInfo.fullName}</h1>
              <span className="text-sm font-medium text-gray-700">{personalInfo.title}</span>
            </div>
            <div className="flex flex-wrap text-[11px] text-gray-600 gap-x-3 border-t border-b py-2 border-gray-200">
              <span className="font-semibold">{personalInfo.location}</span>
              <span className="text-gray-300">|</span>
              <span>{personalInfo.phone}</span>
              <span className="text-gray-300">|</span>
              <a href={`mailto:${personalInfo.email}`} className="text-blue-600 underline">{personalInfo.email}</a>
              <span className="text-gray-300">|</span>
              <a href={personalInfo.linkedin} className="text-blue-600">LinkedIn</a>
            </div>
          </div>
        );
      case TemplateStyle.CLASSIC_JAKE:
        return (
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold uppercase tracking-tight">{personalInfo.fullName}</h1>
            <div className="text-[11px] mt-1 flex justify-center items-center gap-2">
              <span>{personalInfo.location}</span>
              <span>|</span>
              <span>{personalInfo.phone}</span>
              <span>|</span>
              <span className="text-blue-700 underline">{personalInfo.email}</span>
              <span>|</span>
              <span className="text-blue-700 underline">{personalInfo.linkedin}</span>
              <span>|</span>
              <span className="text-blue-700 underline">{personalInfo.github}</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="mb-6 border-b-2 border-gray-900 pb-4">
            <h1 className="text-4xl font-black text-gray-900 mb-1">{personalInfo.fullName}</h1>
            <p className="text-lg font-semibold text-gray-700 mb-2">{personalInfo.title}</p>
            <div className="flex gap-4 text-sm text-gray-600">
              <span>{personalInfo.email}</span>
              <span>{personalInfo.phone}</span>
              <span>{personalInfo.location}</span>
            </div>
          </div>
        );
    }
  };

  const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (template === TemplateStyle.CLASSIC_JAKE) {
      return (
        <h2 className="text-[14px] font-bold border-b border-black mb-1.5 mt-4 uppercase">{children}</h2>
      );
    }
    if (template === TemplateStyle.MODERN_ANALYST) {
        return (
          <h2 className="text-[15px] font-bold text-gray-800 mb-2 mt-4 uppercase tracking-wide border-l-4 border-blue-600 pl-2">{children}</h2>
        );
    }
    return (
      <h2 className="text-lg font-bold text-gray-800 mb-2 mt-6 border-b pb-1">{children}</h2>
    );
  };

  const renderSection = (type: string) => {
    switch (type) {
      case 'summary':
        return summary ? (
          <section key="summary" className="mb-4">
            <SectionHeading>Summary</SectionHeading>
            <p className="text-gray-800 text-justify leading-relaxed">{summary}</p>
          </section>
        ) : null;
      
      case 'experience':
        return (
          <section key="experience" className="mb-4">
            <SectionHeading>Experience</SectionHeading>
            <div className="space-y-4">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <span className="text-sm text-gray-600 italic">{exp.dateRange}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold text-gray-700 italic">{exp.subtitle}</span>
                    <span className="text-[11px] text-gray-500 uppercase">{exp.location}</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 text-gray-800 space-y-1">
                    {exp.description.filter(b => b.trim()).map((bullet, j) => (
                      <li key={j} className="text-justify">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        return projects.length > 0 ? (
          <section key="projects" className="mb-4">
            <SectionHeading>Projects</SectionHeading>
            <div className="space-y-4">
              {projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-gray-900">{proj.title}</h3>
                    <span className="text-sm text-gray-600 italic">{proj.dateRange}</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 text-gray-800 space-y-1">
                    {proj.description.filter(b => b.trim()).map((bullet, j) => (
                      <li key={j} className="text-justify">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'education':
        return (
          <section key="education" className="mb-4">
            <SectionHeading>Education</SectionHeading>
            <div className="space-y-2">
              {education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{edu.title}</h3>
                    <span className="text-sm text-gray-600 italic">{edu.dateRange}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-semibold text-gray-700 italic">{edu.subtitle}</span>
                    <span className="text-[11px] text-gray-500 uppercase">{edu.location}</span>
                  </div>
                  <p className="text-[12px] text-gray-700">{edu.description[0]}</p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        return (
          <section key="skills" className="mb-4">
            <SectionHeading>Skills</SectionHeading>
            <div className="space-y-1.5">
              {skills.map((skill, i) => (
                <div key={i} className="text-[12px] flex items-start gap-1">
                  <span className="font-bold text-gray-900 whitespace-nowrap">{skill.category}: </span>
                  <span className="text-gray-800">{skill.items}</span>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      id="resume-preview"
      className="resume-container"
      style={containerStyle}
    >
      {renderHeader()}
      {sectionOrder.map(section => renderSection(section))}
    </div>
  );
};

export default ResumePreview;
