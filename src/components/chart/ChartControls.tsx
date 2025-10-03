import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3 } from 'lucide-react';

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
  onToggleGrid,
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
      </div>
    </div>
  );
};