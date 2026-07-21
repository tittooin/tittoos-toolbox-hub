import { useState } from "react";
import { CanonicalProduct } from "../types";

/**
 * Custom React hook placeholder for accessing product engine states.
 * Scoped strictly to contract, state, and loading placeholders as per constraints.
 */
export const useProduct = () => {
  const [products] = useState<CanonicalProduct[]>([]);
  const [loading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  return {
    products,
    loading,
    error
  };
};
