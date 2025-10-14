interface RawCandle {
  time: number;
  open: number | string;
  high: number | string;
  low: number | string;
  close: number | string;
  volumeUsd: number | string;
}

export interface NormalizedCandle {
  time: number; // seconds (UTC)
  open: number;
  high: number;
  low: number;
  close: number;
  volumeUsd: number;
}

/**
 * Normalizes candle data for professional chart rendering:
 * - Sorts by time
 * - Deduplicates (keeps last bar per timestamp)
 * - Enforces OHLC invariants (high >= open/close, low <= open/close)
 * - Coerces all values to numbers
 */
export function normalizeCandles(raw: RawCandle[]): NormalizedCandle[] {
  if (!raw || raw.length === 0) {
    console.log('[normalizeCandles] Empty or undefined input');
    return [];
  }

  console.log(`[normalizeCandles] Processing ${raw.length} candles, first candle:`, raw[0]);

  // 1) Sort by time
  const sorted = [...raw].sort((a, b) => Number(a.time) - Number(b.time));

  // 2) Deduplicate: keep the last bar for each timestamp
  const map = new Map<number, RawCandle>();
  for (const c of sorted) {
    const t = Number(c.time);
    if (!isNaN(t) && t > 0) {
      map.set(t, c);
    } else {
      console.warn('[normalizeCandles] Skipping invalid time:', c);
    }
  }

  // 3) Validate invariants & coerce numbers
  const cleaned: NormalizedCandle[] = [];
  for (const c of map.values()) {
    let time = Number(c.time);
    const open = Number(c.open);
    const high = Number(c.high);
    const low = Number(c.low);
    const close = Number(c.close);
    const vol = Number(c.volumeUsd) || 0;

    // Convert milliseconds to seconds if needed (lightweight-charts expects seconds)
    // Timestamps > 10^10 are likely in milliseconds
    if (time > 10000000000) {
      time = Math.floor(time / 1000);
    }

    // Skip invalid data - must have valid time and OHLC
    if (isNaN(time) || time <= 0 || isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close)) {
      console.warn('[normalizeCandles] Skipping invalid candle:', { time, open, high, low, close });
      continue;
    }

    // Enforce high/low envelope
    const hi = Math.max(high, open, close);
    const lo = Math.min(low, open, close);

    cleaned.push({
      time,
      open,
      high: hi,
      low: lo,
      close,
      volumeUsd: vol,
    });
  }

  const result = cleaned.sort((a, b) => a.time - b.time);
  console.log(`[normalizeCandles] Cleaned ${result.length} valid candles from ${raw.length} raw`);
  
  if (result.length > 0) {
    console.log('[normalizeCandles] First cleaned candle:', result[0]);
    console.log('[normalizeCandles] Last cleaned candle:', result[result.length - 1]);
  }

  return result;
}
