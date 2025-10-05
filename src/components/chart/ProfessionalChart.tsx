import React from 'react';
import { RefreshIndicator } from './RefreshIndicator';
import { LightweightCandlestickChart } from './LightweightCandlestickChart';

interface CandlestickDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ProfessionalChartProps {
  data: CandlestickDataPoint[];
  color: string;
  indexName: string;
  timePeriod: string;
  isRefreshing?: boolean;
  lastUpdated?: Date;
  formatXAxisLabel: (value: string | number) => string;
  formatLargeNumber: (value: number) => string;
}

export const ProfessionalChart: React.FC<ProfessionalChartProps> = ({
  data,
  color,
  indexName,
  timePeriod,
  isRefreshing = false,
  lastUpdated,
  formatXAxisLabel,
  formatLargeNumber
}) => {
  // Transform CandlestickDataPoint[] to Candle[] format for LightweightCandlestickChart
  const transformedCandles = data.map(point => ({
    time: Math.floor(new Date(point.date).getTime() / 1000),
    open: point.open,
    high: point.high,
    low: point.low,
    close: point.close,
    volumeUsd: point.volume
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">
          {indexName} Performance ({
            timePeriod === 'daily' ? '12AM-Current' : 
            timePeriod === 'month' ? 'Last 30 Days' : 
            timePeriod === 'year' ? 'Year to Date' : 'All Time'
          })
        </h4>
        <RefreshIndicator isRefreshing={isRefreshing} lastUpdated={lastUpdated} />
      </div>

      <LightweightCandlestickChart
        candles={transformedCandles}
        indexName={indexName}
        timePeriod={timePeriod}
        formatLargeNumber={formatLargeNumber}
      />
    </div>
  );
};