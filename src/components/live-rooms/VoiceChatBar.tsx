/**
 * VoiceChatBar — WebRTC P2P Voice Chat for Axevora Live Rooms
 * Uses the WebSocket server as the signaling channel (via useChatSocket)
 * Max 5 simultaneous speakers
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { VoiceParticipant } from "@/hooks/useChatSocket";

const MAX_SPEAKERS = 5;

interface VoiceChatBarProps {
  roomId: string;
  myUid: string;
  myDisplayName: string;
  myPhotoURL: string;
  voiceParticipants: VoiceParticipant[];
  onJoinVoice: (peerId: string) => void;
  onLeaveVoice: () => void;
  onSendSignal: (targetUid: string, signal: unknown) => void;
}

interface PeerState {
  uid: string;
  displayName: string;
  photoURL: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
  speaking: boolean;
}

export function VoiceChatBar({
  roomId,
  myUid,
  myDisplayName,
  myPhotoURL,
  voiceParticipants,
  onJoinVoice,
  onLeaveVoice,
  onSendSignal,
}: VoiceChatBarProps) {
  const [inVoice, setInVoice] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Map<string, PeerState>>(new Map());

  const peersRef = useRef<Map<string, PeerState>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  // ICE servers (public STUN - no cost)
  const ICE_SERVERS = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];

  // Handle incoming WebRTC signals from other peers (dispatched by useChatSocket)
  useEffect(() => {
    const handler = async (e: Event) => {
      const { fromUid, signal } = (e as CustomEvent).detail as {
        fromUid: string;
        signal: RTCSessionDescriptionInit | RTCIceCandidateInit;
      };

      if (!inVoice || fromUid === myUid) return;

      let peer = peersRef.current.get(fromUid);

      if (!peer) {
        peer = await createPeer(fromUid, false);
      }

      const { connection } = peer;

      if ("type" in signal) {
        if (signal.type === "offer") {
          await connection.setRemoteDescription(new RTCSessionDescription(signal));
          const answer = await connection.createAnswer();
          await connection.setLocalDescription(answer);
          onSendSignal(fromUid, answer);
        } else if (signal.type === "answer") {
          await connection.setRemoteDescription(new RTCSessionDescription(signal));
        }
      } else {
        // ICE candidate
        try {
          await connection.addIceCandidate(new RTCIceCandidate(signal));
        } catch {}
      }
    };

    window.addEventListener("axevora-voice-signal", handler);
    return () => window.removeEventListener("axevora-voice-signal", handler);
  }, [inVoice, myUid, onSendSignal]);

  // When voice participants list changes, connect to new peers
  useEffect(() => {
    if (!inVoice) return;
    for (const participant of voiceParticipants) {
      if (participant.uid === myUid) continue;
      if (!peersRef.current.has(participant.uid)) {
        // Only the "older" peer initiates the offer (by UID comparison) to avoid both sides offering
        if (myUid < participant.uid) {
          connectToPeer(participant);
        }
      }
    }
    // Remove peers who left voice
    const activeUids = new Set(voiceParticipants.map(p => p.uid));
    for (const [uid, peer] of peersRef.current) {
      if (!activeUids.has(uid)) {
        peer.connection.close();
        peersRef.current.delete(uid);
      }
    }
    setPeers(new Map(peersRef.current));
  }, [voiceParticipants, inVoice, myUid]);

  const createPeer = async (uid: string, isInitiator: boolean): Promise<PeerState> => {
    const connection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    const peerInfo = voiceParticipants.find(p => p.uid === uid);
    const peerState: PeerState = {
      uid,
      displayName: peerInfo?.displayName || "User",
      photoURL: peerInfo?.photoURL || "",
      connection,
      speaking: false,
    };

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => connection.addTrack(t, localStreamRef.current!));
    }

    // ICE candidate handler
    connection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        onSendSignal(uid, candidate.toJSON());
      }
    };

    // Remote track handler
    connection.ontrack = (event) => {
      if (event.streams[0]) {
        const audio = new Audio();
        audio.srcObject = event.streams[0];
        audio.autoplay = true;
        audio.volume = deafened ? 0 : 1;
        peerState.stream = event.streams[0];
        peersRef.current.set(uid, { ...peerState, stream: event.streams[0] });
        setPeers(new Map(peersRef.current));
      }
    };

    peersRef.current.set(uid, peerState);
    setPeers(new Map(peersRef.current));

    if (isInitiator) {
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      onSendSignal(uid, offer);
    }

    return peerState;
  };

  const connectToPeer = async (participant: VoiceParticipant) => {
    await createPeer(participant.uid, true);
  };

  const joinVoice = async () => {
    if (voiceParticipants.length >= MAX_SPEAKERS) {
      toast.error(`Voice room is full (max ${MAX_SPEAKERS} speakers)`);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      setLocalStream(stream);
      setInVoice(true);

      const myPeerId = `${myUid}_${Date.now()}`;
      onJoinVoice(myPeerId);
      toast.success("Joined voice chat 🎙️");
    } catch (err) {
      toast.error("Microphone access denied. Please allow mic permissions.");
    }
  };

  const leaveVoice = useCallback(() => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);

    peersRef.current.forEach(peer => peer.connection.close());
    peersRef.current.clear();
    setPeers(new Map());

    setInVoice(false);
    setMicMuted(false);
    onLeaveVoice();
    toast.info("Left voice chat");
  }, [onLeaveVoice]);

  const toggleMic = () => {
    if (!localStreamRef.current) return;
    const enabled = !micMuted;
    localStreamRef.current.getAudioTracks().forEach(t => { t.enabled = !enabled; });
    setMicMuted(enabled);
  };

  const toggleDeafen = () => {
    setDeafened(d => !d);
    // Mute/unmute all remote audio
    peers.forEach(peer => {
      if (peer.stream) {
        peer.stream.getAudioTracks().forEach(t => { t.enabled = deafened; });
      }
    });
  };

  if (!inVoice && voiceParticipants.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all" onClick={joinVoice}>
        <Volume2 className="w-3.5 h-3.5 text-white/40" />
        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Join Voice</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all",
      inVoice ? "bg-emerald-500/10 border-emerald-500/30" : "bg-white/5 border-white/10"
    )}>
      {/* Live speaker avatars */}
      <div className="flex items-center gap-1">
        {voiceParticipants.map(p => (
          <div key={p.uid} className="relative">
            <Avatar className={cn(
              "h-7 w-7 border-2 transition-all",
              p.uid === myUid ? "border-emerald-400" : "border-blue-400/50"
            )}>
              <AvatarImage src={p.photoURL} />
              <AvatarFallback className="text-[8px] font-black bg-blue-900">{p.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black animate-pulse" />
          </div>
        ))}
        <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] ml-1">
          {voiceParticipants.length}/{MAX_SPEAKERS}
        </Badge>
      </div>

      {/* Controls */}
      {inVoice ? (
        <>
          <button
            onClick={toggleMic}
            className={cn(
              "p-1.5 rounded-full transition-all",
              micMuted ? "bg-rose-500/20 text-rose-400" : "bg-white/10 text-white/60 hover:text-white"
            )}
            title={micMuted ? "Unmute" : "Mute"}
          >
            {micMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={toggleDeafen}
            className={cn(
              "p-1.5 rounded-full transition-all",
              deafened ? "bg-rose-500/20 text-rose-400" : "bg-white/10 text-white/60 hover:text-white"
            )}
            title={deafened ? "Undeafen" : "Deafen"}
          >
            {deafened ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={leaveVoice}
            className="p-1.5 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all"
            title="Leave Voice"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <button
          onClick={joinVoice}
          disabled={voiceParticipants.length >= MAX_SPEAKERS}
          className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all disabled:opacity-40"
          title="Join Voice"
        >
          <Phone className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
