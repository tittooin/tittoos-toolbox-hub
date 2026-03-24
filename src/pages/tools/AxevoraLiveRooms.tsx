import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import {
  Activity,
  Copy,
  Crown,
  DoorClosed,
  DoorOpen,
  Hand,
  ImagePlus,
  Link2,
  Loader2,
  Mic,
  MicOff,
  Pin,
  Radio,
  Send,
  Share2,
  Shield,
  Sparkles,
  Star,
  Trophy,
  UserMinus,
  Users,
  Volume2,
  Waves,
  Zap,
} from "lucide-react";

import ToolTemplate from "../../components/ToolTemplate";
import AuthButton from "@/components/comments/AuthButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { auth, db } from "@/lib/firebase";
import { DEDICATION_TYPE_OPTIONS } from "@/lib/dedications";
import { SocialLobbyView } from "@/components/live-rooms/SocialLobbyView";
import { GlobalRoomView } from "@/components/live-rooms/GlobalRoomView";
import { GiftPanel } from "@/components/live-rooms/GiftPanel";
import { CoinStoreModal } from "@/components/live-rooms/CoinStoreModal";
import { LiveChatShell } from "@/components/live-rooms/LiveChatShell";
import {
  CRICKET_REACTIONS,
  LIVE_MOODS,
  ROOM_THEMES,
  buildConnectionId,
  buildLiveRoomProfile,
  buildParticipant,
  buildRoomCode,
  buildRoomEventPreview,
  getDedicationTypeMeta,
  getMoodAccentStyle,
  getMoodMeta,
  getThemeMeta,
  normalizeRoomCode,
  type LivePeerPayload,
  type LiveMoodId,
  type LiveRoom,
  type LiveRoomDedication,
  type LiveRoomEvent,
  type LiveRoomParticipant,
  type LiveRoomProfile,
  type LiveSignalDoc,
  type MicState,
  type LiveRoomThemeId,
  type TypingState,
} from "@/lib/liveRooms";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { cricbuzzApi, type CricketMatch } from "@/lib/cricbuzzApi";

const DEFAULT_DEDICATION: LiveRoomDedication = {
  kind: "song",
  title: "",
  creatorName: "",
  resourceUrl: "",
  coverUrl: "",
  note: "",
  moodId: "soft",
};

const CRICKET_TEAMS = ["CSK", "MI", "RCB", "KKR", "INDIA", "Any side"];
const LIVE_IMAGE_MAX_BYTES = 350 * 1024;

function formatRoomTime(value?: { toDate?: () => Date } | null) {
  if (!value?.toDate) return "just now";
  return value.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function isInlineImageUrl(value?: string) {
  return Boolean(value && value.startsWith("data:image/"));
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${bytes} B`;
}

function formatMicStateLabel(micState: MicState) {
  if (micState === "requested") return "Hand raised";
  if (micState === "speaker") return "Speaker";
  return "Listener";
}

export default function AxevoraLiveRooms() {
  const [searchParams, setSearchParams] = useSearchParams();
  const roomFromUrl = normalizeRoomCode(searchParams.get("room") || "");

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<LiveRoomProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [roomCodeInput, setRoomCodeInput] = useState(roomFromUrl);
  const [roomName, setRoomName] = useState("Starlight Lounge");
  const [activeRoomCode, setActiveRoomCode] = useState(roomFromUrl);
  const [activeGlobalRoom, setActiveGlobalRoom] = useState<{id: string, name: string} | null>(null);
  const [room, setRoom] = useState<LiveRoom | null>(null);
  const [participants, setParticipants] = useState<LiveRoomParticipant[]>([]);
  const [events, setEvents] = useState<LiveRoomEvent[]>([]);
  const [messageText, setMessageText] = useState("");
  const [dedicationOpen, setDedicationOpen] = useState(false);
  const [dedicationDraft, setDedicationDraft] = useState<LiveRoomDedication>(DEFAULT_DEDICATION);
  const [liveImageName, setLiveImageName] = useState("");
  const [liveImageSize, setLiveImageSize] = useState<number | null>(null);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [sending, setSending] = useState(false);
  const [signalingState, setSignalingState] = useState("Idle");
  const [transportEvents, setTransportEvents] = useState<LiveRoomEvent[]>([]);
  const [connectionStates, setConnectionStates] = useState<Record<string, string>>({});
  // Platform mode: "platform" = new WebSocket Yahoo-style, "classic" = original Firebase private rooms
  const [viewMode, setViewMode] = useState<"platform" | "classic">("platform");
  // Phase 5 state
  const [typingUsers, setTypingUsers] = useState<TypingState[]>([]);
  const [burstItems, setBurstItems] = useState<Array<{ id: string; emoji: string; x: number; y: number; color: string }>>([]);
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [newDedicationId, setNewDedicationId] = useState<string | null>(null);
  
  // Phase 6 state
  const [cricketScoreInput, setCricketScoreInput] = useState("");
  const [updatingScore, setUpdatingScore] = useState(false);
  const [matchAlert, setMatchAlert] = useState<LiveRoomEvent | null>(null);
  
  // Phase B State: Gift Animations
  const [giftAnimationEvent, setGiftAnimationEvent] = useState<LiveRoomEvent | null>(null);
  const [cricketMatches, setCricketMatches] = useState<{ live: CricketMatch[], upcoming: CricketMatch[] }>({ live: [], upcoming: [] });
  const [loadingMatches, setLoadingMatches] = useState(false);
  
  const lastProcessedGiftIdRef = useRef<string | null>(null);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const feedEndRef = useRef<HTMLDivElement | null>(null);
  const joinedPresenceRef = useRef<string>("");
  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const dataChannelsRef = useRef<Record<string, RTCDataChannel>>({});
  const remoteAudioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const remoteStreamsRef = useRef<Record<string, MediaStream>>({});
  const localAudioStreamRef = useRef<MediaStream | null>(null);
  const localCandidateKeysRef = useRef<Record<string, Set<string>>>({});
  const processedSignalRef = useRef<Record<string, { offerApplied: boolean; answerApplied: boolean; offerCandidates: Set<string>; answerCandidates: Set<string> }>>({});

  const themeMeta = getThemeMeta(room?.themeId || "sunset");
  const isDarkRoom = ["midnight", "stadium", "neon", "csk-yellow", "mi-blue", "rcb-red"].includes(room?.themeId || "sunset");
  const myParticipant = participants.find((participant) => participant.uid === user?.uid) || null;
  const isHost = room?.hostUid === user?.uid;
  const onlineParticipants = participants.filter((participant) => participant.isOnline);
  const speakerLimit = room?.speakerLimit || 4;
  const requestedParticipants = onlineParticipants.filter(
    (participant) => participant.role !== "host" && participant.micState === "requested"
  );
  const stageSpeakers = onlineParticipants.filter(
    (participant) => participant.role === "host" || participant.canSpeak
  );
  const guestSpeakers = stageSpeakers.filter((participant) => participant.role !== "host");
  const liveMicParticipants = stageSpeakers.filter((participant) => participant.isMicLive);
  const stageSpotsRemaining = Math.max(speakerLimit - guestSpeakers.length, 0);

  const combinedEvents = useMemo(
    () =>
      [...events, ...transportEvents].sort(
        (a, b) =>
          (a.createdAtMs || a.createdAt?.toDate?.().getTime() || 0) -
          (b.createdAtMs || b.createdAt?.toDate?.().getTime() || 0)
      ),
    [events, transportEvents]
  );
  const stageDedicationEvent = useMemo(
    () =>
      [...combinedEvents]
        .reverse()
        .find((event) => event.type === "dedication" && event.dedication) || null,
    [combinedEvents]
  );

  useEffect(() => {
    if (!combinedEvents.length) return;
    const latestEvent = combinedEvents[combinedEvents.length - 1];
    
    if (latestEvent.type === "gift") {
      const now = Date.now();
      const eventTime = latestEvent.createdAtMs || latestEvent.createdAt?.toDate?.().getTime() || 0;
      const isRecent = now - eventTime < 10000;
      
      if (isRecent && lastProcessedGiftIdRef.current !== latestEvent.id) {
        lastProcessedGiftIdRef.current = latestEvent.id;
        setGiftAnimationEvent(latestEvent);
        const t = setTimeout(() => setGiftAnimationEvent(null), 4000);
        return () => clearTimeout(t);
      }
    }
  }, [combinedEvents]);

  // Firebase Auth State Listener
  useEffect(() => {
    // Safety timeout: Ensure loading state clears even if Firebase hangs
    const timer = setTimeout(() => {
      setProfileLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setProfileLoading(false);
        clearTimeout(timer);
        return;
      }

      void (async () => {
        setProfileLoading(true);
        try {
          const profileRef = doc(db, "live_room_profiles", currentUser.uid);
          const snap = await getDoc(profileRef);

          let nextProfile: LiveRoomProfile;

          if (snap.exists()) {
            nextProfile = snap.data() as LiveRoomProfile;
            if (nextProfile.walletBalance === undefined) {
              nextProfile.walletBalance = 0;
            }
          } else {
            nextProfile = buildLiveRoomProfile(currentUser);
            nextProfile.walletBalance = 0;
          }

          await setDoc(
            profileRef,
            {
              ...nextProfile,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );

          setProfile(nextProfile);
        } catch (error) {
          console.error("Failed to sync live room profile", error);
          toast.error("Could not prepare your live room profile.");
        } finally {
          setProfileLoading(false);
          clearTimeout(timer);
        }
      })();
    });

    // Fetch matches for lobby
    void (async () => {
        setLoadingMatches(true);
        const res = await cricbuzzApi.getAllMatches();
        if (res.success) {
            setCricketMatches({ live: res.data.live, upcoming: res.data.upcoming });
        }
        setLoadingMatches(false);
    })();

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!activeRoomCode || !user || !profile) {
      setRoom(null);
      setParticipants([]);
      setEvents([]);
      return;
    }

    const roomRef = doc(db, "live_rooms", activeRoomCode);
    const participantsQuery = query(
      collection(db, "live_rooms", activeRoomCode, "participants"),
      orderBy("joinedAt", "asc"),
      limit(50)
    );
    const eventsQuery = query(
      collection(db, "live_rooms", activeRoomCode, "events"),
      orderBy("createdAt", "asc"),
      limit(120)
    );

    setSignalingState("Syncing room state");

    const roomUnsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (!snapshot.exists()) {
        setRoom(null);
        setSignalingState("Room unavailable");
        return;
      }

      setRoom({ id: snapshot.id, ...(snapshot.data() as Omit<LiveRoom, "id">) });
      setSignalingState("Live sync active");
    });

    const participantsUnsubscribe = onSnapshot(participantsQuery, (snapshot) => {
      const nextParticipants = snapshot.docs
        .map((item) => ({ uid: item.id, ...item.data() }) as LiveRoomParticipant)
        .sort((a, b) => {
          if (a.role === "host" && b.role !== "host") return -1;
          if (a.role !== "host" && b.role === "host") return 1;
          if (a.isOnline && !b.isOnline) return -1;
          if (!a.isOnline && b.isOnline) return 1;
          return a.displayName.localeCompare(b.displayName);
        });

      setParticipants(nextParticipants);
    });

    const eventsUnsubscribe = onSnapshot(eventsQuery, (snapshot) => {
      const nextEvents = snapshot.docs.map(
        (item) => ({ id: item.id, ...item.data() }) as LiveRoomEvent
      );
      setEvents(nextEvents);
    });

    void (async () => {
      try {
        const roomSnapshot = await getDoc(roomRef);
        if (!roomSnapshot.exists()) return;

        const roomData = roomSnapshot.data() as LiveRoom;
        const role = roomData.hostUid === user.uid ? "host" : "guest";
        const participantRef = doc(db, "live_rooms", activeRoomCode, "participants", user.uid);

        await setDoc(
          participantRef,
          {
            ...buildParticipant(profile, role),
            joinedAt: serverTimestamp(),
            lastSeen: serverTimestamp(),
          },
          { merge: true }
        );

        if (joinedPresenceRef.current !== `${activeRoomCode}:${user.uid}`) {
          joinedPresenceRef.current = `${activeRoomCode}:${user.uid}`;
          await addDoc(collection(db, "live_rooms", activeRoomCode, "events"), {
            type: "system",
            senderUid: user.uid,
            senderName: profile.displayName,
            text: `${profile.displayName} joined the live room.`,
            createdAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error("Failed to join room presence", error);
        toast.error("Could not sync your live room presence.");
      }
    })();

    return () => {
      roomUnsubscribe();
      participantsUnsubscribe();
      eventsUnsubscribe();

      void setDoc(
        doc(db, "live_rooms", activeRoomCode, "participants", user.uid),
        {
          isOnline: false,
          isMicLive: false,
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
    };
  }, [activeRoomCode, profile, user]);

  useEffect(() => {
    if (!activeRoomCode) return;
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events, transportEvents, activeRoomCode]);

  useEffect(() => {
    if (!myParticipant) return;

    if (myParticipant.isMicLive && (myParticipant.canSpeak || isHost)) {
      void startLocalAudio();
      return;
    }

    stopLocalAudio();
  }, [isHost, myParticipant?.canSpeak, myParticipant?.isMicLive]);

  useEffect(() => {
    if (localAudioStreamRef.current) {
      syncLocalStreamToConnections();
    }
  }, [participants.length]);


  const updateConnectionState = (peerUid: string, state: string) => {
    setConnectionStates((current) => ({
      ...current,
      [peerUid]: state,
    }));
  };

  const appendTransportEvent = (event: LiveRoomEvent) => {
    setTransportEvents((current) => {
      if (current.some((item) => item.id === event.id)) {
        return current;
      }
      return [...current, event];
    });
  };

  const getSignalTracker = (connectionId: string) => {
    if (!processedSignalRef.current[connectionId]) {
      processedSignalRef.current[connectionId] = {
        offerApplied: false,
        answerApplied: false,
        offerCandidates: new Set<string>(),
        answerCandidates: new Set<string>(),
      };
    }

    return processedSignalRef.current[connectionId];
  };

  const ensureCandidateSet = (connectionId: string) => {
    if (!localCandidateKeysRef.current[connectionId]) {
      localCandidateKeysRef.current[connectionId] = new Set<string>();
    }

    return localCandidateKeysRef.current[connectionId];
  };

  const bindDataChannel = (peerUid: string, channel: RTCDataChannel) => {
    dataChannelsRef.current[peerUid] = channel;
    updateConnectionState(peerUid, "Data channel connecting");

    channel.onopen = () => {
      updateConnectionState(peerUid, "Live data channel ready");
    };

    channel.onclose = () => {
      updateConnectionState(peerUid, "Data channel closed");
      delete dataChannelsRef.current[peerUid];
    };

    channel.onerror = () => {
      updateConnectionState(peerUid, "Data channel error");
    };

    channel.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as LivePeerPayload;
        if ("event" in payload) {
          appendTransportEvent(payload.event);
          if (payload.kind === "alert") {
            setMatchAlert(payload.event);
            setTimeout(() => setMatchAlert(null), 4000);
          }
        }
      } catch (error) {
        console.error("Failed to parse peer payload", error);
      }
    };
  };

  const attachRemoteStream = (peerUid: string, stream: MediaStream) => {
    remoteStreamsRef.current[peerUid] = stream;
    const audioElement = remoteAudioRefs.current[peerUid];
    if (audioElement) {
      audioElement.srcObject = stream;
      void audioElement.play().catch(() => {});
    }
  };

  const syncLocalStreamToConnections = () => {
    const stream = localAudioStreamRef.current;
    if (!stream) return;

    Object.values(peerConnectionsRef.current).forEach((connection) => {
      const senders = connection.getSenders();
      stream.getTracks().forEach((track) => {
        const alreadyAttached = senders.some((sender) => sender.track?.id === track.id);
        if (!alreadyAttached) {
          connection.addTrack(track, stream);
        }
      });
    });
  };

  const startLocalAudio = async () => {
    if (localAudioStreamRef.current) {
      localAudioStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
      syncLocalStreamToConnections();
      return true;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localAudioStreamRef.current = stream;
      syncLocalStreamToConnections();
      return true;
    } catch (error) {
      console.error("Failed to access microphone", error);
      toast.error("Microphone access was blocked.");
      return false;
    }
  };

  const stopLocalAudio = () => {
    if (!localAudioStreamRef.current) return;
    localAudioStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = false;
    });
  };

  const closePeerConnection = (peerUid: string) => {
    dataChannelsRef.current[peerUid]?.close();
    delete dataChannelsRef.current[peerUid];

    const connection = peerConnectionsRef.current[peerUid];
    if (connection) {
      connection.onicecandidate = null;
      connection.ontrack = null;
      connection.ondatachannel = null;
      connection.close();
      delete peerConnectionsRef.current[peerUid];
    }

    updateConnectionState(peerUid, "Disconnected");
  };

  const closeAllConnections = () => {
    Object.keys(peerConnectionsRef.current).forEach((peerUid) => closePeerConnection(peerUid));
    setConnectionStates({});
    setTransportEvents([]);
    remoteStreamsRef.current = {};
    processedSignalRef.current = {};
    localCandidateKeysRef.current = {};
    if (localAudioStreamRef.current) {
      localAudioStreamRef.current.getTracks().forEach((track) => track.stop());
      localAudioStreamRef.current = null;
    }
  };

  useEffect(() => {
    closeAllConnections();
    joinedPresenceRef.current = "";
  }, [activeRoomCode]);

  const ensurePeerConnection = async (peer: LiveRoomParticipant) => {
    if (!activeRoomCode || !user) return null;
    if (peer.uid === user.uid) return null;
    if (peerConnectionsRef.current[peer.uid]) return peerConnectionsRef.current[peer.uid];

    const connectionId = buildConnectionId(user.uid, peer.uid);
    const signalRef = doc(db, "live_rooms", activeRoomCode, "signals", connectionId);
    const initiator = user.uid < peer.uid;

    const connection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnectionsRef.current[peer.uid] = connection;
    updateConnectionState(peer.uid, initiator ? "Creating live tunnel" : "Waiting for tunnel");

    connection.oniceconnectionstatechange = () => {
      updateConnectionState(peer.uid, `ICE: ${connection.iceConnectionState}`);
    };

    connection.onconnectionstatechange = () => {
      updateConnectionState(peer.uid, `Connection: ${connection.connectionState}`);
    };

    connection.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) {
        attachRemoteStream(peer.uid, stream);
      }
    };

    connection.onicecandidate = (event) => {
      if (!event.candidate) return;

      const candidate = event.candidate.toJSON();
      const candidateKey = JSON.stringify(candidate);
      const sentCandidates = ensureCandidateSet(connectionId);
      if (sentCandidates.has(candidateKey)) return;
      sentCandidates.add(candidateKey);

      void setDoc(
        signalRef,
        {
          [initiator ? "offerCandidates" : "answerCandidates"]: arrayUnion(candidate),
        },
        { merge: true }
      ).catch((error) => {
        console.error("Failed to publish ICE candidate", error);
      });
    };

    connection.ondatachannel = (event) => {
      bindDataChannel(peer.uid, event.channel);
    };

    if (localAudioStreamRef.current) {
      localAudioStreamRef.current.getTracks().forEach((track) => {
        connection.addTrack(track, localAudioStreamRef.current as MediaStream);
      });
    }

    if (initiator) {
      const channel = connection.createDataChannel("axevora-live");
      bindDataChannel(peer.uid, channel);

      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      await setDoc(
        signalRef,
        {
          offer: {
            from: user.uid,
            sdp: offer,
          },
        },
        { merge: true }
      );
    }

    return connection;
  };

  useEffect(() => {
    if (!activeRoomCode || !user) {
      closeAllConnections();
      return;
    }

    const signalUnsubscribers = participants
      .filter((participant) => participant.uid !== user.uid && participant.isOnline)
      .map((participant) => {
        const connectionId = buildConnectionId(user.uid, participant.uid);
        const signalRef = doc(db, "live_rooms", activeRoomCode, "signals", connectionId);

        void ensurePeerConnection(participant).catch((error) => {
          console.error("Failed to prepare peer connection", error);
        });

        return onSnapshot(signalRef, (snapshot) => {
          if (!snapshot.exists()) return;

          const signal = snapshot.data() as LiveSignalDoc;
          const tracker = getSignalTracker(connectionId);

          void (async () => {
            const connection = await ensurePeerConnection(participant);
            if (!connection) return;

            if (signal.offer && signal.offer.from !== user.uid && !tracker.offerApplied) {
              tracker.offerApplied = true;
              await connection.setRemoteDescription(new RTCSessionDescription(signal.offer.sdp));

              const answer = await connection.createAnswer();
              await connection.setLocalDescription(answer);
              await setDoc(
                signalRef,
                {
                  answer: {
                    from: user.uid,
                    sdp: answer,
                  },
                },
                { merge: true }
              );
            }

            if (signal.answer && signal.answer.from !== user.uid && !tracker.answerApplied) {
              tracker.answerApplied = true;
              await connection.setRemoteDescription(new RTCSessionDescription(signal.answer.sdp));
            }

            const offerCandidates = signal.offerCandidates || [];
            offerCandidates.forEach((candidate) => {
              const candidateKey = JSON.stringify(candidate);
              if (tracker.offerCandidates.has(candidateKey) || signal.offer?.from === user.uid) return;
              tracker.offerCandidates.add(candidateKey);
              void connection.addIceCandidate(new RTCIceCandidate(candidate as RTCIceCandidateInit));
            });

            const answerCandidates = signal.answerCandidates || [];
            answerCandidates.forEach((candidate) => {
              const candidateKey = JSON.stringify(candidate);
              if (tracker.answerCandidates.has(candidateKey) || signal.answer?.from === user.uid) return;
              tracker.answerCandidates.add(candidateKey);
              void connection.addIceCandidate(new RTCIceCandidate(candidate as RTCIceCandidateInit));
            });
          })().catch((error) => {
            console.error("Failed to apply signaling snapshot", error);
          });
        });
      });

    return () => {
      signalUnsubscribers.forEach((unsubscribe) => unsubscribe());

      const onlinePeerIds = new Set(
        participants.filter((participant) => participant.uid !== user.uid && participant.isOnline).map((participant) => participant.uid)
      );

      Object.keys(peerConnectionsRef.current).forEach((peerUid) => {
        if (!onlinePeerIds.has(peerUid)) {
          closePeerConnection(peerUid);
        }
      });
    };
  }, [activeRoomCode, participants, user]);

  const createRoom = async () => {
    if (!user || !profile) {
      toast.error("Sign in first to start a live room.");
      return;
    }

    setCreatingRoom(true);
    const roomCode = buildRoomCode(user.uid);
    const nextRoomName = roomName.trim() || "Starlight Lounge";

    try {
      await setDoc(doc(db, "live_rooms", roomCode), {
        roomCode,
        roomName: nextRoomName,
        hostUid: user.uid,
        hostName: profile.displayName,
        themeId: "sunset",
        cricketMode: false,
        joinLocked: false,
        micRequestsOpen: true,
        speakerLimit: 4,
        status: "live",
        createdAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "live_rooms", roomCode, "participants", user.uid),
        {
          ...buildParticipant(profile, "host"),
          joinedAt: serverTimestamp(),
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(collection(db, "live_rooms", roomCode, "events"), {
        type: "system",
        senderUid: user.uid,
        senderName: profile.displayName,
        text: `${profile.displayName} opened ${nextRoomName}.`,
        createdAt: serverTimestamp(),
      });

      setActiveRoomCode(roomCode);
      setRoomCodeInput(roomCode);
      setActiveGlobalRoom(null); // Clear global room when creating private
      setSearchParams({ room: roomCode });
      toast.success("Live room created.");
    } catch (error) {
      console.error("Failed to create room", error);
      toast.error("Could not create the room right now.");
    } finally {
      setCreatingRoom(false);
    }
  };

  const joinRoom = async () => {
    const normalized = normalizeRoomCode(roomCodeInput);
    if (!normalized) {
      toast.error("Enter a valid room code.");
      return;
    }

    if (!user || !profile) {
      toast.error("Sign in first to join a live room.");
      return;
    }

    setJoiningRoom(true);

    try {
      const roomRef = doc(db, "live_rooms", normalized);
      const snapshot = await getDoc(roomRef);

      if (!snapshot.exists()) {
        toast.error("No live room found for this code.");
        return;
      }

      const roomData = snapshot.data() as LiveRoom;
      if (roomData.joinLocked && roomData.hostUid !== user.uid) {
        toast.error("This room is locked by the host right now.");
        return;
      }

      setActiveRoomCode(normalized);
      setRoomCodeInput(normalized);
      setActiveGlobalRoom(null); // Clear global room when joining private
      setSearchParams({ room: normalized });
      toast.success("Joined live room.");
    } catch (error) {
      console.error("Failed to join room", error);
      toast.error("Could not join this room.");
    } finally {
      setJoiningRoom(false);
    }
  };

  const copyRoomCode = async () => {
    if (!activeRoomCode) return;

    try {
      await navigator.clipboard.writeText(activeRoomCode);
      toast.success("Room code copied.");
    } catch (error) {
      console.error("Copy room code failed", error);
      toast.error("Clipboard copy failed.");
    }
  };

  const sendEvent = async (payload: Omit<LiveRoomEvent, "id">) => {
    if (!activeRoomCode) return;
    await addDoc(collection(db, "live_rooms", activeRoomCode, "events"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  };

  const broadcastPeerPayload = (payload: LivePeerPayload) => {
    Object.values(dataChannelsRef.current).forEach((channel) => {
      if (channel.readyState === "open") {
        channel.send(JSON.stringify(payload));
      }
    });
  };

  const emitLivePayload = (payload: LivePeerPayload) => {
    if ("event" in payload) {
      appendTransportEvent(payload.event);
    }
    broadcastPeerPayload(payload);
  };

  const resetDedicationComposer = () => {
    setDedicationDraft(DEFAULT_DEDICATION);
    setLiveImageName("");
    setLiveImageSize(null);
  };

  const handleLiveImageSelection = (file: File | undefined) => {
    if (!file) {
      setLiveImageName("");
      setLiveImageSize(null);
      setDedicationDraft((current) => ({
        ...current,
        coverUrl: "",
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are supported for live drops.");
      return;
    }

    if (file.size > LIVE_IMAGE_MAX_BYTES) {
      toast.error(`Keep live image drops under ${formatFileSize(LIVE_IMAGE_MAX_BYTES)} for fast P2P sharing.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        toast.error("Image preview could not be prepared.");
        return;
      }

      setLiveImageName(file.name);
      setLiveImageSize(file.size);
      setDedicationDraft((current) => ({
        ...current,
        coverUrl: result,
        title: current.title || file.name.replace(/\.[^.]+$/, ""),
      }));
    };
    reader.onerror = () => {
      toast.error("Image preview could not be prepared.");
    };
    reader.readAsDataURL(file);
  };

  const sendChat = async () => {
    const trimmed = messageText.trim();
    if (!trimmed || !user || !profile || !activeRoomCode) return;

    setSending(true);
    try {
      emitLivePayload({
        kind: "chat",
        event: {
          id: `peer-chat-${user.uid}-${Date.now()}`,
          type: "chat",
          senderUid: user.uid,
          senderName: profile.displayName,
          text: trimmed,
          createdAtMs: Date.now(),
        },
      });
      setMessageText("");
    } catch (error) {
      console.error("Failed to send chat event", error);
      toast.error("Chat send failed.");
    } finally {
      setSending(false);
    }
  };

  const sendDedication = async () => {
    if (!user || !profile || !activeRoomCode) return;
    if (!dedicationDraft.title.trim()) {
      toast.error("Dedication title is required.");
      return;
    }
    if (dedicationDraft.kind === "image" && !dedicationDraft.coverUrl.trim() && !dedicationDraft.resourceUrl.trim()) {
      toast.error("Add a live image or image link before sending.");
      return;
    }

    const cleanedDedication: LiveRoomDedication = {
      ...dedicationDraft,
      title: dedicationDraft.title.trim(),
      creatorName: dedicationDraft.creatorName.trim(),
      resourceUrl: dedicationDraft.resourceUrl.trim(),
      coverUrl: dedicationDraft.coverUrl.trim(),
      note: dedicationDraft.note.trim(),
    };

    setSending(true);
    try {
      emitLivePayload({
        kind: "dedication",
        event: {
          id: `peer-dedication-${user.uid}-${Date.now()}`,
          type: "dedication",
          senderUid: user.uid,
          senderName: profile.displayName,
          text: buildRoomEventPreview("dedication", cleanedDedication.note, cleanedDedication.title),
          dedication: cleanedDedication,
          createdAtMs: Date.now(),
        },
      });
      resetDedicationComposer();
      setDedicationOpen(false);
      toast.success("Live dedication dropped.");
    } catch (error) {
      console.error("Failed to send dedication", error);
      toast.error("Dedication send failed.");
    } finally {
      setSending(false);
    }
  };

  const updateRoomTheme = async (themeId: LiveRoomThemeId) => {
    if (!isHost || !activeRoomCode) return;

    try {
      await updateDoc(doc(db, "live_rooms", activeRoomCode), {
        themeId,
      });
      await sendEvent({
        type: "system",
        senderUid: user?.uid || "",
        senderName: profile?.displayName || "Host",
        text: `Room theme switched to ${getThemeMeta(themeId).name}.`,
      });
    } catch (error) {
      console.error("Failed to update room theme", error);
      toast.error("Theme update failed.");
    }
  };

  const updateMood = async (moodId: LiveMoodId) => {
    if (!activeRoomCode || !user) return;

    try {
      await updateDoc(doc(db, "live_rooms", activeRoomCode, "participants", user.uid), {
        moodId,
        lastSeen: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to update mood", error);
      toast.error("Mood update failed.");
    }
  };

  const requestMic = async () => {
    if (!activeRoomCode || !user || !myParticipant) return;
    if (room?.micRequestsOpen === false) {
      toast.error("Host has paused mic requests for now.");
      return;
    }

    try {
      await updateDoc(doc(db, "live_rooms", activeRoomCode, "participants", user.uid), {
        micState: "requested",
      });
      await sendEvent({
        type: "system",
        senderUid: user.uid,
        senderName: profile?.displayName || "Guest",
        text: `${profile?.displayName || "A guest"} requested speaker access.`,
      });
      toast.success("Mic request sent to host.");
    } catch (error) {
      console.error("Failed to request mic", error);
      toast.error("Mic request failed.");
    }
  };

  const setSpeakerAccess = async (participant: LiveRoomParticipant, allow: boolean) => {
    if (!activeRoomCode || !isHost) return;
    if (allow && !participant.canSpeak && guestSpeakers.length >= speakerLimit) {
      toast.error(`Stage is full right now. Limit is ${speakerLimit} guest speakers.`);
      return;
    }

    try {
      await updateDoc(doc(db, "live_rooms", activeRoomCode, "participants", participant.uid), {
        canSpeak: allow,
        micState: allow ? "speaker" : "listener",
        isMicLive: false,
      });
      await sendEvent({
        type: "system",
        senderUid: user?.uid || "",
        senderName: profile?.displayName || "Host",
        text: allow
          ? `${participant.displayName} was invited to the mic stage.`
          : `${participant.displayName} was moved back to listener mode.`,
      });
    } catch (error) {
      console.error("Failed to set speaker access", error);
      toast.error("Speaker access update failed.");
    }
  };

  const declineMicRequest = async (participant: LiveRoomParticipant) => {
    if (!activeRoomCode || !isHost) return;

    try {
      await updateDoc(doc(db, "live_rooms", activeRoomCode, "participants", participant.uid), {
        canSpeak: false,
        micState: "listener",
        isMicLive: false,
      });
      await sendEvent({
        type: "system",
        senderUid: user?.uid || "",
        senderName: profile?.displayName || "Host",
        text: `${participant.displayName}'s hand raise was cleared by the host.`,
      });
    } catch (error) {
      console.error("Failed to decline mic request", error);
      toast.error("Could not clear this mic request.");
    }
  };

  const muteParticipantMic = async (participant: LiveRoomParticipant) => {
    if (!activeRoomCode || !isHost) return;

    try {
      await updateDoc(doc(db, "live_rooms", activeRoomCode, "participants", participant.uid), {
        isMicLive: false,
      });
      await sendEvent({
        type: "system",
        senderUid: user?.uid || "",
        senderName: profile?.displayName || "Host",
        text: `${participant.displayName} was muted on the voice stage.`,
      });
    } catch (error) {
      console.error("Failed to mute participant mic", error);
      toast.error("Mute action failed.");
    }
  };

  const muteAllGuests = async () => {
    if (!activeRoomCode || !isHost || guestSpeakers.length === 0) return;

    try {
      await Promise.all(
        guestSpeakers.map((participant) =>
          updateDoc(doc(db, "live_rooms", activeRoomCode, "participants", participant.uid), {
            isMicLive: false,
          })
        )
      );
      await sendEvent({
        type: "system",
        senderUid: user?.uid || "",
        senderName: profile?.displayName || "Host",
        text: "Host muted all guest stage mics.",
      });
      toast.success("All guest stage mics muted.");
    } catch (error) {
      console.error("Failed to mute all guests", error);
      toast.error("Could not mute all guest mics.");
    }
  };

  const toggleJoinLock = async () => {
    if (!activeRoomCode || !isHost || !room) return;
    const joinLocked = room.joinLocked ?? false;

    try {
      await updateDoc(doc(db, "live_rooms", activeRoomCode), {
        joinLocked: !joinLocked,
      });
      await sendEvent({
        type: "system",
        senderUid: user?.uid || "",
        senderName: profile?.displayName || "Host",
        text: !joinLocked
          ? "Host locked the room for new joins."
          : "Host reopened the room for new joins.",
      });
    } catch (error) {
      console.error("Failed to toggle join lock", error);
      toast.error("Room lock update failed.");
    }
  };

  const toggleMicRequests = async () => {
    if (!activeRoomCode || !isHost || !room) return;
    const micRequestsOpen = room.micRequestsOpen ?? true;

    try {
      await updateDoc(doc(db, "live_rooms", activeRoomCode), {
        micRequestsOpen: !micRequestsOpen,
      });
      await sendEvent({
        type: "system",
        senderUid: user?.uid || "",
        senderName: profile?.displayName || "Host",
        text: !micRequestsOpen
          ? "Host reopened raise-hand requests."
          : "Host paused new raise-hand requests.",
      });
    } catch (error) {
      console.error("Failed to toggle mic requests", error);
      toast.error("Mic request gate update failed.");
    }
  };

  const toggleMicLive = async () => {
    if (!activeRoomCode || !user || !myParticipant) return;
    if (!myParticipant.canSpeak && !isHost) {
      toast.error("Host speaker access required first.");
      return;
    }

    try {
      await updateDoc(doc(db, "live_rooms", activeRoomCode, "participants", user.uid), {
        isMicLive: !myParticipant.isMicLive,
        micState: "speaker",
      });
      if (!myParticipant.isMicLive) {
        const ready = await startLocalAudio();
        if (!ready) return;
      } else {
        stopLocalAudio();
      }
      broadcastPeerPayload({
        kind: "presence",
        senderUid: user.uid,
        senderName: profile?.displayName || "Speaker",
        micLive: !myParticipant.isMicLive,
        canSpeak: true,
      });
      await sendEvent({
        type: "system",
        senderUid: user.uid,
        senderName: profile?.displayName || "Speaker",
        text: !myParticipant.isMicLive
          ? `${profile?.displayName || "Speaker"} switched mic live.`
          : `${profile?.displayName || "Speaker"} muted the mic.`,
      });
    } catch (error) {
      console.error("Failed to toggle mic live", error);
      toast.error("Mic toggle failed.");
    }
  };

  const toggleCricketMode = async () => {
    if (!activeRoomCode || !isHost || !room) return;

    try {
      await updateDoc(doc(db, "live_rooms", activeRoomCode), {
        cricketMode: !room.cricketMode,
      });
      await sendEvent({
        type: "system",
        senderUid: user?.uid || "",
        senderName: profile?.displayName || "Host",
        text: !room.cricketMode ? "Cricket mode is live." : "Cricket mode was paused.",
      });
    } catch (error) {
      console.error("Failed to toggle cricket mode", error);
      toast.error("Cricket mode update failed.");
    }
  };

  const sendCricketReaction = async (label: string, emoji: string, color: string) => {
    if (!activeRoomCode || !user || !profile) return;

    // Burst animation
    const burstId = `burst-${Date.now()}`;
    const rx = 20 + Math.random() * 60;
    const ry = 20 + Math.random() * 50;
    setBurstItems((prev) => [...prev, { id: burstId, emoji, x: rx, y: ry, color }]);
    setTimeout(() => setBurstItems((prev) => prev.filter((b) => b.id !== burstId)), 1800);

    try {
      emitLivePayload({
        kind: "cricket",
        event: {
          id: `peer-cricket-${user.uid}-${Date.now()}`,
          type: "cricket",
          senderUid: user.uid,
          senderName: profile.displayName,
          text: label,
          cricketTeam: emoji,
          createdAtMs: Date.now(),
        },
      });
    } catch (error) {
      console.error("Failed to send cricket reaction", error);
      toast.error("Reaction send failed.");
    }
  };

  const updateCricketScore = async () => {
    if (!activeRoomCode || !isHost) return;
    setUpdatingScore(true);
    try {
      await updateDoc(doc(db, "live_rooms", activeRoomCode), {
        cricketScore: cricketScoreInput,
      });
      toast.success("Score pinned to room");
    } catch (error) {
      console.error("Failed to update score", error);
      toast.error("Could not update score");
    } finally {
      setUpdatingScore(false);
    }
  };

  const sendMatchAlert = (type: "wicket" | "four" | "six" | "milestone", label: string) => {
    if (!activeRoomCode || !isHost || !user || !profile) return;
    
    // Show locally
    const alertEvent: LiveRoomEvent = {
       id: `peer-alert-${user.uid}-${Date.now()}`,
       type: "cricket",
       senderUid: user.uid,
       senderName: profile.displayName,
       alertType: type,
       text: label,
       createdAtMs: Date.now(),
    };
    
    setMatchAlert(alertEvent);
    setTimeout(() => setMatchAlert(null), 4000);

    try {
      emitLivePayload({
        kind: "alert",
        event: alertEvent,
      });
    } catch (error) {
      console.error("Failed to send match alert", error);
      toast.error("Alert send failed.");
    }
  };

  // Typing indicator helpers
  const publishTyping = useCallback(async () => {
    if (!activeRoomCode || !user || !profile) return;
    try {
      await setDoc(
        doc(db, "live_rooms", activeRoomCode, "typing", user.uid),
        { uid: user.uid, displayName: profile.displayName, typingAt: Date.now() },
        { merge: true }
      );
    } catch (_) { /* silent */ }
  }, [activeRoomCode, profile, user]);

  const clearTyping = useCallback(async () => {
    if (!activeRoomCode || !user) return;
    try {
      await deleteDoc(doc(db, "live_rooms", activeRoomCode, "typing", user.uid));
    } catch (_) { /* silent */ }
  }, [activeRoomCode, user]);

  const handleMessageInput = (value: string) => {
    setMessageText(value);
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      void publishTyping();
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      void clearTyping();
    }, 2500);
  };

  // Copy invite link
  const copyInviteLink = async () => {
    if (!activeRoomCode) return;
    const url = `${window.location.origin}/tools/axevora-live-rooms?room=${activeRoomCode}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Invite link copied!");
    } catch (_) {
      toast.error("Clipboard copy failed.");
    }
  };

  // Typing state Firestore listener
  useEffect(() => {
    if (!activeRoomCode || !user) { setTypingUsers([]); return; }
    const typingQuery = query(collection(db, "live_rooms", activeRoomCode, "typing"));
    const unsub = onSnapshot(typingQuery, (snap) => {
      const now = Date.now();
      const fresh = snap.docs
        .map((d) => d.data() as TypingState)
        .filter((t) => t.uid !== user.uid && now - t.typingAt < 4000);
      setTypingUsers(fresh);
    });
    return () => unsub();
  }, [activeRoomCode, user]);

  // Track new dedications for card-reveal animation
  useEffect(() => {
    const latest = stageDedicationEvent;
    if (!latest) return;
    setNewDedicationId(latest.id);
    const t = setTimeout(() => setNewDedicationId(null), 900);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageDedicationEvent?.id]);

  return (
    <ToolTemplate
      title="Axevora Live Rooms"
      description="Create private multi-user live rooms for chats, dedications, host-controlled mic moments, mood themes, and cricket watch-party energy."
      icon={Radio}
      content={`
        <h2>Live Rooms Built For Shared Time, Not Stored Messages</h2>
        <p>Axevora Live Rooms is the new real-time social layer for your platform. Instead of inbox-first messaging, this feature is designed for live presence, host-led sessions, dedication cards, and mood-rich room experiences.</p>
        <p>The current phase adds direct peer-to-peer tunnels, live mic transport groundwork, raise-hand queue management, host moderation controls, and lightweight image drops for on-the-spot sharing. It remains isolated from the existing platform so no current tool logic is affected.</p>
      `}
      features={[
        "Private room creation and join by code",
        "Multi-user live presence with host badge and speaker states",
        "Live room feed for chat, dedications, and cricket reactions",
        "Stage spotlight for the latest dedication moment",
        "Raise-hand queue with host approvals, declines, and mute controls",
        "Small live image drops over direct peer-to-peer transport",
        "Mood and theme switching for expressive room visuals",
        "Host-controlled mic invitations and speaker access flow",
      ]}
    >
      {/* ────────────── MODE SWITCHER ────────────── */}
      <div className="flex items-center gap-2 mb-6 p-1 rounded-2xl bg-white/5 border border-white/10 w-fit">
        <button
          onClick={() => setViewMode("platform")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            viewMode === "platform"
              ? "bg-blue-600 text-white shadow-lg"
              : "text-white/40 hover:text-white/70"
          )}
        >
          <Radio className="w-3.5 h-3.5" />
          Live Platform
        </button>
        <button
          onClick={() => setViewMode("classic")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
            viewMode === "classic"
              ? "bg-blue-600 text-white shadow-lg"
              : "text-white/40 hover:text-white/70"
          )}
        >
          <Crown className="w-3.5 h-3.5" />
          Private Stages
        </button>
      </div>

      {/* ────────────── PLATFORM MODE — Yahoo-style WebSocket Chat ────────────── */}
      {viewMode === "platform" && (
        <LiveChatShell
          user={user}
          userCoins={profile?.walletBalance || 0}
          onAddCoins={(amount) => {
            if (profile) setProfile({ ...profile, walletBalance: (profile.walletBalance || 0) + amount });
          }}
          onJoinCricketRoom={() => {
            // Switch to classic mode and auto-join cricket room
            setViewMode("classic");
          }}
        />
      )}

      {/* ────────────── CLASSIC MODE — Original Firebase Rooms ────────────── */}
      {viewMode === "classic" && (
        <>
      {/* Burst animation overlay */}
      <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
        {burstItems.map((burst) => (
          <div
            key={burst.id}
            className="absolute flex animate-bounce items-center justify-center rounded-full px-4 py-2 text-2xl font-black shadow-xl"
            style={{
              left: `${burst.x}%`,
              top: `${burst.y}%`,
              background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
              animation: "burstFly 1.8s ease-out forwards",
            }}
          >
            {burst.emoji}
          </div>
        ))}
      </div>

      {/* Match Alert Overlay */}
      {matchAlert && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="animate-in zoom-in-50 duration-500 max-w-2xl w-full mx-4 overflow-hidden rounded-[40px] border-4 border-white/20 bg-[linear-gradient(135deg,#020617,#1e1b4b)] shadow-2xl p-10 text-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.15),transparent_70%)]" />
            <h2 className="relative z-10 text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 tracking-tight drop-shadow-lg uppercase italic transform -skew-x-6">
              {matchAlert.text}
            </h2>
            <p className="relative z-10 mt-6 text-xl font-medium text-white/50 tracking-widest uppercase">
              Match Alert
            </p>
          </div>
        </div>
      )}

      {/* Gift Animation Overlay */}
      {giftAnimationEvent && giftAnimationEvent.payload && (
        <div className="fixed inset-0 z-[2000] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500" />
          <div className="relative flex flex-col items-center animate-in zoom-in-50 duration-700 ease-out">
            <div className="text-[12rem] md:text-[20rem] drop-shadow-[0_0_40px_rgba(251,191,36,0.6)] animate-bounce" style={{ animationDuration: '2s' }}>
              {giftAnimationEvent.payload.giftIcon}
            </div>
            <div className="mt-4 bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500 text-transparent bg-clip-text text-4xl md:text-6xl font-black drop-shadow-2xl text-center px-6 py-2">
              {giftAnimationEvent.senderName} sent a {giftAnimationEvent.payload.giftName}!
            </div>
          </div>
        </div>
      )}

      {/* Main View Selection Flow */}
      {profileLoading && (
        <Card className="border mx-auto max-w-5xl mt-8 animate-pulse shadow-md">
          <CardContent className="flex min-h-[320px] items-center justify-center">
            <div className="flex items-center gap-4 text-sm font-semibold text-sky-600 dark:text-sky-400">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="tracking-wide">Preparing your live room identity...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!profileLoading && !activeRoomCode && !activeGlobalRoom && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Featured Matches Arena */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-400" />
                  Live Cricket Arenas
                </h2>
                <p className="text-white/40 text-sm">Join a match-specific lounge for real-time scores and squads.</p>
              </div>
              {loadingMatches && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
                {/* Live Matches */}
                {cricketMatches.live.map(match => (
                    <Card key={match.id} className="bg-[#1e293b]/40 border-emerald-500/20 backdrop-blur-xl overflow-hidden group hover:border-emerald-500/40 transition-all">
                        <CardHeader className="pb-2">
                            <Badge className="w-fit bg-emerald-500 text-white mb-2 animate-pulse">LIVE NOW</Badge>
                            <CardTitle className="text-white text-lg">{match.team_a} vs {match.team_b}</CardTitle>
                            <CardDescription className="text-white/40 font-bold uppercase text-[10px] tracking-widest">{match.series_name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-emerald-400 mb-4">{match.last_score || "0/0"}</div>
                            <Button 
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black"
                                onClick={() => setActiveGlobalRoom({ id: `cricket_${match.id}`, name: `${match.team_a} vs ${match.team_b} Lounge` })}
                            >
                                Join Live Arena
                            </Button>
                        </CardContent>
                    </Card>
                ))}

                {/* Upcoming Matches */}
                {cricketMatches.upcoming.slice(0, 6).map(match => (
                    <Card key={match.id} className="bg-[#1e293b]/40 border-white/10 backdrop-blur-xl overflow-hidden hover:border-blue-500/40 transition-all">
                        <CardHeader className="pb-2">
                            <Badge variant="outline" className="w-fit text-blue-400 border-blue-400/20 mb-2">UPCOMING</Badge>
                            <CardTitle className="text-white text-lg">{match.team_a} vs {match.team_b}</CardTitle>
                            <CardDescription className="text-white/40 font-bold uppercase text-[10px] tracking-widest">{match.series_name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-white/60 mb-4">{new Date(match.start_time).toLocaleString()}</div>
                            <Button 
                                variant="outline"
                                className="w-full border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10 font-black"
                                onClick={() => setActiveGlobalRoom({ id: `cricket_${match.id}`, name: `${match.team_a} vs ${match.team_b} Lounge` })}
                            >
                                Register Pre-Match
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
          </div>

          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0f172a] px-3 text-white/20 text-xs font-bold uppercase tracking-widest">Or create a private room</span>
            </div>
          </div>

          <SocialLobbyView 
            user={user} 
            profile={profile} 
            roomName={roomName} 
            setRoomName={setRoomName} 
            roomCodeInput={roomCodeInput} 
            setRoomCodeInput={setRoomCodeInput} 
            creatingRoom={creatingRoom} 
            joiningRoom={joiningRoom} 
            onCreateRoom={createRoom} 
            onJoinRoom={joinRoom} 
            onJoinGlobalRoom={(id, name) => {
              setActiveGlobalRoom({ id, name });
              setActiveRoomCode("");
            }}
          />
        </div>
      )}

      {!profileLoading && activeGlobalRoom && (
        <GlobalRoomView
          user={user}
          roomId={activeGlobalRoom.id}
          roomName={activeGlobalRoom.name}
          onLeave={() => setActiveGlobalRoom(null)}
        />
      )}

      {!profileLoading && activeRoomCode && !activeGlobalRoom && (
        <>
          <div className={cn("space-y-6 rounded-[32px] border p-4 md:p-6", themeMeta.shellClass, isDarkRoom ? "border-white/10" : "border-rose-100")}>
          <div className={cn("rounded-[28px] border p-6 shadow-sm", themeMeta.panelClass)}>
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-3">
                <Badge className={cn("rounded-full", isDarkRoom ? "bg-white/15 text-white hover:bg-white/15" : "bg-slate-950 text-white hover:bg-slate-950")}>
                  <Zap className="mr-1 h-3 w-3" />
                  Live
                </Badge>
                <div>
                  <h2 className={cn("text-3xl font-semibold tracking-tight", isDarkRoom ? "text-white" : "text-slate-950")}>
                    Live private rooms with mood, mic queue, and dedication energy
                  </h2>
                  <p className={cn("mt-3 max-w-3xl text-sm leading-6", isDarkRoom ? "text-white/75" : "text-slate-600")}>
                    This module is built as a shared-time experience. Users join the same private room, chat live, dedicate media cards, react to cricket moments, and let the host shape the session mood.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className={cn("rounded-2xl border px-4 py-3", isDarkRoom ? "border-white/10 bg-white/10" : "border-slate-200 bg-white/80")}>
                  <p className="text-xs uppercase tracking-[0.22em] text-emerald-500">Room sync</p>
                  <p className={cn("mt-2 text-sm font-medium", isDarkRoom ? "text-white" : "text-slate-900")}>{signalingState}</p>
                </div>
                <div className={cn("rounded-2xl border px-4 py-3", isDarkRoom ? "border-white/10 bg-white/10" : "border-slate-200 bg-white/80")}>
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-500">Online now</p>
                  <p className={cn("mt-2 text-sm font-medium", isDarkRoom ? "text-white" : "text-slate-900")}>{onlineParticipants.length} users</p>
                </div>
                <div className={cn("rounded-2xl border px-4 py-3", isDarkRoom ? "border-white/10 bg-white/10" : "border-slate-200 bg-white/80")}>
                  <p className="text-xs uppercase tracking-[0.22em] text-amber-500">Cricket mode</p>
                  <p className={cn("mt-2 text-sm font-medium", isDarkRoom ? "text-white" : "text-slate-900")}>{room?.cricketMode ? "Active" : "Standby"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <Card className={cn("border shadow-sm", themeMeta.panelClass)}>
                <CardHeader>
                  <CardTitle className={cn("text-lg", isDarkRoom ? "text-white" : "text-slate-950")}>Identity and access</CardTitle>
                  <CardDescription className={isDarkRoom ? "text-white/60" : undefined}>
                    Sign in, create a room, or join one with a live code.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AuthButton user={user} />

                  {profile ? (
                    <div className={cn("rounded-2xl border p-3", isDarkRoom ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80")}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11">
                          <AvatarImage src={profile.photoURL} />
                          <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className={cn("truncate font-medium", isDarkRoom ? "text-white" : "text-slate-950")}>{profile.displayName}</p>
                          <p className={cn("text-xs", isDarkRoom ? "text-white/60" : "text-slate-500")}>Live room share ID: {profile.shareCode}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {room ? (
                    <div className={cn("rounded-3xl border p-5 shadow-sm", isDarkRoom ? "border-emerald-400/20 bg-[linear-gradient(145deg,rgba(16,185,129,0.1),rgba(5,46,22,0.4))]" : "border-emerald-200 bg-[linear-gradient(145deg,#ecfdf5,#f0fdf4)]")}>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                          <Link2 className="h-4 w-4" />
                        </div>
                        <p className={cn("text-xs uppercase tracking-[0.2em] font-semibold", isDarkRoom ? "text-emerald-400" : "text-emerald-600")}>
                          Active Room Live
                        </p>
                      </div>
                      <div className="mt-4">
                        <p className={cn("text-xl font-bold tracking-tight", isDarkRoom ? "text-white" : "text-slate-950")}>{room.roomName}</p>
                        <p className={cn("mt-1 text-sm font-medium", isDarkRoom ? "text-emerald-400/80" : "text-emerald-600")}>Code: {room.roomCode}</p>
                      </div>
                      <div className="mt-5 grid sm:grid-cols-2 gap-3">
                        <Button type="button" variant={isDarkRoom ? "secondary" : "outline"} className="w-full rounded-xl" onClick={copyRoomCode}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Code
                        </Button>
                        <Button type="button" className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white" onClick={copyInviteLink}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Invite Link
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card className={cn("border shadow-sm", themeMeta.panelClass)}>
                <CardHeader>
                  <CardTitle className={cn("text-lg", isDarkRoom ? "text-white" : "text-slate-950")}>People in room</CardTitle>
                  <CardDescription className={isDarkRoom ? "text-white/60" : undefined}>
                    Host comes first, then live participants.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[420px] pr-4">
                    <div className="space-y-3">
                      {participants.length > 0 ? (
                        participants.map((participant) => {
                          const moodMeta = getMoodMeta(participant.moodId);
                          const canHostAct = isHost && participant.uid !== user?.uid && participant.role !== "host";

                          return (
                            <div
                              key={participant.uid}
                              className={cn("rounded-2xl border p-3", isDarkRoom ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80")}
                            >
                              <div className="flex items-start gap-3">
                                <div className="relative">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={participant.photoURL} />
                                    <AvatarFallback>{participant.displayName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  {participant.isMicLive && (
                                    <span className="absolute -inset-1 animate-pulse rounded-full border-2 border-emerald-400/60" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className={cn("truncate font-medium", isDarkRoom ? "text-white" : "text-slate-900")}>
                                      {participant.displayName}
                                    </p>
                                    {participant.role === "host" ? (
                                      <Badge className="rounded-full bg-amber-500 text-black hover:bg-amber-500">
                                        <Crown className="mr-1 h-3 w-3" />
                                        Host
                                      </Badge>
                                    ) : null}
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="rounded-full">
                                      Mood: {moodMeta.name}
                                    </Badge>
                                    <Badge variant="secondary" className="rounded-full">
                                      {participant.isOnline ? "Online" : "Away"}
                                    </Badge>
                                    <Badge variant="outline" className="rounded-full">
                                      {formatMicStateLabel(participant.micState)}
                                    </Badge>
                                    {participant.isMicLive ? (
                                      <Badge className="rounded-full bg-emerald-500 text-white hover:bg-emerald-500">
                                        <Mic className="mr-1 h-3 w-3" />
                                        Mic live
                                      </Badge>
                                    ) : null}
                                  </div>
                                  {canHostAct ? (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                      {participant.micState === "requested" ? (
                                        <>
                                          <Button type="button" size="sm" variant="outline" onClick={() => setSpeakerAccess(participant, true)}>
                                            Invite to mic
                                          </Button>
                                          <Button type="button" size="sm" variant="outline" onClick={() => declineMicRequest(participant)}>
                                            Clear hand
                                          </Button>
                                        </>
                                      ) : null}
                                      {participant.canSpeak ? (
                                        <>
                                          <Button type="button" size="sm" variant="outline" onClick={() => muteParticipantMic(participant)}>
                                            Mute mic
                                          </Button>
                                          <Button type="button" size="sm" variant="outline" onClick={() => setSpeakerAccess(participant, false)}>
                                            Listener mode
                                          </Button>
                                        </>
                                      ) : null}
                                      {!participant.canSpeak && participant.micState !== "requested" ? (
                                        <Button type="button" size="sm" variant="outline" onClick={() => setSpeakerAccess(participant, true)}>
                                          Invite to mic
                                        </Button>
                                      ) : null}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className={cn("rounded-2xl border border-dashed p-4 text-sm", isDarkRoom ? "border-white/15 text-white/70" : "text-slate-500")}>
                          No one is in the room yet. Create or join a room to start.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            <Card className={cn("overflow-hidden border shadow-sm", themeMeta.panelClass)}>
              {room ? (
                <>
                  <CardHeader className={cn("border-b", isDarkRoom ? "border-white/10" : "border-slate-200")}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <CardTitle className={cn("text-2xl", isDarkRoom ? "text-white" : "text-slate-950")}>
                            {room.roomName}
                          </CardTitle>
                          {room.cricketMode ? (
                            <Badge className="rounded-full bg-emerald-500 text-white hover:bg-emerald-500">
                              <Trophy className="mr-1 h-3 w-3" />
                              Cricket mode
                            </Badge>
                          ) : null}
                        </div>
                        <CardDescription className={cn("mt-2", isDarkRoom ? "text-white/60" : "text-slate-500")}>
                          Host-led live space for shared chats, dedication cards, and special moments.
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="rounded-full">
                          <Shield className="mr-1 h-3 w-3" />
                          Private room
                        </Badge>
                        <Badge variant="secondary" className="rounded-full">
                          <Activity className="mr-1 h-3 w-3" />
                          {onlineParticipants.length} online
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid min-h-[860px] grid-rows-[1fr_auto]">
                      <ScrollArea className="h-[680px] px-6 py-6">
                        <div className="space-y-4">
                          {room?.cricketScore && (
                            <div className={cn("rounded-2xl border p-4 flex items-center gap-4 text-center justify-center shadow-sm", isDarkRoom ? "border-amber-400/20 bg-[linear-gradient(135deg,rgba(251,191,36,0.15),rgba(217,119,6,0.05))] text-amber-300" : "border-amber-200 bg-[linear-gradient(135deg,#fef3c7,#fef08a)] text-amber-900")}>
                                <Trophy className="h-6 w-6" />
                                <span className="text-lg md:text-xl font-black tracking-tight uppercase">
                                  {room.cricketScore}
                                </span>
                            </div>
                          )}

                          {stageDedicationEvent?.dedication ? (
                            <div
                              className={cn(
                                "overflow-hidden rounded-[32px] border p-5 shadow-sm",
                                isDarkRoom
                                  ? "border-white/10 bg-white/10 backdrop-blur"
                                  : "border-fuchsia-200 bg-[linear-gradient(135deg,_rgba(244,114,182,0.10),_rgba(255,255,255,0.92))]"
                              )}
                            >
                              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                {stageDedicationEvent.dedication.coverUrl ? (
                                  <img
                                    src={stageDedicationEvent.dedication.coverUrl}
                                    alt={stageDedicationEvent.dedication.title}
                                    className="h-32 w-full rounded-[24px] object-cover md:w-40"
                                    loading="lazy"
                                  />
                                ) : null}
                                <div className="min-w-0 flex-1 space-y-3">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge className="rounded-full bg-fuchsia-500 text-white hover:bg-fuchsia-500">
                                      <Pin className="mr-1 h-3 w-3" />
                                      On the room stage
                                    </Badge>
                                    <Badge variant="outline" className="rounded-full">
                                      {getDedicationTypeMeta(stageDedicationEvent.dedication.kind).label}
                                    </Badge>
                                    <Badge variant="outline" className="rounded-full">
                                      From {stageDedicationEvent.senderUid === user?.uid ? "you" : stageDedicationEvent.senderName}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className={cn("text-xl font-semibold", isDarkRoom ? "text-white" : "text-slate-950")}>
                                      {stageDedicationEvent.dedication.title}
                                    </p>
                                    {stageDedicationEvent.dedication.note ? (
                                      <p className={cn("mt-2 text-sm leading-6", isDarkRoom ? "text-white/75" : "text-slate-600")}>
                                        {stageDedicationEvent.dedication.note}
                                      </p>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}

                          {combinedEvents.length > 0 ? (
                            combinedEvents.map((event) => {
                              const own = event.senderUid === user?.uid;
                              const dedicationMeta = event.dedication ? getDedicationTypeMeta(event.dedication.kind) : null;
                              const eventMood = event.dedication ? getMoodMeta(event.dedication.moodId) : null;
                              const imageDrop = event.dedication?.kind === "image" && Boolean(event.dedication.coverUrl);
                              const inlineImage = isInlineImageUrl(event.dedication?.coverUrl);
                              const dedicationLink =
                                event.dedication?.resourceUrl && !event.dedication.resourceUrl.startsWith("data:")
                                  ? event.dedication.resourceUrl
                                  : "";

                              if (event.type === "system") {
                                return (
                                  <div
                                    key={event.id}
                                    className={cn("rounded-full px-4 py-2 text-center text-xs uppercase tracking-[0.2em]", isDarkRoom ? "bg-white/10 text-white/70" : "bg-slate-100 text-slate-500")}
                                  >
                                    {event.text}
                                  </div>
                                );
                              }

                              return (
                                <div key={event.id} className={cn("flex", own ? "justify-end" : "justify-start")}>
                                  <div className="max-w-[90%] space-y-2">
                                    <div className={cn("flex items-center gap-2 px-1 text-xs", isDarkRoom ? "text-white/55" : "text-slate-400")}>
                                      <span>{own ? "You" : event.senderName}</span>
                                      <span>•</span>
                                      <span>{formatRoomTime(event.createdAt)}</span>
                                    </div>

                                    {event.type === "dedication" && event.dedication ? (
                                      <div
                                        className={cn(
                                          "overflow-hidden rounded-[28px] border p-4 shadow-sm",
                                          own
                                            ? "border-fuchsia-300/30 bg-[linear-gradient(135deg,_rgba(236,72,153,0.18),_rgba(255,255,255,0.16))]"
                                            : isDarkRoom
                                              ? "border-white/10 bg-white/10"
                                              : "border-slate-200 bg-white/90",
                                          newDedicationId === event.id && "animate-in slide-in-from-bottom-4 fade-in duration-500",
                                          eventMood ? "border-l-4" : ""
                                        )}
                                        style={eventMood ? { borderImage: getMoodAccentStyle(eventMood.id).background, borderImageSlice: 1 } : undefined}
                                      >
                                        <div className="flex flex-col gap-4 md:flex-row">
                                          {event.dedication.coverUrl ? (
                                            <img
                                              src={event.dedication.coverUrl}
                                              alt={event.dedication.title}
                                              className="h-36 w-full rounded-2xl object-cover md:w-40"
                                              loading="lazy"
                                            />
                                          ) : null}
                                          <div className="min-w-0 flex-1 space-y-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                              <Badge className={cn("rounded-full", own ? "bg-white/85 text-slate-900 hover:bg-white/85" : "")}>
                                                {dedicationMeta?.label}
                                              </Badge>
                                              {imageDrop ? (
                                                <Badge variant="outline" className="rounded-full">
                                                  Live image drop
                                                </Badge>
                                              ) : null}
                                              {eventMood ? (
                                                <Badge variant="outline" className="rounded-full">
                                                  Mood: {eventMood.name}
                                                </Badge>
                                              ) : null}
                                            </div>
                                            <div>
                                              <p className={cn("text-lg font-semibold", isDarkRoom ? "text-white" : "text-slate-950")}>
                                                {event.dedication.title}
                                              </p>
                                              {event.dedication.creatorName ? (
                                                <p className={cn("text-sm", isDarkRoom ? "text-white/60" : "text-slate-500")}>
                                                  {dedicationMeta?.creatorLabel}: {event.dedication.creatorName}
                                                </p>
                                              ) : null}
                                            </div>
                                            {event.dedication.note ? (
                                              <p className={cn("text-sm leading-6", isDarkRoom ? "text-white/80" : "text-slate-700")}>
                                                {event.dedication.note}
                                              </p>
                                            ) : null}
                                            {imageDrop && inlineImage ? (
                                              <p className={cn("text-xs uppercase tracking-[0.18em]", isDarkRoom ? "text-white/45" : "text-slate-400")}>
                                                Shared directly over the live tunnel
                                              </p>
                                            ) : null}
                                            {dedicationLink ? (
                                              <a
                                                href={dedicationLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 text-sm font-medium text-cyan-500"
                                              >
                                                <Waves className="h-4 w-4" />
                                                Open dedication link
                                              </a>
                                            ) : !inlineImage ? null : (
                                              <a
                                                href={event.dedication.coverUrl}
                                                download={`${event.dedication.title || "axevora-live-drop"}.png`}
                                                className="inline-flex items-center gap-2 text-sm font-medium text-cyan-500"
                                              >
                                                <ImagePlus className="h-4 w-4" />
                                                Save live image
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ) : event.type === "gift" && event.payload ? (
                                      <div className={cn("rounded-[24px] border px-4 py-3 shadow-sm", isDarkRoom ? "border-amber-500/30 bg-amber-500/10 text-white" : "border-amber-200 bg-amber-50 text-amber-900")}>
                                        <div className="flex items-center gap-3">
                                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white text-2xl shadow-inner border-2 border-amber-300">
                                            {event.payload.giftIcon}
                                          </div>
                                          <div className="flex flex-col">
                                            <p className="font-bold text-base leading-tight">
                                              {event.senderName} sent a {event.payload.giftName}!
                                            </p>
                                            <p className={cn("text-xs font-semibold mt-0.5", isDarkRoom ? "text-amber-400" : "text-amber-700")}>
                                              Value: {event.payload.cost} Coins
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ) : event.type === "cricket" ? (
                                      <div className={cn("rounded-[24px] border px-4 py-3 shadow-sm", isDarkRoom ? "border-emerald-300/20 bg-emerald-400/10 text-white" : "border-emerald-200 bg-emerald-50 text-emerald-900")}>
                                        <div className="flex items-center gap-3">
                                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                                            <Trophy className="h-5 w-5" />
                                          </div>
                                          <div>
                                            <p className="font-semibold">{event.text}</p>
                                            <p className={cn("text-sm", isDarkRoom ? "text-white/70" : "text-emerald-700")}>
                                              Team pulse: {event.cricketTeam || "Any side"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className={cn("rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm", own ? "bg-slate-950 text-white" : isDarkRoom ? "border border-white/10 bg-white/10 text-white" : "border border-slate-200 bg-white text-slate-700")}>
                                        {event.text}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className={cn("rounded-3xl border border-dashed p-6 text-sm", isDarkRoom ? "border-white/15 text-white/70" : "text-slate-500")}>
                              Your room feed will appear here once participants start chatting or dedicating cards.
                            </div>
                          )}
                          
                          {typingUsers.length > 0 && (
                            <div className={cn("flex items-center gap-2 px-4 text-sm italic", isDarkRoom ? "text-white/50" : "text-slate-400")}>
                              <div className="flex gap-1">
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                              </div>
                              {typingUsers.map((u) => u.displayName).join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
                            </div>
                          )}

                          <div ref={feedEndRef} />
                        </div>
                      </ScrollArea>

                      <div className={cn("border-t px-6 py-5", isDarkRoom ? "border-white/10 bg-black/10" : "border-slate-200 bg-white/70")}>
                        <div className="grid gap-4">
                          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] items-end">
                            <Textarea
                              value={messageText}
                              onChange={(event) => setMessageText(event.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  if (messageText.trim() && !sending) {
                                    sendChat();
                                  }
                                }
                              }}
                              placeholder={room ? `Share the moment in ${room.roomName}...` : "Join a room first"}
                              className={cn("min-h-[110px]", isDarkRoom ? "border-white/10 bg-white/10 text-white placeholder:text-white/40" : "bg-white")}
                              disabled={!room}
                            />
                            {profile && room && (
                              <div className="flex h-full items-end pb-1">
                                <GiftPanel roomId={room.id} profile={profile} isDarkRoom={isDarkRoom} />
                              </div>
                            )}
                            <Dialog
                              open={dedicationOpen}
                              onOpenChange={(nextOpen) => {
                                setDedicationOpen(nextOpen);
                                if (!nextOpen) {
                                  resetDedicationComposer();
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button type="button" variant="outline" className="min-h-[110px] rounded-2xl px-6" disabled={!room}>
                                  <Sparkles className="mr-2 h-4 w-4" />
                                  Drop dedication
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Send a live dedication card</DialogTitle>
                                  <DialogDescription>
                                    This card appears instantly in the shared room feed.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-2 md:grid-cols-2">
                                  <div className="space-y-2 md:col-span-2">
                                    <Label>Dedication type</Label>
                                    <div className="grid gap-2 sm:grid-cols-5">
                                      {DEDICATION_TYPE_OPTIONS.map((option) => (
                                        <button
                                          key={option.id}
                                          type="button"
                                          onClick={() =>
                                            setDedicationDraft((current) => ({ ...current, kind: option.id }))
                                          }
                                          className={cn(
                                            "rounded-2xl border px-3 py-3 text-sm transition-colors",
                                            dedicationDraft.kind === option.id
                                              ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                          )}
                                        >
                                          {option.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="live-title">Title</Label>
                                    <Input
                                      id="live-title"
                                      value={dedicationDraft.title}
                                      onChange={(event) =>
                                        setDedicationDraft((current) => ({ ...current, title: event.target.value }))
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="live-creator">{getDedicationTypeMeta(dedicationDraft.kind).creatorLabel}</Label>
                                    <Input
                                      id="live-creator"
                                      value={dedicationDraft.creatorName}
                                      onChange={(event) =>
                                        setDedicationDraft((current) => ({ ...current, creatorName: event.target.value }))
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="live-link">Link</Label>
                                    <Input
                                      id="live-link"
                                      value={dedicationDraft.resourceUrl}
                                      onChange={(event) =>
                                        setDedicationDraft((current) => ({ ...current, resourceUrl: event.target.value }))
                                      }
                                      placeholder="https://..."
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="live-cover">Cover image URL</Label>
                                    <Input
                                      id="live-cover"
                                      value={dedicationDraft.coverUrl}
                                      onChange={(event) =>
                                        setDedicationDraft((current) => ({ ...current, coverUrl: event.target.value }))
                                      }
                                    />
                                  </div>
                                  {dedicationDraft.kind === "image" ? (
                                    <div className="space-y-3 md:col-span-2">
                                      <Label htmlFor="live-image-upload">Live image drop</Label>
                                      <div
                                        className={cn(
                                          "rounded-3xl border border-dashed p-4",
                                          isDarkRoom ? "border-white/15 bg-white/5" : "border-slate-200 bg-slate-50"
                                        )}
                                      >
                                        <input
                                          id="live-image-upload"
                                          type="file"
                                          accept="image/*"
                                          onChange={(event) => handleLiveImageSelection(event.target.files?.[0])}
                                          className={cn(
                                            "block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:font-medium",
                                            isDarkRoom
                                              ? "text-white/75 file:bg-white file:text-slate-950"
                                              : "text-slate-600 file:bg-slate-950 file:text-white"
                                          )}
                                        />
                                        <p className={cn("mt-3 text-xs leading-5", isDarkRoom ? "text-white/55" : "text-slate-500")}>
                                          Small images under {formatFileSize(LIVE_IMAGE_MAX_BYTES)} travel fastest over the live tunnel and stay out of hosted storage.
                                        </p>
                                        {dedicationDraft.coverUrl ? (
                                          <div className="mt-4 flex flex-col gap-3 rounded-2xl border p-3 sm:flex-row sm:items-center">
                                            <img
                                              src={dedicationDraft.coverUrl}
                                              alt={dedicationDraft.title || "Live image preview"}
                                              className="h-24 w-full rounded-2xl object-cover sm:w-28"
                                            />
                                            <div className="min-w-0 flex-1">
                                              <p className="truncate text-sm font-medium text-slate-900">
                                                {liveImageName || dedicationDraft.title || "Ready to drop"}
                                              </p>
                                              <p className="mt-1 text-xs text-slate-500">
                                                {liveImageSize ? formatFileSize(liveImageSize) : "Instant preview ready"}
                                              </p>
                                            </div>
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  ) : null}
                                  <div className="space-y-2 md:col-span-2">
                                    <Label>Mood accent</Label>
                                    <div className="grid gap-2 sm:grid-cols-5">
                                      {LIVE_MOODS.map((mood) => (
                                        <button
                                          key={mood.id}
                                          type="button"
                                          onClick={() =>
                                            setDedicationDraft((current) => ({ ...current, moodId: mood.id }))
                                          }
                                          className={cn(
                                            "rounded-2xl border px-3 py-3 text-sm transition-colors",
                                            dedicationDraft.moodId === mood.id
                                              ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700"
                                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                          )}
                                        >
                                          {mood.name}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="live-note">Note</Label>
                                    <Textarea
                                      id="live-note"
                                      value={dedicationDraft.note}
                                      onChange={(event) =>
                                        setDedicationDraft((current) => ({ ...current, note: event.target.value }))
                                      }
                                      className="min-h-[120px]"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                      setDedicationOpen(false);
                                      resetDedicationComposer();
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button type="button" onClick={sendDedication} disabled={sending}>
                                    Send live card
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              type="button" 
                              className="min-h-[110px] rounded-2xl px-8 bg-blue-600 hover:bg-blue-500 text-white shadow-glow" 
                              onClick={sendChat} 
                              disabled={!room || !messageText.trim() || sending}
                            >
                              {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                              Send live message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex min-h-[860px] items-center justify-center p-8">
                  <div className="max-w-lg space-y-5 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500 text-white shadow-lg">
                      <Radio className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className={cn("text-2xl font-semibold tracking-tight", isDarkRoom ? "text-white" : "text-slate-950")}>
                        Create or join a private live room
                      </h3>
                      <p className={cn("text-sm leading-6", isDarkRoom ? "text-white/70" : "text-slate-500")}>
                        This room becomes your live stage for shared chat, speaker access, moods, and dedication drops.
                      </p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            <div className="space-y-6">
              <Card className={cn("border shadow-sm", themeMeta.panelClass)}>
                <CardHeader>
                  <CardTitle className={cn("text-lg", isDarkRoom ? "text-white" : "text-slate-950")}>Mood and room styling</CardTitle>
                  <CardDescription className={isDarkRoom ? "text-white/60" : undefined}>
                    Personalize your vibe and let the host shape the room shell.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Your mood</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {LIVE_MOODS.map((mood) => (
                        <button
                          key={mood.id}
                          type="button"
                          onClick={() => updateMood(mood.id)}
                          className={cn(
                            "rounded-2xl border px-3 py-3 text-left text-sm transition-colors",
                            myParticipant?.moodId === mood.id
                              ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                              : isDarkRoom
                                ? "border-white/10 bg-white/5 text-white hover:border-white/20"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          )}
                        >
                          <span className="font-medium">{mood.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Room themes</Label>
                    <div className="space-y-2">
                      {ROOM_THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => updateRoomTheme(theme.id)}
                          disabled={!isHost}
                          className={cn(
                            "w-full rounded-2xl border px-4 py-3 text-left transition-colors",
                            room?.themeId === theme.id
                              ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700"
                              : isDarkRoom
                                ? "border-white/10 bg-white/5 text-white hover:border-white/20"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                            !isHost && "cursor-not-allowed opacity-70"
                          )}
                        >
                          <p className="font-medium">{theme.name}</p>
                          <p className={cn("mt-1 text-xs", isDarkRoom ? "text-white/60" : "text-slate-500")}>{theme.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={cn("border shadow-sm", themeMeta.panelClass)}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className={cn("text-lg", isDarkRoom ? "text-white" : "text-slate-950")}>Voice stage</CardTitle>
                      <CardDescription className={isDarkRoom ? "text-white/60" : undefined}>
                        Multi-speaker room stage with raise-hand queue and host moderation.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="rounded-full">
                      {guestSpeakers.length}/{speakerLimit} guest speakers
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className={cn("rounded-2xl border p-4", isDarkRoom ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80")}>
                      <div className="flex items-center justify-between gap-3">
                        <p className={cn("font-medium", isDarkRoom ? "text-white" : "text-slate-900")}>Live speakers</p>
                        <Badge className="rounded-full bg-emerald-500 text-white hover:bg-emerald-500">
                          {liveMicParticipants.length} live
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        {stageSpeakers.length > 0 ? (
                          stageSpeakers.map((participant) => (
                            <div
                              key={participant.uid}
                              className={cn("flex items-center justify-between gap-3 rounded-2xl border p-3", isDarkRoom ? "border-white/10 bg-black/10" : "border-slate-200 bg-slate-50")}
                            >
                              <div className="min-w-0">
                                <p className={cn("truncate font-medium", isDarkRoom ? "text-white" : "text-slate-900")}>
                                  {participant.displayName}
                                </p>
                                <p className={cn("text-xs", isDarkRoom ? "text-white/60" : "text-slate-500")}>
                                  {participant.role === "host" ? "Host speaker" : participant.isMicLive ? "Mic is live" : "Stage speaker"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {participant.isMicLive ? <Volume2 className="h-4 w-4 text-emerald-500" /> : <MicOff className="h-4 w-4 text-slate-400" />}
                                {isHost && participant.role !== "host" ? (
                                  <Button type="button" size="sm" variant="outline" onClick={() => setSpeakerAccess(participant, false)}>
                                    <UserMinus className="mr-2 h-3 w-3" />
                                    Drop
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={cn("rounded-2xl border border-dashed p-4 text-sm", isDarkRoom ? "border-white/15 text-white/70" : "text-slate-500")}>
                            Host ke alawa abhi koi speaker stage par nahi hai.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={cn("rounded-2xl border p-4", isDarkRoom ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80")}>
                      <div className="flex items-center justify-between gap-3">
                        <p className={cn("font-medium", isDarkRoom ? "text-white" : "text-slate-900")}>Raise-hand queue</p>
                        <Badge variant="secondary" className="rounded-full">
                          {requestedParticipants.length} waiting
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-2">
                        {requestedParticipants.length > 0 ? (
                          requestedParticipants.map((participant) => (
                            <div
                              key={participant.uid}
                              className={cn("rounded-2xl border p-3", isDarkRoom ? "border-white/10 bg-black/10" : "border-slate-200 bg-slate-50")}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className={cn("truncate font-medium", isDarkRoom ? "text-white" : "text-slate-900")}>
                                    {participant.displayName}
                                  </p>
                                  <p className={cn("text-xs", isDarkRoom ? "text-white/60" : "text-slate-500")}>
                                    Waiting for host approval
                                  </p>
                                </div>
                                <Hand className="h-4 w-4 text-amber-500" />
                              </div>
                              {isHost ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <Button type="button" size="sm" variant="outline" onClick={() => setSpeakerAccess(participant, true)}>
                                    Approve
                                  </Button>
                                  <Button type="button" size="sm" variant="outline" onClick={() => declineMicRequest(participant)}>
                                    Decline
                                  </Button>
                                </div>
                              ) : null}
                            </div>
                          ))
                        ) : (
                          <div className={cn("rounded-2xl border border-dashed p-4 text-sm", isDarkRoom ? "border-white/15 text-white/70" : "text-slate-500")}>
                            Queue empty hai. Raise hand karne par request yahan dikhegi.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {isHost ? (
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Button type="button" variant="outline" onClick={toggleJoinLock}>
                        {(room?.joinLocked ?? false) ? <DoorOpen className="mr-2 h-4 w-4" /> : <DoorClosed className="mr-2 h-4 w-4" />}
                        {(room?.joinLocked ?? false) ? "Unlock joins" : "Lock joins"}
                      </Button>
                      <Button type="button" variant="outline" onClick={toggleMicRequests}>
                        <Hand className="mr-2 h-4 w-4" />
                        {(room?.micRequestsOpen ?? true) ? "Pause raise hand" : "Open raise hand"}
                      </Button>
                      <Button type="button" variant="outline" onClick={muteAllGuests} disabled={guestSpeakers.length === 0}>
                        <MicOff className="mr-2 h-4 w-4" />
                        Mute guest mics
                      </Button>
                    </div>
                  ) : (
                    <div className={cn("rounded-2xl border p-4 text-sm", isDarkRoom ? "border-white/10 bg-white/5 text-white/75" : "border-slate-200 bg-white/80 text-slate-600")}>
                      {(room?.micRequestsOpen ?? true)
                        ? myParticipant?.micState === "requested"
                          ? "Tumhara raise-hand request host queue me hai."
                          : `Raise hand karke host se speaker access lo. ${stageSpotsRemaining} guest spots bache hain.`
                        : "Host ne abhi raise-hand requests pause kar rakhi hain."}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className={cn("border shadow-sm", themeMeta.panelClass)}>
                <CardHeader>
                  <CardTitle className={cn("text-lg", isDarkRoom ? "text-white" : "text-slate-950")}>Live tunnel status</CardTitle>
                  <CardDescription className={isDarkRoom ? "text-white/60" : undefined}>
                    Peer-to-peer data and audio channel health for online participants.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {participants.filter((participant) => participant.uid !== user?.uid).length > 0 ? (
                    participants
                      .filter((participant) => participant.uid !== user?.uid)
                      .map((participant) => (
                        <div
                          key={participant.uid}
                          className={cn("rounded-2xl border p-3", isDarkRoom ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80")}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className={cn("truncate font-medium", isDarkRoom ? "text-white" : "text-slate-900")}>
                                {participant.displayName}
                              </p>
                              <p className={cn("text-xs", isDarkRoom ? "text-white/60" : "text-slate-500")}>
                                {connectionStates[participant.uid] || "Waiting for sync"}
                              </p>
                            </div>
                            <Badge variant={dataChannelsRef.current[participant.uid]?.readyState === "open" ? "secondary" : "outline"} className="rounded-full">
                              {dataChannelsRef.current[participant.uid]?.readyState === "open" ? "P2P live" : "Syncing"}
                            </Badge>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className={cn("rounded-2xl border border-dashed p-4 text-sm", isDarkRoom ? "border-white/15 text-white/70" : "text-slate-500")}>
                      Invite someone into the room to establish direct live tunnels.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className={cn("border shadow-sm", themeMeta.panelClass)}>
                <CardHeader>
                  <CardTitle className={cn("text-lg", isDarkRoom ? "text-white" : "text-slate-950")}>Mic stage controls</CardTitle>
                  <CardDescription className={isDarkRoom ? "text-white/60" : undefined}>
                    Host approves speakers, and live audio now uses direct peer connections.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={cn("rounded-2xl border p-4", isDarkRoom ? "border-white/10 bg-white/5" : "border-slate-200 bg-white/80")}>
                    <p className={cn("font-medium", isDarkRoom ? "text-white" : "text-slate-900")}>
                      {isHost ? "You are hosting this stage" : myParticipant?.canSpeak ? "You have speaker access" : "You are in listener mode"}
                    </p>
                    <p className={cn("mt-2 text-sm", isDarkRoom ? "text-white/65" : "text-slate-500")}>
                      Direct audio transport is active on the live tunnel, and the host can manage the queue in real time.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={requestMic}
                      disabled={!room || isHost || myParticipant?.micState === "requested" || room?.micRequestsOpen === false}
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      {myParticipant?.micState === "requested" ? "Request sent" : "Raise hand"}
                    </Button>
                    <Button type="button" onClick={toggleMicLive} disabled={!room || (!isHost && !myParticipant?.canSpeak)}>
                      {myParticipant?.isMicLive ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                      {myParticipant?.isMicLive ? "Mute stage mic" : "Go mic live"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className={cn("border shadow-sm", themeMeta.panelClass)}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className={cn("text-lg", isDarkRoom ? "text-white" : "text-slate-950")}>Cricket room pack</CardTitle>
                      <CardDescription className={isDarkRoom ? "text-white/60" : undefined}>
                        Quick reactions and team energy for the coming season.
                      </CardDescription>
                    </div>
                    <Button type="button" size="sm" variant="outline" onClick={toggleCricketMode} disabled={!isHost || !room}>
                      {room?.cricketMode ? "Pause" : "Start"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isHost && (
                    <div className="space-y-4 rounded-2xl border p-4 bg-white/5 border-white/10">
                      <div className="space-y-2">
                        <Label className={cn(isDarkRoom ? "text-amber-300" : "text-slate-800")}>Pinned Score / Status</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="e.g. IND 150/2 (15.0) | VK 45*"
                            value={cricketScoreInput}
                            onChange={(e) => setCricketScoreInput(e.target.value)}
                            className={cn(isDarkRoom ? "bg-white/10 border-white/20 text-white" : "bg-white border-slate-200")}
                            disabled={!room || !room.cricketMode}
                          />
                          <Button 
                            type="button" 
                            onClick={updateCricketScore}
                            disabled={!room || !room.cricketMode || updatingScore}
                            variant={isDarkRoom ? "secondary" : "default"}
                          >
                            {updatingScore ? <Loader2 className="h-4 w-4 animate-spin" /> : "Pin"}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <Label className={cn(isDarkRoom ? "text-amber-300" : "text-slate-800")}>Send Match Alert Overlay</Label>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                           <Button onClick={() => sendMatchAlert("four", "FOUR!")} disabled={!room || !room.cricketMode} variant="outline" className="font-black italic bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">FOUR</Button>
                           <Button onClick={() => sendMatchAlert("six", "SIX!")} disabled={!room || !room.cricketMode} variant="outline" className="font-black italic bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">SIX</Button>
                           <Button onClick={() => sendMatchAlert("wicket", "WICKET!")} disabled={!room || !room.cricketMode} variant="outline" className="font-black italic bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20">WICKET</Button>
                           <Button onClick={() => sendMatchAlert("milestone", "FIFTY!")} disabled={!room || !room.cricketMode} variant="outline" className="font-black italic bg-cyan-500/10 text-cyan-500 border-cyan-500/20 hover:bg-cyan-500/20">FIFTY</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className={cn(isDarkRoom ? "text-white/80" : "text-slate-700")}>Team pulse</Label>
                    <div className="flex flex-wrap gap-2">
                      {["INDIA", "AUSTRALIA", "PAKISTAN", "ENGLAND", "SOUTH AFRICA"].map((team) => (
                        <Button key={team} type="button" size="sm" variant="outline"
                          onClick={() => sendCricketReaction(`Backing ${team}`, "🏏", "from-yellow-400 to-orange-500")}
                          disabled={!room || !room.cricketMode}
                          className="font-bold"
                        >
                          {team}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {CRICKET_REACTIONS.map((reaction) => (
                      <button
                        key={reaction.id}
                        type="button"
                        onClick={() => sendCricketReaction(reaction.label, reaction.emoji, reaction.color)}
                        disabled={!room || !room.cricketMode}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all hover:scale-[1.03]",
                          isDarkRoom
                            ? "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm",
                          (!room || !room.cricketMode) && "cursor-not-allowed opacity-50"
                        )}
                      >
                        <span className="mr-2 text-lg">{reaction.emoji}</span>{reaction.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="hidden">
            {participants
              .filter((participant) => participant.uid !== user?.uid)
              .map((participant) => (
                <audio
                  key={participant.uid}
                  ref={(element) => {
                    remoteAudioRefs.current[participant.uid] = element;
                    if (element && remoteStreamsRef.current[participant.uid]) {
                      element.srcObject = remoteStreamsRef.current[participant.uid];
                    }
                  }}
                  autoPlay
                  playsInline
                />
              ))}
          </div>
        </div>
        </>
      )}
    </ToolTemplate>
  );
}
