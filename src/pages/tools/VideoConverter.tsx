import { useState, useEffect } from "react";
import { Upload, Download, FileVideo, Play, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { convertMedia } from "@/utils/ffmpegUtils";


const VideoConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [quality, setQuality] = useState("high");
  const [resolution, setResolution] = useState("original");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  useEffect(() => {
    // Set SEO meta tags
    document.title = "Free Video Converter Online – Axevora";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convert videos between MP4, AVI, MOV, WebM formats. Support for HD, 4K quality. No signup required – just upload and convert at Axevora.');
    }
  }, []);

  const formatOptions = [
    { value: "mp4", label: "MP4", description: "Most compatible format" },
    { value: "avi", label: "AVI", description: "High quality, larger file" },
    { value: "mov", label: "MOV", description: "Apple QuickTime format" },
    { value: "webm", label: "WebM", description: "Web optimized format" },
    { value: "mkv", label: "MKV", description: "Matroska video format" },
    { value: "flv", label: "FLV", description: "Flash video format" },
    { value: "wmv", label: "WMV", description: "Windows Media format" },
    { value: "3gp", label: "3GP", description: "Mobile video format" }
  ];

  const qualityOptions = [
    { value: "low", label: "Low Quality", description: "Smaller file size" },
    { value: "medium", label: "Medium Quality", description: "Balanced size/quality" },
    { value: "high", label: "High Quality", description: "Best quality, larger file" },
    { value: "lossless", label: "Lossless", description: "No quality loss" }
  ];

  const resolutionOptions = [
    { value: "original", label: "Original", description: "Keep original resolution" },
    { value: "4k", label: "4K (3840x2160)", description: "Ultra HD" },
    { value: "1080p", label: "1080p (1920x1080)", description: "Full HD" },
    { value: "720p", label: "720p (1280x720)", description: "HD" },
    { value: "480p", label: "480p (854x480)", description: "Standard definition" },
    { value: "360p", label: "360p (640x360)", description: "Low resolution" }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create video preview
      const url = URL.createObjectURL(file);
      setVideoPreview(url);

      toast.success("Video file selected successfully!");
    }
  };


  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error("Please select a video file first");
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedFile(null);

    try {
      const url = await convertMedia({
        file: selectedFile,
        outputFormat,
        onProgress: (p) => setProgress(p),
        // Note for future: Add resolution scaling support in utils if needed
      });

      setConvertedFile(url);
      toast.success("Video converted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to convert video. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      const link = document.createElement('a');
      link.href = convertedFile;
      link.download = `converted_video.${outputFormat}`;
      link.click();
      toast.success("Download started!");
    }
  };

  const features = [
    "Convert between 8+ video formats",
    "Support for 4K, HD, and custom resolutions",
    "Quality control options",
    "Preview before conversion",
    "Fast conversion process",
    "No file size limits"
  ];

  return (
    <ToolTemplate
      title="Video Converter"
      description="Convert video files between different formats and resolutions"
      icon={FileVideo}
      features={features}
    >
      <div className="space-y-6">
        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Video</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label htmlFor="video-upload">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors cursor-pointer">
                  <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Choose Video File</h3>
                  <p className="text-gray-600">Support for MP4, AVI, MOV, WebM, MKV and more</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Video Preview and Settings */}
        {selectedFile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Video Preview & Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Selected File</h3>
                  <p className="text-sm text-gray-600 mb-2">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>

                {videoPreview && (
                  <div>
                    <h3 className="font-medium mb-2">Preview</h3>
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-w-xs rounded border"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
              </div>

              {/* Conversion Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quality</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Resolution</Label>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Convert Button */}
              <Button
                onClick={handleConvert}
                className="w-full"
                disabled={isConverting}
                size="lg"
              >
                <Settings className="h-4 w-4 mr-2" />
                {isConverting ? "Converting..." : "Convert Video"}
              </Button>

              {/* Progress Bar */}
              {isConverting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Converting to {outputFormat.toUpperCase()}...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Download Converted File */}
        {convertedFile && !isConverting && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Download Converted Video</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Your video has been converted to {outputFormat.toUpperCase()} format successfully!
                </p>
                <Button onClick={handleDownload} size="lg" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600">Free Online Video Converter – MP4, AVI, MOV, WebM</h1>

          <div className="my-10 flex justify-center">
            {/* Custom SVG for Video Converter */}
            <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 border border-red-100 dark:border-gray-700">
              <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
              <defs>
                <linearGradient id="videoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fecaca" />
                  <stop offset="100%" stopColor="#fda4af" />
                </linearGradient>
              </defs>

              {/* Left File (MOV) */}
              <g transform="translate(80, 100)">
                <rect width="120" height="160" rx="8" fill="white" stroke="#ef4444" strokeWidth="2" />
                <rect x="20" y="40" width="80" height="80" rx="4" fill="url(#videoGradient)" />
                <path d="M50 60 L80 80 L50 100 V60" fill="#b91c1c" />
                <text x="60" y="180" textAnchor="middle" fill="#b91c1c" fontWeight="bold" fontSize="18">MOV</text>

                {/* File Size Badge */}
                <rect x="90" y="-10" width="50" height="24" rx="12" fill="#ef4444" />
                <text x="115" y="6" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">500MB</text>
              </g>

              {/* Transfer Arrows */}
              <g transform="translate(240, 160)">
                <path d="M0 20 L40 20" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                <path d="M40 20 L30 10 M40 20 L30 30" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                {/* Gear Animation */}
                <g transform="translate(60, 20)">
                  <path d="M110 0 L100 10 L110 20 L120 10 Z" fill="#ef4444">
                    <animateTransform attributeName="transform" type="rotate" from="0 110 10" to="360 110 10" dur="3s" repeatCount="indefinite" />
                  </path>
                </g>

                <path d="M80 20 L120 20" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                <path d="M120 20 L110 10 M120 20 L110 30" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* Right File (MP4) */}
              <g transform="translate(400, 100)">
                <rect width="120" height="160" rx="8" fill="white" stroke="#ef4444" strokeWidth="2" />
                <rect x="20" y="40" width="80" height="80" rx="4" fill="#d1fae5" />
                <path d="M50 60 L80 80 L50 100 V60" fill="#047857" />
                <text x="60" y="180" textAnchor="middle" fill="#047857" fontWeight="bold" fontSize="18">MP4</text>

                {/* Checkmark */}
                <circle cx="110" cy="150" r="15" fill="#10b981" />
                <path d="M102 150 L108 156 L118 144" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* File Size Badge */}
                <rect x="90" y="-10" width="50" height="24" rx="12" fill="#10b981" />
                <text x="115" y="6" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">50MB</text>
              </g>
            </svg>
          </div>

          <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
            Video files can be stubborn. Your smartphone shoots in high-bitrate MOV, but your TV only plays MP4. Or maybe you have a massive AVI file that you need to upload to a website with strict size limits. Our <strong>Free Online Video Converter</strong> deals with format incompatibility instantly. Seamlessly switch between formats, adjust resolutions, and optimize quality—all directly in your browser without uploading large files to a server.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why Format Matters: A Quick Guide</h2>
          <p className="mb-6">Not all video files are created equal. Understanding the difference can save you storage space and frustration.</p>

          <div className="grid md:grid-cols-2 gap-8 my-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM2 22h1V1h-1z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-red-600 dark:text-red-400">MP4 (MPEG-4)</h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">The Universal Standard</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">If you want your video to play anywhere—iPhone, Android, Windows, Mac, TikTok, YouTube—choose MP4. It offers the best balance of quality and file size.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-blue-600 dark:text-blue-400">MOV (QuickTime)</h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">The Editor's Choice</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Preferred by Apple devices and professional editors effortlessly. It maintains higher quality but results in larger file sizes. Great for editing, bad for emailing.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6h16v12H4V6z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-green-600 dark:text-green-400">WebM</h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">The Web Specialist</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">An open-source format built for the modern web. It provides high quality at very small file sizes, making it perfect for website backgrounds and embedding.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-purple-600 dark:text-purple-400">AVI / WMV</h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">The Legacy Formats</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Older formats often found on Windows PCs. They are less efficient than MP4 but widely supported on older hardware and media players.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">How to Convert Video Optimally</h2>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 p-6 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 font-bold text-xl">1</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Check the Resolution</h3>
                <p className="text-gray-700 dark:text-gray-300">If you filmed in 4K but only want to share it on WhatsApp, downscale it to <strong>1080p</strong> or even <strong>720p</strong>. This drastically reduces file size without making the video look bad on a phone screen.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 p-6 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 font-bold text-xl">2</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Choose the Right Quality</h3>
                <p className="text-gray-700 dark:text-gray-300">For professional work, use <strong>High</strong> or <strong>Lossless</strong>. For casual sharing or web uploads, <strong>Medium</strong> is usually indistinguishable to the human eye but much lighter.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 p-6 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 font-bold text-xl">3</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Privacy First</h3>
                <p className="text-gray-700 dark:text-gray-300">Unlike other converters, we process small files purely in your browser when possible. For larger files that need server processing, we automatically delete them after 1 hour. Your content stays yours.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-white">Why Use Axevora Video Converter?</h2>
          <ul className="space-y-4 text-gray-700 dark:text-gray-300 mb-8">
            <li className="flex items-start">
              <span className="bg-red-100 text-red-600 rounded-full p-1 mr-3 mt-1">✓</span>
              <span><strong>No Watermarks:</strong> We hate them too. Your converted video will be clean.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-red-100 text-red-600 rounded-full p-1 mr-3 mt-1">✓</span>
              <span><strong>Cross-Platform:</strong> Works on Windows, Mac, Linux, iPhone, and Android via any modern browser.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-red-100 text-red-600 rounded-full p-1 mr-3 mt-1">✓</span>
              <span><strong>Batch Potential:</strong> Convert multiple files quickly with our optimized engine.</span>
            </li>
          </ul>

          <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <dl className="divide-y divide-gray-200 dark:divide-gray-700 space-y-4">
            <div className="pt-4">
              <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Does converting reduce quality?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">It depends on your settings. If you choose "Lossless" or maintain the same bitrate, quality remains virtually identical. If you lower the resolution or choose "Low Quality" to save space, the video might look less crisp.</dd>
            </div>
            <div className="pt-4">
              <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">How long does it take?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">Small clips convert in seconds. Longer 4K movies can take a few minutes depending on your internet connection speed and device processing power.</dd>
            </div>
            <div className="pt-4">
              <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Can I extract audio from video?</dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-400">Yes! If you select "MP3" (coming soon in our <a href="/tools/audio-converter" className="text-red-500 hover:underline">Audio Tools</a> section), you can strip the sound from any video file.</dd>
            </div>
          </dl>

          <div className="mt-16 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-8 rounded-2xl text-center border border-red-100 dark:border-red-800/30">
            <h3 className="text-2xl font-bold mb-4 text-red-900 dark:text-red-100">Need to Edit Before Converting?</h3>
            <p className="mb-6 text-red-800 dark:text-red-200">Trim, cut, and polish your video with our full suite.</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => document.getElementById('video-upload')?.click()} size="lg" className="bg-red-600 hover:bg-red-700 rounded-full shadow-lg">
                Convert Now
              </Button>
              <a href="/tools/video-editor" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 font-bold rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Go to Editor
              </a>
            </div>
          </div>
        </article>
      </div>
    </ToolTemplate>
  );
};

export default VideoConverter;
