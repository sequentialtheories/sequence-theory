import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volumeUsd: number;
}

interface TokenComposition {
  symbol: string;
  weight: number;
}

interface DataIntegrityCardProps {
  candles: Candle[];
  constituents: TokenComposition[];
  indexName: string;
  indexColor: string;
}

export const DataIntegrityCard: React.FC<DataIntegrityCardProps> = ({
  candles,
  constituents,
  indexName,
  indexColor
}) => {
  if (!candles || candles.length === 0) {
    return null;
  }

  // Calculate statistics
  const prices = candles.map(c => c.close);
  const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const rangePercent = (priceRange / minPrice) * 100;

  // Weight distribution
  const totalWeight = constituents.reduce((sum, c) => sum + c.weight, 0);
  const avgWeight = totalWeight / constituents.length;
  const maxWeight = Math.max(...constituents.map(c => c.weight));
  const minWeight = Math.min(...constituents.map(c => c.weight));
  const weightSpread = maxWeight - minWeight;

  // Data quality checks
  const hasGoodCoverage = candles.length >= 100;
  const hasBalancedWeights = weightSpread < 50; // Less than 50% spread indicates good balance
  const hasGoodVariety = constituents.length >= 5;

  const qualityScore = [hasGoodCoverage, hasBalancedWeights, hasGoodVariety].filter(Boolean).length;

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            Data Integrity
          </CardTitle>
          <Badge 
            variant={qualityScore === 3 ? "default" : qualityScore === 2 ? "secondary" : "destructive"}
          >
            {qualityScore}/3 Checks Passed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quality Checks */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Data Coverage</span>
            <div className="flex items-center gap-2">
              {hasGoodCoverage ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span className="font-medium">{candles.length} candles</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Weight Balance</span>
            <div className="flex items-center gap-2">
              {hasBalancedWeights ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span className="font-medium">{weightSpread.toFixed(1)}% spread</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Constituent Diversity</span>
            <div className="flex items-center gap-2">
              {hasGoodVariety ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span className="font-medium">{constituents.length} tokens</span>
            </div>
          </div>
        </div>

        {/* Price Statistics */}
        <div className="pt-3 border-t">
          <div className="text-xs text-muted-foreground mb-2 font-semibold">
            Price Statistics
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Mean:</span>
              <span className="ml-2 font-medium">{mean.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Std Dev:</span>
              <span className="ml-2 font-medium">{stdDev.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Range:</span>
              <span className="ml-2 font-medium">{minPrice.toFixed(0)} - {maxPrice.toFixed(0)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Variation:</span>
              <span className="ml-2 font-medium">{rangePercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Weight Distribution */}
        <div className="pt-3 border-t">
          <div className="text-xs text-muted-foreground mb-2 font-semibold">
            Weight Distribution
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Average:</span>
              <span className="ml-2 font-medium">{avgWeight.toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total:</span>
              <span className="ml-2 font-medium">{totalWeight.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Max Weight:</span>
              <span className="ml-2 font-medium">{maxWeight.toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">Min Weight:</span>
              <span className="ml-2 font-medium">{minWeight.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
