import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, Eye, EyeOff, RotateCcw, TrendingUp, Activity } from 'lucide-react';

interface ChartControlsProps {
  showGrid: boolean;
  showLegend: boolean;
  chartType: 'line' | 'area';
  onToggleGrid: () => void;
  onToggleLegend: () => void;
  onToggleChartType: () => void;
  onResetZoom: () => void;
  hasZoom: boolean;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  showGrid,
  showLegend,
  chartType,
  onToggleGrid,
  onToggleLegend,
  onToggleChartType,
  onResetZoom,
  hasZoom
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleGrid}
          className={`h-8 px-2 ${showGrid ? 'bg-primary/10 text-primary' : ''}`}
        >
          <Grid3X3 className="h-3 w-3" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLegend}
          className={`h-8 px-2 ${showLegend ? 'bg-primary/10 text-primary' : ''}`}
        >
          {showLegend ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleChartType}
          className={`h-8 px-2 ${chartType === 'area' ? 'bg-primary/10 text-primary' : ''}`}
        >
          {chartType === 'line' ? <TrendingUp className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
        </Button>
        
        {hasZoom && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetZoom}
            className="h-8 px-2"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};