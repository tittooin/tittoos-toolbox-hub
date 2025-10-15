
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Wand2, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

interface AIBlogGeneratorProps {
  onClose: () => void;
  onSave: (blog: any) => void;
}

const AIBlogGenerator: React.FC<AIBlogGeneratorProps> = ({ onClose, onSave }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<any>(null);
  const [formData, setFormData] = useState({
    topic: '',
    category: '',
    tone: 'professional',
    wordCount: '1200',
    keywords: '',
    author: ''
  });

  const categories = [
    'Technology', 'Business', 'Marketing', 'Health', 'Education', 
    'Finance', 'Travel', 'Lifestyle', 'Food', 'Entertainment',
    'Sports', 'Science', 'Environment', 'Politics', 'Culture'
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'conversational', label: 'Conversational' }
  ];

  const generateSEOBlog = async () => {
    if (!formData.topic || !formData.category || !formData.author) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI blog generation with realistic content
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const keywordList = formData.keywords.split(',').map(k => k.trim()).filter(Boolean);
      const mainKeywords = keywordList.length > 0 ? keywordList : [`${formData.topic}`, `${formData.category.toLowerCase()} tips`, 'best practices'];
      
      const generatedContent = generateBlogContent(formData.topic, formData.category, mainKeywords, parseInt(formData.wordCount));
      
      const newBlog = {
        id: Date.now(),
        title: `${formData.topic}: Complete Guide for ${new Date().getFullYear()}`,
        excerpt: `Discover everything you need to know about ${formData.topic.toLowerCase()}. This comprehensive guide covers ${mainKeywords.slice(0, 3).join(', ')} and more essential tips for success.`,
        content: generatedContent,
        author: formData.author,
        date: new Date().toISOString().split('T')[0],
        readTime: `${Math.ceil(parseInt(formData.wordCount) / 200)} min read`,
        keywords: mainKeywords,
        metaDescription: `Learn about ${formData.topic.toLowerCase()} with our comprehensive guide. Includes ${mainKeywords.slice(0, 2).join(', ')} and expert insights. Read now!`,
        category: formData.category,
        isAIGenerated: true
      };
      
      setGeneratedBlog(newBlog);
      toast.success('Blog post generated successfully!');
      
    } catch (error) {
      toast.error('Failed to generate blog post. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBlogContent = (topic: string, category: string, keywords: string[], wordCount: number): string => {
    // Generate SEO-friendly blog content structure
    const sections = [
      `<h2>Introduction to ${topic}</h2>`,
      `<p>In today's rapidly evolving ${category.toLowerCase()} landscape, understanding ${topic.toLowerCase()} has become crucial for success. This comprehensive guide will explore ${keywords.slice(0, 3).join(', ')} and provide you with actionable insights to excel in this domain.</p>`,
      
      `<h2>What is ${topic}?</h2>`,
      `<p>${topic} represents a fundamental concept in ${category.toLowerCase()} that affects how we approach modern challenges. By focusing on ${keywords[0] || topic.toLowerCase()}, professionals can achieve better results and stay ahead of the competition.</p>`,
      
      `<h2>Key Benefits of Understanding ${topic}</h2>`,
      `<ul>
        <li>Enhanced ${keywords[1] || 'productivity'} through strategic implementation</li>
        <li>Improved ${keywords[2] || 'efficiency'} in daily operations</li>
        <li>Better decision-making capabilities</li>
        <li>Competitive advantage in the market</li>
        <li>Long-term sustainable growth</li>
      </ul>`,
      
      `<h2>Essential Strategies for ${topic}</h2>`,
      `<p>Implementing effective ${topic.toLowerCase()} strategies requires a systematic approach. Here are the most important considerations:</p>`,
      `<h3>1. Planning and Research</h3>`,
      `<p>Before diving into ${keywords[0] || topic.toLowerCase()}, conduct thorough research to understand your specific needs and objectives. This foundation will guide your entire approach.</p>`,
      
      `<h3>2. Implementation Best Practices</h3>`,
      `<p>When implementing ${topic.toLowerCase()} solutions, focus on ${keywords[1] || 'quality'} over quantity. Start with small, manageable steps and gradually scale your efforts.</p>`,
      
      `<h3>3. Monitoring and Optimization</h3>`,
      `<p>Continuous monitoring is essential for ${keywords[2] || 'success'}. Regular evaluation helps identify areas for improvement and ensures optimal performance.</p>`,
      
      `<h2>Common Challenges and Solutions</h2>`,
      `<p>Every ${topic.toLowerCase()} journey comes with its challenges. Here are the most common obstacles and how to overcome them:</p>`,
      `<p><strong>Challenge 1: Resource Constraints</strong><br>Solution: Prioritize high-impact activities and leverage available tools effectively.</p>`,
      `<p><strong>Challenge 2: Technical Complexity</strong><br>Solution: Break down complex processes into manageable components and seek expert guidance when needed.</p>`,
      
      `<h2>Future Trends in ${topic}</h2>`,
      `<p>The ${category.toLowerCase()} industry continues to evolve, and ${topic.toLowerCase()} is no exception. Stay ahead by understanding these emerging trends:</p>`,
      `<ul>
        <li>Integration of AI and automation</li>
        <li>Enhanced focus on sustainability</li>
        <li>Improved user experience design</li>
        <li>Data-driven decision making</li>
      </ul>`,
      
      `<h2>Conclusion</h2>`,
      `<p>Mastering ${topic.toLowerCase()} is essential for success in today's ${category.toLowerCase()} environment. By implementing the strategies outlined in this guide and focusing on ${keywords.slice(0, 2).join(' and ')}, you'll be well-positioned to achieve your goals and drive meaningful results.</p>`,
      `<p>Remember, ${topic.toLowerCase()} is an ongoing journey that requires continuous learning and adaptation. Stay curious, embrace new challenges, and always strive for excellence in your approach.</p>`
    ];
    
    return sections.join('\n\n');
  };

  const copyToClipboard = async () => {
    if (generatedBlog) {
      await navigator.clipboard.writeText(generatedBlog.content);
      toast.success('Blog content copied to clipboard!');
    }
  };

  const downloadAsHTML = () => {
    if (generatedBlog) {
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${generatedBlog.title}</title>
    <meta name="description" content="${generatedBlog.metaDescription}">
    <meta name="keywords" content="${generatedBlog.keywords.join(', ')}">
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
        p { line-height: 1.6; }
        ul { padding-left: 20px; }
    </style>
</head>
<body>
    <h1>${generatedBlog.title}</h1>
    <p><em>By ${generatedBlog.author} • ${generatedBlog.readTime}</em></p>
    ${generatedBlog.content}
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedBlog.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Blog downloaded as HTML file!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>AI Blog Generator</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {!generatedBlog ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="topic">Blog Topic *</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="e.g., Digital Marketing Strategies"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author Name *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tone">Writing Tone</Label>
                  <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map(tone => (
                        <SelectItem key={tone.value} value={tone.value}>{tone.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="wordCount">Word Count</Label>
                  <Select value={formData.wordCount} onValueChange={(value) => setFormData(prev => ({ ...prev, wordCount: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="800">800 words</SelectItem>
                      <SelectItem value="1200">1200 words</SelectItem>
                      <SelectItem value="1500">1500 words</SelectItem>
                      <SelectItem value="2000">2000 words</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="keywords">Target Keywords (comma separated)</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="SEO keywords, trending topics, main focus areas"
                />
              </div>

              <Button 
                onClick={generateSEOBlog} 
                disabled={isGenerating}
                className="w-full"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating SEO Blog...' : 'Generate AI Blog Post'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Generated Blog Post</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadAsHTML}>
                    <Download className="h-4 w-4 mr-2" />
                    Download HTML
                  </Button>
                  <Button size="sm" onClick={() => onSave(generatedBlog)}>
                    Save to Blog
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">SEO Details:</h4>
                <p><strong>Title:</strong> {generatedBlog.title}</p>
                <p><strong>Meta Description:</strong> {generatedBlog.metaDescription}</p>
                <p><strong>Keywords:</strong> {generatedBlog.keywords.join(', ')}</p>
                <p><strong>Word Count:</strong> ~{formData.wordCount} words</p>
              </div>

              <div className="prose prose-lg max-w-none border rounded-lg p-6 max-h-96 overflow-y-auto">
                <h1>{generatedBlog.title}</h1>
                <p className="text-gray-600">By {generatedBlog.author} • {generatedBlog.readTime}</p>
                <div dangerouslySetInnerHTML={{ __html: generatedBlog.content }} />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setGeneratedBlog(null)}>
                  Generate New
                </Button>
                <Button onClick={() => {
                  onSave(generatedBlog);
                  onClose();
                }}>
                  Save & Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIBlogGenerator;
