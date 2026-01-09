import React from 'react';
import { RotateCw } from 'lucide-react';

interface RefreshIndicatorProps {
  isRefreshing: boolean;
  lastUpdated?: Date;
}

export const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({
  isRefreshing,
  lastUpdated
}) => {
  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
  };

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <RotateCw 
        className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} 
      />
      <span>
        {isRefreshing ? 'Updating...' : lastUpdated ? formatLastUpdated(lastUpdated) : 'Ready'}
      </span>
    </div>
  );
};