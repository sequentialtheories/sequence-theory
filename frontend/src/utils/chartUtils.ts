interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volumeUsd: number;
}

export const normalizeCandles = (candles: Candle[], timePeriod: string): Candle[] => {
  if (!candles.length) return [];
  
  // Sort by time ascending
  const sorted = [...candles].sort((a, b) => a.time - b.time);
  
  // Determine expected interval based on time period
  const intervals = {
    daily: 3600, // 1 hour
    month: 3600, // 1 hour
    year: 86400, // 1 day
    all: 86400 // 1 day
  };
  
  const interval = intervals[timePeriod as keyof typeof intervals] || 3600;
  
  // Validate data continuity (lightweight-charts handles gaps automatically)
  const normalized: Candle[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    normalized.push(current);
    
    if (i < sorted.length - 1) {
      const next = sorted[i + 1];
      const gap = next.time - current.time;
      
      // Log warning if there's a significant gap (more than 2x expected interval)
      if (gap > interval * 2) {
        console.debug(`Chart data gap detected: ${gap}s between ${new Date(current.time * 1000).toISOString()} and ${new Date(next.time * 1000).toISOString()}`);
      }
    }
  }
  
  return normalized;
};

export const formatChartTime = (time: number, timePeriod: string): string => {
  const date = new Date(time * 1000);
  
  switch (timePeriod) {
    case 'daily':
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'month':
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit'
      });
    case 'year':
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    case 'all':
      return date.toLocaleString('en-US', { 
        year: 'numeric',
        month: 'short'
      });
    default:
      return date.toLocaleDateString();
  }
};
