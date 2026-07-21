import { useState, useEffect } from "react";
import { ContentItem, ContentTypeConfig } from "../types";
import { CONTENT_TYPES_REGISTRY } from "../constants/registry";

export const useCMS = () => {
  const [contentTypes] = useState<ContentTypeConfig[]>(CONTENT_TYPES_REGISTRY);
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return { contentTypes, items, loading, error, setItems };
};
