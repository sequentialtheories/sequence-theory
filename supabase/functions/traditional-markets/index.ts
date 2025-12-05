import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://vaultclub.io',
  'https://sequence-theory.lovable.app',
  'https://sequencetheory.com'
];

const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow Lovable preview domains
  if (origin.endsWith('.lovableproject.com')) return true;
  return false;
};

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin!,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
};

interface MarketData {
  symbol: string;
  ytd: number;
  one_month: number;
  three_month: number;
  one_year: number;
}

// Cache for market data (1 hour TTL)
const cache = new Map<string, { data: MarketData[]; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { timePeriod = 'year' } = await req.json();
    
    console.log('[traditional-markets] Fetching data for period:', timePeriod);

    // Check cache
    const cacheKey = 'market_data';
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log('[traditional-markets] Returning cached data');
      return new Response(
        JSON.stringify(cached.data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch real market data from Yahoo Finance API (free, no auth required)
    const symbols = [
      { ticker: '^GSPC', name: 'S&P 500' },  // S&P 500
      { ticker: '^IXIC', name: 'Nasdaq' },   // Nasdaq
      { ticker: 'GC=F', name: 'Gold' }       // Gold Futures
    ];

    const marketData: MarketData[] = [];

    for (const { ticker, name } of symbols) {
      try {
        // Use Yahoo Finance quote endpoint
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=1y&interval=1d`;
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`[traditional-markets] Failed to fetch ${name}: ${response.statusText}`);
          continue;
        }

        const data = await response.json();
        const result = data?.chart?.result?.[0];
        
        if (!result || !result.indicators?.quote?.[0]) {
          console.error(`[traditional-markets] Invalid data structure for ${name}`);
          continue;
        }

        const timestamps = result.timestamp || [];
        const closes = result.indicators.quote[0].close || [];
        
        // Filter out null values
        const validData = timestamps
          .map((time: number, i: number) => ({ time, close: closes[i] }))
          .filter((d: any) => d.close != null);

        if (validData.length === 0) {
          console.error(`[traditional-markets] No valid data for ${name}`);
          continue;
        }

        // Calculate performance metrics
        const latestPrice = validData[validData.length - 1].close;
        const now = new Date();
        const yearStart = new Date(now.getFullYear(), 0, 1).getTime() / 1000;
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).getTime() / 1000;
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).getTime() / 1000;
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).getTime() / 1000;

        const findClosestPrice = (targetTime: number) => {
          return validData.reduce((closest: any, current: any) => {
            return Math.abs(current.time - targetTime) < Math.abs(closest.time - targetTime)
              ? current
              : closest;
          }).close;
        };

        const ytdPrice = findClosestPrice(yearStart);
        const oneMonthPrice = findClosestPrice(oneMonthAgo);
        const threeMonthPrice = findClosestPrice(threeMonthsAgo);
        const oneYearPrice = findClosestPrice(oneYearAgo);

        marketData.push({
          symbol: name,
          ytd: ((latestPrice - ytdPrice) / ytdPrice) * 100,
          one_month: ((latestPrice - oneMonthPrice) / oneMonthPrice) * 100,
          three_month: ((latestPrice - threeMonthPrice) / threeMonthPrice) * 100,
          one_year: ((latestPrice - oneYearPrice) / oneYearPrice) * 100,
        });

        console.log(`[traditional-markets] Fetched ${name}: YTD ${marketData[marketData.length - 1].ytd.toFixed(2)}%`);
      } catch (error) {
        console.error(`[traditional-markets] Error fetching ${name}:`, error);
      }
    }

    if (marketData.length === 0) {
      throw new Error('Failed to fetch any market data');
    }

    // Cache the result
    cache.set(cacheKey, { data: marketData, timestamp: Date.now() });

    return new Response(
      JSON.stringify(marketData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[traditional-markets] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        // Return fallback data in case of error
        fallback: [
          { symbol: 'S&P 500', ytd: 12.5, one_month: 2.3, three_month: 5.8, one_year: 15.2 },
          { symbol: 'Nasdaq', ytd: 18.7, one_month: 3.1, three_month: 8.2, one_year: 22.4 },
          { symbol: 'Gold', ytd: 6.1, one_month: 1.2, three_month: 3.5, one_year: 8.7 }
        ]
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
