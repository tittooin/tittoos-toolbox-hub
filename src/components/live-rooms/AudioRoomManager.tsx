import React, { useEffect, useRef, useState } from "react";
import { 
  Mic, MicOff, Volume2, Monitor, PhoneOff, Shield, Crown, User, 
  Hand, Radio, Settings, Music, MessageSquare, Award, Play, AlertCircle, Sparkles, VolumeX, Smile
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { VoiceParticipant } from "@/hooks/useChatSocket";
import { DeviceManager, VoiceActivityDetector, AUDIO_QUALITY_PROFILES, AxevoraLiveEventBus } from "@/lib/audioAbstractions";
import { AudioPresenceState, AudioQualityProfile, LiveRoomStatus } from "@/lib/liveRooms";

interface AudioRoomManagerProps {
  roomId: string;
  myUid: string;
  myName: string;
  myPhoto: string;
  voiceParticipants: VoiceParticipant[];
  socketHelpers: {
    sendVoiceJoin: (peerId: string, role?: string) => void;
    sendVoiceLeave: () => void;
    sendVoiceSignal: (targetUid: string, signal: unknown) => void;
    sendMuteUser: (targetUid: string, muted: boolean) => void;
    sendKickUser: (targetUid: string) => void;
    sendRaiseHand: (handRaised: boolean) => void;
    sendSetRole: (targetUid: string, role: string) => void;
    sendPresenceState: (presence: string) => void;
    sendAudioQualityProfile: (profile: string) => void;
  };
}

export function AudioRoomManager({
  roomId,
  myUid,
  myName,
  myPhoto,
  voiceParticipants,
  socketHelpers
}: AudioRoomManagerProps) {
  const [inVoice, setInVoice] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [sharingSystem, setSharingSystem] = useState(false);
  const [myPresence, setMyPresence] = useState<AudioPresenceState>("ONLINE");
  const [qualityProfile, setQualityProfile] = useState<AudioQualityProfile>("medium");
  const [roomLifecycle, setRoomLifecycle] = useState<LiveRoomStatus>("live");
  
  const [audioInputs, setAudioInputs] = useState<MediaDeviceInfo[]>([]);
  const [selectedInput, setSelectedInput] = useState("");
  const [activeSpeakerUids, setActiveSpeakerUids] = useState<Set<string>>(new Set());

  const localStreamRef = useRef<MediaStream | null>(null);
  const systemStreamRef = useRef<MediaStream | null>(null);
  const mixedStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const vadRef = useRef<VoiceActivityDetector | null>(null);

  const myParticipant = voiceParticipants.find(p => p.uid === myUid);
  const isHost = myParticipant?.role === "host";

  const [recoveryHostUid, setRecoveryHostUid] = useState<string | null>(null);
  const [recoveryCountdown, setRecoveryCountdown] = useState(60);
  const [netQuality, setNetQuality] = useState<{ latency: number; quality: string }>({ latency: 0, quality: "excellent" });

  // Host recovery countdown
  useEffect(() => {
    if (!recoveryHostUid) return;
    const interval = setInterval(() => {
      setRecoveryCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          setRecoveryHostUid(null);
          return 60;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [recoveryHostUid]);

  // Load audio input devices
  useEffect(() => {
    DeviceManager.getAudioInputDevices().then(devices => {
      setAudioInputs(devices);
      if (devices.length > 0) setSelectedInput(devices[0].deviceId);
    });
  }, []);

  // Listen to remote mute/kick/recovery signals
  useEffect(() => {
    const handleModerated = (e: Event) => {
      const { targetUid, muted } = (e as CustomEvent).detail;
      if (targetUid === myUid) {
        setMicMuted(muted);
        if (localStreamRef.current) {
          localStreamRef.current.getAudioTracks().forEach(t => t.enabled = !muted);
        }
        toast.info(muted ? "Host has muted your microphone 🔇" : "Host has unmuted your microphone 🎙️");
      }
    };

    const handleKicked = () => {
      leaveRoom();
      toast.error("You have been kicked from the audio room by the host!");
    };

    const handleRecovery = (e: Event) => {
      const { hostUid, timeoutSec } = (e as CustomEvent).detail;
      setRecoveryHostUid(hostUid);
      setRecoveryCountdown(timeoutSec);
      toast.warning("Room Host disconnected! Seeking recovery...");
    };

    const handleReconnected = () => {
      setRecoveryHostUid(null);
      toast.success("Room Host reconnected successfully!");
    };

    const handleTransferred = (e: Event) => {
      const { oldHostUid, newHostUid } = (e as CustomEvent).detail;
      setRecoveryHostUid(null);
      if (newHostUid === myUid) {
        toast.success("You have been promoted to Host of this room 👑");
      } else {
        toast.info("Host role transferred to another member.");
      }
    };

    const handleQuality = (e: Event) => {
      const { latency, quality } = (e as CustomEvent).detail;
      setNetQuality({ latency, quality });
    };

    window.addEventListener("axevora-voice-moderated", handleModerated);
    window.addEventListener("axevora-voice-kicked", handleKicked);
    window.addEventListener("axevora-host-recovery", handleRecovery);
    window.addEventListener("axevora-host-reconnected", handleReconnected);
    window.addEventListener("axevora-host-transferred", handleTransferred);
    window.addEventListener("axevora-network-quality", handleQuality);

    return () => {
      window.removeEventListener("axevora-voice-moderated", handleModerated);
      window.removeEventListener("axevora-voice-kicked", handleKicked);
      window.removeEventListener("axevora-host-recovery", handleRecovery);
      window.removeEventListener("axevora-host-reconnected", handleReconnected);
      window.removeEventListener("axevora-host-transferred", handleTransferred);
      window.removeEventListener("axevora-network-quality", handleQuality);
    };
  }, [myUid]);

  const joinRoom = async (assignedRole: string = "listener") => {
    try {
      const constraints = {
        audio: {
          deviceId: selectedInput ? { exact: selectedInput } : undefined,
          echoCancellation: qualityProfile !== "music",
          noiseSuppression: qualityProfile !== "music",
          autoGainControl: qualityProfile !== "music"
        },
        video: false
      };

      const micStream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = micStream;
      mixedStreamRef.current = micStream;

      // Start VAD
      vadRef.current = new VoiceActivityDetector(micStream, (speaking) => {
        setActiveSpeakerUids(prev => {
          const next = new Set(prev);
          if (speaking) {
            next.add(myUid);
            socketHelpers.sendPresenceState("SPEAKING");
          } else {
            next.delete(myUid);
            socketHelpers.sendPresenceState("ONLINE");
          }
          return next;
        });
      });
      vadRef.current.start();

      const peerId = `${myUid}_${Date.now()}`;
      socketHelpers.sendVoiceJoin(peerId, assignedRole);
      setInVoice(true);
      toast.success("Joined Axevora Live audio room 🎙️");
    } catch (e) {
      toast.error("Failed to access microphone. Check permissions.");
    }
  };

  const leaveRoom = () => {
    vadRef.current?.stop();
    vadRef.current = null;

    localStreamRef.current?.getTracks().forEach(t => t.stop());
    systemStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    systemStreamRef.current = null;
    mixedStreamRef.current = null;

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    socketHelpers.sendVoiceLeave();
    setInVoice(false);
    setSharingSystem(false);
    setMicMuted(false);
    toast.info("Left audio room");
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return;
    const nextMute = !micMuted;
    localStreamRef.current.getAudioTracks().forEach(t => t.enabled = !nextMute);
    setMicMuted(nextMute);
    socketHelpers.sendPresenceState(nextMute ? "MUTED" : "ONLINE");
    AxevoraLiveEventBus.emit({ type: "MIC_ENABLED", uid: myUid, enabled: !nextMute });
  };

  const startSystemAudioSharing = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: false,
          noiseSuppression: false
        }
      });
      
      const audioTracks = displayStream.getAudioTracks();
      if (audioTracks.length === 0) {
        displayStream.getTracks().forEach(t => t.stop());
        toast.warning("No system/tab audio selected during capture sharing.");
        return;
      }

      systemStreamRef.current = displayStream;

      // Mix mic track + system audio track using Web Audio API
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const micSource = audioContextRef.current.createMediaStreamSource(localStreamRef.current!);
      const sysSource = audioContextRef.current.createMediaStreamSource(new MediaStream([audioTracks[0]]));
      
      const destination = audioContextRef.current.createMediaStreamDestination();
      micSource.connect(destination);
      sysSource.connect(destination);

      mixedStreamRef.current = destination.stream;
      setSharingSystem(true);
      toast.success("System tab audio mixed and shared successfully!");
      AxevoraLiveEventBus.emit({ type: "SYSTEM_AUDIO_STARTED", uid: myUid });

      // Stop system audio if sharing window is closed manually
      audioTracks[0].onended = () => {
        stopSystemAudioSharing();
      };
    } catch (e) {
      console.error(e);
      toast.error("Failed to share system/tab audio.");
    }
  };

  const stopSystemAudioSharing = () => {
    systemStreamRef.current?.getTracks().forEach(t => t.stop());
    systemStreamRef.current = null;
    mixedStreamRef.current = localStreamRef.current;
    setSharingSystem(false);
    toast.info("Stopped sharing system audio");
  };

  const handlePresenceChange = (state: AudioPresenceState) => {
    setMyPresence(state);
    socketHelpers.sendPresenceState(state);
  };

  const handleQualityChange = (profile: AudioQualityProfile) => {
    setQualityProfile(profile);
    socketHelpers.sendAudioQualityProfile(profile);
    toast.success(`Quality set to ${profile.toUpperCase()} profile`);
  };

  return (
    <Card className="border-indigo-500/20 bg-slate-900 text-white shadow-2xl rounded-3xl overflow-hidden max-w-4xl mx-auto">
      {/* Header Info */}
      <CardHeader className="bg-slate-950 p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border-rose-500/20">
              Live Stage
            </Badge>
            <Badge className="bg-slate-800 text-[10px] font-bold capitalize">
              Lifecycle: {roomLifecycle}
            </Badge>
            {netQuality.latency > 0 && (
              <Badge className="bg-slate-800 text-[10px] text-slate-300">
                Ping: {netQuality.latency}ms ({netQuality.quality})
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
            Axevora Live Audio Control Room
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs mt-1">
            Yahoo! Messenger inspired interactive broadcast foundation.
          </CardDescription>
        </div>

        {/* Quality profiles and lifecycles */}
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={qualityProfile} 
            onChange={(e) => handleQualityChange(e.target.value as AudioQualityProfile)}
            className="bg-slate-800 text-xs px-3 py-1.5 rounded-xl border border-white/10 outline-none text-slate-200"
          >
            <option value="low">Low Quality (16kbps)</option>
            <option value="medium">Medium Quality (64kbps)</option>
            <option value="high">High Quality (128kbps)</option>
            <option value="music">Music Mode (320kbps Stereo)</option>
          </select>
          {isHost && (
            <select
              value={roomLifecycle}
              onChange={(e) => setRoomLifecycle(e.target.value as LiveRoomStatus)}
              className="bg-slate-800 text-xs px-3 py-1.5 rounded-xl border border-white/10 outline-none text-slate-200"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="starting">Starting</option>
              <option value="live">Live</option>
              <option value="ending">Ending</option>
              <option value="ended">Ended</option>
              <option value="archived">Archived</option>
            </select>
          )}
        </div>
      </CardHeader>

      {recoveryHostUid && (
        <div className="bg-rose-500/20 border-b border-rose-500/30 text-rose-300 text-xs px-6 py-3 flex items-center gap-2 font-bold animate-pulse">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Host disconnected! Automatic Co-Host role transfer in {recoveryCountdown} seconds...</span>
        </div>
      )}

      <CardContent className="p-6 space-y-6">
        {/* Stage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SPEAKERS / STAGE */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> On Stage (Speakers)
            </h3>
            <div className="rounded-2xl bg-slate-950/60 p-4 border border-white/5 space-y-3 min-h-[220px]">
              {voiceParticipants.filter(p => p.role !== "listener").map(p => (
                <div key={p.uid} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border border-indigo-500/30">
                        <AvatarImage src={p.photoURL} />
                        <AvatarFallback className="bg-slate-800 text-white font-bold">{p.displayName[0]}</AvatarFallback>
                      </Avatar>
                      {activeSpeakerUids.has(p.uid) && (
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-slate-900">
                          <Volume2 className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold">{p.displayName}</span>
                        <Badge className="bg-amber-500/20 text-amber-400 text-[8px] px-1 py-0 border-none font-bold uppercase tracking-wider">{p.role}</Badge>
                      </div>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        Status: <span className="font-bold text-slate-300">{p.presence || "ONLINE"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions for Host */}
                  <div className="flex items-center gap-1">
                    {isHost && p.uid !== myUid && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-slate-400 hover:text-rose-400 rounded-full"
                          onClick={() => socketHelpers.sendMuteUser(p.uid, !p.isMuted)}
                          title="Mute/Unmute"
                        >
                          {p.isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-500" /> : <Mic className="w-3.5 h-3.5" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-slate-400 hover:text-rose-400 rounded-full"
                          onClick={() => socketHelpers.sendKickUser(p.uid)}
                          title="Kick Speaker"
                        >
                          <PhoneOff className="w-3.5 h-3.5 text-rose-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {voiceParticipants.filter(p => p.role !== "listener").length === 0 && (
                <div className="text-center py-10 text-slate-600 text-xs">
                  Stage is empty. Join Room to step up.
                </div>
              )}
            </div>
          </div>

          {/* AUDIENCE / LISTENERS */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" /> Audience (Listeners)
            </h3>
            <div className="rounded-2xl bg-slate-950/60 p-4 border border-white/5 space-y-3 min-h-[220px]">
              {voiceParticipants.filter(p => p.role === "listener").map(p => (
                <div key={p.uid} className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={p.photoURL} />
                      <AvatarFallback className="bg-slate-800 text-white text-xs">{p.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{p.displayName}</span>
                        {p.handRaised && (
                          <Badge className="bg-indigo-500/30 text-indigo-300 text-[8px] flex items-center gap-0.5 border-none">
                            <Hand className="w-2.5 h-2.5" /> Hand Raised
                          </Badge>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-500">Listening...</p>
                    </div>
                  </div>

                  {/* Host accepts raise hand */}
                  {isHost && (
                    <div className="flex gap-1.5">
                      {p.handRaised && (
                        <Button 
                          size="sm" 
                          className="h-6 text-[10px] bg-indigo-600 hover:bg-indigo-700"
                          onClick={() => {
                            socketHelpers.sendSetRole(p.uid, "speaker");
                            socketHelpers.sendMuteUser(p.uid, false);
                          }}
                        >
                          Accept Stage
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[10px] text-rose-400"
                        onClick={() => socketHelpers.sendKickUser(p.uid)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {voiceParticipants.filter(p => p.role === "listener").length === 0 && (
                <div className="text-center py-10 text-slate-600 text-xs">
                  No active listeners.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-white/5">
          <div className="flex items-center gap-3">
            {inVoice ? (
              <>
                <Button 
                  onClick={toggleMute}
                  className={micMuted ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}
                >
                  {micMuted ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                  {micMuted ? "Unmute Mic" : "Mute Mic"}
                </Button>

                <Button 
                  variant="outline" 
                  onClick={sharingSystem ? stopSystemAudioSharing : startSystemAudioSharing}
                  className="border-white/10 hover:bg-white/10 text-white"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  {sharingSystem ? "Stop System Audio" : "Share System Audio"}
                </Button>

                {!isHost && (
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      const next = !myParticipant?.handRaised;
                      socketHelpers.sendRaiseHand(next);
                      toast.info(next ? "Hand Raised 🖐️" : "Hand Lowered");
                    }}
                    className={myParticipant?.handRaised ? "text-indigo-400 hover:bg-indigo-500/10" : "text-white/60 hover:bg-white/5"}
                  >
                    <Hand className="mr-2 h-4 w-4" />
                    {myParticipant?.handRaised ? "Lower Hand" : "Raise Hand"}
                  </Button>
                )}

                <Button variant="destructive" onClick={leaveRoom}>
                  <PhoneOff className="mr-2 h-4 w-4" /> Leave Room
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => joinRoom(isHost ? "host" : "listener")} className="bg-indigo-600 hover:bg-indigo-700">
                  <Play className="mr-2 h-4 w-4" /> Join Live Stage
                </Button>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Mic Input:</label>
                  <select 
                    value={selectedInput} 
                    onChange={(e) => setSelectedInput(e.target.value)}
                    className="bg-slate-800 text-xs px-2 py-1 rounded border border-white/10 outline-none"
                  >
                    {audioInputs.map(d => (
                      <option key={d.deviceId} value={d.deviceId}>{d.label || `Mic ${d.deviceId.slice(0,4)}`}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Presence state selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">My Presence:</span>
            <select 
              value={myPresence} 
              onChange={(e) => handlePresenceChange(e.target.value as AudioPresenceState)}
              className="bg-slate-800 text-xs px-2 py-1 rounded border border-white/10 outline-none text-slate-200"
            >
              <option value="ONLINE">Online</option>
              <option value="AWAY">Away</option>
              <option value="MUTED">Muted</option>
              <option value="CONNECTING">Connecting</option>
              <option value="RECONNECTING">Reconnecting</option>
            </select>
          </div>
        </div>

        {/* Plugin triggers panel */}
        <div className="pt-4 border-t border-white/5">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Active Platform Plugins
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Button variant="outline" className="border-white/5 bg-slate-950 text-slate-300 hover:bg-white/5 justify-start text-xs font-bold rounded-2xl h-11" onClick={() => toast.info("Plugin: Music Queue activated")}>
              <Music className="w-4 h-4 mr-2 text-pink-500" /> Music Queue
            </Button>
            <Button variant="outline" className="border-white/5 bg-slate-950 text-slate-300 hover:bg-white/5 justify-start text-xs font-bold rounded-2xl h-11" onClick={() => toast.info("Plugin: Polls activated")}>
              <Award className="w-4 h-4 mr-2 text-amber-500" /> Live Polls
            </Button>
            <Button variant="outline" className="border-white/5 bg-slate-950 text-slate-300 hover:bg-white/5 justify-start text-xs font-bold rounded-2xl h-11" onClick={() => toast.info("Plugin: Emoji Reactions activated")}>
              <Smile className="w-4 h-4 mr-2 text-cyan-500" /> Reactions
            </Button>
            <Button variant="outline" className="border-white/5 bg-slate-950 text-slate-300 hover:bg-white/5 justify-start text-xs font-bold rounded-2xl h-11" onClick={() => toast.info("Plugin: Live Captions activated")}>
              <MessageSquare className="w-4 h-4 mr-2 text-emerald-500" /> Live Captions
            </Button>
            <Button variant="outline" className="border-white/5 bg-slate-950 text-slate-300 hover:bg-white/5 justify-start text-xs font-bold rounded-2xl h-11" onClick={() => toast.info("Plugin: Soundboard activated")}>
              <Volume2 className="w-4 h-4 mr-2 text-purple-500" /> Soundboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
