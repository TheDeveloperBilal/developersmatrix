'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Sparkles, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code,
  FileText,
  Printer
} from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export default function ResumeBuilderClient() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);
  const tabOrder = ['personal', 'experience', 'education', 'skills', 'projects'];

  // Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: ''
  });

  // Experience
  const [experiences, setExperiences] = useState<Experience[]>([{
    id: '1',
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  }]);

  // Education
  const [education, setEducation] = useState<Education[]>([{
    id: '1',
    institution: '',
    degree: '',
    field: '',
    graduationDate: ''
  }]);

  // Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Projects
  const [projects, setProjects] = useState<Project[]>([]);

  const addExperience = () => {
    setExperiences([...experiences, {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    }]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      graduationDate: ''
    }]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addProject = () => {
    setProjects([...projects, {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    }]);
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };

  const generateSummary = async () => {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'resume-summary',
        data: {
          position: experiences[0]?.position || 'professional',
          company: experiences[0]?.company,
          skills: skills.slice(0, 5)
        }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      setPersonalInfo({ ...personalInfo, summary: data.content });
    } else {
      // Fallback
      const summary = `Experienced ${experiences[0]?.position || 'professional'} with expertise in ${skills.slice(0, 3).join(', ') || 'software development'}. Proven track record of delivering high-quality solutions at ${experiences[0]?.company || 'leading companies'}. Passionate about continuous learning and driving impactful results.`;
      setPersonalInfo({ ...personalInfo, summary });
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const exportToPDF = async () => {
    // Create printable content
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const resumeContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${personalInfo.name || 'Resume'} - Resume</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
            background: white;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #2563eb; 
            padding-bottom: 15px; 
            margin-bottom: 20px;
          }
          .name { 
            font-size: 28px; 
            font-weight: 700; 
            color: #1a1a1a; 
            margin-bottom: 8px;
            letter-spacing: 0.5px;
          }
          .contact-info { 
            font-size: 12px; 
            color: #4b5563;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px;
          }
          .contact-item {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          .section { 
            margin-bottom: 20px; 
          }
          .section-title { 
            font-size: 14px; 
            font-weight: 600; 
            color: #2563eb; 
            border-bottom: 1px solid #e5e7eb; 
            padding-bottom: 5px; 
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .experience-item, .education-item, .project-item { 
            margin-bottom: 15px; 
          }
          .experience-header, .education-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
          }
          .company, .institution { 
            font-weight: 600; 
            font-size: 14px;
            color: #1f2937;
          }
          .position, .degree { 
            font-size: 13px; 
            color: #4b5563;
            font-style: italic;
          }
          .date { 
            font-size: 11px; 
            color: #6b7280; 
          }
          .description { 
            font-size: 12px; 
            color: #374151;
            white-space: pre-line;
            margin-top: 6px;
          }
          .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          .skill { 
            background: #f3f4f6; 
            padding: 4px 10px; 
            border-radius: 4px; 
            font-size: 11px;
            color: #374151;
          }
          .summary { 
            font-size: 12px; 
            color: #374151; 
          }
          .project-name { font-weight: 600; font-size: 13px; }
          .project-tech { font-size: 11px; color: #6b7280; margin-top: 4px; }
          @media print {
            body { padding: 0.5in; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${personalInfo.name || 'Your Name'}</div>
          <div class="contact-info">
            ${personalInfo.email ? `<span class="contact-item">📧 ${personalInfo.email}</span>` : ''}
            ${personalInfo.phone ? `<span class="contact-item">📱 ${personalInfo.phone}</span>` : ''}
            ${personalInfo.location ? `<span class="contact-item">📍 ${personalInfo.location}</span>` : ''}
            ${personalInfo.linkedin ? `<span class="contact-item">💼 ${personalInfo.linkedin}</span>` : ''}
            ${personalInfo.website ? `<span class="contact-item">🌐 ${personalInfo.website}</span>` : ''}
          </div>
        </div>

        ${personalInfo.summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p class="summary">${personalInfo.summary}</p>
        </div>
        ` : ''}

        ${experiences.some(e => e.company || e.position) ? `
        <div class="section">
          <div class="section-title">Experience</div>
          ${experiences.filter(e => e.company || e.position).map(exp => `
            <div class="experience-item">
              <div class="experience-header">
                <div>
                  <div class="company">${exp.company}</div>
                  <div class="position">${exp.position}</div>
                </div>
                <div class="date">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
              </div>
              ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${education.some(e => e.institution || e.degree) ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${education.filter(e => e.institution || e.degree).map(edu => `
            <div class="education-item">
              <div class="education-header">
                <div>
                  <div class="institution">${edu.institution}</div>
                  <div class="degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
                </div>
                <div class="date">${formatDate(edu.graduationDate)}</div>
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${skills.length > 0 ? `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-container">
            ${skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
          </div>
        </div>
        ` : ''}

        ${projects.some(p => p.name) ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${projects.filter(p => p.name).map(proj => `
            <div class="project-item">
              <div class="project-name">${proj.name}${proj.link ? ` - ${proj.link}` : ''}</div>
              ${proj.description ? `<div class="description">${proj.description}</div>` : ''}
              ${proj.technologies ? `<div class="project-tech">Technologies: ${proj.technologies}</div>` : ''}
            </div>
          `).join('')}
        </div>
        ` : ''}
      </body>
      </html>
    `;

    printWindow.document.write(resumeContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const tabProgress = {
    personal: 20,
    experience: 40,
    education: 60,
    skills: 80,
    projects: 100,
  };

  return (
    <>
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Resume Builder
            </CardTitle>
            <div className="flex items-center gap-2">
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={!personalInfo.name}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Resume Preview</DialogTitle>
                  </DialogHeader>
                  <div ref={resumeRef} className="bg-white text-black p-8 rounded-lg border shadow-sm">
                    {/* Preview Header */}
                    <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
                      <h1 className="text-3xl font-bold text-gray-900">{personalInfo.name || 'Your Name'}</h1>
                      <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm text-gray-600">
                        {personalInfo.email && <span>📧 {personalInfo.email}</span>}
                        {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
                        {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                        {personalInfo.linkedin && <span>💼 {personalInfo.linkedin}</span>}
                        {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
                      </div>
                    </div>

                    {/* Summary */}
                    {personalInfo.summary && (
                      <div className="mb-6">
                        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide border-b pb-1 mb-3">Professional Summary</h2>
                        <p className="text-sm text-gray-700">{personalInfo.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {experiences.some(e => e.company || e.position) && (
                      <div className="mb-6">
                        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide border-b pb-1 mb-3">Experience</h2>
                        {experiences.filter(e => e.company || e.position).map((exp, i) => (
                          <div key={i} className="mb-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-800">{exp.company}</h3>
                                <p className="text-sm text-gray-600 italic">{exp.position}</p>
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                              </span>
                            </div>
                            {exp.description && (
                              <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education */}
                    {education.some(e => e.institution || e.degree) && (
                      <div className="mb-6">
                        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide border-b pb-1 mb-3">Education</h2>
                        {education.filter(e => e.institution || e.degree).map((edu, i) => (
                          <div key={i} className="mb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
                                <p className="text-sm text-gray-600 italic">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                              </div>
                              <span className="text-xs text-gray-500">{formatDate(edu.graduationDate)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide border-b pb-1 mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {projects.some(p => p.name) && (
                      <div className="mb-6">
                        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide border-b pb-1 mb-3">Projects</h2>
                        {projects.filter(p => p.name).map((proj, i) => (
                          <div key={i} className="mb-3">
                            <h3 className="font-semibold text-gray-800">{proj.name}</h3>
                            {proj.description && <p className="text-sm text-gray-700 mt-1">{proj.description}</p>}
                            {proj.technologies && (
                              <p className="text-xs text-gray-500 mt-1">Technologies: {proj.technologies}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                size="sm" 
                onClick={exportToPDF}
                disabled={!personalInfo.name}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-1">
            Step {Object.keys(tabProgress).indexOf(activeTab) + 1} of 5
          </p>
          <div className="w-full bg-gray-100 rounded-full h-1 mb-3">
            <div
              className="bg-gradient-to-r from-violet-600 to-purple-600 h-1 rounded-full transition-all duration-500"
              style={{ width: `${tabProgress[activeTab] ?? 20}%` }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value) => {
            const currentIndex = tabOrder.indexOf(activeTab);
            const newIndex = tabOrder.indexOf(value);
            if (newIndex > currentIndex && !completedTabs.includes(activeTab)) {
              setCompletedTabs(prev => [...prev, activeTab]);
            }
            setActiveTab(value);
          }}>
            <div className="border-b px-2 sm:px-4 overflow-x-auto">
              <TabsList className="h-auto sm:h-12 bg-transparent flex flex-nowrap min-w-max sm:min-w-0 sm:flex-wrap gap-1 py-2">
                <TabsTrigger value="personal" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-600 px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">
                  <span className={`
                    w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-1.5 shrink-0
                    ${completedTabs.includes('personal')
                      ? 'bg-violet-600 text-white'
                      : activeTab === 'personal'
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-gray-100 text-gray-400'}
                  `}>
                    {completedTabs.includes('personal') ? '✓' : '1'}
                  </span>
                  Personal
                </TabsTrigger>
                <TabsTrigger value="experience" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-600 px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">
                  <span className={`
                    w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-1.5 shrink-0
                    ${completedTabs.includes('experience')
                      ? 'bg-violet-600 text-white'
                      : activeTab === 'experience'
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-gray-100 text-gray-400'}
                  `}>
                    {completedTabs.includes('experience') ? '✓' : '2'}
                  </span>
                  Experience
                </TabsTrigger>
                <TabsTrigger value="education" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-600 px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">
                  <span className={`
                    w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-1.5 shrink-0
                    ${completedTabs.includes('education')
                      ? 'bg-violet-600 text-white'
                      : activeTab === 'education'
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-gray-100 text-gray-400'}
                  `}>
                    {completedTabs.includes('education') ? '✓' : '3'}
                  </span>
                  Education
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-600 px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">
                  <span className={`
                    w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-1.5 shrink-0
                    ${completedTabs.includes('skills')
                      ? 'bg-violet-600 text-white'
                      : activeTab === 'skills'
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-gray-100 text-gray-400'}
                  `}>
                    {completedTabs.includes('skills') ? '✓' : '4'}
                  </span>
                  Skills
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-600 px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">
                  <span className={`
                    w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-1.5 shrink-0
                    ${completedTabs.includes('projects')
                      ? 'bg-violet-600 text-white'
                      : activeTab === 'projects'
                        ? 'bg-violet-100 text-violet-600'
                        : 'bg-gray-100 text-gray-400'}
                  `}>
                    {completedTabs.includes('projects') ? '✓' : '5'}
                  </span>
                  Projects
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4 sm:p-6">
              <TabsContent value="personal" className="mt-0 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-violet-500">*</span></Label>
                    <Input
                      className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                      id="name"
                      placeholder="John Doe"
                      value={personalInfo.name}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-violet-500">*</span></Label>
                    <Input
                      className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                      id="location"
                      placeholder="San Francisco, CA"
                      value={personalInfo.location}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                      id="linkedin"
                      placeholder="linkedin.com/in/johndoe"
                      value={personalInfo.linkedin}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website/Portfolio</Label>
                    <Input
                      className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                      id="website"
                      placeholder="johndoe.com"
                      value={personalInfo.website}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={generateSummary}
                      className="text-violet-600 border-violet-500/30"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Generate
                    </Button>
                  </div>
                  <Textarea
                    className="rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 resize-none"
                    id="summary"
                    placeholder="Write a compelling summary of your professional background and goals..."
                    rows={4}
                    value={personalInfo.summary}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    A strong summary highlights your key achievements and career goals in 2-3 sentences.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="mt-0 space-y-4 sm:space-y-6">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="border border-gray-200 rounded-xl shadow-sm p-4 mb-4 relative bg-white">
                    <div className="absolute top-3 right-3">
                      {experiences.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeExperience(exp.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="mb-3 pb-2 border-b border-gray-100 pr-8">
                      <p className="font-semibold text-sm text-gray-700">
                        {exp.company || exp.position || 'New Experience'}
                      </p>
                      {exp.startDate && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {exp.startDate} – {exp.endDate || 'Present'}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                          placeholder="Google"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...experiences];
                            updated[index].company = e.target.value;
                            setExperiences(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Position</Label>
                        <Input
                          className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                          placeholder="Senior Software Engineer"
                          value={exp.position}
                          onChange={(e) => {
                            const updated = [...experiences];
                            updated[index].position = e.target.value;
                            setExperiences(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => {
                            const updated = [...experiences];
                            updated[index].startDate = e.target.value;
                            setExperiences(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                          type="month"
                          placeholder="Present"
                          value={exp.endDate}
                          onChange={(e) => {
                            const updated = [...experiences];
                            updated[index].endDate = e.target.value;
                            setExperiences(updated);
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        className="rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 resize-none"
                        placeholder="• Led development of key features...
• Improved system performance by 40%...
• Mentored junior developers..."
                        rows={4}
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...experiences];
                          updated[index].description = e.target.value;
                          setExperiences(updated);
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Use bullet points (•) to highlight achievements. Start each bullet with action verbs.
                      </p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addExperience}
                  className="w-full border-dashed border-2 border-violet-300 text-violet-600 hover:bg-violet-50 hover:border-violet-400 py-3 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </TabsContent>

              <TabsContent value="education" className="mt-0 space-y-4 sm:space-y-6">
                {education.map((edu, index) => (
                  <div key={edu.id} className="border border-gray-200 rounded-xl shadow-sm p-4 mb-4 relative bg-white">
                    <div className="absolute top-3 right-3">
                      {education.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="mb-3 pb-2 border-b border-gray-100 pr-8">
                      <p className="font-semibold text-sm text-gray-700">
                        {edu.institution || edu.degree || 'New Education'}
                      </p>
                      {edu.graduationDate && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {edu.graduationDate}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input
                          className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                          placeholder="Stanford University"
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[index].institution = e.target.value;
                            setEducation(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input
                          className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                          placeholder="Bachelor of Science"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[index].degree = e.target.value;
                            setEducation(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                          placeholder="Computer Science"
                          value={edu.field}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[index].field = e.target.value;
                            setEducation(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Graduation Date</Label>
                        <Input
                          className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                          type="month"
                          value={edu.graduationDate}
                          onChange={(e) => {
                            const updated = [...education];
                            updated[index].graduationDate = e.target.value;
                            setEducation(updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addEducation}
                  className="w-full border-dashed border-2 border-violet-300 text-violet-600 hover:bg-violet-50 hover:border-violet-400 py-3 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </TabsContent>

              <TabsContent value="skills" className="mt-0 space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type a skill and press Enter"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      className="min-h-[44px] h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                    />
                    <Button onClick={addSkill} variant="outline" className="shrink-0 min-h-[44px] min-w-[44px]">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-violet-50 text-violet-700 border border-violet-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5"
                      >
                        {skill}
                        <button
                          onClick={() => setSkills(skills.filter(s => s !== skill))}
                          className="text-violet-400 hover:text-violet-600 ml-1 text-xs leading-none"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    {skills.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No skills added yet. Add your technical and soft skills above.
                      </p>
                    )}
                  </div>

                  {skills.length < 3 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1.5">
                        Suggested skills:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'Figma']
                          .filter(s => !skills.includes(s))
                          .map(s => (
                            <button
                              key={s}
                              onClick={() => setSkills([...skills, s])}
                              className="text-xs border border-violet-200 text-violet-600 rounded-full px-2.5 py-0.5 hover:bg-violet-50 transition-colors"
                            >
                              + {s}
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Suggested Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'SQL', 'AWS', 'Docker', 'Git', 'Agile', 'Machine Learning', 'Data Analysis'].map((skill) => (
                        <Badge 
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-violet-500/10 hover:text-violet-600 hover:border-violet-500/30"
                          onClick={() => {
                            if (!skills.includes(skill)) {
                              setSkills([...skills, skill]);
                            }
                          }}
                        >
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="mt-0 space-y-4 sm:space-y-6">
                {projects.map((project, index) => (
                  <div key={project.id} className="border border-gray-200 rounded-xl shadow-sm p-4 mb-4 relative bg-white">
                    <div className="absolute top-3 right-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeProject(project.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mb-3 pb-2 border-b border-gray-100 pr-8">
                      <p className="font-semibold text-sm text-gray-700">
                        {project.name || 'New Project'}
                      </p>
                      {project.technologies && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {project.technologies}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label>Project Name</Label>
                        <Input
                          className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                          placeholder="E-commerce Platform"
                          value={project.name}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[index].name = e.target.value;
                            setProjects(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Project Link (optional)</Label>
                        <Input
                          className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                          placeholder="github.com/username/project"
                          value={project.link}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[index].link = e.target.value;
                            setProjects(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          className="rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 resize-none"
                          placeholder="Built a full-stack e-commerce platform..."
                          rows={3}
                          value={project.description}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[index].description = e.target.value;
                            setProjects(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Technologies Used</Label>
                        <Input
                          className="h-11 rounded-lg focus-visible:ring-violet-400 focus-visible:ring-2 focus-visible:border-violet-400"
                          placeholder="React, Node.js, MongoDB, AWS"
                          value={project.technologies}
                          onChange={(e) => {
                            const updated = [...projects];
                            updated[index].technologies = e.target.value;
                            setProjects(updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addProject}
                  className="w-full border-dashed border-2 border-violet-300 text-violet-600 hover:bg-violet-50 hover:border-violet-400 py-3 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
                
                {projects.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Add your projects to showcase your work</p>
                    <p className="text-sm">Projects help demonstrate your practical skills</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>

          {/* Sticky Bottom Navigation Bar */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-3 rounded-b-xl">
            <button
              onClick={() => {
                const currentIndex = tabOrder.indexOf(activeTab);
                if (currentIndex > 0) setActiveTab(tabOrder[currentIndex - 1]);
              }}
              disabled={activeTab === 'personal'}
              className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 flex items-center gap-1"
            >
              ← Back
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {Object.keys(tabProgress).indexOf(activeTab) + 1} / 5
              </span>
            </div>

            {activeTab === 'projects' ? (
              <button
                onClick={exportToPDF}
                className="bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:opacity-90 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            ) : (
              <button
                onClick={() => {
                  const currentIndex = tabOrder.indexOf(activeTab);
                  if (currentIndex < tabOrder.length - 1) {
                    if (!completedTabs.includes(activeTab)) {
                      setCompletedTabs(prev => [...prev, activeTab]);
                    }
                    setActiveTab(tabOrder[currentIndex + 1]);
                  }
                }}
                className="bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:opacity-90 flex items-center gap-1.5"
              >
                Next →
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
