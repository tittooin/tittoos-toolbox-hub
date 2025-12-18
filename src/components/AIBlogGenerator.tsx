
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
    // Helper to pick random element
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // Human-like data banks
    const hooks = [
      `<p>I still remember the first time I tried to wrap my head around ${topic.toLowerCase()}. It felt like staring at a wall of code without a compilation error—frustrating and a bit overwhelming. But after diving deep and making a fair share of mistakes, I realized it's not actually that complicated.</p>`,
      `<p>Let's be honest: most advice about ${topic.toLowerCase()} is boring. It's full of jargon and academic theory that doesn't help when you're actually sitting at your desk trying to get things done. So today, I want to skip the fluff and talk about what actually works.</p>`,
      `<p>You've probably heard a million times that ${topic.toLowerCase()} is "essential" or a "game-changer." I usually roll my eyes at that kind of talk. But in this case, there's actually some truth to it—if you approach it the right way.</p>`,
      `<p>Picture this: You're deadline-driven, your coffee is cold, and you need to figure out ${topic.toLowerCase()} yesterday. We've all been there. That's exactly why I wrote this guide—to be the resource I wish I had when I started.</p>`
    ];

    const definitions = [
      `<p>So, what are we actually talking about here? Simply put, ${topic} is about ${keywords[0] || 'solving problems'}. It's not magic, and it doesn't need to be over-engineered. Think of it as a tool in your belt that helps you ${keywords[1] || 'work smarter'}.</p>`,
      `<p>Forget the textbook definitions for a second. In the real world, ${topic} basically means finding a way to ${keywords[0] || 'improve efficiency'} without losing your mind. High-level pros use it to stay organized, but it's just as useful for beginners.</p>`
    ];

    const benefitTransitions = [
      `<p>Why should you care? Well, aside from making your boss happy, mastering this saves you time. And I don't know about you, but I'd rather spend my Friday afternoon finishing up early than debugging a messy workflow.</p>`,
      `<p>The real payout here isn't just "productivity"—it's sanity. When you nail ${topic.toLowerCase()}, you stop fighting fires and start actually building things. Here is what that looks like in practice:</p>`
    ];

    const strategyIntros = [
      `<p>Now, I'm not going to give you a laundry list of generic tips. Instead, here are three things I actually do in my own projects. These aren't theoretical; they are battle-tested.</p>`,
      `<p>If I had to start over from scratch today, this is exactly how I'd approach it. No fluff, just the steps that move the needle.</p>`
    ];

    const commonMistakes = [
      `<p>I learned this the hard way: trying to do everything at once usually leads to nothing getting done. When I started with ${topic}, I overcomplicated it. Don't make my mistake. Keep it simple.</p>`,
      `<p>A lot of people get stuck thinking they need perfect tools before they start. That's a trap. You don't need expensive software to get value out of ${topic.toLowerCase()}. You just need a process.</p>`
    ];

    const conclusions = [
      `<p>Look, ${topic} isn't something you master overnight. It takes a bit of practice. But trust me, once it clicks, you'll wonder how you ever managed without it.</p>`,
      `<p>So there you have it—my honest take on ${topic}. Give these strategies a shot, break a few things, and see what works for you. That's the only way to really learn.</p>`
    ];

    // Assemble the content
    const sections = [
      `<h2>Introduction</h2>`,
      pick(hooks),

      `<h2>What is ${topic}? (In Plain English)</h2>`,
      pick(definitions),

      `<h2>Why It Actually Matters</h2>`,
      pick(benefitTransitions),
      `<ul>
        <li><strong>Less Stress:</strong> ${keywords[1] || 'Efficiency'} isn't just a buzzword; it means going home on time.</li>
        <li><strong>Better Results:</strong> Focusing on ${keywords[0] || 'core tasks'} improves output naturally.</li>
        <li><strong>Sustainability:</strong> You can keep this pace up without burning out.</li>
      </ul>`,

      `<h2>My Field-Tested Strategies</h2>`,
      pick(strategyIntros),

      `<h3>1. Start Small</h3>`,
      `<p>Don't try to boil the ocean. When dealing with ${topic.toLowerCase()}, pick one small area to improve first. For me, that was focusing on ${keywords[0] || 'basics'}. It builds momentum effectively.</p>`,

      `<h3>2. Use What You Have</h3>`,
      `<p>You don't need a fancy setup. I still use basic free tools for 90% of my ${category.toLowerCase()} work. Use the tools you already know until you hit a hard limit.</p>`,

      `<h3>3. Iterate</h3>`,
      `<p>Your first attempt at ${topic.toLowerCase()} won't be perfect. Mine sure wasn't. The goal is to be slightly better than yesterday, not perfect immediately.</p>`,

      `<h2>Things I Wish I Knew Earlier (Common Mistakes)</h2>`,
      pick(commonMistakes),

      `<h2>Final Thoughts</h2>`,
      pick(conclusions),
      `<p>If you're stuck or just want to chat more about ${category.toLowerCase()}, feel free to reach out. We're all figuring this out together.</p>`
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
