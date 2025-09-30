import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Bar,
  Cell
} from 'recharts';

interface CandlestickDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  data: CandlestickDataPoint[];
  color: string;
  showGrid: boolean;
  formatXAxisLabel: (value: string) => string;
  formatLargeNumber: (value: number) => string;
  indexName: string;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  color,
  showGrid,
  formatXAxisLabel,
  formatLargeNumber,
  indexName
}) => {
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-strong">
          <p className="text-sm font-medium text-card-foreground mb-1">
            {indexName}
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            {formatXAxisLabel(dataPoint.date)}
          </p>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Open:</span>
              <span className="font-semibold">{formatLargeNumber(dataPoint.open)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">High:</span>
              <span className="font-semibold text-green-600">{formatLargeNumber(dataPoint.high)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Low:</span>
              <span className="font-semibold text-red-600">{formatLargeNumber(dataPoint.low)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Close:</span>
              <span className="font-semibold text-primary">{formatLargeNumber(dataPoint.close)}</span>
            </div>
            <div className="flex justify-between gap-4 border-t pt-1 mt-1">
              <span className="text-muted-foreground">Volume:</span>
              <span className="font-semibold">{formatLargeNumber(dataPoint.volume)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Candlestick Shape
  const Candlestick = (props: any) => {
    const { x, y, width, height, payload } = props;
    const { open, close, high, low } = payload;
    
    const isGreen = close > open;
    const candleColor = isGreen ? '#10b981' : '#ef4444';
    const wickX = x + width / 2;
    
    // Calculate y positions for high and low
    const chartHeight = height;
    const valueRange = Math.max(...data.map(d => d.high)) - Math.min(...data.map(d => d.low));
    const minValue = Math.min(...data.map(d => d.low));
    
    const getY = (value: number) => {
      return y + chartHeight - ((value - minValue) / valueRange) * chartHeight;
    };
    
    const openY = getY(open);
    const closeY = getY(close);
    const highY = getY(high);
    const lowY = getY(low);
    
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.abs(closeY - openY) || 1;
    
    return (
      <g>
        {/* Wick (High-Low line) */}
        <line
          x1={wickX}
          y1={highY}
          x2={wickX}
          y2={lowY}
          stroke={candleColor}
          strokeWidth={1}
        />
        {/* Body (Open-Close rectangle) */}
        <rect
          x={x + width * 0.2}
          y={bodyTop}
          width={width * 0.6}
          height={bodyHeight}
          fill={isGreen ? candleColor : 'transparent'}
          stroke={candleColor}
          strokeWidth={1.5}
        />
      </g>
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Candlestick Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--muted-foreground))" 
                strokeOpacity={0.2}
              />
            )}
            
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
              tickFormatter={formatXAxisLabel}
            />
            
            <YAxis 
              domain={['auto', 'auto']}
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={formatLargeNumber}
              label={{ 
                value: 'Index Value', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' }
              }}
            />
            
            <Tooltip content={customTooltip} />
            
            <Bar 
              dataKey="high" 
              shape={<Candlestick />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Volume Chart */}
      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="date" 
              hide
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={formatLargeNumber}
            />
            
            <Bar dataKey="volume">
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.close > entry.open ? '#10b98133' : '#ef444433'}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
