export interface WorkspaceFavorite {
  toolId: string;
  addedAt: number;
}

export interface WorkspaceRecentItem {
  id: string;
  title: string;
  type: "tool" | "workflow" | "template" | "battle" | "creator" | "pdf";
  path?: string;
  subtitle?: string;
  timestamp: number;
}

export interface WorkspaceSavedItem {
  id: string;
  title: string;
  description: string;
  path?: string;
  type: "workflow" | "template" | "creator" | "battle" | "pdf";
  savedAt: number;
  relatedIds?: string[];
}

export interface WorkspacePdfSession {
  id: string;
  fileName: string;
  pageCount: number;
  extractedChars: number;
  preview: string;
  savedAt: number;
}

export interface WorkspaceSnapshot {
  favorites: WorkspaceFavorite[];
  recents: WorkspaceRecentItem[];
  savedItems: WorkspaceSavedItem[];
  pdfSessions: WorkspacePdfSession[];
}

const STORAGE_KEY = "axevora-workspace-v1";
const EVENT_NAME = "axevora-workspace-updated";

const defaultSnapshot = (): WorkspaceSnapshot => ({
  favorites: [],
  recents: [],
  savedItems: [],
  pdfSessions: []
});

const ensureBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const readWorkspaceSnapshot = (): WorkspaceSnapshot => {
  if (!ensureBrowser()) return defaultSnapshot();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSnapshot();
    const parsed = JSON.parse(raw) as Partial<WorkspaceSnapshot>;
    return {
      favorites: parsed.favorites ?? [],
      recents: parsed.recents ?? [],
      savedItems: parsed.savedItems ?? [],
      pdfSessions: parsed.pdfSessions ?? []
    };
  } catch (error) {
    console.error("Failed to parse workspace snapshot", error);
    return defaultSnapshot();
  }
};

export const writeWorkspaceSnapshot = (snapshot: WorkspaceSnapshot) => {
  if (!ensureBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
};

const uniqueById = <T extends { id: string }>(items: T[]) => {
  const map = new Map<string, T>();
  items.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
};

export const subscribeWorkspaceUpdates = (callback: () => void) => {
  if (!ensureBrowser()) return () => undefined;
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
};

export const toggleFavorite = (toolId: string) => {
  const snapshot = readWorkspaceSnapshot();
  const exists = snapshot.favorites.some((item) => item.toolId === toolId);
  const favorites = exists
    ? snapshot.favorites.filter((item) => item.toolId !== toolId)
    : [{ toolId, addedAt: Date.now() }, ...snapshot.favorites];

  writeWorkspaceSnapshot({
    ...snapshot,
    favorites: favorites.slice(0, 40)
  });
};

export const addRecentItem = (item: WorkspaceRecentItem) => {
  const snapshot = readWorkspaceSnapshot();
  const recents = uniqueById([item, ...snapshot.recents])
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 30);

  writeWorkspaceSnapshot({
    ...snapshot,
    recents
  });
};

export const saveWorkspaceItem = (item: WorkspaceSavedItem) => {
  const snapshot = readWorkspaceSnapshot();
  const savedItems = uniqueById([item, ...snapshot.savedItems])
    .sort((a, b) => b.savedAt - a.savedAt)
    .slice(0, 30);

  writeWorkspaceSnapshot({
    ...snapshot,
    savedItems
  });
};

export const removeWorkspaceItem = (id: string) => {
  const snapshot = readWorkspaceSnapshot();
  writeWorkspaceSnapshot({
    ...snapshot,
    savedItems: snapshot.savedItems.filter((item) => item.id !== id)
  });
};

export const savePdfSession = (session: WorkspacePdfSession) => {
  const snapshot = readWorkspaceSnapshot();
  const pdfSessions = uniqueById([session, ...snapshot.pdfSessions])
    .sort((a, b) => b.savedAt - a.savedAt)
    .slice(0, 12);

  writeWorkspaceSnapshot({
    ...snapshot,
    pdfSessions
  });
};

export const clearRecentItems = () => {
  const snapshot = readWorkspaceSnapshot();
  writeWorkspaceSnapshot({
    ...snapshot,
    recents: []
  });
};
