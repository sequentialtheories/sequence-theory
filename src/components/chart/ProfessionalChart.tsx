import React, { useEffect, useRef, useState } from 'react';
import { 
  createChart, 
  IChartApi, 
  ISeriesApi, 
  CandlestickData, 
  HistogramData, 
  UTCTimestamp,
  CandlestickSeries,
  HistogramSeries
} from 'lightweight-charts';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { RefreshIndicator } from './RefreshIndicator';
import { NormalizedCandle } from '@/utils/candleUtils';

interface ProfessionalChartProps {
  data: NormalizedCandle[];
  color: string;
  indexName: string;
  timePeriod: string;
  isVisible: boolean;
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
  isVisible,
  isRefreshing = false,
  lastUpdated,
  formatXAxisLabel,
  formatLargeNumber
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  
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

  // Initialize chart ONCE - persist across renders
  useEffect(() => {
    if (!chartContainerRef.current || typeof window === 'undefined') return;
    
    // Prevent duplicate initialization
    if (chartRef.current) {
      console.log(`[${indexName}] Chart already initialized, skipping`);
      return;
    }

    console.log(`[${indexName}] Initializing chart instance`);

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
      autoSize: true,
    });

    chartRef.current = chart;

    // Add candlestick series with proper API
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });

    candlestickSeriesRef.current = candlestickSeries;

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: '',
      priceFormat: {
        type: 'volume',
      },
      color: 'rgba(148, 163, 184, 0.35)',
    });

    volumeSeriesRef.current = volumeSeries;
    
    // Set proper volume scale margins
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

    // Setup crosshair for tooltip
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point || !candlestickSeriesRef.current) {
        setTooltip(prev => ({ ...prev, visible: false }));
        return;
      }

      const candleData = param.seriesData.get(candlestickSeriesRef.current);
      const volumeData = param.seriesData.get(volumeSeriesRef.current!);
      
      if (candleData && 'open' in candleData) {
        const timeStr = formatXAxisLabel(param.time as number);
        
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

    // ONLY cleanup on unmount (component destroyed)
    return () => {
      console.log(`[${indexName}] Cleaning up chart instance`);
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [indexName]); // Only recreate if indexName changes (shouldn't happen)

  // Update chart data when data or time period changes
  useEffect(() => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current) return;
    
    // Handle empty data gracefully
    if (!data || data.length === 0) {
      console.log(`[${indexName}] No data to display, clearing chart`);
      candlestickSeriesRef.current.setData([]);
      volumeSeriesRef.current.setData([]);
      return;
    }

    // Data is already normalized and sorted from normalizeCandles
    const candlestickData: CandlestickData[] = data.map(point => ({
      time: point.time as UTCTimestamp, // Already in seconds
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
    }));

    const volumeData: HistogramData[] = data.map(point => ({
      time: point.time as UTCTimestamp,
      value: point.volumeUsd,
      color: point.close >= point.open 
        ? 'rgba(34, 197, 94, 0.5)' 
        : 'rgba(239, 68, 68, 0.5)',
    }));

    // Update existing series WITHOUT recreating chart
    candlestickSeriesRef.current.setData(candlestickData);
    volumeSeriesRef.current.setData(volumeData);

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [data, timePeriod, indexName]);

  // Handle visibility changes - resize when becoming visible
  useEffect(() => {
    if (isVisible && chartRef.current && chartContainerRef.current) {
      // Resize chart when becoming visible (in case container size changed)
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
      chartRef.current.timeScale().fitContent();
    }
  }, [isVisible]);

  const handleResetZoom = () => {
    if (!chartRef.current) {
      console.warn(`[${indexName}] Chart not initialized for reset`);
      return;
    }
    chartRef.current.timeScale().fitContent();
  };

  const handleZoomIn = () => {
    if (!chartRef.current) {
      console.warn(`[${indexName}] Chart not initialized for zoom in`);
      return;
    }
    const timeScale = chartRef.current.timeScale();
    const visibleRange = timeScale.getVisibleRange();
    if (visibleRange) {
      const diff = (visibleRange.to as number) - (visibleRange.from as number);
      const newDiff = diff * 0.8;
      const center = ((visibleRange.from as number) + (visibleRange.to as number)) / 2;
      timeScale.setVisibleRange({
        from: (center - newDiff / 2) as UTCTimestamp,
        to: (center + newDiff / 2) as UTCTimestamp,
      });
    }
  };

  const handleZoomOut = () => {
    if (!chartRef.current) {
      console.warn(`[${indexName}] Chart not initialized for zoom out`);
      return;
    }
    const timeScale = chartRef.current.timeScale();
    const visibleRange = timeScale.getVisibleRange();
    if (visibleRange) {
      const diff = (visibleRange.to as number) - (visibleRange.from as number);
      const newDiff = diff * 1.2;
      const center = ((visibleRange.from as number) + (visibleRange.to as number)) / 2;
      timeScale.setVisibleRange({
        from: (center - newDiff / 2) as UTCTimestamp,
        to: (center + newDiff / 2) as UTCTimestamp,
      });
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
          className="fixed z-50 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg pointer-events-none"
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
      <div 
        ref={chartContainerRef} 
        className="w-full"
        style={{ height: 400 }}
      />
    </div>
  );
};
