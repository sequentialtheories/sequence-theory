import { useEffect, useRef, useCallback } from 'react';

interface AutoRefreshOptions {
  interval?: number;
  onRefresh: () => Promise<void>;
  enabled?: boolean;
}

export const useAutoRefresh = ({ 
  interval = 60000, // 60 seconds default
  onRefresh, 
  enabled = true 
}: AutoRefreshOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(true);

  const startRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (enabled && isVisibleRef.current) {
      intervalRef.current = setInterval(() => {
        if (isVisibleRef.current) {
          onRefresh();
        }
      }, interval);
    }
  }, [interval, onRefresh, enabled]);

  const stopRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current) {
        startRefresh();
      } else {
        stopRefresh();
      }
    };

    const handleFocus = () => {
      isVisibleRef.current = true;
      startRefresh();
    };

    const handleBlur = () => {
      isVisibleRef.current = false;
      stopRefresh();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Start refresh on mount
    startRefresh();

    return () => {
      stopRefresh();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [startRefresh, stopRefresh]);

  return { startRefresh, stopRefresh };
};