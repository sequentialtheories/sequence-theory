/**
 * INDICES PREVIEW COMPONENT
 * 
 * Lightweight preview of the three indices for the home page.
 * Shows current score and 24h change for each index.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, BarChart3, ArrowRight, Loader2 } from 'lucide-react';

interface IndexData {
  name: string;
  symbol: string;
  description: string;
  currentValue: number;
  change24h: number;
  color: string;
}

export const IndicesPreview: React.FC = () => {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL || '';
        const response = await fetch(`${backendUrl}/api/crypto-indices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timePeriod: 'daily' })
        });
        
        if (response.ok) {
          const data = await response.json();
          setIndices([
            {
              name: 'Anchor5',
              symbol: 'A5',
              description: 'Top 5 blue-chip stability',
              currentValue: data.anchor5?.currentValue || 0,
              change24h: data.anchor5?.change_24h_percentage || 0,
              color: 'blue'
            },
            {
              name: 'Vibe20',
              symbol: 'V20',
              description: 'Top 20 by trading volume',
              currentValue: data.vibe20?.currentValue || 0,
              change24h: data.vibe20?.change_24h_percentage || 0,
              color: 'purple'
            },
            {
              name: 'Wave100',
              symbol: 'W100',
              description: 'Equal-weight broad market',
              currentValue: data.wave100?.currentValue || 0,
              change24h: data.wave100?.change_24h_percentage || 0,
              color: 'emerald'
            }
          ]);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch indices:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchIndices();
  }, []);

  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
    return value.toFixed(2);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' };
      case 'purple': return { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' };
      case 'emerald': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' };
      default: return { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Unable to load indices data</p>
        <Link to="/indices">
          <Button variant="outline" className="rounded-full">
            View Indices Page <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Index Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {indices.map((index) => {
          const colors = getColorClasses(index.color);
          const isPositive = index.change24h >= 0;
          
          return (
            <div 
              key={index.symbol}
              className={`bg-card border ${colors.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}>
                  <span className={`font-bold text-sm ${colors.text}`}>{index.symbol}</span>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {isPositive ? '+' : ''}{index.change24h.toFixed(2)}%
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-foreground mb-1">{index.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{index.description}</p>
              
              <div className="text-2xl font-bold text-foreground">
                {formatValue(index.currentValue)}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* CTA Button */}
      <div className="text-center">
        <Link to="/indices">
          <Button className="rounded-full px-8" variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            For Advanced Users
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default IndicesPreview;
