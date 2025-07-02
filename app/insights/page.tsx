'use client';

import Sidebar from '@/components/Sidebar';
import InsightsPanel from '@/components/InsightsPanel';
import { Insight } from '@/types';

const detailedInsights: Insight[] = [
  {
    id: '1',
    title: 'Revenue Growth Trend',
    description: 'Revenue has increased by 12.5% this month compared to last month, indicating strong business performance. This growth is primarily driven by increased customer acquisition and higher average order values.',
    type: 'trend',
    severity: 'low',
    createdAt: new Date('2024-01-10'),
    isRead: false
  },
  {
    id: '2',
    title: 'Conversion Rate Drop',
    description: 'Conversion rate has decreased by 2.1%. Consider reviewing your marketing funnel and landing pages. The drop appears to be concentrated in mobile traffic.',
    type: 'anomaly',
    severity: 'medium',
    createdAt: new Date('2024-01-09'),
    isRead: true
  },
  {
    id: '3',
    title: 'User Engagement Opportunity',
    description: 'Active users are up 8.7%. Consider implementing new features to capitalize on this momentum. Focus on features that increase session duration.',
    type: 'recommendation',
    severity: 'low',
    createdAt: new Date('2024-01-08'),
    isRead: false
  },
  {
    id: '4',
    title: 'Customer Churn Alert',
    description: 'Customer churn rate has increased by 15% in the last week. Immediate action required to identify and address the root cause.',
    type: 'anomaly',
    severity: 'high',
    createdAt: new Date('2024-01-07'),
    isRead: false
  },
  {
    id: '5',
    title: 'Seasonal Trend Detection',
    description: 'Data shows a clear seasonal pattern in sales. Consider adjusting inventory and marketing strategies for upcoming seasonal peaks.',
    type: 'trend',
    severity: 'low',
    createdAt: new Date('2024-01-06'),
    isRead: true
  }
];

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
            <p className="text-gray-600 mt-2">
              Automated insights and recommendations to help you make data-driven decisions.
            </p>
          </div>
          <InsightsPanel
            insights={detailedInsights}
            onInsightClick={(insight) => console.log('Insight clicked:', insight)}
          />
        </main>
      </div>
    </div>
  );
} 