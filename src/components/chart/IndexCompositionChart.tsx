import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TokenComposition {
  id: string;
  symbol: string;
  weight: number;
  price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

interface IndexCompositionChartProps {
  constituents: TokenComposition[];
  indexName: string;
  indexColor: string;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
  '#84cc16', '#a855f7', '#22d3ee', '#fb923c', '#c084fc'
];

export const IndexCompositionChart: React.FC<IndexCompositionChartProps> = ({
  constituents,
  indexName,
  indexColor
}) => {
  if (!constituents || constituents.length === 0) {
    return null;
  }

  // Prepare data for pie chart - show top 10 + others
  const sortedConstituents = [...constituents]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 15);

  const pieData = sortedConstituents.map((token, idx) => ({
    name: token.symbol.toUpperCase(),
    value: token.weight,
    color: COLORS[idx % COLORS.length]
  }));

  // Calculate aggregate stats
  const totalWeight = constituents.reduce((sum, t) => sum + t.weight, 0);
  const avgWeight = totalWeight / constituents.length;
  const topHolding = constituents.reduce((max, t) => t.weight > max.weight ? t : max, constituents[0]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
          <p className="font-semibold text-sm">{payload[0].name}</p>
          <p className="text-xs text-muted-foreground">
            {payload[0].value.toFixed(2)}% of index
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: indexColor }}
          />
          Token Composition
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => {
                    const numValue = typeof value === 'number' ? value : 0;
                    return numValue > 5 ? `${name} ${numValue.toFixed(1)}%` : '';
                  }}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats & Top Holdings */}
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3 pb-3 border-b">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Total Constituents</div>
                <div className="text-lg font-bold">{constituents.length}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Avg Weight</div>
                <div className="text-lg font-bold">{avgWeight.toFixed(2)}%</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-muted-foreground mb-1">Top Holding</div>
                <div className="text-lg font-bold">
                  {topHolding.symbol.toUpperCase()} ({topHolding.weight.toFixed(2)}%)
                </div>
              </div>
            </div>

            {/* Top 10 Holdings */}
            <div>
              <div className="text-xs text-muted-foreground mb-2 font-semibold">
                Top 10 Holdings
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {sortedConstituents.slice(0, 10).map((token, idx) => (
                  <div key={token.symbol} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="font-medium">{token.symbol.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{token.weight.toFixed(2)}%</span>
                      <span className={token.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {token.price_change_percentage_24h >= 0 ? '+' : ''}
                        {token.price_change_percentage_24h.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
