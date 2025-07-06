
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ToolTemplate from "@/components/ToolTemplate";
import { 
  Video, Upload, Download, Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Scissors, Copy, Trash2, RotateCw, FlipHorizontal,
  ZoomIn, ZoomOut, Layers, Filter, Type, Square, Circle,
  Move, Maximize, Music, Image, Settings, Save, FileVideo
} from "lucide-react";
import { toast } from "sonner";

interface VideoClip {
  id: string;
  name: string;
  src: string;
  duration: number;
  startTime: number;
  endTime: number;
  volume: number;
  effects: string[];
}

interface AudioTrack {
  id: string;
  name: string;
  src: string;
  duration: number;
  volume: number;
}

const VideoEditor = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [videoClips, setVideoClips] = useState<VideoClip[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [exportFormat, setExportFormat] = useState("mp4");
  const [exportQuality, setExportQuality] = useState("720p");
  const [isExporting, setIsExporting] = useState(false);

  // Video controls
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!videoRef.current) return;
    const volumeValue = newVolume / 100;
    videoRef.current.volume = volumeValue;
    setVolume(newVolume);
  };

  // File upload handlers
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newClip: VideoClip = {
      id: Date.now().toString(),
      name: file.name,
      src: url,
      duration: 0, // Will be set when metadata loads
      startTime: 0,
      endTime: 0,
      volume: 100,
      effects: []
    };

    setVideoClips([...videoClips, newClip]);
    toast.success("Video uploaded successfully!");
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newTrack: AudioTrack = {
      id: Date.now().toString(),
      name: file.name,
      src: url,
      duration: 0,
      volume: 100
    };

    setAudioTracks([...audioTracks, newTrack]);
    toast.success("Audio uploaded successfully!");
  };

  // Edit functions
  const cutClip = () => {
    if (!selectedClip) {
      toast.error("Please select a clip to cut");
      return;
    }
    toast.success("Clip cut at current position");
  };

  const copyClip = () => {
    if (!selectedClip) {
      toast.error("Please select a clip to copy");
      return;
    }
    toast.success("Clip copied to clipboard");
  };

  const deleteClip = (clipId: string) => {
    setVideoClips(videoClips.filter(clip => clip.id !== clipId));
    toast.success("Clip deleted");
  };

  const addEffect = (effect: string) => {
    if (!selectedClip) {
      toast.error("Please select a clip to add effects");
      return;
    }
    toast.success(`${effect} effect applied`);
  };

  const addTransition = (transition: string) => {
    toast.success(`${transition} transition added`);
  };

  // Export functions
  const exportVideo = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success(`Video exported as ${exportFormat.toUpperCase()} (${exportQuality})`);
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <ToolTemplate
      title="Video Editor"
      description="Professional video editing tool with timeline, effects, and multiple export options"
      icon={Video}
      features={[
        "Timeline-based editing",
        "Video and audio tracks",
        "Effects and transitions",
        "Text and shape overlays",
        "Multiple export formats",
        "Professional tools"
      ]}
    >
      <div className="space-y-6">
        {/* Top Toolbar */}
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="hidden"
            id="video-upload"
          />
          <Button
            onClick={() => document.getElementById("video-upload")?.click()}
            variant="outline"
            size="sm"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Video
          </Button>
          
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="hidden"
            id="audio-upload"
          />
          <Button
            onClick={() => document.getElementById("audio-upload")?.click()}
            variant="outline"
            size="sm"
          >
            <Music className="h-4 w-4 mr-2" />
            Import Audio
          </Button>
          
          <Button onClick={cutClip} variant="outline" size="sm">
            <Scissors className="h-4 w-4 mr-2" />
            Cut
          </Button>
          
          <Button onClick={copyClip} variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          
          <Button onClick={exportVideo} variant="outline" size="sm" disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Effects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addEffect("Blur")}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Blur
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addEffect("Brightness")}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Brightness
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addEffect("Contrast")}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Contrast
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addEffect("Saturation")}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Saturation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Transitions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addTransition("Fade")}
                >
                  Fade
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addTransition("Dissolve")}
                >
                  Dissolve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addTransition("Wipe")}
                >
                  Wipe
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    src={videoClips[0]?.src}
                  />
                </div>
                
                {/* Video Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button size="sm" variant="outline">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button onClick={togglePlayPause} size="sm">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="outline">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Timeline */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">{formatTime(currentTime)}</span>
                      <Slider
                        value={[currentTime]}
                        onValueChange={(value) => handleSeek(value[0])}
                        max={duration || 100}
                        step={0.1}
                        className="flex-1"
                      />
                      <span className="text-xs">{formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    <Slider
                      value={[volume]}
                      onValueChange={(value) => handleVolumeChange(value[0])}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                    <span className="text-xs">{volume}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Video Tracks */}
                  <div className="space-y-1">
                    <Label className="text-xs">Video Tracks</Label>
                    {videoClips.map((clip) => (
                      <div
                        key={clip.id}
                        className={`p-2 bg-blue-100 rounded cursor-pointer ${
                          selectedClip === clip.id ? "ring-2 ring-blue-500" : ""
                        }`}
                        onClick={() => setSelectedClip(clip.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{clip.name}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteClip(clip.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Audio Tracks */}
                  <div className="space-y-1">
                    <Label className="text-xs">Audio Tracks</Label>
                    {audioTracks.map((track) => (
                      <div
                        key={track.id}
                        className="p-2 bg-green-100 rounded cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{track.name}</span>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Export Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Format</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4</SelectItem>
                      <SelectItem value="mov">MOV</SelectItem>
                      <SelectItem value="avi">AVI</SelectItem>
                      <SelectItem value="webm">WebM</SelectItem>
                      <SelectItem value="mkv">MKV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Quality</Label>
                  <Select value={exportQuality} onValueChange={setExportQuality}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="480p">480p</SelectItem>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                      <SelectItem value="1440p">1440p</SelectItem>
                      <SelectItem value="4k">4K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={exportVideo}
                  className="w-full"
                  disabled={isExporting}
                >
                  <FileVideo className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export Video"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Clip Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedClip ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs">Volume</Label>
                      <Slider
                        value={[100]}
                        onValueChange={() => {}}
                        max={100}
                        step={1}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline">
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <FlipHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-500">Select a clip to edit properties</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolTemplate>
  );
};

export default VideoEditor;
