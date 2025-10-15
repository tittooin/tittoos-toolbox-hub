import { useState, useEffect, Fragment } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogSubmissionForm from "@/components/BlogSubmissionForm";
import AIBlogGenerator from "@/components/AIBlogGenerator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Plus, Wand2 } from "lucide-react";
import { toast } from 'sonner';
import AdSense from "@/components/AdSense";
import { setSEO, injectJsonLd } from "@/utils/seoUtils";

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [userBlogs, setUserBlogs] = useState<any[]>([]);

  const defaultBlogPosts = [
    {
      id: 1,
      title: "10 Essential Online Tools for Digital Productivity in 2024",
      excerpt: "Discover the most useful online tools that can boost your productivity and streamline your digital workflow in the modern era.",
      date: "2024-01-15",
      readTime: "8 min read",
      author: "TittoosTools Team",
      content: `
        <p>In today's fast-paced digital world, having the right tools at your fingertips can make the difference between struggling with daily tasks and completing them efficiently. Whether you're a professional, student, or entrepreneur, these essential online tools will revolutionize how you work and manage your digital life.</p>

        <h2>1. Password Managers: Your Digital Security Foundation</h2>
        <p>Password security remains one of the most critical aspects of digital safety. With cyber threats evolving constantly, using weak or repeated passwords is no longer an option. Modern password managers not only generate complex, unique passwords for each account but also store them securely and auto-fill login forms across devices.</p>
        
        <p>The benefits extend beyond security. A good password manager saves countless hours by eliminating the need to remember or reset passwords. Many also include features like secure note storage, two-factor authentication backup, and breach monitoring.</p>

        <h2>2. File Conversion Tools: Breaking Format Barriers</h2>
        <p>Gone are the days when incompatible file formats could halt your workflow. Modern online converters handle everything from documents and images to videos and audio files. These tools are particularly valuable for:</p>
        
        <ul>
        <li>Converting presentations for different platforms</li>
        <li>Optimizing images for web use</li>
        <li>Converting videos for social media</li>
        <li>Extracting audio from video files</li>
        </ul>

        <h2>3. Code Formatters and Validators</h2>
        <p>For developers and anyone working with structured data, code formatters are indispensable. JSON, XML, HTML, and CSS formatters not only make code readable but also help identify syntax errors before they cause problems in production environments.</p>

        <h2>4. QR Code Generators: Bridging Physical and Digital</h2>
        <p>QR codes have experienced a renaissance, especially post-pandemic. They're now essential for restaurant menus, event management, contact sharing, and marketing campaigns. Modern QR generators offer customization options, analytics, and dynamic content updates.</p>

        <h2>5. Text Analysis Tools: Understanding Your Content</h2>
        <p>Whether you're writing blog posts, academic papers, or marketing copy, text analysis tools provide insights into readability, keyword density, and overall quality. These tools help ensure your content resonates with your intended audience.</p>

        <h2>6. Image Optimization and Analysis</h2>
        <p>Visual content dominates digital communication. Image optimization tools reduce file sizes without sacrificing quality, while analysis tools extract metadata and provide technical details essential for web development and digital asset management.</p>

        <h2>7. Calculators Beyond Basic Math</h2>
        <p>Specialized calculators for loans, BMI, percentages, and unit conversions eliminate guesswork from important decisions. These tools are particularly valuable for financial planning, health monitoring, and international business.</p>

        <h2>8. Color Tools for Design Excellence</h2>
        <p>Color picking and palette generation tools are essential for maintaining brand consistency and creating visually appealing designs. They help both professionals and amateurs make informed color choices.</p>

        <h2>9. AI-Powered Content Creation</h2>
        <p>Artificial intelligence has democratized content creation. AI tools can generate images, videos, and text, making high-quality content accessible to everyone regardless of technical skill level.</p>

        <h2>10. Social Media Content Downloaders</h2>
        <p>These tools help preserve valuable content for offline viewing, backup purposes, or content curation. They're essential for digital marketers, researchers, and content creators who need to work with social media content.</p>

        <h2>Conclusion</h2>
        <p>The key to digital productivity lies not in using more tools, but in using the right tools effectively. Each tool mentioned here addresses specific pain points common in digital workflows. By integrating these tools into your routine, you'll save time, reduce errors, and focus on what truly matters: creating value and achieving your goals.</p>

        <p>Remember, the best tool is the one you actually use. Start with one or two tools that address your most pressing needs, master them, and gradually expand your toolkit as required.</p>
      `
    },
    {
      id: 2,
      title: "Password Security Best Practices: A Complete Guide for 2024",
      excerpt: "Learn how to create and manage strong passwords to keep your accounts secure in an increasingly dangerous digital landscape.",
      date: "2024-01-10",
      readTime: "12 min read",
      author: "Security Expert",
      content: `
        <p>Password security isn't just about IT departments anymore—it's everyone's responsibility. With data breaches affecting millions of users annually and cybercriminals becoming increasingly sophisticated, understanding password security has never been more critical.</p>

        <h2>The Current State of Password Security</h2>
        <p>Despite decades of security awareness campaigns, password-related breaches continue to dominate cybersecurity headlines. The problem isn't just weak passwords—it's the human tendency to reuse passwords across multiple accounts, creating a domino effect when one service is compromised.</p>

        <p>Recent studies show that the average person has over 100 online accounts but uses fewer than 20 unique passwords. This mathematical impossibility leads to dangerous shortcuts that cybercriminals exploit.</p>

        <h2>Understanding Password Strength</h2>
        <p>Password strength isn't just about complexity—it's about unpredictability. A truly strong password combines several elements:</p>

        <h3>Length Matters Most</h3>
        <p>Contrary to popular belief, length trumps complexity. A 12-character password with mixed case letters is stronger than an 8-character password with numbers and symbols. This is because password cracking is mathematical—each additional character exponentially increases the time needed to crack it.</p>

        <h3>Unpredictability is Key</h3>
        <p>Avoid common substitutions like "@" for "a" or "3" for "e". Password crackers are programmed to recognize these patterns. Instead, use truly random combinations or passphrase methods.</p>

        <h2>The Passphrase Method</h2>
        <p>Passphrases represent a paradigm shift in password creation. Instead of trying to remember "P@ssw0rd123!", you can use "coffee-sunset-bicycle-47" which is both stronger and more memorable. The key is combining unrelated words with random numbers or symbols.</p>

        <h3>Creating Effective Passphrases</h3>
        <ul>
        <li>Use 4-6 unrelated words</li>
        <li>Add random numbers or symbols</li>
        <li>Ensure total length exceeds 15 characters</li>
        <li>Avoid common phrases or quotes</li>
        </ul>

        <h2>Password Managers: Your Security Command Center</h2>
        <p>Password managers solve the fundamental problem of human memory limitations. They generate, store, and automatically fill unique passwords for every account, making strong password practices effortless.</p>

        <h3>Choosing the Right Password Manager</h3>
        <p>When selecting a password manager, consider:</p>
        <ul>
        <li>Cross-platform compatibility</li>
        <li>Strong encryption standards (AES-256)</li>
        <li>Zero-knowledge architecture</li>
        <li>Two-factor authentication support</li>
        <li>Regular security audits</li>
        <li>Emergency access features</li>
        </ul>

        <h2>Two-Factor Authentication: The Second Line of Defense</h2>
        <p>Even the strongest password can be compromised. Two-factor authentication (2FA) adds a crucial second layer of security. When enabled, accessing your account requires both your password and a second factor—typically a code from your phone.</p>

        <h3>Types of Two-Factor Authentication</h3>
        <p><strong>SMS-based:</strong> Convenient but vulnerable to SIM swapping attacks.</p>
        <p><strong>App-based:</strong> More secure, using apps like Google Authenticator or Authy.</p>
        <p><strong>Hardware keys:</strong> The most secure option, using physical devices like YubiKey.</p>

        <h2>Regular Security Hygiene</h2>
        <p>Password security is an ongoing process, not a one-time setup. Regular maintenance includes:</p>

        <h3>Monthly Tasks</h3>
        <ul>
        <li>Review and update passwords for critical accounts</li>
        <li>Check for data breach notifications</li>
        <li>Audit active sessions across platforms</li>
        </ul>

        <h3>Quarterly Tasks</h3>
        <ul>
        <li>Update recovery information</li>
        <li>Review account permissions and connections</li>
        <li>Test 2FA backup codes</li>
        </ul>

        <h2>Recognizing and Responding to Threats</h2>
        <p>Understanding common attack vectors helps you recognize threats:</p>

        <h3>Phishing Attacks</h3>
        <p>Always verify the URL before entering credentials. Legitimate sites use HTTPS and display security indicators in your browser.</p>

        <h3>Credential Stuffing</h3>
        <p>Attackers use leaked credentials from one breach to access other accounts. This is why unique passwords for every account are crucial.</p>

        <h2>Business Password Policies</h2>
        <p>Organizations need comprehensive password policies that balance security with usability:</p>
        <ul>
        <li>Minimum length requirements (12+ characters)</li>
        <li>Mandatory password manager adoption</li>
        <li>Regular security training</li>
        <li>Incident response procedures</li>
        </ul>

        <h2>The Future of Authentication</h2>
        <p>Passwordless authentication is gaining traction, using biometrics, hardware keys, or magic links instead of traditional passwords. While promising, passwords will remain relevant for years to come, making current security practices essential.</p>

        <h2>Conclusion</h2>
        <p>Password security doesn't have to be complicated or burdensome. By adopting a password manager, enabling two-factor authentication, and following basic security hygiene, you can dramatically improve your digital security posture. The goal isn't perfection—it's making yourself a harder target than the majority of users who still use "password123" for everything.</p>

        <p>Remember: cybersecurity is a journey, not a destination. Stay informed about emerging threats, update your practices regularly, and never hesitate to prioritize security over convenience. Your future self will thank you.</p>
      `
    },
    {
      id: 3,
      title: "File Conversion Mastery: The Complete Guide to Digital Format Management",
      excerpt: "Everything you need to know about converting files between different formats for various use cases, from basic conversions to advanced optimization techniques.",
      date: "2024-01-05",
      readTime: "10 min read",
      author: "Digital Workflow Specialist",
      content: `
        <p>In our interconnected digital world, file compatibility issues can be workflow killers. Whether you're a content creator, business professional, or casual user, understanding file conversion is essential for seamless collaboration and efficient work processes.</p>

        <h2>Understanding File Formats: The Foundation</h2>
        <p>Every digital file is essentially data organized according to specific rules—that's what we call a format. These formats determine how software interprets and displays information. Understanding the purpose and characteristics of different formats is crucial for making informed conversion decisions.</p>

        <h3>Container vs. Codec</h3>
        <p>This distinction is particularly important for multimedia files. A container (like MP4 or AVI) is like a box that holds various streams of data, while codecs (like H.264 or AAC) determine how that data is compressed and decompressed. Understanding this relationship helps explain why some files play on certain devices but not others.</p>

        <h2>Document Conversion: Beyond Simple Format Changes</h2>
        <p>Document conversion involves more than changing file extensions. Each format has unique capabilities and limitations that affect the final output.</p>

        <h3>PDF: The Universal Document Format</h3>
        <p>PDF's strength lies in its ability to preserve formatting across different systems. When converting to PDF, consider:</p>
        <ul>
        <li>Image compression settings for file size optimization</li>
        <li>Font embedding to ensure consistency</li>
        <li>Security settings for sensitive documents</li>
        <li>Accessibility features for screen readers</li>
        </ul>

        <h3>Word Processing Formats</h3>
        <p>Converting between Word, Google Docs, and other text formats often involves compatibility trade-offs. Advanced formatting, comments, and track changes may not translate perfectly between platforms.</p>

        <h2>Image Conversion: Balancing Quality and Efficiency</h2>
        <p>Image conversion is perhaps the most complex area due to the variety of use cases and quality requirements.</p>

        <h3>Lossy vs. Lossless Compression</h3>
        <p>Understanding this fundamental distinction helps make appropriate format choices:</p>
        <p><strong>Lossy formats (JPEG, WebP):</strong> Ideal for photographs and complex images where perfect quality isn't critical. They achieve smaller file sizes by discarding some visual information.</p>
        <p><strong>Lossless formats (PNG, TIFF):</strong> Essential for images with text, logos, or when you need perfect quality preservation. They maintain all original image data.</p>

        <h3>Modern Web Formats</h3>
        <p>WebP and AVIF offer superior compression compared to traditional formats while maintaining quality. However, browser support varies, making format selection strategy crucial for web applications.</p>

        <h2>Video Conversion: Navigating Complexity</h2>
        <p>Video conversion involves multiple variables that significantly impact output quality and file size.</p>

        <h3>Resolution and Aspect Ratio</h3>
        <p>Converting between different resolutions requires careful consideration of scaling algorithms and aspect ratio preservation. Upscaling generally produces poor results, while downscaling can maintain quality if done properly.</p>

        <h3>Bitrate and Quality Settings</h3>
        <p>Bitrate directly impacts both quality and file size. Understanding variable vs. constant bitrate encoding helps optimize for specific use cases:</p>
        <ul>
        <li>Streaming: Lower, consistent bitrates</li>
        <li>Archive: Higher bitrates for quality preservation</li>
        <li>Social media: Platform-specific optimization</li>
        </ul>

        <h3>Audio Considerations</h3>
        <p>Don't overlook audio quality in video conversions. Sample rates, bit depths, and codec selection affect the final viewing experience significantly.</p>

        <h2>Audio Conversion: Fidelity vs. Efficiency</h2>
        <p>Audio conversion serves different purposes, from creating smaller files for mobile devices to preparing high-quality masters for production.</p>

        <h3>Sample Rate and Bit Depth</h3>
        <p>These technical specifications determine audio quality limits. Converting from lower to higher specifications doesn't improve quality, while the reverse reduces it. Understanding source material limitations helps set realistic expectations.</p>

        <h3>Codec Selection Strategy</h3>
        <p>Different audio codecs serve different purposes:</p>
        <ul>
        <li>MP3: Universal compatibility, moderate compression</li>
        <li>AAC: Better quality than MP3 at similar sizes</li>
        <li>FLAC: Lossless compression for archival</li>
        <li>OGG: Open-source alternative with good compression</li>
        </ul>

        <h2>Batch Processing: Scaling Your Workflow</h2>
        <p>For professionals dealing with multiple files, batch processing becomes essential. This involves converting many files simultaneously while maintaining consistent settings and quality standards.</p>

        <h3>Automation Strategies</h3>
        <p>Effective batch processing requires:</p>
        <ul>
        <li>Consistent naming conventions</li>
        <li>Quality control checkpoints</li>
        <li>Error handling procedures</li>
        <li>Output organization systems</li>
        </ul>

        <h2>Platform-Specific Considerations</h2>
        <p>Different platforms have unique requirements that affect conversion strategies.</p>

        <h3>Social Media Optimization</h3>
        <p>Each platform has specific technical requirements and algorithmic preferences. Instagram favors certain aspect ratios, while YouTube has specific encoding recommendations for optimal quality.</p>

        <h3>Mobile Device Compatibility</h3>
        <p>Mobile devices have processing and storage limitations that influence format choices. Balancing quality with performance is crucial for mobile-first content.</p>

        <h2>Quality Control and Validation</h2>
        <p>Conversion quality control goes beyond visual inspection. Technical validation ensures files meet specifications and perform correctly across different systems.</p>

        <h3>Testing Protocols</h3>
        <p>Establish systematic testing procedures:</p>
        <ul>
        <li>Technical specification verification</li>
        <li>Cross-platform compatibility testing</li>
        <li>Quality assessment at different viewing conditions</li>
        <li>Performance benchmarking</li>
        </ul>

        <h2>Common Conversion Pitfalls</h2>
        <p>Understanding common mistakes helps avoid quality loss and workflow disruptions:</p>
        <ul>
        <li>Multiple lossy conversions causing quality degradation</li>
        <li>Inappropriate format selection for use case</li>
        <li>Ignoring metadata preservation</li>
        <li>Overlooking accessibility considerations</li>
        </ul>

        <h2>Future-Proofing Your Conversion Strategy</h2>
        <p>Technology evolves rapidly, making future-proofing considerations important for long-term workflows.</p>

        <h3>Emerging Formats</h3>
        <p>Stay informed about new formats like AV1 for video and HEIF for images. Early adoption requires balancing cutting-edge benefits with compatibility requirements.</p>

        <h3>Archive Strategies</h3>
        <p>For important content, maintain high-quality masters in stable, widely-supported formats alongside optimized versions for current use.</p>

        <h2>Conclusion</h2>
        <p>File conversion mastery comes from understanding both technical specifications and practical applications. The key is matching conversion choices to specific use cases while maintaining quality standards appropriate for your needs.</p>

        <p>Remember that conversion is often a balancing act between quality, file size, compatibility, and processing time. The "best" conversion is the one that meets your specific requirements while remaining practical for your workflow.</p>

        <p>As technology continues evolving, staying informed about format developments and conversion best practices will ensure your digital content remains accessible and useful across different platforms and devices.</p>
      `
    }
  ];

  const allBlogPosts = [...userBlogs, ...defaultBlogPosts];

  const handleSaveBlog = (blog: any) => {
    setUserBlogs(prev => [blog, ...prev]);
    toast.success('Blog post saved successfully!');
  };

  const selectedPostData = selectedPost ? allBlogPosts.find(post => post.id === selectedPost) : null;

  // Apply SEO dynamically for list vs article views
  useEffect(() => {
    if (selectedPostData) {
      const title = `${selectedPostData.title} | TittoosTools Blog`;
      setSEO({
        title,
        description: selectedPostData.excerpt,
        keywords: [
          'blog','productivity','online tools','guides','tutorials','digital workflow','seo tips','formatters','converters'
        ],
        type: 'article',
        image: `${window.location.origin}/placeholder.svg`,
        canonicalUrl: `${window.location.origin}/blog`,
      });

      // Inject BlogPosting JSON-LD for the article
      injectJsonLd({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': selectedPostData.title,
        'articleBody': selectedPostData.excerpt,
        'author': {
          '@type': 'Person',
          'name': selectedPostData.author || 'TittoosTools Team'
        },
        'datePublished': selectedPostData.date,
        'publisher': {
          '@type': 'Organization',
          'name': 'TittoosTools',
          'logo': {
            '@type': 'ImageObject',
            'url': `${window.location.origin}/favicon.ico`
          }
        },
        'mainEntityOfPage': `${window.location.origin}/blog`
      });
    } else {
      setSEO({
        title: 'TittoosTools Blog - Tips, Tutorials, and Guides',
        description: 'Read practical tutorials and guides on using online tools effectively: SEO tips, formatters, converters, and productivity workflows.',
        keywords: [
          'blog','online tools','seo','tutorials','guides','productivity','formatters','converters'
        ],
        type: 'website',
        image: `${window.location.origin}/placeholder.svg`,
        canonicalUrl: `${window.location.origin}/blog`,
      });
    }
  }, [selectedPostData]);

  if (selectedPostData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Button 
              onClick={() => setSelectedPost(null)}
              variant="ghost"
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>

            <article className="bg-white rounded-lg shadow-lg p-8">
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {selectedPostData.title}
                </h1>
                
                <div className="flex items-center space-x-6 text-gray-600 text-sm">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {selectedPostData.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(selectedPostData.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {selectedPostData.readTime}
                  </div>
                  {selectedPostData.isAIGenerated && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      AI Generated
                    </span>
                  )}
                </div>
              </header>

              {/* In-article ad for better in-content visibility */}
              <AdSense
                adSlot="1234567890"
                adType="in_article"
                className="my-6 max-w-2xl mx-auto"
              />

              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPostData.content }}
              />

              {/* Multiplex ad at the end of the article */}
              <AdSense
                adSlot="1234567890"
                adType="multiplex"
                className="mt-8"
              />
            </article>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              TittoosTools Blog
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Tips, tutorials, and insights to help you make the most of our tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setShowSubmissionForm(true)} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Submit Your Blog
              </Button>
              <Button onClick={() => setShowAIGenerator(true)} variant="outline" className="flex items-center">
                <Wand2 className="h-4 w-4 mr-2" />
                AI Blog Generator
              </Button>
            </div>
          </div>

          {/* Top banner ad for list view */}
          <AdSense
            adSlot="1234567890"
            adType="display"
            className="mb-8 max-w-3xl mx-auto"
          />

          <div className="space-y-8">
            {allBlogPosts.map((post, index) => (
              <Fragment key={post.id}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle 
                          className="text-2xl hover:text-blue-600 transition-colors cursor-pointer"
                          onClick={() => setSelectedPost(post.id)}
                        >
                          {post.title}
                        </CardTitle>
                        {post.isAIGenerated && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                            AI Generated
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-base mb-4">
                        {post.excerpt}
                      </CardDescription>
                      <Button 
                        onClick={() => setSelectedPost(post.id)}
                        variant="outline"
                      >
                        Read More
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
              {/* Insert an in-feed ad after a couple of posts for better scroll placement */}
              {index === 1 && (
                <AdSense
                  adSlot="1234567890"
                  adType="in_feed"
                  layoutKey={undefined}
                  className="my-6 max-w-3xl mx-auto"
                />
              )}
              </Fragment>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              Share your expertise with our community! Submit your blog or generate one with AI.
            </p>
          </div>

          {/* Multiplex ad at end of list */}
          <AdSense
            adSlot="1234567890"
            adType="multiplex"
            className="mt-8"
          />
        </div>
      </div>

      <Footer />

      {showSubmissionForm && (
        <BlogSubmissionForm
          onClose={() => setShowSubmissionForm(false)}
          onSave={handleSaveBlog}
        />
      )}

      {showAIGenerator && (
        <AIBlogGenerator
          onClose={() => setShowAIGenerator(false)}
          onSave={handleSaveBlog}
        />
      )}
    </div>
  );
};

export default Blog;
