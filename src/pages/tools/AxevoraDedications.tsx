import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import {
  BookOpen,
  Copy,
  ExternalLink,
  FileText,
  Heart,
  Image as ImageIcon,
  Inbox,
  Link2,
  Loader2,
  Lock,
  MessageSquare,
  Music,
  PlusCircle,
  Search,
  Send,
  Shield,
  Sparkles,
  UserPlus,
  Video,
} from "lucide-react";

import ToolTemplate from "@/components/ToolTemplate";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { auth, db } from "@/lib/firebase";
import {
  DEDICATION_TYPE_OPTIONS,
  buildParticipantFromProfile,
  buildProfileFromUser,
  buildThreadId,
  formatDedicationPreview,
  getDedicationOption,
  getOtherParticipant,
  normalizeShareCode,
  type DedicationKind,
  type DedicationMessage,
  type DedicationPayload,
  type DedicationProfile,
  type DedicationThread,
} from "@/lib/dedications";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DEFAULT_DRAFT: DedicationPayload = {
  kind: "song",
  title: "",
  creatorName: "",
  resourceUrl: "",
  coverUrl: "",
  note: "",
  mood: "Warm",
};

const DEDICATION_ICON_MAP = {
  song: Music,
  book: BookOpen,
  story: FileText,
  image: ImageIcon,
  video: Video,
} satisfies Record<DedicationKind, typeof Music>;

function formatTimestamp(value?: { toDate?: () => Date } | null) {
  if (!value?.toDate) return "Just now";
  return value.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatThreadTime(value?: { toDate?: () => Date } | null) {
  if (!value?.toDate) return "now";

  const date = value.toDate();
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString([], { day: "numeric", month: "short" });
}

function DedicationCard({ dedication, own }: { dedication: DedicationPayload; own: boolean }) {
  const option = getDedicationOption(dedication.kind);
  const Icon = DEDICATION_ICON_MAP[dedication.kind];
  const imagePreview =
    dedication.kind === "image" ? dedication.resourceUrl || dedication.coverUrl : dedication.coverUrl;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-sm",
        own
          ? "border-rose-200 bg-gradient-to-br from-rose-50 via-white to-orange-50"
          : "border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full bg-white/80 text-slate-700">
              {option.label}
            </Badge>
            {dedication.mood ? (
              <Badge variant="outline" className="rounded-full">
                Mood: {dedication.mood}
              </Badge>
            ) : null}
          </div>

          <div>
            <p className="text-lg font-semibold text-slate-900">{dedication.title}</p>
            {dedication.creatorName ? (
              <p className="text-sm text-slate-500">
                {option.creatorLabel}: {dedication.creatorName}
              </p>
            ) : null}
          </div>

          {imagePreview ? (
            <img
              src={imagePreview}
              alt={dedication.title}
              className="h-40 w-full rounded-2xl object-cover"
              loading="lazy"
            />
          ) : null}

          {dedication.note ? <p className="text-sm leading-6 text-slate-700">{dedication.note}</p> : null}

          {dedication.resourceUrl ? (
            <a
              href={dedication.resourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
            >
              <ExternalLink className="h-4 w-4" />
              Open dedication
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function AxevoraDedications() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DedicationProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [threads, setThreads] = useState<DedicationThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DedicationMessage[]>([]);
  const [threadSearch, setThreadSearch] = useState("");
  const [connectCode, setConnectCode] = useState("");
  const [messageText, setMessageText] = useState("");
  const [draft, setDraft] = useState<DedicationPayload>(DEFAULT_DRAFT);
  const [connecting, setConnecting] = useState(false);
  const [sendingText, setSendingText] = useState(false);
  const [sendingDedication, setSendingDedication] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [feedTab, setFeedTab] = useState("all");
  const endRef = useRef<HTMLDivElement | null>(null);

  const deferredThreadSearch = useDeferredValue(threadSearch);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setThreads([]);
        setActiveThreadId(null);
        setMessages([]);
        setProfileLoading(false);
        return;
      }

      void (async () => {
        setProfileLoading(true);
        const baseProfile = buildProfileFromUser(currentUser);
        const profileRef = doc(db, "dedication_profiles", currentUser.uid);

        try {
          const snapshot = await getDoc(profileRef);

          if (!snapshot.exists()) {
            await setDoc(profileRef, {
              ...baseProfile,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            setProfile(baseProfile);
            setProfileLoading(false);
            return;
          }

          const savedProfile = snapshot.data() as Partial<DedicationProfile>;
          const mergedProfile: DedicationProfile = {
            ...baseProfile,
            ...savedProfile,
            displayName: currentUser.displayName || savedProfile.displayName || baseProfile.displayName,
            photoURL: currentUser.photoURL || savedProfile.photoURL || "",
            shareCode: savedProfile.shareCode || baseProfile.shareCode,
            searchName: (
              currentUser.displayName ||
              savedProfile.displayName ||
              baseProfile.displayName
            ).toLowerCase(),
          };

          await setDoc(
            profileRef,
            {
              ...mergedProfile,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );

          setProfile(mergedProfile);
        } catch (error) {
          console.error("Failed to sync dedication profile", error);
          toast.error("Profile sync failed. Please refresh once.");
        } finally {
          setProfileLoading(false);
        }
      })();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const inboxQuery = query(
      collection(db, "dedication_threads"),
      where("memberIds", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(inboxQuery, (snapshot) => {
      const nextThreads = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }) as DedicationThread)
        .sort((a, b) => (b.updatedAt?.toMillis?.() || 0) - (a.updatedAt?.toMillis?.() || 0));

      setThreads(nextThreads);

      if (!activeThreadId && nextThreads[0]) {
        setActiveThreadId(nextThreads[0].id);
        return;
      }

      if (activeThreadId && !nextThreads.some((thread) => thread.id === activeThreadId)) {
        setActiveThreadId(nextThreads[0]?.id || null);
      }
    });

    return () => unsubscribe();
  }, [activeThreadId, user]);

  useEffect(() => {
    if (!activeThreadId) {
      setMessages([]);
      return;
    }

    const messagesQuery = query(
      collection(db, "dedication_threads", activeThreadId, "messages"),
      orderBy("createdAt", "asc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const nextMessages = snapshot.docs.map(
        (item) => ({ id: item.id, ...item.data() }) as DedicationMessage
      );
      setMessages(nextMessages);
    });

    return () => unsubscribe();
  }, [activeThreadId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, feedTab]);

  const filteredThreads = useMemo(() => {
    const searchText = deferredThreadSearch.trim().toLowerCase();
    if (!searchText || !user) return threads;

    return threads.filter((thread) => {
      const other = getOtherParticipant(thread, user.uid);
      if (!other) return false;

      return (
        other.displayName.toLowerCase().includes(searchText) ||
        other.shareCode.toLowerCase().includes(searchText)
      );
    });
  }, [deferredThreadSearch, threads, user]);

  const activeThread = threads.find((thread) => thread.id === activeThreadId) || null;
  const activePartner = getOtherParticipant(activeThread, user?.uid);
  const visibleMessages =
    feedTab === "dedications"
      ? messages.filter((message) => message.type === "dedication")
      : messages;
  const currentOption = getDedicationOption(draft.kind);

  const copyShareCode = async () => {
    if (!profile?.shareCode) return;

    try {
      await navigator.clipboard.writeText(profile.shareCode);
      toast.success("Share code copied");
    } catch (error) {
      console.error("Copy failed", error);
      toast.error("Clipboard copy failed");
    }
  };

  const handleConnect = async () => {
    if (!user || !profile) {
      toast.error("Sign in first to open a dedication thread.");
      return;
    }

    const normalizedCode = normalizeShareCode(connectCode);
    if (!normalizedCode) {
      toast.error("Enter a valid share code.");
      return;
    }

    if (normalizedCode === profile.shareCode) {
      toast.error("Use someone else's share code here.");
      return;
    }

    setConnecting(true);

    try {
      const profileQuery = query(
        collection(db, "dedication_profiles"),
        where("shareCode", "==", normalizedCode),
        limit(1)
      );

      const result = await getDocs(profileQuery);
      if (result.empty) {
        toast.error("No dedication profile found for that code.");
        return;
      }

      const targetProfile = result.docs[0].data() as DedicationProfile;
      const threadId = buildThreadId(user.uid, targetProfile.uid);
      const threadRef = doc(db, "dedication_threads", threadId);
      const existingThread = await getDoc(threadRef);

      const currentParticipant = buildParticipantFromProfile(profile);
      const targetParticipant = buildParticipantFromProfile(targetProfile);

      await setDoc(
        threadRef,
        {
          memberIds: [user.uid, targetProfile.uid].sort(),
          participants: [currentParticipant, targetParticipant],
          updatedAt: serverTimestamp(),
          lastMessagePreview: existingThread.exists()
            ? existingThread.data()?.lastMessagePreview || "Private dedication thread reopened."
            : `${profile.displayName} opened a private dedication space.`,
          lastMessageType: existingThread.exists()
            ? existingThread.data()?.lastMessageType || "system"
            : "system",
        },
        { merge: true }
      );

      if (!existingThread.exists()) {
        await addDoc(collection(db, "dedication_threads", threadId, "messages"), {
          type: "system",
          senderUid: user.uid,
          senderName: profile.displayName,
          text: `${profile.displayName} opened this private dedication space.`,
          createdAt: serverTimestamp(),
        });
      }

      setActiveThreadId(threadId);
      setConnectCode("");
      toast.success(`Private dedication thread ready with ${targetProfile.displayName}.`);
    } catch (error) {
      console.error("Failed to connect dedication thread", error);
      toast.error("Could not open that private thread right now.");
    } finally {
      setConnecting(false);
    }
  };

  const handleSendText = async () => {
    const trimmed = messageText.trim();
    if (!trimmed || !user || !profile || !activeThreadId || !activePartner) return;

    setSendingText(true);

    try {
      await addDoc(collection(db, "dedication_threads", activeThreadId, "messages"), {
        type: "text",
        senderUid: user.uid,
        senderName: profile.displayName,
        text: trimmed,
        createdAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "dedication_threads", activeThreadId),
        {
          participants: [buildParticipantFromProfile(profile), activePartner],
          updatedAt: serverTimestamp(),
          lastMessagePreview: trimmed.slice(0, 96),
          lastMessageType: "text",
        },
        { merge: true }
      );

      setMessageText("");
    } catch (error) {
      console.error("Failed to send text message", error);
      toast.error("Message send failed.");
    } finally {
      setSendingText(false);
    }
  };

  const handleSendDedication = async () => {
    if (!user || !profile || !activeThreadId || !activePartner) {
      toast.error("Open a private thread first.");
      return;
    }

    const cleanedPayload: DedicationPayload = {
      kind: draft.kind,
      title: draft.title.trim(),
      creatorName: draft.creatorName.trim(),
      resourceUrl: draft.resourceUrl.trim(),
      coverUrl: draft.coverUrl.trim(),
      note: draft.note.trim(),
      mood: draft.mood.trim(),
    };

    if (!cleanedPayload.title) {
      toast.error("Give your dedication a title first.");
      return;
    }

    if (["song", "image", "video"].includes(cleanedPayload.kind) && !cleanedPayload.resourceUrl) {
      toast.error("This dedication type needs a media link.");
      return;
    }

    setSendingDedication(true);

    try {
      await addDoc(collection(db, "dedication_threads", activeThreadId, "messages"), {
        type: "dedication",
        senderUid: user.uid,
        senderName: profile.displayName,
        dedication: cleanedPayload,
        createdAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "dedication_threads", activeThreadId),
        {
          participants: [buildParticipantFromProfile(profile), activePartner],
          updatedAt: serverTimestamp(),
          lastMessagePreview: formatDedicationPreview(cleanedPayload.kind, cleanedPayload.title),
          lastMessageType: "dedication",
        },
        { merge: true }
      );

      setDraft(DEFAULT_DRAFT);
      setComposerOpen(false);
      toast.success("Dedication sent.");
    } catch (error) {
      console.error("Failed to send dedication", error);
      toast.error("Dedication could not be sent.");
    } finally {
      setSendingDedication(false);
    }
  };

  return (
    <ToolTemplate
      title="Axevora Dedications"
      description="Open a private one-to-one space where users can chat and dedicate songs, books, stories, images, and videos with notes."
      icon={Heart}
      content={`
        <h2>Private Chats Meet Meaningful Media Gifting</h2>
        <p>Axevora Dedications is a lightweight social layer for the platform. Instead of generic chat, users can open a private room and send thoughtful dedication cards for songs, books, stories, images, and videos.</p>
        <p>The MVP is intentionally focused: private threads only, share-code based connection, and clean dedication cards that feel personal without touching any existing tool logic.</p>
      `}
      features={[
        "Private inbox powered by Firebase real-time sync",
        "Share-code based connection flow for simple onboarding",
        "Dedicated cards for songs, books, stories, images, and videos",
        "Text chat plus personal notes, moods, and optional cover art",
        "No dependency on current Axevora Circle or admin tools",
      ]}
    >
      <div className="space-y-6">
        <div className="rounded-[28px] border border-rose-200 bg-[radial-gradient(circle_at_top_left,_rgba(251,113,133,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(251,146,60,0.18),_transparent_30%),linear-gradient(135deg,_#fff7ed,_#ffffff_45%,_#f8fafc)] p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Badge className="rounded-full bg-slate-950 text-white hover:bg-slate-950">
                MVP social module
              </Badge>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                Private emotional inbox for media dedications
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Every conversation stays one-to-one. Users connect with a share code, then chat or send a dedication card with a link, mood, and note.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm">
                <Lock className="h-4 w-4 text-rose-500" />
                Private threads only
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm">
                <Shield className="h-4 w-4 text-amber-500" />
                Safe isolated module
              </span>
            </div>
          </div>
        </div>

        {profileLoading ? (
          <Card>
            <CardContent className="flex min-h-[280px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing your dedication workspace...
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <div className="space-y-6">
              <Card className="overflow-hidden border-rose-100">
                <div className="bg-[linear-gradient(135deg,_#0f172a,_#1e293b_48%,_#4c1d95)] px-6 py-5 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/60">Identity</p>
                      <h4 className="mt-2 text-lg font-semibold">Your dedication pass</h4>
                    </div>
                    <Heart className="h-8 w-8 text-rose-300" />
                  </div>
                </div>
                <CardContent className="space-y-5 p-6">
                  <AuthButton user={user} />

                  {user && profile ? (
                    <>
                      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={profile.photoURL} />
                          <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{profile.displayName}</p>
                          <p className="text-xs text-slate-500">Private dedication mode is active</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/60 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-rose-500">
                          Share Code
                        </p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="text-2xl font-semibold tracking-[0.32em] text-slate-950">
                            {profile.shareCode}
                          </span>
                          <Button type="button" size="sm" variant="outline" onClick={copyShareCode}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          Share this code with someone you trust to open a one-to-one thread.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                      Sign in with Google to create your dedication identity and inbox.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserPlus className="h-5 w-5 text-rose-500" />
                    Start a private thread
                  </CardTitle>
                  <CardDescription>
                    Paste a friend&apos;s share code to open a private dedication chat.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Label htmlFor="share-code">Friend share code</Label>
                  <Input
                    id="share-code"
                    value={connectCode}
                    onChange={(event) => setConnectCode(normalizeShareCode(event.target.value))}
                    placeholder="Example: ABC12345"
                    disabled={!user || connecting}
                  />
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleConnect}
                    disabled={!user || connecting}
                  >
                    {connecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
                    Open private space
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Inbox className="h-5 w-5 text-slate-700" />
                    Inbox
                  </CardTitle>
                  <CardDescription>
                    Your active one-to-one dedication threads.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={threadSearch}
                      onChange={(event) => setThreadSearch(event.target.value)}
                      placeholder="Find by name or code"
                      className="pl-9"
                    />
                  </div>

                  <ScrollArea className="h-[360px] pr-4">
                    <div className="space-y-2">
                      {filteredThreads.length > 0 ? (
                        filteredThreads.map((thread) => {
                          const partner = getOtherParticipant(thread, user?.uid);
                          if (!partner) return null;

                          return (
                            <button
                              key={thread.id}
                              type="button"
                              onClick={() => setActiveThreadId(thread.id)}
                              className={cn(
                                "w-full rounded-2xl border p-3 text-left transition-colors",
                                activeThreadId === thread.id
                                  ? "border-rose-200 bg-rose-50"
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={partner.photoURL} />
                                  <AvatarFallback>{partner.displayName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="truncate font-medium text-slate-900">{partner.displayName}</p>
                                    <span className="text-xs text-slate-400">
                                      {formatThreadTime(thread.updatedAt)}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                                    {partner.shareCode}
                                  </p>
                                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                                    {thread.lastMessagePreview || "No messages yet"}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                          No matching dedication threads yet.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            <Card className="overflow-hidden border-slate-200">
              {activeThread && activePartner ? (
                <>
                  <CardHeader className="border-b bg-[linear-gradient(135deg,_#fff1f2,_#ffffff_45%,_#eef2ff)]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border border-white shadow-sm">
                          <AvatarImage src={activePartner.photoURL} />
                          <AvatarFallback>{activePartner.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl text-slate-950">{activePartner.displayName}</CardTitle>
                          <CardDescription className="mt-1">
                            Share code: {activePartner.shareCode}
                          </CardDescription>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="rounded-full">
                              <Lock className="mr-1 h-3 w-3" />
                              Private only
                            </Badge>
                            <Badge variant="outline" className="rounded-full">
                              <Sparkles className="mr-1 h-3 w-3" />
                              Media dedications
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
                        <DialogTrigger asChild>
                          <Button type="button" className="rounded-full">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Send dedication
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Create a dedication card</DialogTitle>
                            <DialogDescription>
                              Send something meaningful to {activePartner.displayName} with a note and mood.
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
                                    onClick={() => setDraft((current) => ({ ...current, kind: option.id }))}
                                    className={cn(
                                      "rounded-2xl border px-3 py-3 text-sm transition-colors",
                                      draft.kind === option.id
                                        ? "border-rose-300 bg-rose-50 text-rose-700"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                    )}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dedication-title">Title</Label>
                              <Input
                                id="dedication-title"
                                value={draft.title}
                                onChange={(event) =>
                                  setDraft((current) => ({ ...current, title: event.target.value }))
                                }
                                placeholder="Give this dedication a title"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dedication-creator">{currentOption.creatorLabel}</Label>
                              <Input
                                id="dedication-creator"
                                value={draft.creatorName}
                                onChange={(event) =>
                                  setDraft((current) => ({ ...current, creatorName: event.target.value }))
                                }
                                placeholder={`${currentOption.creatorLabel} name`}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dedication-url">{currentOption.urlLabel}</Label>
                              <Input
                                id="dedication-url"
                                value={draft.resourceUrl}
                                onChange={(event) =>
                                  setDraft((current) => ({ ...current, resourceUrl: event.target.value }))
                                }
                                placeholder="https://..."
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dedication-cover">Cover image URL</Label>
                              <Input
                                id="dedication-cover"
                                value={draft.coverUrl}
                                onChange={(event) =>
                                  setDraft((current) => ({ ...current, coverUrl: event.target.value }))
                                }
                                placeholder="Optional preview image"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dedication-mood">Mood</Label>
                              <Input
                                id="dedication-mood"
                                value={draft.mood}
                                onChange={(event) =>
                                  setDraft((current) => ({ ...current, mood: event.target.value }))
                                }
                                placeholder="Warm, soft, wild, nostalgic..."
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="dedication-note">Personal note</Label>
                              <Textarea
                                id="dedication-note"
                                value={draft.note}
                                onChange={(event) =>
                                  setDraft((current) => ({ ...current, note: event.target.value }))
                                }
                                placeholder={currentOption.placeholder}
                                className="min-h-[120px]"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setComposerOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="button" onClick={handleSendDedication} disabled={sendingDedication}>
                              {sendingDedication ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Heart className="mr-2 h-4 w-4" />
                              )}
                              Send dedication
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <Tabs value={feedTab} onValueChange={setFeedTab}>
                      <div className="border-b px-6 py-4">
                        <TabsList className="grid w-full max-w-sm grid-cols-2">
                          <TabsTrigger value="all">All messages</TabsTrigger>
                          <TabsTrigger value="dedications">Dedications only</TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="all" className="m-0">
                        <div className="grid min-h-[720px] grid-rows-[1fr_auto]">
                          <ScrollArea className="h-[520px] px-6 py-6">
                            <div className="space-y-4">
                              {visibleMessages.length > 0 ? (
                                visibleMessages.map((message) => {
                                  const own = message.senderUid === user?.uid;

                                  if (message.type === "system") {
                                    return (
                                      <div key={message.id} className="text-center text-xs uppercase tracking-[0.22em] text-slate-400">
                                        {message.text}
                                      </div>
                                    );
                                  }

                                  return (
                                    <div
                                      key={message.id}
                                      className={cn("flex", own ? "justify-end" : "justify-start")}
                                    >
                                      <div className="max-w-[85%] space-y-2">
                                        <div className="flex items-center gap-2 px-1 text-xs text-slate-400">
                                          <span>{own ? "You" : message.senderName}</span>
                                          <span>•</span>
                                          <span>{formatTimestamp(message.createdAt)}</span>
                                        </div>

                                        {message.type === "dedication" && message.dedication ? (
                                          <DedicationCard dedication={message.dedication} own={own} />
                                        ) : (
                                          <div
                                            className={cn(
                                              "rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
                                              own
                                                ? "bg-slate-950 text-white"
                                                : "border border-slate-200 bg-white text-slate-700"
                                            )}
                                          >
                                            {message.text}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                                  Nothing here yet. Start the conversation or send the first dedication card.
                                </div>
                              )}
                              <div ref={endRef} />
                            </div>
                          </ScrollArea>

                          <div className="border-t bg-slate-50/80 px-6 py-5">
                            <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                              <Textarea
                                value={messageText}
                                onChange={(event) => setMessageText(event.target.value)}
                                placeholder={`Message ${activePartner.displayName}...`}
                                className="min-h-[110px] bg-white"
                              />
                              <Button
                                type="button"
                                className="h-full min-h-[110px] rounded-2xl px-8"
                                onClick={handleSendText}
                                disabled={!messageText.trim() || sendingText}
                              >
                                {sendingText ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Send className="mr-2 h-4 w-4" />
                                )}
                                Send message
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="dedications" className="m-0">
                        <div className="grid min-h-[720px] grid-rows-[1fr_auto]">
                          <ScrollArea className="h-[520px] px-6 py-6">
                            <div className="space-y-4">
                              {visibleMessages.length > 0 ? (
                                visibleMessages.map((message) => {
                                  const own = message.senderUid === user?.uid;
                                  if (!message.dedication) return null;

                                  return (
                                    <div
                                      key={message.id}
                                      className={cn("flex", own ? "justify-end" : "justify-start")}
                                    >
                                      <div className="max-w-[85%] space-y-2">
                                        <div className="flex items-center gap-2 px-1 text-xs text-slate-400">
                                          <span>{own ? "You" : message.senderName}</span>
                                          <span>•</span>
                                          <span>{formatTimestamp(message.createdAt)}</span>
                                        </div>
                                        <DedicationCard dedication={message.dedication} own={own} />
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                                  No dedication cards in this thread yet.
                                </div>
                              )}
                              <div ref={endRef} />
                            </div>
                          </ScrollArea>

                          <div className="border-t bg-slate-50/80 px-6 py-5">
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed bg-white p-4">
                              <div className="space-y-1">
                                <p className="font-medium text-slate-900">Send a dedication card</p>
                                <p className="text-sm text-slate-500">
                                  Pick a media type, add a link, and write why it matters.
                                </p>
                              </div>
                              <Button type="button" onClick={() => setComposerOpen(true)}>
                                <Heart className="mr-2 h-4 w-4" />
                                New dedication
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex min-h-[760px] items-center justify-center p-8">
                  <div className="max-w-md space-y-5 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-rose-500">
                      <MessageSquare className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                        Open your first private dedication space
                      </h3>
                      <p className="text-sm leading-6 text-slate-500">
                        Sign in, copy your share code, or paste someone else&apos;s code in the left panel to begin.
                      </p>
                    </div>
                    <div className="grid gap-3 rounded-3xl border border-dashed p-5 text-left text-sm text-slate-600">
                      <div className="flex items-start gap-3">
                        <Shield className="mt-0.5 h-4 w-4 text-amber-500" />
                        <span>Private one-to-one threads only. No public wall in this MVP.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Heart className="mt-0.5 h-4 w-4 text-rose-500" />
                        <span>Dedicate songs, books, stories, images, and videos with a note.</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-4 w-4 text-indigo-500" />
                        <span>Built as an isolated feature layer so the rest of the platform stays untouched.</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        )}
      </div>
    </ToolTemplate>
  );
}
