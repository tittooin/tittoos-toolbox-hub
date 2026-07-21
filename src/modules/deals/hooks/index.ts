import { useState, useEffect, useMemo } from "react";
import { DealProduct } from "../types";
import { DEALS_ENGINE_DEFAULT_CONFIG } from "../config";

export const useDeals = (initialDeals: DealProduct[] = []) => {
  const [deals, setDeals] = useState<DealProduct[]>(initialDeals);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search & Filter state configurations
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>(DEALS_ENGINE_DEFAULT_CONFIG.sorting.defaultSortBy);

  // Memoized filter and sorting engine
  const processedDeals = useMemo(() => {
    let result = [...deals];

    // 1. Search Behaviour
    if (searchQuery.trim().length >= DEALS_ENGINE_DEFAULT_CONFIG.search.minChars) {
      const query = searchQuery.toLowerCase();
      result = result.filter(deal => {
        return DEALS_ENGINE_DEFAULT_CONFIG.search.searchFields.some(field => {
          const val = (deal as any)[field];
          return typeof val === "string" && val.toLowerCase().includes(query);
        });
      });
    }

    // 2. Category filtering
    if (selectedCategory !== "all") {
      result = result.filter(deal => deal.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 3. Store filtering
    if (selectedStore !== "all") {
      result = result.filter(deal => deal.storeName.toLowerCase() === selectedStore.toLowerCase());
    }

    // 4. Sorting behavior
    result.sort((a, b) => {
      if (sortBy === "discount") {
        return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      }
      if (sortBy === "price-asc") {
        return a.discountedPrice - b.discountedPrice;
      }
      if (sortBy === "price-desc") {
        return b.discountedPrice - a.discountedPrice;
      }
      // Default: Latest created
      const dateA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
      const dateB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
      return dateB - dateA;
    });

    return result;
  }, [deals, searchQuery, selectedCategory, selectedStore, sortBy]);

  return {
    deals: processedDeals,
    rawDeals: deals,
    setDeals,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedStore,
    setSelectedStore,
    sortBy,
    setSortBy
  };
};
