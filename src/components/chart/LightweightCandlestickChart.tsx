import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, Time, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { ChartTooltip } from './ChartTooltip';
import { normalizeCandles, formatChartTime } from '@/utils/chartUtils';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volumeUsd: number;
}

interface LightweightCandlestickChartProps {
  candles: Candle[];
  indexName: string;
  timePeriod?: string;
  formatLargeNumber?: (value: number) => string;
}

export const LightweightCandlestickChart: React.FC<LightweightCandlestickChartProps> = ({
  candles,
  indexName,
  timePeriod = 'daily',
  formatLargeNumber = (num: number) => num.toLocaleString()
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

  useEffect(() => {
    if (!chartContainerRef.current || typeof window === 'undefined') return;

    // Create chart
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

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Add volume series
    const volumeSeries = chart.addSeries(HistogramSeries, {
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

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Subscribe to crosshair move for tooltip
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point || !candlestickSeriesRef.current) {
        setTooltip(prev => ({ ...prev, visible: false }));
        return;
      }

      const data = param.seriesData.get(candlestickSeriesRef.current);
      const volumeData = param.seriesData.get(volumeSeriesRef.current);
      
      if (data && 'open' in data) {
        setTooltip({
          visible: true,
          time: formatChartTime(param.time as number, timePeriod),
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
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
  }, [timePeriod]);

  useEffect(() => {
    if (!candlestickSeriesRef.current || !volumeSeriesRef.current || !candles.length) return;

    // Normalize and sort candles
    const normalizedCandles = normalizeCandles(candles, timePeriod);

    // Transform data for candlestick series
    const candlestickData = normalizedCandles.map(candle => ({
      time: candle.time as Time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    // Transform data for volume series
    const volumeData = normalizedCandles.map(candle => ({
      time: candle.time as Time,
      value: candle.volumeUsd,
      color: candle.close > candle.open 
        ? 'rgba(16, 185, 129, 0.3)' 
        : 'rgba(239, 68, 68, 0.3)',
    }));

    candlestickSeriesRef.current.setData(candlestickData);
    volumeSeriesRef.current.setData(volumeData);

    // Fit content
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [candles, timePeriod]);

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

  return (
    <div className="space-y-2 relative">
      <ChartTooltip
        visible={tooltip.visible}
        time={tooltip.time}
        open={tooltip.open}
        high={tooltip.high}
        low={tooltip.low}
        close={tooltip.close}
        volume={tooltip.volume}
        indexName={indexName}
        formatLargeNumber={formatLargeNumber}
        position={tooltip.position}
      />
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
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};
