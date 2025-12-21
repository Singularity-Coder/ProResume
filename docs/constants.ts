
import { ResumeData, TemplateStyle } from './types';

export const INITIAL_DATA: ResumeData = {
  personalInfo: {
    fullName: "John Doe",
    title: "Software Engineer",
    email: "johndoe@email.com",
    phone: "(555) 123-4567",
    location: "Seattle, WA",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    portfolio: "johndoe.com"
  },
  summary: "Motivated Computer Science graduate with a strong foundation in software development and data structures. Seeking an entry-level position at Amazon to contribute to innovative projects and grow as a professional while adhering to leadership principles.",
  experience: [
    {
      id: 'exp1',
      title: "Software Development Intern",
      subtitle: "Amazon",
      location: "Seattle, WA",
      dateRange: "06/2023 - 08/2023",
      description: [
        "Developed and implemented a new feature for the company's mobile app, resulting in a 15% increase in user engagement",
        "Collaborated with a team of 5 developers to optimize database queries, improving app performance by 20%",
        "Participated in daily stand-ups and biweekly sprint planning meetings, adhering to Agile methodologies"
      ]
    }
  ],
  education: [
    {
      id: 'edu1',
      title: "Bachelor of Science - Computer Science",
      subtitle: "University of Washington",
      location: "Seattle, WA",
      dateRange: "09/2020 - 05/2024",
      description: ["GPA: 3.8/4.0"]
    }
  ],
  projects: [
    {
      id: 'proj1',
      title: "E-commerce Platform (Academic Project)",
      dateRange: "09/2023 - 12/2023",
      description: [
        "Led a team of 4 to design and develop a full-stack e-commerce platform using React, Node.js, and MongoDB",
        "Implemented user authentication, product catalog, and shopping cart functionality",
        "Presented the project to a panel of professors and industry professionals, receiving top marks for innovation"
      ]
    }
  ],
  skills: [
    { category: "Languages", items: "Java, Python, JavaScript, C++, SQL" },
    { category: "Frameworks/Web", items: "React, Node.js, HTML, CSS" },
    { category: "Tools", items: "Git, GitHub, MongoDB, Agile Methodologies" }
  ],
  certifications: [
    "AWS Certified Cloud Practitioner (09/2023)"
  ],
  interests: "Generative AI, Multi Modal I/O, Text to 3D Models",
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills']
};

export const FONTS = [
  { name: 'Inter (Sans)', value: 'Inter, sans-serif' },
  { name: 'Roboto (Sans)', value: 'Roboto, sans-serif' },
  { name: 'Open Sans (Sans)', value: '"Open Sans", sans-serif' },
  { name: 'Libre Baskerville (Serif)', value: '"Libre Baskerville", serif' },
  { name: 'Merriweather (Serif)', value: 'Merriweather, serif' },
  { name: 'Georgia (Serif)', value: 'Georgia, serif' }
];

export const FONT_SIZES = [
  { name: 'Small', value: '11px' },
  { name: 'Normal', value: '12px' },
  { name: 'Medium', value: '13px' },
  { name: 'Large', value: '14px' }
];
