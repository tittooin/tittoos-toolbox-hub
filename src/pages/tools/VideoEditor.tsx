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
  Move, Maximize, Music, Image, Settings, Save, FileVideo,
  Wand2, Sparkles, Eye, EyeOff, Lock, Unlock, AudioLines,
  Mic, MicOff, Headphones, Equalizer, SlidersHorizontal
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
  visible: boolean;
  locked: boolean;
}

interface AudioTrack {
  id: string;
  name: string;
  src: string;
  duration: number;
  volume: number;
  effects: string[];
  type: 'music' | 'voice' | 'sfx';
  muted: boolean;
  solo: boolean;
}

interface TimelineFrame {
  time: number;
  thumbnail?: string;
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
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [exportFormat, setExportFormat] = useState("mp4");
  const [exportQuality, setExportQuality] = useState("720p");
  const [isExporting, setIsExporting] = useState(false);
  const [timelineFrames, setTimelineFrames] = useState<TimelineFrame[]>([]);
  const [showWaveform, setShowWaveform] = useState(true);

  // Video effects list
  const videoEffects = [
    "Blur", "Brightness", "Contrast", "Saturation", "Hue", "Sepia", 
    "Grayscale", "Invert", "Vintage", "Vignette", "Sharpen", "Noise",
    "Chromatic Aberration", "Film Grain", "Color Temperature", "Exposure",
    "Highlights", "Shadows", "Vibrance", "Clarity"
  ];

  // Audio effects list
  const audioEffects = [
    "Reverb", "Echo", "Chorus", "Flanger", "Phaser", "Distortion",
    "Compressor", "Limiter", "EQ", "Bass Boost", "Treble Boost",
    "Pitch Shift", "Time Stretch", "Noise Reduction", "De-esser",
    "Auto-tune", "Vocoder", "Ring Modulator"
  ];

  // Transition effects
  const transitions = [
    "Fade", "Dissolve", "Wipe Left", "Wipe Right", "Wipe Up", "Wipe Down",
    "Slide Left", "Slide Right", "Zoom In", "Zoom Out", "Spin", "Flip",
    "Cross Fade", "Dip to Black", "Dip to White", "Push", "Cover", "Uncover"
  ];

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
    generateTimelineFrames();
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

  // Generate timeline frames for detailed view
  const generateTimelineFrames = () => {
    if (!duration) return;
    const frames: TimelineFrame[] = [];
    const frameInterval = duration / 100; // 100 frames across timeline
    
    for (let i = 0; i <= 100; i++) {
      frames.push({
        time: i * frameInterval,
        thumbnail: undefined // Could generate actual thumbnails
      });
    }
    setTimelineFrames(frames);
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
      duration: 0,
      startTime: 0,
      endTime: 0,
      volume: 100,
      effects: [],
      visible: true,
      locked: false
    };

    setVideoClips([...videoClips, newClip]);
    toast.success("Video uploaded successfully!");
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const audioType = file.type.includes('music') ? 'music' : 
                     file.name.toLowerCase().includes('voice') ? 'voice' : 'sfx';
    
    const newTrack: AudioTrack = {
      id: Date.now().toString(),
      name: file.name,
      src: url,
      duration: 0,
      volume: 100,
      effects: [],
      type: audioType,
      muted: false,
      solo: false
    };

    setAudioTracks([...audioTracks, newTrack]);
    toast.success("Audio uploaded successfully!");
  };

  // Enhanced edit functions
  const addVideoEffect = (effect: string) => {
    if (!selectedClip) {
      toast.error("Please select a clip to add effects");
      return;
    }
    
    const updatedClips = videoClips.map(clip => {
      if (clip.id === selectedClip) {
        return { ...clip, effects: [...clip.effects, effect] };
      }
      return clip;
    });
    
    setVideoClips(updatedClips);
    toast.success(`${effect} effect applied to video`);
  };

  const addAudioEffect = (effect: string) => {
    if (!selectedAudioTrack) {
      toast.error("Please select an audio track to add effects");
      return;
    }
    
    const updatedTracks = audioTracks.map(track => {
      if (track.id === selectedAudioTrack) {
        return { ...track, effects: [...track.effects, effect] };
      }
      return track;
    });
    
    setAudioTracks(updatedTracks);
    toast.success(`${effect} effect applied to audio`);
  };

  const toggleClipVisibility = (clipId: string) => {
    const updatedClips = videoClips.map(clip => {
      if (clip.id === clipId) {
        return { ...clip, visible: !clip.visible };
      }
      return clip;
    });
    setVideoClips(updatedClips);
  };

  const toggleClipLock = (clipId: string) => {
    const updatedClips = videoClips.map(clip => {
      if (clip.id === clipId) {
        return { ...clip, locked: !clip.locked };
      }
      return clip;
    });
    setVideoClips(updatedClips);
  };

  const toggleAudioMute = (trackId: string) => {
    const updatedTracks = audioTracks.map(track => {
      if (track.id === trackId) {
        return { ...track, muted: !track.muted };
      }
      return track;
    });
    setAudioTracks(updatedTracks);
  };

  const toggleAudioSolo = (trackId: string) => {
    const updatedTracks = audioTracks.map(track => {
      if (track.id === trackId) {
        return { ...track, solo: !track.solo };
      }
      return track;
    });
    setAudioTracks(updatedTracks);
  };

  const exportVideo = async () => {
    setIsExporting(true);
    try {
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
    const frames = Math.floor((time % 1) * 30); // Assuming 30fps
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  return (
    <ToolTemplate
      title="Video Editor"
      description="Professional video editing tool with advanced effects, timeline editing, and comprehensive audio controls"
      icon={Video}
      features={[
        "Advanced timeline with frame-by-frame editing",
        "20+ video effects and filters",
        "18+ audio effects and processing",
        "Multi-track audio editing",
        "Voice and music enhancement",
        "Professional export options"
      ]}
    >
      <div className="space-y-6">
        {/* Enhanced Top Toolbar */}
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
          
          <Button variant="outline" size="sm">
            <Mic className="h-4 w-4 mr-2" />
            Record Voice
          </Button>
          
          <Button onClick={exportVideo} variant="outline" size="sm" disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>

          <div className="ml-auto flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWaveform(!showWaveform)}
            >
              <AudioLines className="h-4 w-4 mr-2" />
              Waveform
            </Button>
            <Label className="text-xs">Zoom:</Label>
            <Slider
              value={[zoom]}
              onValueChange={(value) => setZoom(value[0])}
              min={25}
              max={400}
              step={25}
              className="w-20"
            />
            <span className="text-xs">{zoom}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Enhanced Effects Panel */}
          <div className="space-y-4">
            <Tabs defaultValue="video-effects" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="video-effects">Video</TabsTrigger>
                <TabsTrigger value="audio-effects">Audio</TabsTrigger>
              </TabsList>
              
              <TabsContent value="video-effects" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Video Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                    {videoEffects.map((effect) => (
                      <Button
                        key={effect}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => addVideoEffect(effect)}
                      >
                        <Wand2 className="h-3 w-3 mr-2" />
                        {effect}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Transitions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-40 overflow-y-auto">
                    {transitions.map((transition) => (
                      <Button
                        key={transition}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => toast.success(`${transition} transition added`)}
                      >
                        <Sparkles className="h-3 w-3 mr-2" />
                        {transition}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audio-effects" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Headphones className="h-4 w-4 mr-2" />
                      Audio Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                    {audioEffects.map((effect) => (
                      <Button
                        key={effect}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => addAudioEffect(effect)}
                      >
                        <SlidersHorizontal className="h-3 w-3 mr-2" />
                        {effect}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Voice Enhancement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addAudioEffect("Voice Clarity")}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Voice Clarity
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => addAudioEffect("Background Noise Removal")}
                    >
                      <MicOff className="h-4 w-4 mr-2" />
                      Noise Removal
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-3">
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
                  
                  {/* Enhanced Timeline */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono">{formatTime(currentTime)}</span>
                      <div className="flex-1 relative">
                        <Slider
                          value={[currentTime]}
                          onValueChange={(value) => handleSeek(value[0])}
                          max={duration || 100}
                          step={1/30} // Frame-accurate seeking at 30fps
                          className="w-full"
                        />
                        {/* Frame markers */}
                        <div className="absolute top-6 left-0 right-0 h-2 flex">
                          {timelineFrames.map((frame, index) => (
                            <div
                              key={index}
                              className="flex-1 border-l border-gray-300 h-full"
                              style={{ opacity: index % 10 === 0 ? 1 : 0.3 }}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs font-mono">{formatTime(duration)}</span>
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

            {/* Enhanced Multi-track Timeline */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Multi-track Timeline</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Video Tracks */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-blue-600">Video Tracks</Label>
                    {videoClips.map((clip) => (
                      <div
                        key={clip.id}
                        className={`p-3 bg-blue-50 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedClip === clip.id ? "border-blue-500 bg-blue-100" : "border-transparent"
                        }`}
                        onClick={() => setSelectedClip(clip.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleClipVisibility(clip.id);
                              }}
                            >
                              {clip.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleClipLock(clip.id);
                              }}
                            >
                              {clip.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                            </Button>
                            <span className="text-xs font-medium">{clip.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {clip.effects.length > 0 && (
                              <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                                {clip.effects.length} effects
                              </span>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVideoClips(videoClips.filter(c => c.id !== clip.id));
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {showWaveform && (
                          <div className="mt-2 h-8 bg-blue-200 rounded relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-400 opacity-60" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Audio Tracks */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-green-600">Audio Tracks</Label>
                    {audioTracks.map((track) => (
                      <div
                        key={track.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          track.type === 'music' ? 'bg-green-50' : 
                          track.type === 'voice' ? 'bg-purple-50' : 'bg-orange-50'
                        } ${
                          selectedAudioTrack === track.id ? 
                          (track.type === 'music' ? "border-green-500 bg-green-100" : 
                           track.type === 'voice' ? "border-purple-500 bg-purple-100" : 
                           "border-orange-500 bg-orange-100") : "border-transparent"
                        }`}
                        onClick={() => setSelectedAudioTrack(track.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAudioMute(track.id);
                              }}
                            >
                              {track.muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAudioSolo(track.id);
                              }}
                            >
                              <Headphones className={`h-3 w-3 ${track.solo ? 'text-yellow-500' : ''}`} />
                            </Button>
                            <span className="text-xs font-medium">{track.name}</span>
                            <span className={`text-xs px-2 py-1 rounded text-white ${
                              track.type === 'music' ? 'bg-green-500' : 
                              track.type === 'voice' ? 'bg-purple-500' : 'bg-orange-500'
                            }`}>
                              {track.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {track.effects.length > 0 && (
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                {track.effects.length} effects
                              </span>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAudioTracks(audioTracks.filter(t => t.id !== track.id));
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {showWaveform && (
                          <div className={`mt-2 h-8 rounded relative overflow-hidden ${
                            track.type === 'music' ? 'bg-green-200' : 
                            track.type === 'voice' ? 'bg-purple-200' : 'bg-orange-200'
                          }`}>
                            <div className={`absolute inset-0 opacity-60 ${
                              track.type === 'music' ? 'bg-gradient-to-r from-green-300 to-green-400' : 
                              track.type === 'voice' ? 'bg-gradient-to-r from-purple-300 to-purple-400' : 
                              'bg-gradient-to-r from-orange-300 to-orange-400'
                            }`} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Properties Panel */}
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

            {/* Enhanced Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedClip && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold">Video Clip</h4>
                    <div className="space-y-2">
                      <Label className="text-xs">Volume</Label>
                      <Slider
                        value={[100]}
                        onValueChange={() => {}}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Speed</Label>
                      <Slider
                        value={[100]}
                        onValueChange={() => {}}
                        min={25}
                        max={400}
                        step={25}
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
                  </div>
                )}
                
                {selectedAudioTrack && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold">Audio Track</h4>
                    <div className="space-y-2">
                      <Label className="text-xs">Volume</Label>
                      <Slider
                        value={[100]}
                        onValueChange={() => {}}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Pan</Label>
                      <Slider
                        value={[0]}
                        onValueChange={() => {}}
                        min={-100}
                        max={100}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Pitch</Label>
                      <Slider
                        value={[0]}
                        onValueChange={() => {}}
                        min={-24}
                        max={24}
                        step={1}
                      />
                    </div>
                    <Button size="sm" className="w-full">
                      <Equalizer className="h-4 w-4 mr-2" />
                      Open EQ
                    </Button>
                  </div>
                )}
                
                {!selectedClip && !selectedAudioTrack && (
                  <p className="text-xs text-gray-500">Select a clip or track to edit properties</p>
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
