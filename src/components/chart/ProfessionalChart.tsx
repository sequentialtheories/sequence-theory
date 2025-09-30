import React, { useState } from 'react';
import { ChartControls } from './ChartControls';
import { RefreshIndicator } from './RefreshIndicator';
import { CandlestickChart } from './CandlestickChart';

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
  formatXAxisLabel: (value: string) => string;
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
  const [showGrid, setShowGrid] = useState(true);

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

      <ChartControls
        showGrid={showGrid}
        showLegend={false}
        chartType="line"
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleLegend={() => {}}
        onToggleChartType={() => {}}
      />

      <CandlestickChart
        data={data}
        color={color}
        showGrid={showGrid}
        formatXAxisLabel={formatXAxisLabel}
        formatLargeNumber={formatLargeNumber}
        indexName={indexName}
      />
    </div>
  );
};