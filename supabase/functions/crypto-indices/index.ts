import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ===== Type Definitions =====

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
  time: number;          // Unix seconds (UTC)
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

// ===== Helper Functions =====

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

function aggregateToCandles(indexLevels: IndexLevel[], periodSeconds: number): Candle[] {
  if (indexLevels.length === 0) return [];
  
  // Group by period
  const periodMap = new Map<number, IndexLevel[]>();
  
  indexLevels.forEach(level => {
    const periodStart = Math.floor(level.timestamp / periodSeconds) * periodSeconds;
    if (!periodMap.has(periodStart)) {
      periodMap.set(periodStart, []);
    }
    periodMap.get(periodStart)!.push(level);
  });
  
  // Convert to candles
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
  
  return candles;
}

async function fetchHistoricalPrices(
  coinId: string, 
  fromTimestamp: number, 
  toTimestamp: number,
  apiKey: string
): Promise<HistoricalPriceData[]> {
  try {
    const days = Math.max(1, Math.ceil((toTimestamp - fromTimestamp) / 86400));
    const interval = days === 1 ? 'minutely' : days <= 90 ? 'hourly' : 'daily';
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`,
      {
        headers: {
          'x-cg-demo-api-key': apiKey,
        },
      }
    );

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
    
    return result;
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error);
    return [];
  }
}

// ===== Index Calculations =====

async function calculateAnchor5(
  marketData: CoinData[], 
  fromTimestamp: number, 
  toTimestamp: number,
  apiKey: string,
  timePeriod: string
): Promise<IndexResponse> {
  const stablecoins = new Set(['usdt', 'usdc', 'busd', 'dai', 'tusd', 'fdusd', 'usdd', 'usdp', 'gusd', 'pyusd', 'frax']);
  
  // Select top 5 by stability score
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
  
  // Price-weighted (like Dow Jones)
  const divisor = 10;
  const totalCurrentPrice = scoredCoins.reduce((sum, c) => sum + c.current_price, 0);
  const currentValue = Math.round((totalCurrentPrice / divisor));
  
  // Fetch historical data for all constituents
  const historicalPromises = scoredCoins.map(coin => 
    fetchHistoricalPrices(coin.id, fromTimestamp, toTimestamp, apiKey)
  );
  const historicalArrays = await Promise.all(historicalPromises);
  
  // Build index level time series
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
      const dataPoint = hist.find(d => d.timestamp === timestamp);
      
      if (dataPoint) {
        priceSum += dataPoint.price;
        volumeSum += dataPoint.volume;
        validCount++;
      } else {
        // Use current price as fallback
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
  
  // Aggregate to candles
  const periodSeconds = timePeriod === 'daily' ? 900 : timePeriod === 'month' ? 3600 : timePeriod === 'year' ? 86400 : 604800;
  const timeframe = timePeriod === 'daily' ? '15m' : timePeriod === 'month' ? '1h' : timePeriod === 'year' ? '1d' : '1w';
  const candles = aggregateToCandles(indexLevels, periodSeconds);
  
  // Calculate 24h change
  const now = Math.floor(Date.now() / 1000);
  const yesterday = now - 86400;
  const yesterdayCandle = candles.find(c => Math.abs(c.time - yesterday) < 3600) || candles[Math.max(0, candles.length - 2)];
  const change_24h_percentage = yesterdayCandle ? ((currentValue - yesterdayCandle.close) / yesterdayCandle.close) * 100 : 0;
  
  console.log(`[Anchor5] Generated ${candles.length} candles, first:`, candles[0], 'last:', candles[candles.length-1]);
  
  return {
    index: 'Anchor5',
    baseValue: 1,
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
  
  // Top 20 by 24h trading volume
  const top20 = marketData
    .filter(coin => !stablecoins.has(coin.symbol.toLowerCase()))
    .sort((a, b) => b.total_volume - a.total_volume)
    .slice(0, 20);
  
  if (top20.length === 0) {
    return {
      index: 'Vibe20',
      baseValue: 1,
      timeframe: '1h',
      candles: [],
      currentValue: 1,
      change_24h_percentage: 0,
      meta: {
        tz: 'UTC',
        constituents: [],
        rebalanceFrequency: 'daily'
      }
    };
  }
  
  // Volume × Market Cap weighting
  const totalWeightBase = top20.reduce((sum, coin) => sum + (coin.total_volume * coin.market_cap), 0);
  const weightedCoins = top20.map(coin => ({
    ...coin,
    weight: (coin.total_volume * coin.market_cap) / totalWeightBase
  }));
  
  const currentValue = Math.round(
    weightedCoins.reduce((sum, coin) => sum + (coin.current_price * coin.weight), 0)
  );
  
  // Fetch historical data
  const historicalPromises = weightedCoins.map(coin => 
    fetchHistoricalPrices(coin.id, fromTimestamp, toTimestamp, apiKey)
  );
  const historicalArrays = await Promise.all(historicalPromises);
  
  // Build index level time series
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
      const dataPoint = hist.find(d => d.timestamp === timestamp);
      
      if (dataPoint) {
        weightedPriceSum += dataPoint.price * weightedCoins[i].weight;
        volumeSum += dataPoint.volume;
        validCount++;
      } else {
        weightedPriceSum += weightedCoins[i].current_price * weightedCoins[i].weight;
      }
    }
    
    if (validCount > 0) {
      const indexValue = weightedPriceSum;
      indexLevels.push({
        timestamp,
        value: indexValue,
        volume: volumeSum
      });
    }
  }
  
  // Aggregate to candles
  const periodSeconds = timePeriod === 'daily' ? 900 : timePeriod === 'month' ? 3600 : timePeriod === 'year' ? 86400 : 604800;
  const timeframe = timePeriod === 'daily' ? '15m' : timePeriod === 'month' ? '1h' : timePeriod === 'year' ? '1d' : '1w';
  const candles = aggregateToCandles(indexLevels, periodSeconds);
  
  // Calculate 24h change
  const now = Math.floor(Date.now() / 1000);
  const yesterday = now - 86400;
  const yesterdayCandle = candles.find(c => Math.abs(c.time - yesterday) < 3600) || candles[Math.max(0, candles.length - 2)];
  const change_24h_percentage = yesterdayCandle ? ((currentValue - yesterdayCandle.close) / yesterdayCandle.close) * 100 : 0;
  
  console.log(`[Vibe20] Generated ${candles.length} candles, first:`, candles[0], 'last:', candles[candles.length-1]);
  
  return {
    index: 'Vibe20',
    baseValue: 1,
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
  
  // Select top 100 momentum coins
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
  
  // Momentum-proportional weighting
  const totalPositiveMomentum = momentumCoins.reduce((sum, coin) => sum + Math.max(0, coin.momentum), 0);
  const weightedCoins = momentumCoins.map(coin => ({
    ...coin,
    weight: totalPositiveMomentum > 0 
      ? Math.max(0, coin.momentum) / totalPositiveMomentum 
      : 1 / momentumCoins.length
  }));
  
  const currentValue = Math.round(
    weightedCoins.reduce((sum, coin) => sum + (coin.current_price * coin.weight), 0) * 1000
  );
  
  // Use top 20 for historical data (performance)
  const top20 = weightedCoins.slice(0, 20);
  const historicalPromises = top20.map(coin => 
    fetchHistoricalPrices(coin.id, fromTimestamp, toTimestamp, apiKey)
  );
  const historicalArrays = await Promise.all(historicalPromises);
  
  // Build index level time series
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
      const dataPoint = hist.find(d => d.timestamp === timestamp);
      
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
  
  // Aggregate to candles
  const periodSeconds = timePeriod === 'daily' ? 900 : timePeriod === 'month' ? 3600 : timePeriod === 'year' ? 86400 : 604800;
  const timeframe = timePeriod === 'daily' ? '15m' : timePeriod === 'month' ? '1h' : timePeriod === 'year' ? '1d' : '1w';
  const candles = aggregateToCandles(indexLevels, periodSeconds);
  
  // Calculate 24h change
  const now = Math.floor(Date.now() / 1000);
  const yesterday = now - 86400;
  const yesterdayCandle = candles.find(c => Math.abs(c.time - yesterday) < 3600) || candles[Math.max(0, candles.length - 2)];
  const change_24h_percentage = yesterdayCandle ? ((currentValue - yesterdayCandle.close) / yesterdayCandle.close) * 100 : 0;
  
  console.log(`[Wave100] Generated ${candles.length} candles, first:`, candles[0], 'last:', candles[candles.length-1]);
  
  return {
    index: 'Wave100',
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

// ===== Main Handler =====

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { timePeriod = 'year' } = await req.json();
    const apiKey = Deno.env.get('COINGECKO_API_KEY');
    
    if (!apiKey) {
      throw new Error('CoinGecko API key not configured');
    }

    // Fetch market data
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
    
    // Calculate time range
    const now = Math.floor(Date.now() / 1000);
    let fromTimestamp: number;
    
    switch (timePeriod) {
      case 'daily':
        fromTimestamp = now - 86400; // 24 hours
        break;
      case 'month':
        fromTimestamp = now - (30 * 86400); // 30 days
        break;
      case 'year':
        fromTimestamp = now - (365 * 86400); // 1 year
        break;
      case 'all':
        fromTimestamp = now - (730 * 86400); // 2 years
        break;
      default:
        fromTimestamp = now - (365 * 86400);
    }
    
    // Calculate indices in parallel
    const [anchor5, vibe20, wave100] = await Promise.all([
      calculateAnchor5(marketData, fromTimestamp, now, apiKey, timePeriod),
      calculateVibe20(marketData, fromTimestamp, now, apiKey, timePeriod),
      calculateWave100(marketData, fromTimestamp, now, apiKey, timePeriod)
    ]);

    return new Response(
      JSON.stringify({
        anchor5,
        vibe20,
        wave100,
        lastUpdated: new Date(now * 1000).toISOString(),
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=120'
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
