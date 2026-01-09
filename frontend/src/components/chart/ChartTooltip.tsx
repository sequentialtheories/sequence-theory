import React from 'react';

interface ChartTooltipProps {
  visible: boolean;
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  indexName: string;
  formatLargeNumber: (value: number) => string;
  position: { x: number; y: number };
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  visible,
  time,
  open,
  high,
  low,
  close,
  volume,
  indexName,
  formatLargeNumber,
  position
}) => {
  if (!visible) return null;

  const isUp = close >= open;

  return (
    <div
      className="fixed z-50 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-strong pointer-events-none"
      style={{
        left: `${position.x + 15}px`,
        top: `${position.y + 15}px`,
      }}
    >
      <div className="space-y-1 text-sm">
        <div className="font-semibold text-foreground">{indexName}</div>
        <div className="text-muted-foreground text-xs">{time}</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
          <span className="text-muted-foreground">Open:</span>
          <span className="text-foreground font-medium">{open.toFixed(2)}</span>
          
          <span className="text-muted-foreground">High:</span>
          <span className="text-foreground font-medium">{high.toFixed(2)}</span>
          
          <span className="text-muted-foreground">Low:</span>
          <span className="text-foreground font-medium">{low.toFixed(2)}</span>
          
          <span className="text-muted-foreground">Close:</span>
          <span className={`font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            {close.toFixed(2)}
          </span>
          
          <span className="text-muted-foreground">Volume:</span>
          <span className="text-foreground font-medium">{formatLargeNumber(volume)}</span>
        </div>
      </div>
    </div>
  );
};
