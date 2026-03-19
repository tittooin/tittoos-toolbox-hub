import type { User } from "firebase/auth";

export type DedicationKind = "song" | "book" | "story" | "image" | "video";

export interface DedicationProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  shareCode: string;
  searchName: string;
}

export interface DedicationParticipant {
  uid: string;
  displayName: string;
  photoURL: string;
  shareCode: string;
}

export interface DedicationPayload {
  kind: DedicationKind;
  title: string;
  creatorName: string;
  resourceUrl: string;
  coverUrl: string;
  note: string;
  mood: string;
}

export interface DedicationThread {
  id: string;
  memberIds: string[];
  participants: DedicationParticipant[];
  lastMessagePreview?: string;
  lastMessageType?: "text" | "dedication" | "system";
  updatedAt?: {
    toMillis?: () => number;
    toDate?: () => Date;
  } | null;
}

export interface DedicationMessage {
  id: string;
  type: "text" | "dedication" | "system";
  senderUid: string;
  senderName: string;
  text?: string;
  dedication?: DedicationPayload;
  createdAt?: {
    toMillis?: () => number;
    toDate?: () => Date;
  } | null;
}

export const DEDICATION_TYPE_OPTIONS: Array<{
  id: DedicationKind;
  label: string;
  creatorLabel: string;
  urlLabel: string;
  placeholder: string;
}> = [
  {
    id: "song",
    label: "Song",
    creatorLabel: "Artist",
    urlLabel: "Song link",
    placeholder: "This song says exactly what I couldn't put into words.",
  },
  {
    id: "book",
    label: "Book",
    creatorLabel: "Author",
    urlLabel: "Book link",
    placeholder: "You would love this book because...",
  },
  {
    id: "story",
    label: "Story",
    creatorLabel: "Writer",
    urlLabel: "Story link",
    placeholder: "This story reminded me of us because...",
  },
  {
    id: "image",
    label: "Image",
    creatorLabel: "Source",
    urlLabel: "Image link",
    placeholder: "I saved this image for you because...",
  },
  {
    id: "video",
    label: "Video",
    creatorLabel: "Creator",
    urlLabel: "Video link",
    placeholder: "Watch this when you need a smile.",
  },
];

export function normalizeShareCode(input: string) {
  return input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8);
}

export function buildShareCode(uid: string) {
  return normalizeShareCode(uid);
}

export function buildThreadId(a: string, b: string) {
  return [a, b].sort().join("_");
}

export function buildParticipantFromProfile(profile: DedicationProfile): DedicationParticipant {
  return {
    uid: profile.uid,
    displayName: profile.displayName,
    photoURL: profile.photoURL,
    shareCode: profile.shareCode,
  };
}

export function buildProfileFromUser(user: User): DedicationProfile {
  return {
    uid: user.uid,
    displayName: user.displayName || "Axevora User",
    photoURL: user.photoURL || "",
    shareCode: buildShareCode(user.uid),
    searchName: (user.displayName || "Axevora User").toLowerCase(),
  };
}

export function getOtherParticipant(
  thread: DedicationThread | null | undefined,
  currentUserId: string | undefined
) {
  if (!thread || !currentUserId) return null;
  return thread.participants.find((participant) => participant.uid !== currentUserId) || null;
}

export function getDedicationOption(kind: DedicationKind) {
  return DEDICATION_TYPE_OPTIONS.find((option) => option.id === kind) || DEDICATION_TYPE_OPTIONS[0];
}

export function formatDedicationPreview(kind: DedicationKind, title: string) {
  const option = getDedicationOption(kind);
  return `${option.label} dedicated: ${title}`;
}

