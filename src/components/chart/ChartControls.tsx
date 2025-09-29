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
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  showGrid,
  showLegend,
  chartType,
  onToggleGrid,
  onToggleLegend,
  onToggleChartType
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleGrid}
          className={`h-8 px-2 transition-colors ${showGrid ? 'bg-primary text-primary-foreground' : ''}`}
        >
          <Grid3X3 className="h-3 w-3" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLegend}
          className={`h-8 px-2 transition-colors ${showLegend ? 'bg-primary text-primary-foreground' : ''}`}
        >
          {showLegend ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleChartType}
          className={`h-8 px-2 transition-colors ${chartType === 'area' ? 'bg-primary text-primary-foreground' : ''}`}
        >
          {chartType === 'line' ? <TrendingUp className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
};