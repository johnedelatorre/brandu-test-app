'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle, 
  Clock,
  ArrowRight
} from 'lucide-react';

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'recommendation';
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  isRead: boolean;
}

interface InsightsPanelProps {
  insights: Insight[];
  onInsightClick?: (insight: Insight) => void;
}

export default function InsightsPanel({ insights, onInsightClick }: InsightsPanelProps) {
  const [filter, setFilter] = useState<'all' | 'trend' | 'anomaly' | 'recommendation'>('all');

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'anomaly':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'recommendation':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'badge-error';
      case 'medium':
        return 'badge-warning';
      case 'low':
        return 'badge-success';
      default:
        return 'badge-info';
    }
  };

  const filteredInsights = insights.filter(insight => 
    filter === 'all' || insight.type === filter
  );

  const unreadCount = insights.filter(insight => !insight.isRead).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Insights</h3>
          <p className="text-sm text-gray-500">
            Automated actionable insights from your data
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="badge badge-error">
            {unreadCount} new
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All', count: insights.length },
          { key: 'trend', label: 'Trends', count: insights.filter(i => i.type === 'trend').length },
          { key: 'anomaly', label: 'Anomalies', count: insights.filter(i => i.type === 'anomaly').length },
          { key: 'recommendation', label: 'Recommendations', count: insights.filter(i => i.type === 'recommendation').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span className="ml-1 text-xs text-gray-400">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No insights</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'No insights available yet. Upload data to generate insights.'
                : `No ${filter} insights available.`
              }
            </p>
          </div>
        ) : (
          filteredInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${getSeverityColor(insight.severity)} ${
                !insight.isRead ? 'ring-2 ring-primary-200' : ''
              } cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => onInsightClick?.(insight)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {insight.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={`badge ${getSeverityBadge(insight.severity)}`}>
                        {insight.severity}
                      </span>
                      {!insight.isRead && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {insight.description}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {insight.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    <span className="capitalize">{insight.type}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Button */}
      {filteredInsights.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full btn-secondary">
            View All Insights
          </button>
        </div>
      )}
    </div>
  );
} 