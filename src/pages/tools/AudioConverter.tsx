import { useState } from "react";
import { Upload, Download, Music, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";
import { convertMedia } from "@/utils/ffmpegUtils";

const AudioConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputFormat, setOutputFormat] = useState("mp3");
  const [bitrate, setBitrate] = useState("192k");
  const [convertedFile, setConvertedFile] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setConvertedFile(null);
      setProgress(0);
      toast.success("Audio file selected successfully!");
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error("Please select an audio file first");
      return;
    }

    setIsConverting(true);
    setProgress(0);

    try {
      const url = await convertMedia({
        file: selectedFile,
        outputFormat,
        bitrate,
        onProgress: (p) => setProgress(p)
      });

      setConvertedFile(url);
      toast.success(`Converted to ${outputFormat.toUpperCase()} successfully!`);
    } catch (error) {
      console.error("Conversion failed:", error);
      toast.error("Conversion failed. Try a different browser or file.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedFile) {
      const link = document.createElement('a');
      link.href = convertedFile;
      link.download = `Audio_${Date.now()}.${outputFormat}`;
      link.click();
    }
  };

  const features = [
    "Convert between MP3, WAV, FLAC, AAC formats",
    "Adjust audio quality and bitrate",
    "Trim and edit audio files",
    "Batch conversion support",
    "Preserve metadata"
  ];

  return (
    <ToolTemplate
      title="Audio Converter"
      description="Convert audio files between MP3, WAV, FLAC, and other formats"
      icon={Music}
      features={features}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Audio File</h3>
              <p className="text-gray-600 mb-4">Select an audio file to convert</p>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
                id="audio-upload"
              />
              <label htmlFor="audio-upload">
                <Button asChild>
                  <span>Choose Audio File</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>


        {selectedFile && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Conversion Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Output Format</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                  >
                    <option value="mp3">MP3 (Universal)</option>
                    <option value="wav">WAV (High Quality)</option>
                    <option value="m4a">M4A (Apple/Mobile)</option>
                    <option value="aac">AAC (Streaming)</option>
                    <option value="flac">FLAC (Lossless)</option>
                    <option value="ogg">OGG (Web)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Quality (Bitrate)</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={bitrate}
                    onChange={(e) => setBitrate(e.target.value)}
                  >
                    <option value="320k">320kbps (Best)</option>
                    <option value="192k">192kbps (Good)</option>
                    <option value="128k">128kbps (Standard)</option>
                    <option value="64k">64kbps (Small Size)</option>
                  </select>
                </div>
              </div>

              {!isConverting && !convertedFile && (
                <Button onClick={handleConvert} className="w-full" disabled={isConverting}>
                  <Download className="h-4 w-4 mr-2" />
                  Convert to {outputFormat.toUpperCase()}
                </Button>
              )}

              {isConverting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Converting...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    First time load may take a few seconds...
                  </p>
                </div>
              )}

              {convertedFile && (
                <div className="text-center space-y-4 pt-4 border-t">
                  <div className="bg-green-50 text-green-700 p-3 rounded-md border border-green-200">
                    Conversion Complete!
                  </div>
                  <Button onClick={handleDownload} className="w-full gap-2" variant="default">
                    <Download className="h-4 w-4" />
                    Download {outputFormat.toUpperCase()} File
                  </Button>
                  <Button onClick={() => { setConvertedFile(null); setProgress(0); }} variant="outline" className="w-full">
                    Convert Another File
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>
        )}
      </div>

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12 mb-16 px-4 md:px-0">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Free Online Audio Converter – Convert MP3, WAV, FLAC & More</h1>

        <div className="my-10 flex justify-center">
          {/* Custom SVG Illustration for Audio Converter */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-3xl rounded-xl shadow-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border border-purple-100 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#e879f9" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Left Side: Input File */}
            <g transform="translate(80, 100)">
              <rect width="120" height="160" rx="8" fill="white" stroke="#a855f7" strokeWidth="2" />
              <rect x="20" y="20" width="80" height="80" rx="40" fill="#f3e8ff" />
              <path d="M60 40 L60 80 M50 70 L60 80 L70 70" stroke="#a855f7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <text x="60" y="140" textAnchor="middle" fill="#7e22ce" fontWeight="bold" fontSize="18">WAV</text>
              <text x="60" y="180" textAnchor="middle" fill="#a855f7" fontSize="12" fontWeight="bold">50MB</text>
            </g>

            {/* Middle: Conversion Process */}
            <g transform="translate(240, 150)">
              {/* Animated Sound Wave */}
              <rect x="10" y="30" width="8" height="40" rx="4" fill="url(#waveGradient)">
                <animate attributeName="height" values="40;80;40" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="y" values="30;10;30" dur="0.8s" repeatCount="indefinite" />
              </rect>
              <rect x="30" y="20" width="8" height="60" rx="4" fill="url(#waveGradient)">
                <animate attributeName="height" values="60;90;60" dur="0.6s" repeatCount="indefinite" />
                <animate attributeName="y" values="20;5;20" dur="0.6s" repeatCount="indefinite" />
              </rect>
              <rect x="50" y="40" width="8" height="20" rx="4" fill="url(#waveGradient)">
                <animate attributeName="height" values="20;70;20" dur="1s" repeatCount="indefinite" />
                <animate attributeName="y" values="40;15;40" dur="1s" repeatCount="indefinite" />
              </rect>
              <rect x="70" y="25" width="8" height="50" rx="4" fill="url(#waveGradient)">
                <animate attributeName="height" values="50;85;50" dur="0.7s" repeatCount="indefinite" />
                <animate attributeName="y" values="25;7.5;25" dur="0.7s" repeatCount="indefinite" />
              </rect>
              <rect x="90" y="35" width="8" height="30" rx="4" fill="url(#waveGradient)">
                <animate attributeName="height" values="30;60;30" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="y" values="35;20;35" dur="0.9s" repeatCount="indefinite" />
              </rect>

              {/* Progress Arrow */}
              <path d="M0 110 L110 110" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M100 105 L110 110 L100 115" stroke="#a855f7" strokeWidth="2" fill="none" />
            </g>

            {/* Right Side: Output File */}
            <g transform="translate(400, 100)">
              <rect width="120" height="160" rx="8" fill="white" stroke="#ec4899" strokeWidth="2" />
              <rect x="20" y="20" width="80" height="80" rx="40" fill="#fce7f3" />
              <path d="M50 45 L50 75 L75 60 Z" fill="#ec4899" />
              <text x="60" y="140" textAnchor="middle" fill="#be185d" fontWeight="bold" fontSize="18">MP3</text>
              <text x="60" y="180" textAnchor="middle" fill="#ec4899" fontSize="12" fontWeight="bold">5MB</text>

              {/* Sparkle */}
              <path d="M110 10 L115 0 L120 10 L130 15 L120 20 L115 30 L110 20 L100 15 Z" fill="#fbbf24">
                <animateTransform attributeName="transform" type="scale" values="1;1.3;1" dur="2s" repeatCount="indefinite" />
              </path>
            </g>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8 font-light leading-relaxed">
          Audio files come in all shapes and sizes, and finding the right one can be a headache. Whether you need to squish a massive WAV file down to an MP3 for your phone, or convert a voice note (M4A) to a professional format for editing, our <strong>Audio Converter</strong> handles it all smoothly in your browser. No software installation, no upload limits, just pure audio magic.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white flex items-center">
          <span className="bg-purple-100 text-purple-800 p-2 rounded-md mr-4 text-2xl">🎧</span>
          Why Audio Format Matters
        </h2>
        <p className="mb-6">
          You might think "sound is sound," but the file format determines the quality, size, and compatibility of your audio.
        </p>

        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 dark:bg-purple-900/20 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30"></div>
            <h3 className="text-2xl font-bold mb-3 text-purple-600 dark:text-purple-400">MP3 (MPEG-1 Layer 3)</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">The Universal Standard</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Compressed and "lossy," meaning it throws away some sound data to save space. It's supported by literally every device on the planet.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-50 dark:bg-pink-900/20 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-pink-100 dark:group-hover:bg-pink-900/30"></div>
            <h3 className="text-2xl font-bold mb-3 text-pink-600 dark:text-pink-400">WAV (Waveform)</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">The Professional Choice</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Uncompressed and "lossless." It's an exact copy of the original recording. Huge file sizes, but perfect for editing and archiving.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"></div>
            <h3 className="text-2xl font-bold mb-3 text-blue-600 dark:text-blue-400">FLAC</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">Lossless Compression</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">The audiophile's best friend. It compresses file size by ~50% without losing a single bit of quality. Best for archiving music collections.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-bl-full -mr-4 -mt-4 transition group-hover:bg-green-100 dark:group-hover:bg-green-900/30"></div>
            <h3 className="text-2xl font-bold mb-3 text-green-600 dark:text-green-400">AAC / M4A</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">The Modern Streamer</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Apple's preferred format and the standard for YouTube. It sounds better than MP3 at the same bitrate/file size.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Understanding Bitrate: The Quality Knob</h2>
        <p className="mb-6 text-lg">
          When you convert to MP3 or AAC, you'll see a setting called "Bitrate" measured in <strong>kbps</strong> (kilobits per second). Here is what you need to know:
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bitrate</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quality Level</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Best For...</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="py-4 px-6 font-mono text-sm text-purple-600">320 kbps</td>
                <td className="py-4 px-6 text-sm font-bold text-green-600">Excellent</td>
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">Music, Studio Recordings</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-mono text-sm text-purple-600">192 kbps</td>
                <td className="py-4 px-6 text-sm font-bold text-blue-600">Very Good</td>
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">Standard Streaming, Podcasts</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-mono text-sm text-purple-600">128 kbps</td>
                <td className="py-4 px-6 text-sm font-bold text-yellow-600">Good</td>
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">Voice Memos, Audiobooks</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-mono text-sm text-purple-600">64 kbps</td>
                <td className="py-4 px-6 text-sm font-bold text-red-600">Fair</td>
                <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400">Speech only, saving massive space</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Step-by-Step Guide: How to Convert Audio</h2>
        <div className="space-y-8 mt-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xl">1</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Upload Your File</h3>
              <p className="text-gray-600 dark:text-gray-400">Click "Choose Audio File" or drag and drop. We support nearly every format: MP3, WAV, AAC, WMA, OGG, M4A, and FLAC.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold text-xl">2</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Select Output Format</h3>
              <p className="text-gray-600 dark:text-gray-400">Choose your target format. If you aren't sure, <strong>MP3</strong> is the safest bet for maximum compatibility.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xl">3</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Convert & Download</h3>
              <p className="text-gray-600 dark:text-gray-400">Hit the convert button. Our engine processes the file in seconds. Download your new audio file instantly.</p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6 text-gray-900 dark:text-gray-100">Common Use Cases</h2>
        <ul className="space-y-4 text-gray-700 dark:text-gray-300 mb-8">
          <li className="flex items-start">
            <span className="bg-purple-100 text-purple-600 rounded-full p-1 mr-3 mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </span>
            <span><strong>Musicians:</strong> Convert your heavy WAV master tracks to high-quality MP3s for emailing to labels or uploading to SoundCloud.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-100 text-purple-600 rounded-full p-1 mr-3 mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </span>
            <span><strong>Podcasters:</strong> Ensure your episodes are in the industry-standard format (MP3, 192kbps) for widespread distribution on Spotify and Apple Podcasts.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-100 text-purple-600 rounded-full p-1 mr-3 mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </span>
            <span><strong>Students & Journalists:</strong> Reduce the size of long lecture or interview recordings (often GBs in size) to handleable files.</span>
          </li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-gray-100">Frequency Asked Questions</h2>
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Which format is best for music?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">For listening on your phone, <strong>MP3 (320kbps)</strong> or <strong>AAC</strong> is perfect. They sound great to the human ear. If you are archiving CD rips or doing final mixing, go with <strong>FLAC</strong> or <strong>WAV</strong>.</dd>
          </div>
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Can I convert recording from iPhone?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Yes! iPhones record voice memos in <strong>M4A</strong> format. You can use this tool to convert them to <strong>MP3</strong> to share easily with Windows or Android users who might not be able to open M4A files.</dd>
          </div>
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Does converting reduce quality?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Converting from a high-quality format (WAV) to a compressed one (MP3) <strong>does</strong> reduce quality technically, but usually not noticeably if you choose a high bitrate (192kbps+). Converting from a low-quality MP3 <strong>back</strong> to WAV will not improve the quality; it will just make the file larger.</dd>
          </div>
        </dl>

        <div className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl text-center border border-purple-100 dark:border-purple-800/30">
          <h3 className="text-2xl font-bold mb-4 text-purple-900 dark:text-purple-100">Need Video?</h3>
          <p className="mb-6 text-purple-800 dark:text-purple-200">Extract audio from video files or convert sound to video.</p>
          <div className="flex justify-center gap-4">
            <a href="/tools/video-converter" className="px-6 py-3 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-700 font-bold rounded-full hover:bg-purple-50 dark:hover:bg-gray-700 transition shadow-sm">
              Go to Video Converter
            </a>
          </div>
        </div>
      </article>

    </ToolTemplate>
  );
};

export default AudioConverter;
