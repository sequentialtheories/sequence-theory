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

interface IndexCalculation {
  name: string;
  data: { date: string; value: number }[];
  currentValue: number;
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
    const anchor5 = calculateAnchor5(marketData, timeRanges);
    const vibe20 = calculateVibe20(marketData, timeRanges);
    const wave100 = calculateWave100(marketData, timeRanges);

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
  
  switch (timePeriod) {
    case 'daily':
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        ranges.push(date.toISOString().split('T')[0]);
      }
      break;
    case 'year':
      // January to current month
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      for (let i = 0; i <= currentMonth; i++) {
        const date = new Date(currentYear, i, 1);
        ranges.push(date.toISOString().split('T')[0]);
      }
      break;
    case 'all':
      // Quarterly data for last 2 years
      for (let i = 8; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - (i * 3));
        ranges.push(date.toISOString().split('T')[0]);
      }
      break;
  }
  
  return ranges;
}

function calculateAnchor5(marketData: CoinData[], timeRanges: string[]): IndexCalculation {
  // Top 5 by market cap (excluding stablecoins)
  const stablecoins = new Set(['usdt', 'usdc', 'busd', 'dai', 'tusd']);
  const top5 = marketData
    .filter(coin => !stablecoins.has(coin.symbol.toLowerCase()))
    .slice(0, 5);
  
  // Price-weighted calculation
  const baseValue = 1000;
  const totalPrice = top5.reduce((sum, coin) => sum + coin.current_price, 0);
  const currentValue = Math.round(baseValue * (totalPrice / 1000)); // Normalized base
  
  // Generate historical simulation based on current performance
  const data = timeRanges.map((date, index) => {
    const progress = index / (timeRanges.length - 1);
    const volatility = 0.8 + (Math.sin(index * 0.5) * 0.2); // Some volatility simulation
    const value = Math.round(baseValue * volatility + (currentValue - baseValue) * progress);
    return { date, value };
  });
  
  return { name: 'Anchor5', data, currentValue };
}

function calculateVibe20(marketData: CoinData[], timeRanges: string[]): IndexCalculation {
  // Top 20 by volume
  const top20 = marketData
    .sort((a, b) => b.total_volume - a.total_volume)
    .slice(0, 20);
  
  // Volume-weighted calculation
  const baseValue = 1000;
  const avgVolume = top20.reduce((sum, coin) => sum + coin.total_volume, 0) / top20.length;
  const currentValue = Math.round(baseValue * Math.log10(avgVolume / 1000000000) * 100);
  
  const data = timeRanges.map((date, index) => {
    const progress = index / (timeRanges.length - 1);
    const volatility = 0.9 + (Math.cos(index * 0.3) * 0.15);
    const value = Math.round(baseValue * volatility + (currentValue - baseValue) * progress);
    return { date, value };
  });
  
  return { name: 'Vibe20', data, currentValue };
}

function calculateWave100(marketData: CoinData[], timeRanges: string[]): IndexCalculation {
  // Top 100 momentum-based
  const top100 = marketData.slice(0, 100);
  
  // Momentum calculation based on 30-day performance
  const avgMomentum = top100.reduce((sum, coin) => {
    const momentum = coin.price_change_percentage_30d || 0;
    return sum + momentum;
  }, 0) / top100.length;
  
  const baseValue = 1000;
  const currentValue = Math.round(baseValue + (avgMomentum * 20)); // Momentum multiplier
  
  const data = timeRanges.map((date, index) => {
    const progress = index / (timeRanges.length - 1);
    const volatility = 1.0 + (Math.sin(index * 0.4) * 0.25); // Higher volatility for momentum
    const value = Math.round(baseValue * volatility + (currentValue - baseValue) * progress);
    return { date, value };
  });
  
  return { name: 'Wave100', data, currentValue };
}