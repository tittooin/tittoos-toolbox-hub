
import { useState, useEffect } from 'react';

export const useUsageLimit = (toolId: string, limit: number = 3) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(`usage_${toolId}`);
    if (stored) {
      setCount(parseInt(stored, 10));
    }
  }, [toolId]);

  const incrementUsage = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem(`usage_${toolId}`, newCount.toString());
    return newCount;
  };

  const resetUsage = () => {
    setCount(0);
    localStorage.removeItem(`usage_${toolId}`);
  };

  const isLimitReached = count >= limit;

  return { count, incrementUsage, isLimitReached, resetUsage };
};
