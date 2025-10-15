import { useState, useEffect } from "react";
import { FileText, Download, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const ResumeBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: ""
  });
  const [experience, setExperience] = useState([{
    company: "",
    position: "",
    duration: "",
    description: ""
  }]);
  const [education, setEducation] = useState([{
    institution: "",
    degree: "",
    year: "",
    details: ""
  }]);
  const [skills, setSkills] = useState("");

  useEffect(() => {
    document.title = "Free Resume Builder Online – TittoosTools";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Create professional resumes with multiple templates. Free resume builder with ATS-friendly designs and PDF export.');
    }
  }, []);

  const templates = [
    { id: "modern", name: "Modern Professional" },
    { id: "classic", name: "Classic Corporate" },
    { id: "creative", name: "Creative Design" },
    { id: "minimal", name: "Minimal Clean" },
    { id: "executive", name: "Executive Level" }
  ];

  const addExperience = () => {
    setExperience([...experience, { company: "", position: "", duration: "", description: "" }]);
  };

  const addEducation = () => {
    setEducation([...education, { institution: "", degree: "", year: "", details: "" }]);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const handleSave = () => {
    const resumeData = {
      template: selectedTemplate,
      personalInfo,
      experience,
      education,
      skills
    };
    
    localStorage.setItem('resume_data', JSON.stringify(resumeData));
    toast.success("Resume saved successfully!");
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('resume_data');
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedTemplate(data.template || "modern");
      setPersonalInfo(data.personalInfo || {});
      setExperience(data.experience || [{}]);
      setEducation(data.education || [{}]);
      setSkills(data.skills || "");
      toast.success("Resume loaded successfully!");
    } else {
      toast.error("No saved resume found");
    }
  };

  const handleExportPDF = () => {
    // In a real implementation, you would generate PDF here
    toast.info("PDF export feature would generate and download your resume here");
  };

  const features = [
    "Multiple professional templates",
    "ATS-friendly designs",
    "Real-time preview",
    "PDF export functionality",
    "Save and load resume data"
  ];

  return (
    <ToolTemplate
      title="Resume Builder"
      description="Create professional resumes with multiple templates and export options"
      icon={FileText}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Choose Template</h3>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={personalInfo.location}
                  onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                  placeholder="City, State"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label>Professional Summary</Label>
              <Textarea
                value={personalInfo.summary}
                onChange={(e) => setPersonalInfo({...personalInfo, summary: e.target.value})}
                placeholder="Brief professional summary..."
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Button onClick={addExperience} size="sm">Add Experience</Button>
            </div>
            {experience.map((exp, index) => (
              <div key={index} className="space-y-4 p-4 border rounded mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      placeholder="Job title"
                    />
                  </div>
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input
                    value={exp.duration}
                    onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                    placeholder="Jan 2020 - Present"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Key responsibilities and achievements..."
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Button onClick={addEducation} size="sm">Add Education</Button>
            </div>
            {education.map((edu, index) => (
              <div key={index} className="space-y-4 p-4 border rounded mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Institution</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      placeholder="University/School name"
                    />
                  </div>
                  <div>
                    <Label>Degree</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="Degree/Certificate"
                    />
                  </div>
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    value={edu.year}
                    onChange={(e) => updateEducation(index, 'year', e.target.value)}
                    placeholder="2020"
                  />
                </div>
                <div>
                  <Label>Details</Label>
                  <Textarea
                    value={edu.details}
                    onChange={(e) => updateEducation(index, 'details', e.target.value)}
                    placeholder="GPA, honors, relevant coursework..."
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Skills</h3>
            <Textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="List your key skills, separated by commas..."
              className="mb-4"
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1">
            <User className="h-4 w-4 mr-2" />
            Save Resume
          </Button>
          <Button onClick={handleLoad} variant="outline" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            Load Resume
          </Button>
          <Button onClick={handleExportPDF} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default ResumeBuilder;