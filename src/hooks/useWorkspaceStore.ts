import { useEffect, useMemo, useState } from "react";
import {
  WorkspaceSnapshot,
  addRecentItem,
  clearRecentItems,
  readWorkspaceSnapshot,
  removeWorkspaceItem,
  savePdfSession,
  saveWorkspaceItem,
  subscribeWorkspaceUpdates,
  toggleFavorite
} from "@/lib/workspaceStore";

export const useWorkspaceStore = () => {
  const [snapshot, setSnapshot] = useState<WorkspaceSnapshot>(() => readWorkspaceSnapshot());

  useEffect(() => {
    setSnapshot(readWorkspaceSnapshot());
    return subscribeWorkspaceUpdates(() => {
      setSnapshot(readWorkspaceSnapshot());
    });
  }, []);

  const favoriteIds = useMemo(
    () => new Set(snapshot.favorites.map((item) => item.toolId)),
    [snapshot.favorites]
  );

  return {
    snapshot,
    favoriteIds,
    toggleFavorite,
    addRecentItem,
    saveWorkspaceItem,
    removeWorkspaceItem,
    savePdfSession,
    clearRecentItems
  };
};
