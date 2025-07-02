'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'percentage' | 'number';
  category?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  changeType, 
  format,
  category 
}: MetricCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      default:
        return val.toLocaleString();
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {category && (
            <p className="text-xs text-gray-500 mt-1">{category}</p>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {getChangeIcon()}
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </p>
      </div>
    </div>
  );
} 