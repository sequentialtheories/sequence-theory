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
  if (!raw || raw.length === 0) return [];

  // 1) Sort by time
  const sorted = [...raw].sort((a, b) => Number(a.time) - Number(b.time));

  // 2) Deduplicate: keep the last bar for each timestamp
  const map = new Map<number, RawCandle>();
  for (const c of sorted) {
    const t = Number(c.time);
    if (!isNaN(t)) {
      map.set(t, c);
    }
  }

  // 3) Validate invariants & coerce numbers
  const cleaned: NormalizedCandle[] = [];
  for (const c of map.values()) {
    const time = Number(c.time);
    const open = Number(c.open);
    const high = Number(c.high);
    const low = Number(c.low);
    const close = Number(c.close);
    const vol = Number(c.volumeUsd) || 0;

    // Skip invalid data
    if (isNaN(time) || isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close)) {
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

  return cleaned.sort((a, b) => a.time - b.time);
}
