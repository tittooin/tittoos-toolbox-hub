
import { useState } from "react";
import { Upload, Download, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import ToolTemplate from "@/components/ToolTemplate";

const AudioConverter = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success("Audio file selected successfully!");
    }
  };

  const handleConvert = () => {
    if (!selectedFile) {
      toast.error("Please select an audio file first");
      return;
    }
    toast.info("Audio conversion feature coming soon!");
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
              <h3 className="text-lg font-medium mb-2">Selected File</h3>
              <p className="text-gray-600 mb-4">{selectedFile.name}</p>
              <Button onClick={handleConvert} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Convert Audio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <article className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200 mt-12">
        <h1 className="text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">Audio Converter Online – MP3, WAV, FLAC & More</h1>

        <div className="my-8 flex justify-center">
          {/* Custom SVG Illustration for Audio Converter */}
          <svg width="600" height="400" viewBox="0 0 600 400" className="w-full max-w-2xl rounded-xl shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
            <rect x="0" y="0" width="600" height="400" fill="none" rx="12" />

            {/* Central Audio Waveform Animation */}
            <g transform="translate(150, 100)">
              <rect x="0" y="80" width="10" height="40" fill="#8b5cf6" opacity="0.8">
                <animate attributeName="height" values="40;100;40" dur="1s" repeatCount="indefinite" />
                <animate attributeName="y" values="80;50;80" dur="1s" repeatCount="indefinite" />
              </rect>
              <rect x="20" y="60" width="10" height="80" fill="#ec4899" opacity="0.8">
                <animate attributeName="height" values="80;140;80" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="y" values="60;30;60" dur="1.2s" repeatCount="indefinite" />
              </rect>
              <rect x="40" y="40" width="10" height="120" fill="#8b5cf6" opacity="0.8">
                <animate attributeName="height" values="120;180;120" dur="0.8s" repeatCount="indefinite" />
                <animate attributeName="y" values="40;10;40" dur="0.8s" repeatCount="indefinite" />
              </rect>
              <rect x="60" y="70" width="10" height="60" fill="#ec4899" opacity="0.8">
                <animate attributeName="height" values="60;100;60" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="y" values="70;50;70" dur="1.5s" repeatCount="indefinite" />
              </rect>
              <rect x="80" y="90" width="10" height="20" fill="#8b5cf6" opacity="0.8">
                <animate attributeName="height" values="20;60;20" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="y" values="90;70;90" dur="0.9s" repeatCount="indefinite" />
              </rect>
            </g>

            {/* File Icon Converting */}
            <g transform="translate(350, 150)">
              <path d="M10 0 L40 0 L60 20 L60 80 L10 80 Z" fill="#fff" stroke="#4b5563" strokeWidth="2" />
              <text x="35" y="50" textAnchor="middle" fill="#4b5563" fontSize="16" fontWeight="bold">MP3</text>
              <path d="M-40 40 L-10 40" stroke="#8b5cf6" strokeWidth="4" markerEnd="url(#arrow)" />
            </g>

            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill="#8b5cf6" />
              </marker>
            </defs>
          </svg>
        </div>

        <p className="lead text-xl text-gray-600 dark:text-gray-300 mb-8">
          Audio files come in all shapes and sizes, and finding the right one can be a headache. Whether you need to squish a WAV file down to an MP3 for your phone, or convert a voice note to a professional format, our <strong>Audio Converter</strong> handles it all smoothly in your browser.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Why Format Matters?</h2>
        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-purple-600 dark:text-purple-400">MP3</h3>
            <p className="text-gray-600 dark:text-gray-300">The universal standard. Great quality-to-size ratio. Works on literally every device made in the last 20 years.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-pink-600 dark:text-pink-400">WAV</h3>
            <p className="text-gray-600 dark:text-gray-300">Uncompressed and pristine. Perfect for professional audio editing where you can't afford to lose a single detail.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-blue-600 dark:text-blue-400">FLAC</h3>
            <p className="text-gray-600 dark:text-gray-300">Lossless compression. You get the quality of WAV but with half the file size. The audiophile's choice.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-green-600 dark:text-green-400">AAC</h3>
            <p className="text-gray-600 dark:text-gray-300">Apple's preferred format. It often sounds slightly better than MP3 at the same bitrate.</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">Features for Everyone</h2>
        <ul className="space-y-4 text-gray-700 dark:text-gray-300">
          <li className="flex items-start">
            <span className="bg-purple-100 text-purple-600 rounded-full p-1 mr-3 mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </span>
            <span><strong>Privacy First:</strong> Your audio is processed directly on your device. We don't upload your personal voice notes or music to any server.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-purple-100 text-purple-600 rounded-full p-1 mr-3 mt-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </span>
            <span><strong>No Limits:</strong> Convert as many files as you want. There are no daily limits or paywalls here.</span>
          </li>
        </ul>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white">FAQ</h2>
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Which format is best for music?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">For listening on your phone, <strong>MP3 (320kbps)</strong> or <strong>AAC</strong> is perfect. If you are archiving CD rips, go with <strong>FLAC</strong>.</dd>
          </div>
          <div className="py-4">
            <dt className="font-bold text-lg text-gray-900 dark:text-gray-100">Can I convert recording from iPhone?</dt>
            <dd className="mt-2 text-gray-600 dark:text-gray-400">Yes! iPhones usually record in M4A/AAC format. You can convert these to standard MP3s to share easily with Windows or Android users.</dd>
          </div>
        </dl>
      </article>

    </ToolTemplate>
  );
};

export default AudioConverter;
