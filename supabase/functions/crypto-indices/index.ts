import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

interface TokenComposition {
  id: string;
  symbol: string;
  name: string;
  weight: number;
  price: number;
  change_24h: number;
  market_cap: number;
  volume: number;
}

interface IndexCalculation {
  name: string;
  data: { date: string; value: number }[];
  currentValue: number;
  composition: TokenComposition[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { timePeriod = 'year' } = await req.json();
    const apiKey = Deno.env.get('COINGECKO_API_KEY');
    
    if (!apiKey) {
      throw new Error('CoinGecko API key not configured');
    }

    // Fetch market data from CoinGecko
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
    
    // Calculate time periods
    const now = new Date();
    const timeRanges = getTimeRanges(timePeriod, now);
    
    // Calculate indices
    const anchor5 = await calculateAnchor5(marketData, timeRanges, timePeriod, apiKey);
    const vibe20 = await calculateVibe20(marketData, timeRanges, timePeriod, apiKey);
    const wave100 = await calculateWave100(marketData, timeRanges, timePeriod, apiKey);

    return new Response(
      JSON.stringify({
        anchor5,
        vibe20,
        wave100,
        lastUpdated: now.toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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

function getTimeRanges(timePeriod: string, now: Date) {
  const ranges = [];
  
  // Convert UTC time to EST (UTC-5, or UTC-4 during DST)
  const estOffset = -5; // EST offset from UTC
  const estNow = new Date(now.getTime() + (estOffset * 60 * 60 * 1000));
  
  switch (timePeriod) {
    case 'daily':
      // Last 24 hours - every 2 hours for better granularity
      for (let i = 23; i >= 0; i -= 2) {
        const date = new Date(estNow);
        date.setHours(date.getHours() - i);
        ranges.push(date.toISOString());
      }
      break;
    case 'month':
      // Last 30 days - daily data points
      for (let i = 29; i >= 0; i--) {
        const date = new Date(estNow);
        date.setDate(date.getDate() - i);
        ranges.push(date.toISOString().split('T')[0]);
      }
      break;
    case 'year':
      // January to current month - monthly data points
      const currentYear = estNow.getFullYear();
      const currentMonth = estNow.getMonth();
      for (let i = 0; i <= currentMonth; i++) {
        const date = new Date(currentYear, i, 1);
        ranges.push(date.toISOString().split('T')[0]);
      }
      break;
    case 'all':
      // All time - quarterly data points
      for (let i = 8; i >= 0; i--) {
        const date = new Date(estNow);
        date.setMonth(date.getMonth() - (i * 3));
        ranges.push(date.toISOString().split('T')[0]);
      }
      break;
  }
  
  return ranges;
}

async function fetchHistoricalData(coinId: string, days: string, apiKey: string): Promise<number[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=${days === '1' ? 'hourly' : 'daily'}`,
      {
        headers: {
          'x-cg-demo-api-key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${coinId} historical data`);
    }

    const data = await response.json();
    return data.prices.map((price: [number, number]) => price[1]);
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error);
    return [];
  }
}

async function calculateAnchor5(marketData: CoinData[], timeRanges: string[], timePeriod: string, apiKey: string): Promise<IndexCalculation> {
  // Filter for blue-chip criteria: exclude stablecoins
  const stablecoins = new Set(['usdt', 'usdc', 'busd', 'dai', 'tusd', 'fdusd', 'usdd', 'usdp', 'gusd', 'pyusd', 'frax']);
  
  // Calculate custom stability scores
  const scoredCoins = marketData
    .filter(coin => !stablecoins.has(coin.symbol.toLowerCase()))
    .filter(coin => coin.market_cap_rank <= 50) // Focus on top 50 for stability
    .map(coin => {
      // Custom scoring: PriceRank + WalletRank + StabilityRank + MCapRank
      const priceRank = Math.max(0, 100 - (coin.current_price > 1000 ? 20 : coin.current_price > 100 ? 15 : coin.current_price > 10 ? 10 : 5));
      const mCapRank = Math.max(0, 100 - coin.market_cap_rank);
      const stabilityRank = Math.max(0, 100 - Math.abs(coin.price_change_percentage_30d || 0));
      const walletRank = coin.market_cap > 0 ? Math.min(100, coin.market_cap / 1000000000) : 0;
      
      const totalScore = priceRank + mCapRank + stabilityRank + walletRank;
      return { ...coin, stabilityScore: totalScore };
    })
    .sort((a, b) => b.stabilityScore - a.stabilityScore)
    .slice(0, 5);
  
  // Price-weighted calculation (like Dow Jones)
  const totalPrice = scoredCoins.reduce((sum, coin) => sum + coin.current_price, 0);
  const divisor = 10; // Dow-style divisor
  const currentValue = Math.round(totalPrice / divisor);
  
  // Create composition
  const composition: TokenComposition[] = scoredCoins.map(coin => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    weight: (coin.current_price / totalPrice) * 100,
    price: coin.current_price,
    change_24h: coin.price_change_percentage_24h || 0,
    market_cap: coin.market_cap,
    volume: coin.total_volume
  }));
  
  // Fetch real historical data for each coin and calculate index values
  const days = timePeriod === 'daily' ? '1' : timePeriod === 'month' ? '30' : timePeriod === 'year' ? '365' : 'max';
  const historicalDataPromises = scoredCoins.map(coin => fetchHistoricalData(coin.id, days, apiKey));
  const historicalDataArrays = await Promise.all(historicalDataPromises);
  
  // Calculate historical index values
  const data = timeRanges.map((date, index) => {
    let indexValue = 0;
    
    // Calculate price-weighted sum for this time point
    scoredCoins.forEach((coin, coinIndex) => {
      const historicalPrices = historicalDataArrays[coinIndex];
      if (historicalPrices.length > index) {
        indexValue += historicalPrices[index] || coin.current_price;
      } else {
        indexValue += coin.current_price;
      }
    });
    
    return { 
      date: date.includes('T') ? date.split('T')[0] : date, 
      value: Math.round(indexValue / divisor) 
    };
  });
  
  return { name: 'Anchor5', data, currentValue, composition };
}

async function calculateVibe20(marketData: CoinData[], timeRanges: string[], timePeriod: string, apiKey: string): Promise<IndexCalculation> {
  // Filter out stablecoins first
  const stablecoins = new Set(['usdt', 'usdc', 'busd', 'dai', 'tusd', 'fdusd', 'usdd', 'usdp', 'gusd', 'pyusd', 'frax']);
  
  // Top 20 by 24h trading volume (excluding stablecoins)
  const top20 = marketData
    .filter(coin => !stablecoins.has(coin.symbol.toLowerCase()))
    .sort((a, b) => b.total_volume - a.total_volume)
    .slice(0, 20);
  
  // Hybrid formula: Weight(T) = (Vol × MCap) / Σ(Vol × MCap)
  const totalWeightBase = top20.reduce((sum, coin) => sum + (coin.total_volume * coin.market_cap), 0);
  
  const weightedTokens = top20.map(coin => {
    const weight = (coin.total_volume * coin.market_cap) / totalWeightBase;
    return { ...coin, indexWeight: weight };
  });
  
  // Calculate weighted price sum
  const weightedPriceSum = weightedTokens.reduce((sum, coin) => sum + (coin.current_price * coin.indexWeight), 0);
  const currentValue = Math.round((weightedPriceSum * 100) / 100); // Scale to reasonable index value, divide by 100
  
  // Create composition
  const composition: TokenComposition[] = weightedTokens.map(coin => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    weight: coin.indexWeight * 100,
    price: coin.current_price,
    change_24h: coin.price_change_percentage_24h || 0,
    market_cap: coin.market_cap,
    volume: coin.total_volume
  }));
  
  // Fetch real historical data for each coin and calculate weighted index values
  const days = timePeriod === 'daily' ? '1' : timePeriod === 'month' ? '30' : timePeriod === 'year' ? '365' : 'max';
  const historicalDataPromises = weightedTokens.map(coin => fetchHistoricalData(coin.id, days, apiKey));
  const historicalDataArrays = await Promise.all(historicalDataPromises);
  
  // Calculate historical index values
  const data = timeRanges.map((date, index) => {
    let weightedIndexValue = 0;
    
    // Calculate volume-weighted sum for this time point
    weightedTokens.forEach((coin, coinIndex) => {
      const historicalPrices = historicalDataArrays[coinIndex];
      const price = historicalPrices.length > index ? historicalPrices[index] : coin.current_price;
      weightedIndexValue += (price || coin.current_price) * coin.indexWeight;
    });
    
    return { 
      date: date.includes('T') ? date.split('T')[0] : date, 
      value: Math.round((weightedIndexValue * 100) / 100) 
    };
  });
  
  return { name: 'Vibe20', data, currentValue, composition };
}

async function calculateWave100(marketData: CoinData[], timeRanges: string[], timePeriod: string, apiKey: string): Promise<IndexCalculation> {
  // Filter out stablecoins only, focus on price appreciation (30-day gains)
  const stablecoins = new Set(['usdt', 'usdc', 'busd', 'dai', 'tusd', 'fdusd', 'usdd', 'usdp', 'gusd', 'pyusd', 'frax']);
  
  // Select top 100 by price appreciation (30-day performance), excluding only stablecoins
  const momentumCoins = marketData
    .filter(coin => !stablecoins.has(coin.symbol.toLowerCase()))
    .filter(coin => coin.price_change_percentage_30d !== null)
    .sort((a, b) => (b.price_change_percentage_30d || 0) - (a.price_change_percentage_30d || 0))
    .slice(0, 100);
  
  // Return-proportional weighting based on 30-day gains
  const totalMomentum = momentumCoins.reduce((sum, coin) => sum + Math.max(0, coin.price_change_percentage_30d || 0), 0);
  
  const weightedTokens = momentumCoins.map(coin => {
    const momentum = Math.max(0, coin.price_change_percentage_30d || 0);
    const weight = totalMomentum > 0 ? momentum / totalMomentum : 1 / momentumCoins.length;
    return { ...coin, momentumWeight: weight };
  });
  
  // Calculate momentum-weighted index value using same formula as historical
  const weightedMomentumSum = weightedTokens.slice(0, 20).reduce((sum, coin) => sum + (coin.current_price * coin.momentumWeight * 20), 0);
  const currentValue = Math.round((1000 + weightedMomentumSum) * 100); // Base 1000 with momentum scaling, multiply by 100
  
  // Create composition (show all 100 tokens by momentum for display)
  const composition: TokenComposition[] = weightedTokens.map(coin => ({
    id: coin.id,
    symbol: coin.symbol.toUpperCase(),
    name: coin.name,
    weight: coin.momentumWeight * 100,
    price: coin.current_price,
    change_24h: coin.price_change_percentage_24h || 0,
    market_cap: coin.market_cap,
    volume: coin.total_volume
  }));
  
  // Fetch real historical data for top momentum coins and calculate weighted index values
  const days = timePeriod === 'daily' ? '1' : timePeriod === 'month' ? '30' : timePeriod === 'year' ? '365' : 'max';
  const top20ForHistory = weightedTokens.slice(0, 20); // Use top 20 for historical calculation
  const historicalDataPromises = top20ForHistory.map(coin => fetchHistoricalData(coin.id, days, apiKey));
  const historicalDataArrays = await Promise.all(historicalDataPromises);
  
  // Calculate historical index values
  const data = timeRanges.map((date, index) => {
    let momentumIndexValue = 0;
    
    // Calculate momentum-weighted sum for this time point
    top20ForHistory.forEach((coin, coinIndex) => {
      const historicalPrices = historicalDataArrays[coinIndex];
      const price = historicalPrices.length > index ? historicalPrices[index] : coin.current_price;
      momentumIndexValue += (price || coin.current_price) * coin.momentumWeight * 20; // Scale by 20 since using top 20
    });
    
    return { 
      date: date.includes('T') ? date.split('T')[0] : date, 
      value: Math.round((1000 + momentumIndexValue) * 100) 
    };
  });
  
  return { name: 'Wave100', data, currentValue, composition };
}