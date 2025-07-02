'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import D3Chart from '@/components/D3Chart';
import DataTable from '@/components/DataTable';
import CSVUpload from '@/components/CSVUpload';
import InsightsPanel from '@/components/InsightsPanel';
import ChartDataTable from '@/components/ChartDataTable';
import DataDetailDrawer from '@/components/DataDetailDrawer';
import { DashboardMetric, Insight, ChartData } from '@/types';
import { LineChart, BarChart3 } from 'lucide-react';

// Sample data for demonstration
const sampleMetrics: DashboardMetric[] = [
  {
    id: '1',
    name: 'Total Revenue',
    value: 125000,
    change: 12.5,
    changeType: 'increase',
    format: 'currency',
    category: 'Sales'
  },
  {
    id: '2',
    name: 'Conversion Rate',
    value: 0.045,
    change: -2.1,
    changeType: 'decrease',
    format: 'percentage',
    category: 'Marketing'
  },
  {
    id: '3',
    name: 'Active Users',
    value: 15420,
    change: 8.7,
    changeType: 'increase',
    format: 'number',
    category: 'Engagement'
  },
  {
    id: '4',
    name: 'Customer Satisfaction',
    value: 0.92,
    change: 1.2,
    changeType: 'increase',
    format: 'percentage',
    category: 'Support'
  }
];

const sampleChartData: ChartData[] = [
  { date: '2024-01-01', value: 12000 },
  { date: '2024-01-02', value: 13500 },
  { date: '2024-01-03', value: 11800 },
  { date: '2024-01-04', value: 14200 },
  { date: '2024-01-05', value: 15600 },
  { date: '2024-01-06', value: 13800 },
  { date: '2024-01-07', value: 16200 },
  { date: '2024-01-08', value: 17500 },
  { date: '2024-01-09', value: 16800 },
  { date: '2024-01-10', value: 18200 },
];

const sampleInsights: Insight[] = [
  {
    id: '1',
    title: 'Revenue Growth Trend',
    description: 'Revenue has increased by 12.5% this month compared to last month, indicating strong business performance.',
    type: 'trend',
    severity: 'low',
    createdAt: new Date('2024-01-10'),
    isRead: false
  },
  {
    id: '2',
    title: 'Conversion Rate Drop',
    description: 'Conversion rate has decreased by 2.1%. Consider reviewing your marketing funnel and landing pages.',
    type: 'anomaly',
    severity: 'medium',
    createdAt: new Date('2024-01-09'),
    isRead: true
  },
  {
    id: '3',
    title: 'User Engagement Opportunity',
    description: 'Active users are up 8.7%. Consider implementing new features to capitalize on this momentum.',
    type: 'recommendation',
    severity: 'low',
    createdAt: new Date('2024-01-08'),
    isRead: false
  }
];

const sampleTableData = [
  { id: 1, name: 'Product A', sales: 12500, revenue: 125000, date: '2024-01-10' },
  { id: 2, name: 'Product B', sales: 8900, revenue: 89000, date: '2024-01-09' },
  { id: 3, name: 'Product C', sales: 15600, revenue: 156000, date: '2024-01-08' },
  { id: 4, name: 'Product D', sales: 7200, revenue: 72000, date: '2024-01-07' },
  { id: 5, name: 'Product E', sales: 11300, revenue: 113000, date: '2024-01-06' },
];

const tableColumns = [
  { key: 'id', label: 'ID', type: 'number' as const, sortable: true },
  { key: 'name', label: 'Product Name', type: 'string' as const, sortable: true, filterable: true },
  { key: 'sales', label: 'Sales', type: 'number' as const, sortable: true },
  { key: 'revenue', label: 'Revenue', type: 'currency' as const, sortable: true },
  { key: 'date', label: 'Date', type: 'date' as const, sortable: true },
];

export default function Dashboard() {
  const [currentData, setCurrentData] = useState(sampleTableData);
  const [showCSVUpload, setShowCSVUpload] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ date: string; value: number; category?: string } | null>(null);

  const handleDataUpload = (data: { headers: string[]; rows: Record<string, any>[] }) => {
    // Transform CSV data to match table format
    const transformedData = data.rows.map((row, index) => ({
      id: index + 1,
      name: row.name || `Product ${index + 1}`,
      sales: Number(row.sales) || 0,
      revenue: Number(row.revenue) || 0,
      date: row.date || new Date().toISOString().split('T')[0],
      ...row
    }));
    setCurrentData(transformedData);
    setShowCSVUpload(false);
  };

  const handleInsightClick = (insight: Insight) => {
    console.log('Insight clicked:', insight);
    // Handle insight click - could open modal, navigate to detail page, etc.
  };

  const handleDataPointClick = (dataPoint: { date: string; value: number; category?: string }) => {
    setSelectedDataPoint(dataPoint);
    // Small delay to ensure proper animation timing
    requestAnimationFrame(() => {
      setDrawerOpen(true);
    });
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedDataPoint(null), 300); // Clear data after animation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div
        className="transition-all duration-300"
        style={{ paddingLeft: sidebarCollapsed ? '5rem' : '16rem' }}
      >
        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {sampleMetrics.map((metric) => (
              <MetricCard
                key={metric.id}
                title={metric.name}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                format={metric.format}
                category={metric.category}
              />
            ))}
          </div>

          {/* Chart Section - Full Width */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
              <div className="flex items-center space-x-2">
                <button
                  className={`p-2 rounded-md border ${chartType === 'line' ? 'bg-primary-100 border-primary-300 text-primary-700' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                  onClick={() => setChartType('line')}
                  aria-label="Line chart"
                >
                  <LineChart className="h-5 w-5" />
                </button>
                <button
                  className={`p-2 rounded-md border ${chartType === 'bar' ? 'bg-primary-100 border-primary-300 text-primary-700' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                  onClick={() => setChartType('bar')}
                  aria-label="Bar chart"
                >
                  <BarChart3 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <D3Chart
              data={sampleChartData}
              title={undefined}
              height={400}
              chartType={chartType}
              onDataPointClick={handleDataPointClick}
            />
            <div className="mt-8">
              <ChartDataTable data={sampleChartData} />
            </div>
          </div>

          {/* Insights Section */}
          <div className="mb-8">
            <InsightsPanel
              insights={sampleInsights}
              onInsightClick={handleInsightClick}
            />
          </div>

          {/* Data Table Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Data Table</h2>
                <p className="text-gray-600 mt-1">
                  View and analyze your data with sorting and filtering capabilities
                </p>
              </div>
              <button
                onClick={() => setShowCSVUpload(!showCSVUpload)}
                className="btn-primary"
              >
                {showCSVUpload ? 'Cancel Upload' : 'Upload CSV'}
              </button>
            </div>

            {showCSVUpload && (
              <div className="mb-6">
                <CSVUpload onDataUpload={handleDataUpload} />
              </div>
            )}

            <DataTable
              data={currentData}
              columns={tableColumns}
              pageSize={10}
              searchable={true}
              sortable={true}
              filterable={true}
            />
          </div>
        </main>
      </div>
      
      {/* Data Detail Drawer */}
      <DataDetailDrawer
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
        dataPoint={selectedDataPoint}
      />
    </div>
  );
} 