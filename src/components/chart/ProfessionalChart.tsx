import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  AreaChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Brush 
} from 'recharts';
import { ChartControls } from './ChartControls';
import { RefreshIndicator } from './RefreshIndicator';

interface DataPoint {
  date: string;
  value: number;
}

interface ProfessionalChartProps {
  data: DataPoint[];
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
  const [showLegend, setShowLegend] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [zoomDomain, setZoomDomain] = useState<{startIndex?: number, endIndex?: number}>({});

  const hasZoom = zoomDomain.startIndex !== undefined || zoomDomain.endIndex !== undefined;

  const handleResetZoom = () => {
    setZoomDomain({});
  };

  const handleBrushChange = (brushData: any) => {
    if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
      setZoomDomain({
        startIndex: brushData.startIndex,
        endIndex: brushData.endIndex
      });
    }
  };

  const displayData = useMemo(() => {
    if (!hasZoom) return data;
    const { startIndex = 0, endIndex = data.length - 1 } = zoomDomain;
    return data.slice(startIndex, endIndex + 1);
  }, [data, zoomDomain, hasZoom]);

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-strong">
          <p className="text-sm font-medium text-card-foreground mb-1">
            {indexName}
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            {formatXAxisLabel(label)}
          </p>
          <p className="text-sm font-semibold text-primary">
            {formatLargeNumber(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const gradientId = `gradient-${indexName.toLowerCase()}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">
          {indexName} Performance ({
            timePeriod === 'daily' ? 'Last 24 Hours' : 
            timePeriod === 'month' ? 'Last 30 Days' : 
            timePeriod === 'year' ? 'Year to Date' : 'All Time'
          })
        </h4>
        <RefreshIndicator isRefreshing={isRefreshing} lastUpdated={lastUpdated} />
      </div>

      <ChartControls
        showGrid={showGrid}
        showLegend={showLegend}
        chartType={chartType}
        onToggleGrid={() => setShowGrid(!showGrid)}
        onToggleLegend={() => setShowLegend(!showLegend)}
        onToggleChartType={() => setChartType(chartType === 'line' ? 'area' : 'line')}
        onResetZoom={handleResetZoom}
        hasZoom={hasZoom}
      />

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={displayData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              
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
              
              {showLegend && (
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
              )}
              
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4, stroke: color, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                name="Index Value"
              />
              
              <Brush 
                dataKey="date" 
                height={30}
                stroke={color}
                fill={`url(#${gradientId})`}
                onChange={handleBrushChange}
                tickFormatter={formatXAxisLabel}
              />
            </LineChart>
          ) : (
            <AreaChart data={displayData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
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
              
              {showLegend && (
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="rect"
                />
              )}
              
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                name="Index Value"
              />
              
              <Brush 
                dataKey="date" 
                height={30}
                stroke={color}
                fill={`url(#${gradientId})`}
                onChange={handleBrushChange}
                tickFormatter={formatXAxisLabel}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};