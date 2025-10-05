import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, Time } from 'lightweight-charts';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { RefreshIndicator } from './RefreshIndicator';

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
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  
  const [tooltip, setTooltip] = useState({
    visible: false,
    time: '',
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0,
    position: { x: 0, y: 0 }
  });

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current || typeof window === 'undefined') return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: 'hsl(var(--muted-foreground))',
      },
      grid: {
        vertLines: { color: 'hsl(var(--border))' },
        horzLines: { color: 'hsl(var(--border))' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'hsl(var(--border))',
        rightOffset: 12,
      },
      rightPriceScale: {
        borderColor: 'hsl(var(--border))',
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: 'rgba(138, 143, 152, 0.5)',
          style: 3,
        },
        horzLine: {
          width: 1,
          color: 'rgba(138, 143, 152, 0.5)',
          style: 3,
        },
      },
      handleScale: {
        axisPressedMouseMove: {
          time: true,
          price: true,
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
      },
    });

    chartRef.current = chart;

    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    candlestickSeriesRef.current = candlestickSeries;

    const volumeSeries = (chart as any).addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeriesRef.current = volumeSeries;
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point || !candlestickSeriesRef.current) {
        setTooltip(prev => ({ ...prev, visible: false }));
        return;
      }

      const candleData = param.seriesData.get(candlestickSeriesRef.current);
      const volumeData = param.seriesData.get(volumeSeriesRef.current);
      
      if (candleData && 'open' in candleData) {
        const date = new Date((param.time as number) * 1000);
        const timeStr = formatXAxisLabel ? formatXAxisLabel(param.time as number) : date.toLocaleString();
        
        setTooltip({
          visible: true,
          time: timeStr,
          open: candleData.open,
          high: candleData.high,
          low: candleData.low,
          close: candleData.close,
          volume: volumeData && 'value' in volumeData ? volumeData.value : 0,
          position: {
            x: param.point.x,
            y: param.point.y
          }
        });
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [timePeriod, formatXAxisLabel]);

  // Update chart data
  useEffect(() => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current || !data.length) return;

    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const candlestickData = sortedData.map(point => ({
      time: Math.floor(new Date(point.date).getTime() / 1000) as Time,
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
    }));

    const volumeData = sortedData.map(point => ({
      time: Math.floor(new Date(point.date).getTime() / 1000) as Time,
      value: point.volume,
      color: point.close > point.open 
        ? 'rgba(16, 185, 129, 0.3)' 
        : 'rgba(239, 68, 68, 0.3)',
    }));

    candlestickSeriesRef.current.setData(candlestickData);
    volumeSeriesRef.current.setData(volumeData);

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [data]);

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  };

  const handleZoomIn = () => {
    if (chartRef.current) {
      const timeScale = chartRef.current.timeScale();
      const visibleRange = timeScale.getVisibleRange();
      if (visibleRange) {
        const diff = (visibleRange.to as number) - (visibleRange.from as number);
        const newDiff = diff * 0.8;
        const center = ((visibleRange.from as number) + (visibleRange.to as number)) / 2;
        timeScale.setVisibleRange({
          from: (center - newDiff / 2) as Time,
          to: (center + newDiff / 2) as Time,
        });
      }
    }
  };

  const handleZoomOut = () => {
    if (chartRef.current) {
      const timeScale = chartRef.current.timeScale();
      const visibleRange = timeScale.getVisibleRange();
      if (visibleRange) {
        const diff = (visibleRange.to as number) - (visibleRange.from as number);
        const newDiff = diff * 1.2;
        const center = ((visibleRange.from as number) + (visibleRange.to as number)) / 2;
        timeScale.setVisibleRange({
          from: (center - newDiff / 2) as Time,
          to: (center + newDiff / 2) as Time,
        });
      }
    }
  };

  const isUp = tooltip.close >= tooltip.open;

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

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-strong pointer-events-none"
          style={{
            left: `${tooltip.position.x + 15}px`,
            top: `${tooltip.position.y + 15}px`,
          }}
        >
          <div className="space-y-1 text-sm">
            <div className="font-semibold text-foreground">{indexName}</div>
            <div className="text-muted-foreground text-xs">{tooltip.time}</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
              <span className="text-muted-foreground">Open:</span>
              <span className="text-foreground font-medium">{tooltip.open.toFixed(2)}</span>
              
              <span className="text-muted-foreground">High:</span>
              <span className="text-foreground font-medium">{tooltip.high.toFixed(2)}</span>
              
              <span className="text-muted-foreground">Low:</span>
              <span className="text-foreground font-medium">{tooltip.low.toFixed(2)}</span>
              
              <span className="text-muted-foreground">Close:</span>
              <span className={`font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                {tooltip.close.toFixed(2)}
              </span>
              
              <span className="text-muted-foreground">Volume:</span>
              <span className="text-foreground font-medium">
                {formatLargeNumber(tooltip.volume)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Zoom controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="h-8 px-2"
        >
          <ZoomIn className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="h-8 px-2"
        >
          <ZoomOut className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetZoom}
          className="h-8 px-2"
        >
          <Maximize2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Chart container */}
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};
