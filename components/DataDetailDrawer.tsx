'use client';

import { useEffect } from 'react';
import { X, TrendingUp, BarChart3, Calendar, DollarSign, Target, Zap } from 'lucide-react';

interface DataDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dataPoint: { date: string; value: number; category?: string } | null;
}

export default function DataDetailDrawer({ isOpen, onClose, dataPoint }: DataDetailDrawerProps) {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Remove body overflow changes that might trigger re-renders
      // document.body.style.overflow = 'hidden';
    } else {
      // document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      // document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!dataPoint) return null;

  const formatDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dataPoint.date));

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  // Mock deeper insights based on the data point
  const insights = [
    {
      icon: TrendingUp,
      title: 'Growth Trend',
      value: '+12.5%',
      description: 'Compared to previous period',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: BarChart3,
      title: 'Performance Ranking',
      value: 'Top 15%',
      description: 'Among all data points',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Target,
      title: 'Goal Achievement',
      value: '85%',
      description: 'Of monthly target',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Zap,
      title: 'Impact Score',
      value: '8.7/10',
      description: 'Business impact rating',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-[100] transition-opacity duration-500 ease-out ${
          isOpen ? 'bg-opacity-30 opacity-100' : 'bg-opacity-0 opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-[101] transition-all duration-500 ease-out`}
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          opacity: isOpen ? 1 : 0,
          willChange: 'transform, opacity',
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Data Analysis</h2>
              <p className="text-sm text-gray-500 mt-1">Detailed insights and breakdown</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Data Point Summary */}
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <Calendar className="h-5 w-5 text-primary-600" />
                <span className="text-sm font-medium text-primary-900">{formatDate}</span>
              </div>
              <div className="flex items-center space-x-3">
                <DollarSign className="h-6 w-6 text-primary-600" />
                <div>
                  <div className="text-2xl font-bold text-primary-900">
                    {formatCurrency(dataPoint.value)}
                  </div>
                  {dataPoint.category && (
                    <div className="text-sm text-primary-700">Category: {dataPoint.category}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Insights Grid */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
              {insights.map((insight, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                      <insight.icon className={`h-5 w-5 ${insight.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                        <span className={`text-lg font-bold ${insight.color}`}>{insight.value}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Analysis</h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Performance Context</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  This data point represents a significant milestone in the revenue trajectory. 
                  The {formatCurrency(dataPoint.value)} recorded on this date shows strong market 
                  response and customer engagement patterns.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Market Factors</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Seasonal demand patterns influenced performance</li>
                  <li>• Marketing campaign effectiveness peaked during this period</li>
                  <li>• Customer acquisition costs remained optimal</li>
                  <li>• Competitive landscape showed favorable conditions</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Replicate successful strategies from this period</li>
                  <li>• Analyze customer behavior patterns for insights</li>
                  <li>• Consider scaling marketing efforts during similar periods</li>
                  <li>• Monitor key performance indicators closely</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <button
              onClick={onClose}
              className="w-full btn-secondary"
            >
              Close Analysis
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 