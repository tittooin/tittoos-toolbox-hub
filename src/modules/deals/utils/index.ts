import { DealProduct } from "../types";

export const formatCurrency = (amount: number, currency = "INR"): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateDiscount = (original: number, discounted: number): number => {
  if (original <= 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
};

export const filterDealsByCategory = (deals: DealProduct[], category: string): DealProduct[] => {
  return deals.filter(deal => deal.category.toLowerCase() === category.toLowerCase());
};
