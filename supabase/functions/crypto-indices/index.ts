import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
}

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volumeUsd: number;
}

interface IndexResponse {
  index: 'Anchor5' | 'Vibe20' | 'Wave100';
  baseValue: number;
  timeframe: '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
  candles: Candle[];
  currentValue: number;
  change_24h_percentage: number;
  meta: {
    tz: 'UTC';
    constituents: Array<{symbol: string; weight: number; id: string; price: number; market_cap: number; total_volume: number; price_change_percentage_24h: number}>;
    rebalanceFrequency: 'daily' | 'weekly' | 'monthly';
  };
}

interface IndexLevel {
  timestamp: number;
  value: number;
  volume: number;
}

interface HistoricalPriceData {
  timestamp: number;
  price: number;
  volume: number;
}

function validateCandle(candle: Candle): boolean {
  const {open, close, high, low, volumeUsd} = candle;
  return (
    !isNaN(open) && !isNaN(close) && !isNaN(high) && !isNaN(low) &&
    isFinite(open) && isFinite(close) && isFinite(high) && isFinite(low) &&
    high >= Math.max(open, close) &&
    low <= Math.min(open, close) &&
    volumeUsd >= 0
  );
}

function interpolateData(data: HistoricalPriceData[], targetCount: number): HistoricalPriceData[] {
  if (data.length === 0) return [];
  if (data.length >= targetCount) return data;
  
  console.log(`[interpolateData] Interpolating ${data.length} points to ${targetCount}`);
  
  const result: HistoricalPriceData[] = [];
  const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
  
  const startTime = sortedData[0].timestamp;
  const endTime = sortedData[sortedData.length - 1].timestamp;
  const interval = (endTime - startTime) / (targetCount - 1);
  
  for (let i = 0; i < targetCount; i++) {
    const targetTime = startTime + (interval * i);
    
    let before = sortedData[0];
    let after = sortedData[sortedData.length - 1];
    
    for (let j = 0; j < sortedData.length - 1; j++) {
      if (sortedData[j].timestamp <= targetTime && sortedData[j + 1].timestamp >= targetTime) {
        before = sortedData[j];
        after = sortedData[j + 1];
        break;
      }
    }
    
    if (before.timestamp === after.timestamp) {
      result.push({
        timestamp: Math.floor(targetTime),
        price: before.price,
        volume: before.volume
      });
    } else {
      const ratio = (targetTime - before.timestamp) / (after.timestamp - before.timestamp);
      result.push({
        timestamp: Math.floor(targetTime),
        price: before.price + (after.price - before.price) * ratio,
        volume: before.volume + (after.volume - before.volume) * ratio
      });
    }
  }
  
  return result;
}

function aggregateToCandles(indexLevels: IndexLevel[], periodSeconds: number, minCandles: number = 0): Candle[] {
  if (indexLevels.length === 0) return [];
  
  if (minCandles > 0 && indexLevels.length < minCandles / 2) {
    console.log(`[aggregateToCandles] Insufficient data (${indexLevels.length} points), interpolating to ${minCandles * 2}`);
    const interpolated = interpolateData(
      indexLevels.map(l => ({ timestamp: l.timestamp, price: l.value, volume: l.volume })),
      minCandles * 2
    );
    indexLevels = interpolated.map(d => ({ timestamp: d.timestamp, value: d.price, volume: d.volume }));
  }
  
  const periodMap = new Map<number, IndexLevel[]>();
  
  indexLevels.forEach(level => {
    const periodStart = Math.floor(level.timestamp / periodSeconds) * periodSeconds;
    if (!periodMap.has(periodStart)) {
      periodMap.set(periodStart, []);
    }
    periodMap.get(periodStart)!.push(level);
  });
  
  const candles: Candle[] = [];
  const sortedPeriods = Array.from(periodMap.keys()).sort((a, b) => a - b);
  
  for (const periodStart of sortedPeriods) {
    const levels = periodMap.get(periodStart)!;
    levels.sort((a, b) => a.timestamp - b.timestamp);
    
    const open = levels[0].value;
    const close = levels[levels.length - 1].value;
    const high = Math.max(...levels.map(l => l.value));
    const low = Math.min(...levels.map(l => l.value));
    const volumeUsd = levels.reduce((sum, l) => sum + l.volume, 0);
    
    const candle: Candle = {
      time: periodStart,
      open,
      high,
      low,
      close,
      volumeUsd
    };
    
    if (validateCandle(candle)) {
      candles.push(candle);
    }
  }
  
  console.log(`[aggregateToCandles] Generated ${candles.length} candles from ${indexLevels.length} levels`);
  
  return candles;
}

async function fetchHistoricalPrices(
  coinId: string, 
  fromTimestamp: number, 
  toTimestamp: number,
  apiKey: string,
  timePeriod: string
): Promise<HistoricalPriceData[]> {
  try {
    const endpoint = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`;
    
    const response = await fetch(endpoint, {
      headers: {
        'x-cg-demo-api-key': apiKey,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${coinId}: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    const result: HistoricalPriceData[] = [];
    const prices = data.prices || [];
    const volumes = data.total_volumes || [];
    
    for (let i = 0; i < prices.length; i++) {
      result.push({
        timestamp: Math.floor(prices[i][0] / 1000),
        price: prices[i][1],
        volume: volumes[i] ? volumes[i][1] : 0
      });
    }
    
    console.log(`[fetchHistoricalPrices] ${coinId}: Got ${result.length} data points for ${timePeriod}`);
    
    return result;
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error);
    return [];
  }
}

async function calculateAnchor5(
  marketData: CoinData[], 
  fromTimestamp: number, 
  toTimestamp: number,
  apiKey: string,
  timePeriod: string
): Promise<IndexResponse> {
  const stablecoins = new Set(['usdt', 'usdc', 'busd', 'dai', 'tusd', 'fdusd', 'usdd', 'usdp', 'gusd', 'pyusd', 'frax']);
  
  const scoredCoins = marketData
    .filter(coin => !stablecoins.has(coin.symbol.toLowerCase()))
    .filter(coin => coin.market_cap_rank <= 50)
    .map(coin => {
      const priceRank = Math.max(0, 100 - (coin.current_price > 1000 ? 20 : coin.current_price > 100 ? 15 : coin.current_price > 10 ? 10 : 5));
      const mCapRank = Math.max(0, 100 - coin.market_cap_rank);
      const stabilityRank = Math.max(0, 100 - Math.abs(coin.price_change_percentage_30d || 0));
      const walletRank = coin.market_cap > 0 ? Math.min(100, coin.market_cap / 1000000000) : 0;
      
      return { ...coin, stabilityScore: priceRank + mCapRank + stabilityRank + walletRank };
    })
    .sort((a, b) => b.stabilityScore - a.stabilityScore)
    .slice(0, 5);
  
  if (scoredCoins.length === 0) {
    return {
      index: 'Anchor5',
      baseValue: 1000,
      timeframe: '1h',
      candles: [],
      currentValue: 1000,
      change_24h_percentage: 0,
      meta: {
        tz: 'UTC',
        constituents: [],
        rebalanceFrequency: 'weekly'
      }
    };
  }
  
  const divisor = 10;
  const totalCurrentPrice = scoredCoins.reduce((sum, c) => sum + c.current_price, 0);
  const currentValue = Math.round((totalCurrentPrice / divisor));
  
  const historicalPromises = scoredCoins.map(coin => 
    fetchHistoricalPrices(coin.id, fromTimestamp, toTimestamp, apiKey, timePeriod)
  );
  const historicalArrays = await Promise.all(historicalPromises);
  
  const timestampSet = new Set<number>();
  historicalArrays.forEach(arr => arr.forEach(d => timestampSet.add(d.timestamp)));
  const timestamps = Array.from(timestampSet).sort((a, b) => a - b);
  
  const indexLevels: IndexLevel[] = [];
  
  for (const timestamp of timestamps) {
    let priceSum = 0;
    let volumeSum = 0;
    let validCount = 0;
    
    for (let i = 0; i < scoredCoins.length; i++) {
      const hist = historicalArrays[i];
      const dataPoint = hist.find(d => Math.abs(d.timestamp - timestamp) < 1800);
      
      if (dataPoint) {
        priceSum += dataPoint.price;
        volumeSum += dataPoint.volume;
        validCount++;
      } else {
        priceSum += scoredCoins[i].current_price;
      }
    }
    
    if (validCount > 0) {
      const indexValue = (priceSum / divisor);
      indexLevels.push({
        timestamp,
        value: indexValue,
        volume: volumeSum
      });
    }
  }
  
  let periodSeconds: number;
  let timeframe: '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
  let minCandles: number;
  
  switch (timePeriod) {
    case 'daily':
      periodSeconds = 1800;
      timeframe = '15m';
      minCandles = 48;
      break;
    case 'month':
      periodSeconds = 3600;
      timeframe = '1h';
      minCandles = 720;
      break;
    case 'year':
      periodSeconds = 86400;
      timeframe = '1d';
      minCandles = 365;
      break;
    default:
      periodSeconds = 604800;
      timeframe = '1w';
      minCandles = 52;
  }
  
  const candles = aggregateToCandles(indexLevels, periodSeconds, minCandles);
  
  const now = Math.floor(Date.now() / 1000);
  const yesterday = now - 86400;
  const yesterdayCandle = candles.find(c => Math.abs(c.time - yesterday) < 3600) || candles[Math.max(0, candles.length - 2)];
  const change_24h_percentage = yesterdayCandle ? ((currentValue - yesterdayCandle.close) / yesterdayCandle.close) * 100 : 0;
  
  console.log(`[Anchor5] Generated ${candles.length} candles for ${timePeriod}`);
  
  return {
    index: 'Anchor5',
    baseValue: 1000,
    timeframe,
    candles,
    currentValue,
    change_24h_percentage,
    meta: {
      tz: 'UTC',
      constituents: scoredCoins.map(c => ({
        symbol: c.symbol.toUpperCase(),
        weight: (c.current_price / totalCurrentPrice) * 100,
        id: c.id,
        price: c.current_price,
        market_cap: c.market_cap,
        total_volume: c.total_volume,
        price_change_percentage_24h: c.price_change_percentage_24h
      })),
      rebalanceFrequency: 'weekly'
    }
  };
}

async function calculateVibe20(
  marketData: CoinData[], 
  fromTimestamp: number, 
  toTimestamp: number,
  apiKey: string,
  timePeriod: string
): Promise<IndexResponse> {
  const stablecoins = new Set(['usdt', 'usdc', 'busd', 'dai', 'tusd', 'fdusd', 'usdd', 'usdp', 'gusd', 'pyusd', 'frax']);
  
  const top20 = marketData
    .filter(coin => !stablecoins.has(coin.symbol.toLowerCase()))
    .sort((a, b) => b.total_volume - a.total_volume)
    .slice(0, 20);
  
  if (top20.length === 0) {
    return {
      index: 'Vibe20',
      baseValue: 1000,
      timeframe: '1h',
      candles: [],
      currentValue: 1000,
      change_24h_percentage: 0,
      meta: {
        tz: 'UTC',
        constituents: [],
        rebalanceFrequency: 'daily'
      }
    };
  }
  
  const totalWeightBase = top20.reduce((sum, coin) => sum + (coin.total_volume * coin.market_cap), 0);
  const weightedCoins = top20.map(coin => ({
    ...coin,
    weight: (coin.total_volume * coin.market_cap) / totalWeightBase
  }));
  
  const currentValue = Math.round(
    weightedCoins.reduce((sum, coin) => sum + (coin.current_price * coin.weight), 0) * 1000
  );
  
  const historicalPromises = weightedCoins.map(coin => 
    fetchHistoricalPrices(coin.id, fromTimestamp, toTimestamp, apiKey, timePeriod)
  );
  const historicalArrays = await Promise.all(historicalPromises);
  
  const timestampSet = new Set<number>();
  historicalArrays.forEach(arr => arr.forEach(d => timestampSet.add(d.timestamp)));
  const timestamps = Array.from(timestampSet).sort((a, b) => a - b);
  
  const indexLevels: IndexLevel[] = [];
  
  for (const timestamp of timestamps) {
    let weightedPriceSum = 0;
    let volumeSum = 0;
    let validCount = 0;
    
    for (let i = 0; i < weightedCoins.length; i++) {
      const hist = historicalArrays[i];
      const dataPoint = hist.find(d => Math.abs(d.timestamp - timestamp) < 1800);
      
      if (dataPoint) {
        weightedPriceSum += dataPoint.price * weightedCoins[i].weight;
        volumeSum += dataPoint.volume;
        validCount++;
      } else {
        weightedPriceSum += weightedCoins[i].current_price * weightedCoins[i].weight;
      }
    }
    
    if (validCount > 0) {
      const indexValue = weightedPriceSum * 1000;
      indexLevels.push({
        timestamp,
        value: indexValue,
        volume: volumeSum
      });
    }
  }
  
  let periodSeconds: number;
  let timeframe: '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
  let minCandles: number;
  
  switch (timePeriod) {
    case 'daily':
      periodSeconds = 1800;
      timeframe = '15m';
      minCandles = 48;
      break;
    case 'month':
      periodSeconds = 3600;
      timeframe = '1h';
      minCandles = 720;
      break;
    case 'year':
      periodSeconds = 86400;
      timeframe = '1d';
      minCandles = 365;
      break;
    default:
      periodSeconds = 604800;
      timeframe = '1w';
      minCandles = 52;
  }
  
  const candles = aggregateToCandles(indexLevels, periodSeconds, minCandles);
  
  const now = Math.floor(Date.now() / 1000);
  const yesterday = now - 86400;
  const yesterdayCandle = candles.find(c => Math.abs(c.time - yesterday) < 3600) || candles[Math.max(0, candles.length - 2)];
  const change_24h_percentage = yesterdayCandle ? ((currentValue - yesterdayCandle.close) / yesterdayCandle.close) * 100 : 0;
  
  console.log(`[Vibe20] Generated ${candles.length} candles for ${timePeriod}`);
  
  return {
    index: 'Vibe20',
    baseValue: 1000,
    timeframe,
    candles,
    currentValue,
    change_24h_percentage,
    meta: {
      tz: 'UTC',
      constituents: weightedCoins.map(c => ({
        symbol: c.symbol.toUpperCase(),
        weight: c.weight * 100,
        id: c.id,
        price: c.current_price,
        market_cap: c.market_cap,
        total_volume: c.total_volume,
        price_change_percentage_24h: c.price_change_percentage_24h
      })),
      rebalanceFrequency: 'daily'
    }
  };
}

async function calculateWave100(
  marketData: CoinData[], 
  fromTimestamp: number, 
  toTimestamp: number,
  apiKey: string,
  timePeriod: string
): Promise<IndexResponse> {
  const stablecoins = new Set(['usdt', 'usdc', 'busd', 'dai', 'tusd', 'fdusd', 'usdd', 'usdp', 'gusd', 'pyusd', 'frax']);
  
  const getPriceChange = (coin: CoinData): number => {
    switch (timePeriod) {
      case 'daily':
        return coin.price_change_percentage_24h ?? 0;
      case 'month':
        return coin.price_change_percentage_30d ?? coin.price_change_percentage_7d ?? 0;
      default:
        return coin.price_change_percentage_30d ?? 0;
    }
  };
  
  const momentumCoins = marketData
    .filter(coin => !stablecoins.has(coin.symbol.toLowerCase()))
    .filter(coin => coin.current_price > 0 && coin.market_cap > 0)
    .map(coin => ({
      ...coin,
      momentum: getPriceChange(coin)
    }))
    .sort((a, b) => b.momentum - a.momentum)
    .slice(0, 100);
  
  if (momentumCoins.length === 0) {
    return {
      index: 'Wave100',
      baseValue: 1000,
      timeframe: '1h',
      candles: [],
      currentValue: 1000,
      change_24h_percentage: 0,
      meta: {
        tz: 'UTC',
        constituents: [],
        rebalanceFrequency: 'daily'
      }
    };
  }
  
  const weightedCoins = momentumCoins.map(coin => ({
    ...coin,
    weight: 1 / momentumCoins.length
  }));
  
  const currentValue = Math.round(
    weightedCoins.reduce((sum, coin) => sum + (coin.current_price * coin.weight), 0) * 1000
  );
  
  const top20 = weightedCoins.slice(0, 20);
  const historicalPromises = top20.map(coin => 
    fetchHistoricalPrices(coin.id, fromTimestamp, toTimestamp, apiKey, timePeriod)
  );
  const historicalArrays = await Promise.all(historicalPromises);
  
  const timestampSet = new Set<number>();
  historicalArrays.forEach(arr => arr.forEach(d => timestampSet.add(d.timestamp)));
  const timestamps = Array.from(timestampSet).sort((a, b) => a - b);
  
  const indexLevels: IndexLevel[] = [];
  
  for (const timestamp of timestamps) {
    let weightedPriceSum = 0;
    let volumeSum = 0;
    let validCount = 0;
    
    for (let i = 0; i < top20.length; i++) {
      const hist = historicalArrays[i];
      const dataPoint = hist.find(d => Math.abs(d.timestamp - timestamp) < 1800);
      
      if (dataPoint) {
        weightedPriceSum += dataPoint.price * top20[i].weight;
        volumeSum += dataPoint.volume;
        validCount++;
      } else {
        weightedPriceSum += top20[i].current_price * top20[i].weight;
      }
    }
    
    if (validCount > 0) {
      const indexValue = weightedPriceSum * 1000;
      indexLevels.push({
        timestamp,
        value: indexValue,
        volume: volumeSum
      });
    }
  }
  
  let periodSeconds: number;
  let timeframe: '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
  let minCandles: number;
  
  switch (timePeriod) {
    case 'daily':
      periodSeconds = 1800;
      timeframe = '15m';
      minCandles = 48;
      break;
    case 'month':
      periodSeconds = 3600;
      timeframe = '1h';
      minCandles = 720;
      break;
    case 'year':
      periodSeconds = 86400;
      timeframe = '1d';
      minCandles = 365;
      break;
    default:
      periodSeconds = 604800;
      timeframe = '1w';
      minCandles = 52;
  }
  
  const candles = aggregateToCandles(indexLevels, periodSeconds, minCandles);
  
  const now = Math.floor(Date.now() / 1000);
  const yesterday = now - 86400;
  const yesterdayCandle = candles.find(c => Math.abs(c.time - yesterday) < 3600) || candles[Math.max(0, candles.length - 2)];
  const change_24h_percentage = yesterdayCandle ? ((currentValue - yesterdayCandle.close) / yesterdayCandle.close) * 100 : 0;
  
  console.log(`[Wave100] Generated ${candles.length} candles for ${timePeriod}`);
  
  return {
    index: 'Wave100',
    baseValue: 1000,
    timeframe,
    candles,
    currentValue,
    change_24h_percentage,
    meta: {
      tz: 'UTC',
      constituents: weightedCoins
        .slice(0, 20)
        .sort((a, b) => (b.price_change_percentage_24h ?? -Infinity) - (a.price_change_percentage_24h ?? -Infinity))
        .map(c => ({
          symbol: c.symbol.toUpperCase(),
          weight: c.weight * 100,
          id: c.id,
          price: c.current_price,
          market_cap: c.market_cap,
          total_volume: c.total_volume,
          price_change_percentage_24h: c.price_change_percentage_24h
        })),
      rebalanceFrequency: 'daily'
    }
  };
}

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 120000;

function getCacheKey(timePeriod: string): string {
  return `indices_${timePeriod}`;
}

function getFromCache(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Cache] HIT for ${key}`);
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
  console.log(`[Cache] SET for ${key}`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { timePeriod = 'year' } = await req.json();
    
    console.log(`[crypto-indices] Request for timePeriod: ${timePeriod}`);
    
    const cacheKey = getCacheKey(timePeriod);
    const cached = getFromCache(cacheKey);
    if (cached) {
      return new Response(
        JSON.stringify(cached),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-Cache': 'HIT'
          },
        }
      );
    }

    const apiKey = Deno.env.get('COINGECKO_API_KEY');
    
    if (!apiKey) {
      throw new Error('CoinGecko API key not configured');
    }

    const marketResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&price_change_percentage=24h%2C7d%2C30d&page=1`,
      {
        headers: {
          'x-cg-demo-api-key': apiKey,
        },
      }
    );

    if (!marketResponse.ok) {
      throw new Error(`CoinGecko API error: ${marketResponse.status}`);
    }

    const marketData: CoinData[] = await marketResponse.json();
    
    const now = Math.floor(Date.now() / 1000);
    let fromTimestamp: number;
    
    switch (timePeriod) {
      case 'daily':
        fromTimestamp = now - 86400;
        break;
      case 'month':
        fromTimestamp = now - (30 * 86400);
        break;
      case 'year':
        fromTimestamp = now - (365 * 86400);
        break;
      case 'all':
        fromTimestamp = now - (730 * 86400);
        break;
      default:
        fromTimestamp = now - (365 * 86400);
    }
    
    console.log(`[crypto-indices] Fetching data from ${new Date(fromTimestamp * 1000).toISOString()} to ${new Date(now * 1000).toISOString()}`);
    
    const [anchor5, vibe20, wave100] = await Promise.all([
      calculateAnchor5(marketData, fromTimestamp, now, apiKey, timePeriod),
      calculateVibe20(marketData, fromTimestamp, now, apiKey, timePeriod),
      calculateWave100(marketData, fromTimestamp, now, apiKey, timePeriod)
    ]);

    const responseData = {
      anchor5,
      vibe20,
      wave100,
      lastUpdated: new Date(now * 1000).toISOString(),
    };

    setCache(cacheKey, responseData);

    console.log(`[crypto-indices] Success! Anchor5: ${anchor5.candles.length} candles, Vibe20: ${vibe20.candles.length} candles, Wave100: ${wave100.candles.length} candles`);

    return new Response(
      JSON.stringify(responseData),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-Cache': 'MISS'
        },
      }
    );
  } catch (error) {
    console.error('Error in crypto-indices function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});