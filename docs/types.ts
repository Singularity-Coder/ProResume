
export enum TemplateStyle {
  STANDARD_TECH = 'STANDARD_TECH',
  MODERN_ANALYST = 'MODERN_ANALYST',
  CLASSIC_JAKE = 'CLASSIC_JAKE',
  MINIMAL_ELEGANT = 'MINIMAL_ELEGANT'
}

export interface SectionItem {
  id: string;
  title: string;
  subtitle?: string;
  location?: string;
  dateRange?: string;
  description: string[];
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  experience: SectionItem[];
  education: SectionItem[];
  projects: SectionItem[];
  skills: {
    category: string;
    items: string;
  }[];
  certifications: string[];
  interests: string;
  sectionOrder: string[];
}

export interface AppSettings {
  fontFamily: string;
  fontSize: string;
  template: TemplateStyle;
  pagePadding: string; // New setting for margins
}
